import { FloatingStatusWidget } from 'app/components';
import DownloadConfirmDialogBox from 'app/components/DownloadConfirmDialogBox';
import { Outlet } from 'react-router-dom';
import TaskQueue from '../components/TaskQueue';

const FullScreenLayout = () => {
  return (
    <>
      <Outlet />

      <TaskQueue />

      <FloatingStatusWidget />

      <DownloadConfirmDialogBox />
    </>
  );
};

export default FullScreenLayout;
