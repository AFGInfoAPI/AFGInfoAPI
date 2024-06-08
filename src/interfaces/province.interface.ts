import { Document } from 'mongoose';

export interface Province extends Document {
  _id: string;
  name: string;
  area: number;
  population: number;
  gdp: number;
  lat: number;
  lng: number;
  googleMapUrl: string;
  capital: string;
  description: string;
  images: string[];
}

export interface ProvincePnd extends Document {
  _id: string;
  name: string;
  area: number;
  population: number;
  gdp: number;
  lat: number;
  lng: number;
  googleMapUrl: string;
  capital: string;
  description: string;
  images: string[];
  province_id: string;
}
