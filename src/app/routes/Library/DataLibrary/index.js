import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import reviewTheme from 'app/configs/reviewTheme';
import Show from 'app/hoc/Show';
import AllUploads from 'app/routes/Library/DataLibrary/AllUploads';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { selectIsInferenceModalOpen } from 'store/inferenceDrawer/selector';
import { selectIsUploadDataModalOpen } from 'store/uploadData/selector';

import ModelDefectSelect from './AllUploads/components/ModelDefectSelect';
import Inference from './Inference';
import UploadData from './UploadData';
import UploadResults from './UploadResults';
import WaferLib from './WaferLib';

const DataLibrary = () => {
  const modelDefectDrawer = useSelector(
    ({ allUploads }) => allUploads.modelDefectDrawer
  );
  const isInferenceModalOpen = useSelector(selectIsInferenceModalOpen);
  const isUploadDataModalOpen = useSelector(selectIsUploadDataModalOpen);

  return (
    <>
      <Box p={3}>
        <Routes>
          <Route path='results' element={<UploadResults />} />
          <Route
            path='wafers'
            element={
              <ThemeProvider theme={reviewTheme}>
                <CssBaseline />
                <WaferLib />
              </ThemeProvider>
            }
          />
          <Route path='/' element={<AllUploads />} />
        </Routes>
      </Box>

      <Show when={isUploadDataModalOpen}>
        <UploadData />
      </Show>

      <Show when={isInferenceModalOpen}>
        <Inference />
      </Show>

      {modelDefectDrawer && <ModelDefectSelect />}
    </>
  );
};

export default DataLibrary;
