import { Document } from 'mongoose';

export interface Park extends Document {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  status?: boolean;
  images: string[];
  province_id: string;
}

export interface ParkPnd extends Document {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  images: string[];
  park_id: string;
}
