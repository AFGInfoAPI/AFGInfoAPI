import { Document } from 'mongoose';

export interface TouristicPlace extends Document {
  _id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  isNationalPark?: boolean;
  status?: boolean;
  images: string[];
}

export interface TouristicPlacePnd extends Document {
  _id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  isNationalPark?: boolean;
  images: string[];
  touristic_place_id: string;
}
