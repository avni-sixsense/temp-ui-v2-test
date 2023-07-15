import { Route, Routes } from 'react-router-dom';

import WithErrorBoundary from 'app/hoc/WithErrorBoundary';
import Show from 'app/hoc/Show';

import CreateNavigationContext from 'app/components/CreateNavigationContext';

import PrivateLayout from 'app/components/Layouts/PrivateLayout';
import PublicLayout from 'app/components/Layouts/PublicLayout';

import PrimaryLayout from 'app/components/Layouts/PrimaryLayout';
import SecondaryLayout from 'app/components/Layouts/SecondaryLayout';

import {
  publicRoutes,
  navRoutes,
  primaryLayoutRoutes,
  noLayoutRoutes
} from 'app/configs/routes';
import FullScreenLayout from 'app/components/Layouts/FullScreenLayout';

export const renderRoute = ({
  path,
  subRoutes,
  element: Element,
  hasChildren
}) => {
  if (!path) return null;

  if (subRoutes) {
    return subRoutes.map(subRoute =>
      renderRoute({ ...subRoute, path: `${path}/${subRoute.path}` })
    );
  }

  if (hasChildren) path += '/*';

  return <Route key={path} path={path} element={<Element />} />;
};

const Routing = () => {
  return (
    <>
      <Show when={!window.navigation}>
        <CreateNavigationContext />
      </Show>

      <Routes>
        <Route element={<PublicLayout />}>
          {publicRoutes.map(renderRoute)}
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path=':subscriptionId/:packId' element={<FullScreenLayout />}>
            <Route element={<SecondaryLayout />}>
              {navRoutes.map(renderRoute)}
            </Route>

            {noLayoutRoutes.map(renderRoute)}
          </Route>

          <Route element={<PrimaryLayout />}>
            {primaryLayoutRoutes.map(renderRoute)}
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default WithErrorBoundary(Routing);
