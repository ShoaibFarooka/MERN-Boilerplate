import { Route, Routes } from 'react-router-dom';
import routes from './RouteConfig';

const Router: React.FC = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
};

export default Router;
