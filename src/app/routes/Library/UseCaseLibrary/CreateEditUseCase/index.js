/* eslint-disable camelcase */
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import CreateUseCase from './CreateEditUseCase';

const useStyle = makeStyles(theme => ({
  root: {
    '& > .MuiPaper-root': {
      backgroundColor: '#F1FBFF',
      width: '90%'
    },
    '& .MuiStepConnector-root': {
      display: 'none'
    },
    '& .MuiStep-horizontal': {
      padding: 0,
      margin: '8px',
      '& .MuiStepLabel-iconContainer': {
        padding: 0
      }
    }
  }
}));

const CreateUseCaseContainer = () => {
  const drawerOpen = useSelector(
    ({ useCaseLibrary }) => useCaseLibrary.drawerOpen
  );
  const classes = useStyle();

  return (
    <Drawer className={classes.root} anchor='right' open={drawerOpen}>
      <CreateUseCase />
    </Drawer>
  );
};

export default CreateUseCaseContainer;
