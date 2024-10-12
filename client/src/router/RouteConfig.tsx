import Home from '../pages/Home/Home';
import NotFound from '../pages/NotFound/NotFound';

interface Route {
  path: string;
  element: React.ReactNode; // Change to React.ReactNode
}

const routes: Route[] = [
  // admin related routes

  // user related routes

  // common
  { path: '/', element: <Home /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
