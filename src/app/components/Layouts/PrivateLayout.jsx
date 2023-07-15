import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Spinner from 'app/components/Spinner';
import WithCondition from 'app/hoc/WithCondition';

import PrivateLayoutBackdrop from '../PrivateLayoutBackdrop';

import { refreshToken } from 'app/utils/refreshToken';
import { setSessionLogger } from 'app/utils/sessionLogger';
import { setUserInfo } from 'app/utils';

const PrivateLayout = () => {
  const accessToken = useSelector(({ user }) => user.accessToken);

  useEffect(() => {
    if (!accessToken) {
      refreshToken().then(() => {
        setUserInfo();
        setSessionLogger();
      });
    }
  }, []);

  return (
    <WithCondition
      when={accessToken}
      then={
        <>
          <Outlet />
          <PrivateLayoutBackdrop />
        </>
      }
      or={<Spinner />}
    />
  );
};

export default PrivateLayout;
