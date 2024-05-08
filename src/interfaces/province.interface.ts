interface Province {
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

export default Province;
