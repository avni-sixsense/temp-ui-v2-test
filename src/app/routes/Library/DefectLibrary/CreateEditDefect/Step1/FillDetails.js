import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilePreview from 'app/components/FilePreview';
import Progress from 'app/components/Progress';
import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDefectLibNewDefect } from 'store/defectLibrary/selectors';

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

const mapDefectToState = createStructuredSelector({
  defect: selectDefectLibNewDefect
});

const FillDetails = ({
  hanldeFileInputCLick,
  control,
  setValue,
  handleFileDelete,
  uploadService,
  useCases
}) => {
  const classes = useStyle();
  const { defect } = useSelector(mapDefectToState);
  const [isExpand, setIsExpand] = useState(false);

  const ref = useRef(null);

  const handleExpand = () => {
    setIsExpand(!isExpand);
  };

  const scrollToBottom = useCallback(() => {
    if (isExpand && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isExpand]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (Object.entries(defect).length) {
      setValue(
        'organization_defect_code',
        defect?.organization_defect_code || '',
        { shouldValidate: true }
      );
      setValue('name', defect?.name || '', { shouldValidate: true });
      setValue('description', defect?.description || '');
      setValue('useCases', defect?.use_cases || []);
    }
  }, [defect, setValue]);

  const bootstrapClasses = useStylesBootstrap();

  return (
    <>
      <Box className={classes.boxes}>
        <Box mb={4}>
          <Box my={1}>
            <Typography variant='h2' style={{ fontWeight: 500 }}>
              Defect Name
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
              Enter name of the new defect
            </Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='name'
              control={control}
              defaultValue={defect?.name || ''}
              render={({ field }) => (
                <Input className={classes.inputField} {...field} />
              )}
            />
          </Box>
        </Box>
        <Box mb={4}>
          <Box my={1}>
            <Typography variant='h2' style={{ fontWeight: 500 }}>
              Defect Code
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
            <Typography variant='subtitle2'>Enter the code here</Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='organization_defect_code'
              defaultValue={defect?.organization_defect_code || ''}
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
              Defect Definition
            </Typography>
          </Box>
          <Box my={1}>
            <Typography variant='subtitle2'>
              Add a one line definition for the defect
            </Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='description'
              control={control}
              defaultValue={defect?.description || ''}
              render={({ field }) => (
                <Input
                  className={classes.inputField}
                  style={{ width: '60%' }}
                  {...field}
                />
              )}
            />
          </Box>
        </Box>
        <Box mb={4}>
          <Box my={1}>
            <Typography variant='h2' style={{ fontWeight: 500 }}>
              Use Case
            </Typography>
          </Box>
          <Box mt={2}>
            <Controller
              name='useCases'
              control={control}
              defaultValue={defect?.useCases || []}
              render={({ field }) => (
                <ModelSelect
                  {...field}
                  selected={field.value}
                  models={useCases}
                  width={275}
                  height={40}
                  multiSelect
                />
              )}
            />
          </Box>
        </Box>
        <Box>
          {isExpand ? (
            <IconButton
              className={classes.optionBtn}
              onClick={handleExpand}
              size='small'
            >
              <Typography>Less Options</Typography>
              <ExpandLessIcon />
            </IconButton>
          ) : (
            <IconButton
              className={classes.optionBtn}
              onClick={handleExpand}
              size='small'
            >
              <Typography>More Options</Typography>
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Box>
        {isExpand && (
          <Box mb={4}>
            <Box my={1}>
              <Typography variant='h2' style={{ fontWeight: 500 }}>
                Add Meta Images
              </Typography>
            </Box>
            <FilePreview
              uppy={uploadService?.current?.uppy}
              handleFileInputClick={hanldeFileInputCLick}
              handleFileDelete={handleFileDelete}
            />
            <Box width='30%'>
              <Progress uppy={uploadService?.current?.uppy} />
            </Box>
          </Box>
        )}
        {/* <Box mb={4} >
				<Box my={1}>
				<Typography variant="h2" style={{ fontWeight: 500 }}>
				Application
				</Typography>
				</Box>
				<Box my={1}>
				<Typography variant="h3">Select the Application layer here</Typography>
				</Box>
				<Box mt={2}>
					<Input className={classes.inputField} value="Top SMI" />
					</Box>
				</Box> */}
        {/* <Box mb={4}>
				<CommonButton text="Add a New Entry" />
			</Box> */}
      </Box>
      {isExpand && <div ref={ref} />}
    </>
  );
};

export default FillDetails;
