import { Routes, Route } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import BodyBox from '../BodyBox';
import HeaderBox from '../Header';

// import WaferDrawer from '../WaferDrawer/NewWaferDrawer'

const AIPerformance = () => {
  return (
    <>
      <Box width='100%'>
        <HeaderBox />

        <Routes>
          <Route path=':mode/:unit' element={<BodyBox />} />
        </Routes>

        {/* <BodyBox /> */}
      </Box>
      {/* <WaferDrawer /> */}
    </>
  );
};

export default AIPerformance;
