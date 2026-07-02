import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';
import { env } from '../../config/env';
import Stripe from 'stripe';
import { logger } from '../../utils/logger';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'mock_key', {
  apiVersion: '2023-10-16' as any,
});

export class PaymentsController {
  static async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId, amount, currency = 'usd', type } = req.body;

      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      // Create Stripe PaymentIntent
      let paymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Stripe expects amounts in cents
          currency,
          metadata: {
            userId: req.user.id,
            propertyId,
            paymentType: type,
          },
        });
      } catch (stripeError: any) {
        logger.error('Stripe Payment Intent Error:', stripeError);
        return next(new AppError(`Stripe Error: ${stripeError.message}`, 400));
      }

      // Record pending payment in DB
      const payment = await prisma.payment.create({
        data: {
          userId: req.user.id,
          propertyId,
          amount,
          currency,
          type,
          status: 'PENDING',
          stripePaymentIntentId: paymentIntent.id,
        },
      });

      return sendSuccess(res, 'Payment intent created successfully', {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        payment,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return next(new AppError('Missing Stripe signature header', 400));
    }

    let event: Stripe.Event;

    try {
      // req.body must be the raw body buffer
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      logger.error('Stripe webhook signature verification failed:', err.message);
      return next(new AppError(`Webhook Error: ${err.message}`, 400));
    }

    try {
      const intent = event.data.object as Stripe.PaymentIntent;

      if (event.type === 'payment_intent.succeeded') {
        logger.info(`Stripe payment intent succeeded: ${intent.id}`);

        const payment = await prisma.payment.findUnique({
          where: { stripePaymentIntentId: intent.id },
          include: { property: true },
        });

        if (payment) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'SUCCESS' },
            }),
            prisma.notification.create({
              data: {
                userId: payment.userId,
                title: 'Payment Successful',
                message: `Your payment of ${payment.amount} ${payment.currency.toUpperCase()} was successful.`,
                type: 'PAYMENT',
              },
            }),
            prisma.notification.create({
              data: {
                userId: payment.property.ownerId,
                title: 'Received Payment',
                message: `You received a payment of ${payment.amount} ${payment.currency.toUpperCase()} for your listing: "${payment.property.title}".`,
                type: 'PAYMENT',
              },
            }),
          ]);

          // Update property status if booking deposit paid
          if (payment.type === 'BOOKING_DEPOSIT') {
            await prisma.property.update({
              where: { id: payment.propertyId },
              data: { status: 'PENDING' },
            });
          }
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        logger.info(`Stripe payment intent failed: ${intent.id}`);

        const payment = await prisma.payment.findUnique({
          where: { stripePaymentIntentId: intent.id },
        });

        if (payment) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'FAILED' },
            }),
            prisma.notification.create({
              data: {
                userId: payment.userId,
                title: 'Payment Failed',
                message: `Your payment of ${payment.amount} ${payment.currency.toUpperCase()} has failed. Please try again.`,
                type: 'PAYMENT',
              },
            }),
          ]);
        }
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Error handling Stripe webhook event:', error);
      return next(error);
    }
  }

  static async myPayments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const payments = await prisma.payment.findMany({
        where: { userId: req.user.id },
        include: {
          property: {
            select: { id: true, title: true, address: true, city: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'My payments retrieved successfully', { payments });
    } catch (error) {
      return next(error);
    }
  }
}
