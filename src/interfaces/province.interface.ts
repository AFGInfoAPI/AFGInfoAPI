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
  status?: boolean;
  images: string[];
}

export interface ProvincePnd extends Document {
  _id: string;
  en_name: string;
  dr_name: string;
  ps_name: string;
  area: number;
  population: number;
  gdp: number;
  lat: number;
  lng: number;
  googleMapUrl: string;
  en_capital: string;
  dr_capital: string;
  ps_capital: string;
  en_description: string;
  dr_description: string;
  ps_description: string;
  images: string[];
  province_id: string;
}
