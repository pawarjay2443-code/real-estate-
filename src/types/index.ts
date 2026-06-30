export type PropertyType = "Villa" | "Apartment" | "House" | "Penthouse" | "Studio" | "Townhouse" | "Land";
export type PropertyStatus = "For Sale" | "For Rent" | "Sold" | "Under Contract";

export interface Amenity {
  icon: string;
  label: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  agency: string;
  listings: number;
  experience: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  type: PropertyType;
  status: PropertyStatus;
  images: string[];
  amenities: string[];
  features: string[];
  yearBuilt: number;
  floorPlan?: string;
  isFeatured: boolean;
  isNew: boolean;
  agent: Agent;
  category: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo: string;
  rating: number;
  comment: string;
  property: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  type: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  areaMin: number;
  areaMax: number;
  city: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}
