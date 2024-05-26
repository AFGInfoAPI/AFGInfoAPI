interface District {
  id: number;
  name: string;
  capital: string;
  area: number;
  population: number;
  gdp?: number;
  location: {
    type: string;
    coordinates: number[];
  };
  googleMapUrl: string;
  description: string;
  governor?: string;
  images: string[];
}
export default District;
