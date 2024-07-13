import e from 'express';
import { Document } from 'mongoose';

export interface Hospital extends Document {
  _id: string;
  name: string;
  address: string;
  phone: string;
  ambulancePhone: string;
  numberOfBeds: number;
  email: string;
  website: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  status?: boolean;
  images: string[];
  province_id: string;
}

export interface HospitalPnd extends Document {
  _id: string;
  name: string;
  address: string;
  phone: string;
  ambulancePhone: string;
  numberOfBeds: number;
  email: string;
  website: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  images: string[];
  hospital_id: string;
}
