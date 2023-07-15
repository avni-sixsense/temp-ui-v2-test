import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { defectOrderPriority } from 'app/api/Usecase';
import { COMMONS } from 'app/constants/common';
import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CustomTable from '../components/Table';

const useStyle = makeStyles(theme => ({
  inputField: {
    fontStyle: 'normal',
    fontSize: '0.75rem !important',
    color: '#313131',
    width: '30%',
    '&:after': {
      borderBottom: '1px solid #E8EDF1'
    },
    '&:before': {
      borderBottom: '1px solid #E8EDF1'
    }
  },
  boxes: {
    backgroundColor: '#FFFFFF',
    padding: '2%',
    borderRadius: '3px'
  },
  imageWrapper: {
    '& img': {
      width: '105px',
      height: '105px',
      marginRight: '8px',
      borderRadius: '5px'
    },
    '& button': {
      display: 'none',
      position: 'absolute',
      bottom: '-10px',
      right: 0
    },
    '&:hover': {
      '& button': {
        display: 'block'
      },
      '& img': {
        opacity: 0.3
      },
      '& .MuiButton-text': {
        padding: 0,
        paddingLeft: 2
      }
    }
  },
  progress: {
    backgroundColor: '#E5E5E5',
    borderRadius: '6px',
    height: '6px',
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#65D7C8'
    }
  },
  uploadContainer: {
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(2.25),
    '& .MuiCardContent-root': {
      padding: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  uploadBox: {
    maxWidth: '400px'
  },
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
  },
  toolTip: {
    backgroundColor: '#F1FBFF'
  },
  optionBtn: {
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    color: '#02435D',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  img: {
    width: '105px',
    height: '105px',
    marginRight: '8px',
    borderRadius: '5px'
  },
  text: {
    zIndex: 100,
    marginTop: '-56px',
    marginLeft: '22px',
    color: 'white'
  },
  paperModal: {
    zIndex: 9999
  }
}));

const useStylesBootstrap = makeStyles(() => ({
  arrow: {
    color: '#F1FBFF'
  },
  tooltip: {
    backgroundColor: '#F1FBFF',
    fontWeight: 300,
    fontSize: '0.75rem !important',
    color: '#02435D'
  }
}));

const FillDetails = ({ control }) => {
  const classes = useStyle();
  const usecase = useSelector(({ useCaseLibrary }) => useCaseLibrary.usecase);
  const globalMode = useSelector(
    ({ useCaseLibrary }) => useCaseLibrary.globalMode
  );
  const mode = useSelector(({ useCaseLibrary }) => useCaseLibrary.mode);
  const { subscriptionId } = useParams();

  const { data: defects } = useQuery(['defects', subscriptionId], context =>
    api.getDefects(...context.queryKey)
  );
  const [defectPriority, setDefectPriority] = useState([]);

  useEffect(() => {
    if (mode === 'update' && usecase?.id) {
      defectOrderPriority({ id: usecase.id }).then(_ => {
        setDefectPriority(_);
      });
    }
  }, [mode, usecase]);

  const bootstrapClasses = useStylesBootstrap();

  const columns = [
    {
      accessor: 'name',
      Header: 'Name'
    },
    {
      accessor: 'id',
      Header: 'Priority'
    }
  ];

  return (
    <>
      <Box className={classes.boxes}>
        <Box mb={4}>
          <Box my={1}>
            <Typography variant='h2' style={{ fontWeight: 500 }}>
              Name
              <Tooltip
                classes={bootstrapClasses}
                title='This is a mandatory field'
                placement='top-start'
                arrow
              >
                <span style={{ color: '#F56C6C' }}> &nbsp;*</span>
              </Tooltip>
            </Typography>
          </Box>
          <Box my={1}>
            <Typography variant='subtitle2'>
              Enter name of the new usecase
            </Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input className={classes.inputField} {...field} />
              )}
            />
          </Box>
        </Box>
        <Box mb={4}>
          <Box my={1}>
            <Typography variant='h2' style={{ fontWeight: 500 }}>
              Type
              <Tooltip
                classes={bootstrapClasses}
                title='This is a mandatory field'
                placement='top-start'
                arrow
              >
                <span style={{ color: '#F56C6C' }}> &nbsp;*</span>
              </Tooltip>
            </Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='type'
              control={control}
              render={({ field }) => {
                return (
                  <ModelSelect
                    {...field}
                    selected={field.value}
                    models={COMMONS.useCaseTypes}
                    width={275}
                    height={40}
                    multiSelect={false}
                    disabled={globalMode === 'update'}
                  />
                );
              }}
            />
          </Box>
        </Box>
        <Box mb={4}>
          <Box my={1}>
            <Typography variant='h2' style={{ fontWeight: 500 }}>
              Defects
            </Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='defects'
              control={control}
              render={({ field }) => (
                <ModelSelect
                  {...field}
                  selected={field.value}
                  models={defects?.results || []}
                  width={275}
                  height={40}
                  multiSelect
                />
              )}
            />
          </Box>
        </Box>
        {mode === 'update' && (
          <Box width='30%'>
            <CustomTable
              data={defectPriority}
              columns={columns}
              checkBox={false}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default FillDetails;
