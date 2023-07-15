import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CommonButton from 'app/components/CommonButton';
import UploadCloud from 'assests/images/DefectUploadCloud.svg';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
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
  }
}));

const FilePreview = ({
  uppy,
  handleFileInputClick,
  handleFileDelete = () => {}
}) => {
  const classes = useStyles();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (uppy) {
      const files = uppy.getFiles();
      setFiles(files);
    }
  }, [uppy]);

  useEffect(() => {
    if (uppy) {
      uppy.on('file-added', file => {
        setFiles(prevState => [...prevState, file]);
      });
    }
  }, [uppy]);

  const handleDelete = id => {
    if (uppy) {
      uppy.removeFile(id);
      const files = uppy.getFiles();
      setFiles(files);
      handleFileDelete();
    }
  };

  return (
    <Box display='flex' flexWrap='wrap' mt={2}>
      {files.map((file, index) => (
        <Box
          display='block'
          position='relative'
          mb={1}
          className={classes.imageWrapper}
          key={index}
        >
          <img src={file.preview} alt='' />
          <CommonButton
            variant='tertiaryCircle'
            text={<DeleteOutlineIcon />}
            onClick={() => handleDelete(file.id)}
          />
        </Box>
      ))}
      <Box>
        <img
          style={{ cursor: 'pointer' }}
          src={UploadCloud}
          alt=''
          onClick={handleFileInputClick}
        />
      </Box>
    </Box>
  );
};

export default FilePreview;
