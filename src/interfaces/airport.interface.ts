import { Document } from 'mongoose';

export interface Airport extends Document {
  _id: string;
  name: string;
  IATA_Code: string;
  city: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  numbers_of_terminals: number;
  status?: boolean;
  images: string[];
}

export interface AirportPnd extends Document {
  _id: string;
  name: string;
  IATA_Code: string;
  city: string;
  lat: number;
  lng: number;
  googleMapUrl: string;
  numbers_of_terminals: number;
  images: string[];
  airport_id: string;
}
