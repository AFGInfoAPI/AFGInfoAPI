import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ProvinceRoute from './routes/province.route';
import DistrictRoute from './routes/district.route';
import TouristicPlace from './routes/touristicplace.route';
import AirportRoute from './routes/airport.route';
import HotelRoute from './routes/hotel.route';
import ParkRoute from './routes/park.route';
import HospitalRoute from './routes/hospital.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new AuthRoute(),
  new ProvinceRoute(),
  new DistrictRoute(),
  new TouristicPlace(),
  new AirportRoute(),
  new HotelRoute(),
  new ParkRoute(),
  new HospitalRoute(),
  new UsersRoute(),
]);

app.listen();
