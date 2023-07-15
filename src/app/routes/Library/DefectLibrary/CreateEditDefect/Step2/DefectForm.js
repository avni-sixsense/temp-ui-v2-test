import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/CommonButton';
import FilePreview from 'app/components/FilePreview';
import Progress from 'app/components/Progress';
import React from 'react';
import { useSelector } from 'react-redux';

const useStyle = makeStyles(theme => ({
  inputField: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '0.75rem !important',
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
    borderRadius: '5px',
    marginBottom: '10px'
  },
  progressBar: {
    width: '60%',
    [theme.breakpoints.up('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.up('md')]: {
      width: '40%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '20%'
    }
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

const DefectForm = ({
  handleSave,
  handleCancel,
  edit,
  showFileDialogue,
  state,
  onChange,
  errors,
  filesChanged,
  loading,
  saveClicked,
  uploadService,
  step2Dirty,
  handleFileDelete
}) => {
  const classes = useStyle();

  const metaInfo = useSelector(({ dataLibrary }) => dataLibrary.tableStructure);
  const bootstrapClasses = useStylesBootstrap();

  const formDataChange = e => {
    onChange(e);
  };

  return (
    <Box my={2} className={classes.boxes}>
      {metaInfo.map(field =>
        field.associated_with_defects ? (
          <Box mb={4} key={field.field}>
            <Box my={1}>
              <Typography variant='h2' style={{ fontWeight: 500 }}>
                {field.name}
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
              <Input
                required
                error={!!(errors && errors[field.field])}
                className={classes.inputField}
                value={state[field.field]}
                name={field.field}
                onChange={formDataChange}
              />
              {errors && errors[field.field] ? (
                <FormHelperText error>{errors[field.field]}</FormHelperText>
              ) : null}
            </Box>
          </Box>
        ) : (
          ''
        )
      )}
      <Box mb={4}>
        <Box my={1}>
          <Typography variant='h2' style={{ fontWeight: 500 }}>
            Add Images
          </Typography>
        </Box>
        <FilePreview
          uppy={uploadService?.current?.uppy1}
          handleFileInputClick={showFileDialogue}
          handleFileDelete={handleFileDelete}
        />
      </Box>
      <Box className={classes.progressBar}>
        <Progress uppy={uploadService?.current?.uppy1} />
      </Box>
      <Box display='flex'>
        <Box>
          <CommonButton
            onClick={handleCancel}
            text='Cancel'
            variant='tertiary'
          />
        </Box>
        <Box mx={1}>
          <CommonButton
            disabled={
              !(
                state?.allDirty ||
                filesChanged ||
                step2Dirty ||
                (edit && state?.isDirty)
              )
            }
            onClick={handleSave}
            text={
              loading && saveClicked ? <CircularProgress size={15} /> : 'Save'
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DefectForm;
