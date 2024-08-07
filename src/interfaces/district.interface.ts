import { Document, ObjectId } from 'mongoose';

export interface District extends Document {
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
  province_id: ObjectId;
}

export interface DistrictPnd extends Document {
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
  district_id: string;
}
