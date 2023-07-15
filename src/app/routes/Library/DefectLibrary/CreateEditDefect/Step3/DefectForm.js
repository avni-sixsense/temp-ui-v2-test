import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/CommonButton';
import UploadCloud from 'assests/images/DefectUploadCloud.svg';
import React, { useEffect, useState } from 'react';

import SelectUseCase from './SelectUseCase';

const useStyle = makeStyles(theme => ({
  inputField: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '1.375rem !important',
    color: '#000000',
    width: '20%',
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
    background: '#F1FBFF',
    textAlign: 'center',
    borderRadius: '3px'
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
    padding: theme.spacing(1)
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
  text: {
    zIndex: 100,
    marginTop: '-56px',
    marginLeft: '22px',
    color: 'white'
  },
  img: {
    width: '105px',
    height: '105px',
    marginRight: '8px',
    borderRadius: '5px'
  }
}));

const DefectForm = ({
  useCases,
  handleSave,
  handleCancel,
  selected,
  setSelected,
  edit,
  index,
  showFileDialogue,
  files
}) => {
  const classes = useStyle();

  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (files.length) {
      const temp = [];
      files.forEach(file => {
        temp.push(URL.createObjectURL(file));
      });
      setUrls(temp);
    } else {
      setUrls([]);
    }
  }, [files]);

  return (
    <Box my={2} className={classes.boxes}>
      <Box mb={4}>
        <Box my={1}>
          <Typography variant='h2' style={{ fontWeight: 500 }}>
            Use Case
          </Typography>
        </Box>
        <Box mt={2}>
          <SelectUseCase
            useCases={useCases}
            selected={selected}
            setSelected={setSelected}
          />
        </Box>
      </Box>
      <Box mb={4}>
        <Box my={1}>
          <Typography variant='h2' style={{ fontWeight: 500 }}>
            Add Images
          </Typography>
        </Box>
        <Box display='flex' mt={2}>
          {urls[0] ? (
            <Box borderRadius={10}>
              <img src={urls[0]} alt='' className={classes.img} />
            </Box>
          ) : (
            ''
          )}
          {urls[1] ? (
            <Box>
              <img src={urls[1]} alt='' className={classes.img} />
            </Box>
          ) : (
            ''
          )}
          {urls[2] ? (
            <Box>
              <img src={urls[2]} alt='' className={classes.img} />
              <div className={classes.text}>{`+${urls.length - 2} images`}</div>
            </Box>
          ) : (
            ''
          )}
          <Box>
            <img
              style={{ cursor: 'pointer' }}
              src={UploadCloud}
              alt=''
              onClick={showFileDialogue}
            />
          </Box>
        </Box>
      </Box>
      <Box display='flex'>
        <Box mx={1}>
          <CommonButton
            onClick={handleCancel}
            text='Cancel'
            variant='tertiary'
          />
        </Box>
        <Box mx={1}>
          <CommonButton
            onClick={
              edit ? () => handleSave(edit, index) : () => handleSave(edit)
            }
            text='Save'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DefectForm;
