import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ProvinceRoute from './routes/province.route';
import DistrictRoute from './routes/district.route';
import TouristicPlace from './routes/touristicplace.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new ProvinceRoute(), new DistrictRoute(), new TouristicPlace()]);

app.listen();
