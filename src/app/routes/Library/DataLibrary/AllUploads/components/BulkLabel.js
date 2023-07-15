import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  ClickAwayListener,
  Fade,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  Typography
} from '@material-ui/core';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import InputChipSelect from 'app/components/InputChipSelect';
import CommonButton from 'app/components/ReviewButton';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import { encodeURL } from 'app/utils/helpers';
import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  removeTagIcon: {
    color: `${theme.colors.red[600]} !important`
  },
  paper: {
    backgroundColor: theme.colors.grey[17],
    width: '20.125rem',
    marginTop: theme.spacing(1.25)
  },
  lightPaper: {
    backgroundColor: theme.colors.grey[0],
    border: `1px solid ${theme.colors.grey[6]}`,
    width: '20.125rem',
    marginTop: theme.spacing(1.25),
    borderRadius: '4px'
  },
  header: {
    fontWeight: 600,
    color: theme.colors.grey[0],
    fontSize: '0.9375rem'
  },
  lightHeader: {
    fontWeight: 600,
    color: theme.colors.grey[14],
    fontSize: '0.9375rem'
  },
  closeIcon: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[8]
  },
  lightCloseIcon: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[8]
  },
  headerContainer: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`
  },
  lightHeaderContainer: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  popper: {
    zIndex: 999
  },
  lightSelectText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[12],
    marginBottom: theme.spacing(0.75)
  },
  selectText: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.colors.grey[0],
    marginBottom: theme.spacing(0.75)
  },
  formControl: {
    marginLeft: 0
  },
  title: {
    fontWeight: 600,
    fontSize: '0.75rem',
    color: theme.colors.grey[0],
    marginBottom: theme.spacing(0.75)
  },
  actionBtn: {
    marginRight: theme.spacing(1)
  }
}));

const BulkLabelContainer = ({ selected = [], lightTheme = false }) => {
  const classes = useStyles();
  const { subscriptionId } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [inputChipValue, setInputChipValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldOverWrite, setShouldOverWrite] = useState(false);
  const isSameUsecase = selected.every(
    (val, i, arr) => val.use_case === arr[0].use_case
  );
  const isAllClassification = selected.every(
    val => val.use_case_type === 'CLASSIFICATION'
  );

  const queryClient = useQueryClient();

  const { data: defects } = useQuery(
    ['bulkLableUseCaseDefects', selected[0]?.use_case, subscriptionId],
    context => api.getUseCaseDefects(...context.queryKey),
    { enabled: !!(isSameUsecase && subscriptionId && selected.length) }
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('bulkLableUseCaseDefects');
    };
  }, []);

  const onSubmit = () => {
    setIsLoading(true);
    const tempObj = {};
    tempObj.is_no_defect = false;
    tempObj.defects = inputChipValue.map(item => item.id);
    tempObj.file_set_filters = encodeURL({
      upload_session_id__in: selected.map(item => item.id)
    });
    tempObj.replace_existing_labels = shouldOverWrite;
    api
      .addBulkClassification(tempObj)
      .then(() => {
        handlePopperClose();
        queryClient.invalidateQueries('uploadSessions');
        toast(`Folders are updated successfully.`);
      })
      .catch(() => {
        handlePopperClose();
      });
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setInputChipValue([]);
    setShouldOverWrite(false);
    setIsLoading(false);
  };

  const onClick = event => {
    if (!(open && anchorEl)) {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    } else {
      handlePopperClose();
    }
  };
  const handleSubmit = () => {
    onSubmit();
  };

  const handleInputChipChange = value => {
    if (Array.isArray(value)) {
      setInputChipValue(value);
    } else {
      setInputChipValue(Object.keys(value).length ? [value] : []);
    }
  };

  const handleCheckboxChange = event => {
    setShouldOverWrite(event.target.checked);
  };

  return (
    <>
      {/* <Box mb={1} className={classes.buttonBar} display="flex" flexWrap="wrap" py={0.5}> */}
      <CommonButton
        wrapperClass='px-3'
        disabled={!(selected.length && isSameUsecase && isAllClassification)}
        onClick={onClick}
        text='Add Defect Label'
        variant='tertiary'
      />
      {/* </Box> */}
      {open && (
        <ClickAwayListener onClickAway={handlePopperClose}>
          <Popper
            className={classes.popper}
            placement='bottom-start'
            open={open}
            anchorEl={anchorEl}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper
                  className={clsx({
                    [classes.paper]: !lightTheme,
                    [classes.lightPaper]: lightTheme
                  })}
                >
                  <Box pt={2.125} px={1.25} pb={1.875}>
                    <Box
                      pb={1.25}
                      className={clsx({
                        [classes.headerContainer]: !lightTheme,
                        [classes.lightHeaderContainer]: lightTheme
                      })}
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Typography
                        className={clsx({
                          [classes.header]: !lightTheme,
                          [classes.lightHeader]: lightTheme
                        })}
                      >
                        Add Defect Label
                      </Typography>
                      <IconButton
                        className={clsx({
                          [classes.closeIcon]: !lightTheme,
                          [classes.lightCloseIcon]: lightTheme
                        })}
                        onClick={handlePopperClose}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </IconButton>
                    </Box>
                    <Box pt={1.25}>
                      <Box pb={0.25}>
                        <Typography
                          className={clsx({
                            [classes.selectText]: !lightTheme,
                            [classes.lightSelectText]: lightTheme
                          })}
                        >
                          Select Label
                        </Typography>
                        <InputChipSelect
                          data={defects?.results || []}
                          value={inputChipValue}
                          onChange={handleInputChipChange}
                          lightTheme={lightTheme}
                        />
                      </Box>
                      <Box pt={1.25}>
                        <CustomizedCheckbox
                          checked={shouldOverWrite}
                          onChange={handleCheckboxChange}
                          label='Overwrite images which have a label.'
                          lightTheme={lightTheme}
                        />
                      </Box>
                      <Box pt={1.25} display='flex' alignItems='center'>
                        <CommonButton
                          wrapperClass={classes.actionBtn}
                          text='Add'
                          onClick={handleSubmit}
                          disabled={inputChipValue.length === 0}
                        />
                        <CommonButton
                          text='Cancel'
                          onClick={handlePopperClose}
                          disabled={false}
                          variant={lightTheme ? 'tertiary' : 'secondary'}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      )}

      <CommonBackdrop open={isLoading} />
    </>
  );
};

export default memo(BulkLabelContainer);
