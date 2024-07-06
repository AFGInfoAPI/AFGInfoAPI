import { Document } from 'mongoose';

export interface Hotel extends Document {
  _id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  rating: number;
  star: number;
  images: string[];
  status?: boolean;
  lat: number;
  lng: number;
  googleMapUrl: string;
}

export interface HotelPnd extends Document {
  _id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  rating: number;
  star: number;
  images: string[];
  status?: boolean;
  lat: number;
  lng: number;
  googleMapUrl: string;
  hotel_id: string;
}
