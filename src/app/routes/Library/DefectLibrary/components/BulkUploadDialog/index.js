import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { faFileUpload } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Fade,
  makeStyles,
  Modal,
  Paper,
  Typography
} from '@material-ui/core';
import DropZone from 'app/components/DropZone';
import CommonButton from 'app/components/ReviewButton';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    maxWidth: '351px'
  },
  header: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`,
    padding: theme.spacing(1, 1.25),
    '& p': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.colors.grey[18]
    },
    '& svg': {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: theme.colors.grey[7],
      cursor: 'pointer'
    }
  },
  infoText: {
    padding: theme.spacing(1, 1.25),
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  uploadCSV: {
    padding: theme.spacing(1, 1.25),
    height: 84
  },
  downloadCSVText: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: theme.colors.blue[800],
    cursor: 'pointer'
  },
  actionButtons: {
    marginRight: theme.spacing(1)
  },
  dragDropArea: {
    border: `1px dashed ${theme.colors.grey[10]}`,
    cursor: 'pointer',
    '& p': {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: theme.colors.grey[8]
    },
    '& svg': {
      fontSize: '1.5rem',
      fontWeight: 900,
      color: theme.colors.grey[8]
    }
  },
  fileName: {
    padding: theme.spacing(0, 1.25),
    marginBottom: theme.spacing(1),
    '& p': {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: theme.colors.grey[8]
    },
    '& svg': {
      fontSize: '0.75rem',
      fontWeight: 900,
      color: theme.colors.grey[8],
      marginRight: theme.spacing(0.5)
    }
  },
  actionBtnContainer: {
    padding: theme.spacing(1, 1.25)
  }
}));

const ACCEPTED_FILE_TYPES = ['text/csv'];

const BulkUploadDialog = ({ open, handleClose, handleSubmit }) => {
  const classes = useStyles();
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleSubmitClick = () => {
    handleSubmit(fileToUpload);
  };

  const handleDrop = folders => {
    if (folders) {
      if (folders[0].files[0] instanceof Error) {
        toast.error('Unsupported file type');
      } else {
        setFileToUpload(folders[0].files[0]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (fileToUpload) setFileToUpload(null);
    };
  }, [open]);

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <Box
            className={classes.header}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography>Import defects using CSV file.</Typography>
            <Box onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </Box>
          </Box>

          <Box>
            <Typography className={classes.infoText}>
              Add defect details in the sample csv file and upload it to import
              defects.{' '}
              <a href='/sample.csv' className={classes.downloadCSVText}>
                Click to download sample CSV.
              </a>
            </Typography>
          </Box>

          <Box className={classes.uploadCSV}>
            <DropZone
              spinnerProps={{ isLoading: false }}
              acceptedFileTypes={ACCEPTED_FILE_TYPES}
              isMultiUpload={false}
              onUploadEnd={handleDrop}
              isFoldersUpload={false}
              label='Upload CSV'
              disabled={fileToUpload}
            />
          </Box>

          {fileToUpload && (
            <Box
              className={classes.fileName}
              display='flex'
              alignItems='center'
            >
              <FontAwesomeIcon icon={faFileUpload} />
              <Typography>{fileToUpload.name || ''}</Typography>
            </Box>
          )}

          <Box
            className={classes.actionBtnContainer}
            display='flex'
            alignItems='center'
          >
            <CommonButton
              wrapperClass={classes.actionButtons}
              text='Import Defects'
              onClick={handleSubmitClick}
              disabled={!fileToUpload}
            />

            <CommonButton
              wrapperClass={classes.actionButtons}
              text='Cancel'
              variant='tertiary'
              onClick={handleClose}
            />
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default BulkUploadDialog;
