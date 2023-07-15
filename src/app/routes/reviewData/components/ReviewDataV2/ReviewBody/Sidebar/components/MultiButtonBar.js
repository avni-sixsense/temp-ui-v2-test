import {
  faBolt,
  faCheck,
  faCheckDouble,
  faEye,
  faPen,
  faTimes,
  faTimesCircle,
  faTrashAlt
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Label from 'app/components/Label';
import CommonButton from 'app/components/ReviewButton';
import { getParamsObjFromEncodedString } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-use';
import { selectSelectAll } from 'store/reviewData/selector';
import { createStructuredSelector } from 'reselect';

import ActionButtonPopper from '../../../../ActionButtonPopper';

const useStyles = makeStyles(theme => ({
  buttonBar: {
    backgroundColor: 'rgba(28, 42, 66, 0.7)',
    borderRadius: '4px',
    border: `0.2px solid ${theme.colors.grey[13]}`
  },
  button: {
    margin: '5px 0px 5px 10px'
    // padding: theme.spacing(0.5, 1),
    // whiteSpace: 'nowrap',
    // fontSize: '0.750rem',
    // '& svg': {
    // 	fontSize: '0.750rem !important',
    // },
  },
  paper: {
    backgroundColor: theme.colors.grey[17],
    width: '20.125rem',
    marginTop: theme.spacing(1.25)
  },
  closeIcon: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[8]
  },
  headerContainer: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`
  },
  popperContainer: {
    zIndex: 6
  }
}));

const mapReviewBodyState = createStructuredSelector({
  selectAll: selectSelectAll
});

const MultiButtonBar = ({
  variant,
  addOptionData = [],
  replaceOptionDate = [],
  deleteOptionData = [],
  onSubmit,
  models = []
}) => {
  const classes = useStyles();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [header, setHeader] = useState('');
  const [type, setType] = useState('');
  const [submitBtnText, setSubmitBtnText] = useState('');
  const [shortcutKey, setShortcutKey] = useState('');
  const [verticleRadio, setVerticleRadio] = useState(false);
  const [radioGroup, setRadioGroup] = useState({});
  const [checkboxGroup, setCheckboxGroup] = useState({});
  const [multiSelect, setMultiSelect] = useState(false);
  const [open, setOpen] = useState(false);
  const [paramsObj, setParamsObj] = useState({});
  const { availableButtons } = useSelector(
    ({ actionButtons }) => actionButtons
  );
  const { modelLoading } = useSelector(({ helpers }) => helpers);
  const { useAIAssistance } = useSelector(({ review }) => review);
  const userInfo = useSelector(({ common }) => common.userInfo ?? {});
  const { selectAll } = useSelector(mapReviewBodyState);

  useEffect(() => {
    const params = getParamsObjFromEncodedString(location.search);
    setParamsObj(params || {});
  }, [location.search]);

  const handlePopperClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setHeader('');
    setType('');
    setSubmitBtnText('');
    setShortcutKey('');
  };

  const handleButtonClick = (
    multiSelect,
    event,
    title,
    type,
    radioObj,
    submitBtnText,
    shortCutKey = '',
    checkboxObj
  ) => {
    if (!open || (open && event.currentTarget !== anchorEl)) {
      setMultiSelect(multiSelect);
      setAnchorEl(event.currentTarget);
      setHeader(title);
      setSubmitBtnText(submitBtnText || '');
      setRadioGroup(Object.keys(radioObj || {}).length ? radioObj : {});
      setCheckboxGroup(
        Object.keys(checkboxObj || {}).length ? checkboxObj : {}
      );
      if (Object.keys(radioObj || {}).length && radioObj?.verticle) {
        setVerticleRadio(true);
      } else if (verticleRadio) {
        setVerticleRadio(false);
      }
      setType(type || '');
      setShortcutKey(shortCutKey);
      setOpen(true);
    } else {
      handlePopperClose();
      setMultiSelect(false);
    }
  };

  const handleRadioChange = () => {
    // console.log(res)
  };

  const handleSubmit = data => {
    onSubmit(data);
  };

  // DETECTION VERTICLE RADIO LOGIC
  //
  // models?.classification_type === 'MULTI_LABEL'
  // 						? {
  // 								buttons: ['Delete all Boxes', 'Where Label'],
  // 								onChange: handleRadioChange,
  // 								verticle: true,
  // 						  }
  // 						: {
  // 								buttons: ['All Boxes', 'With Specific Label'],
  // 								onChange: handleRadioChange,
  // 						  }

  const allButtons = {
    similarImages: [
      {
        label: 'View all Similar Images',
        icon: <FontAwesomeIcon icon={faEye} />,
        onClick: onSubmit,
        disabled: false,
        visible: true
      }
    ],
    classificationAction: [
      // {
      //   label: 'Add',
      //   icon: <FontAwesomeIcon icon={faPlusCircle} />,
      //   onClick: event =>
      //     handleButtonClick(
      //       useCaseClassificationType === 'MULTI_LABEL',
      //       event,
      //       'Add Classification Defect Class',
      //       'ADD',
      //       {},
      //       'Add Class',
      //       '',
      //       {
      //         labels: ['Overwrite images which have Label already.']
      //       }
      //     ),
      //   disabled: false,
      //   visible: true,
      //   type: 'ADD'
      // },
      // {
      //   label: 'Replace',
      //   icon: <FontAwesomeIcon icon={faPen} />,
      //   onClick: event =>
      //     handleButtonClick(
      //       false,
      //       event,
      //       'Replace Classification Defect Class',
      //       'EDIT',
      //       {},
      //       'Replace'
      //     ),
      //   disabled: false,
      //   visible: true,
      //   type: 'EDIT'
      // },
      {
        label: 'Remove',
        icon: <FontAwesomeIcon icon={faTrashAlt} />,
        onClick: event =>
          handleButtonClick(
            true,
            event,
            'Remove Classification Defect Class',
            'DELETE',
            {
              buttons: ['Remove All', 'Remove Specific Labels'],
              onChange: handleRadioChange
            },
            'Remove'
          ),
        disabled: false,
        visible: true,
        type: 'DELETE'
      },
      {
        label: 'Mark AI label Correct',
        icon: <FontAwesomeIcon icon={faCheck} />,
        onClick: event =>
          handleButtonClick(
            false,
            event,
            'Are you sure you want to mark all AI labels correct?',
            'NOSELECT',
            {},
            'Update'
          ),
        disabled: !useAIAssistance,
        visible: !selectAll,
        type: 'ADD'
      },
      {
        label: 'Mark as Label',
        icon: <FontAwesomeIcon icon={faCheckDouble} />,
        onClick: event =>
          handleButtonClick(
            false,
            event,
            'Are you sure you want to mark all as Label?',
            'MARK_AS_GT',
            {},
            'Update'
          ),
        disabled: false,
        visible: (userInfo.is_staff && !selectAll) ?? false,
        type: 'MARK_AS_GT'
      }
      // {
      // 	label: 'Labelling Guide',
      // 	icon: <FontAwesomeIcon icon={faQuestionCircle} />,
      // onClick: () => handleSubmit({ type: 'LABEL_GUIDE' }),
      // 	disabled: false,
      // 	visible: true,
      // 	type: 'LABEL_GUIDE',
      // },
    ],
    detectionAction: [
      {
        label: 'Delete Box',
        icon: <FontAwesomeIcon icon={faTrashAlt} />,
        onClick: event =>
          handleButtonClick(
            true,
            event,
            models?.classification_type === 'MULTI_LABEL'
              ? 'Delete Box'
              : 'Delete Bounding Box',
            'DELETE',
            {
              buttons: ['All Boxes', 'With Specific Label'],
              onChange: handleRadioChange
            },
            'Remove'
          ),
        disabled: false,
        visible: true,
        type: 'DELETE'
      },
      {
        label: 'Remove Class',
        icon: <FontAwesomeIcon icon={faTimesCircle} />,
        onClick: event =>
          handleButtonClick(
            false,
            event,
            'Remove Box(s) with Class',
            'DELETE',
            {},
            'Remove'
          ),
        disabled: false,
        visible: true,
        type: 'DELETE'
      },
      {
        label: 'Replace Class',
        icon: <FontAwesomeIcon icon={faPen} />,
        onClick: event =>
          handleButtonClick(
            false,
            event,
            'Replace Bounding Box Class',
            'EDIT',
            {},
            'Replace'
          ),
        disabled: false,
        visible: true,
        type: 'EDIT'
      },
      {
        label: 'Mark all Boxes Correct',
        icon: <FontAwesomeIcon icon={faCheck} />,
        onClick: () => {},
        disabled: false,
        visible: true
      }
    ],
    aiAssistance: [
      {
        label: 'Add AI Model',
        icon: <FontAwesomeIcon icon={faBolt} />,
        onClick: event =>
          handleButtonClick(
            false,
            event,
            'Add AI Model',
            'ADD',
            {
              // buttons: ['All Images', 'Only this Image'],
              // onChange: handleRadioChange,
            },
            'Add AI Model'
          ),
        disabled: !!paramsObj.ai_predicted_label__in || modelLoading,
        visible: true,
        type: 'ADD'
      }
    ]
  };

  if (
    !variant ||
    !allButtons[variant].filter(x => availableButtons.includes(x.label)).length
  ) {
    return null;
  }

  return (
    <>
      <Box
        className={classes.buttonBar}
        display='flex'
        flexWrap='wrap'
        py={0.5}
      >
        {allButtons[variant]
          .filter(x => availableButtons.includes(x.label) && x.visible)
          .map((x, index) => (
            <CommonButton
              wrapperClass={classes.button}
              disabled={x.disabled}
              key={index}
              onClick={x.onClick}
              text={x.label}
              icon={x.icon}
              variant='secondary'
              size='xs'
            />
          ))}
      </Box>
      <Popper
        placement='bottom-start'
        open={open}
        anchorEl={anchorEl}
        transition
        className={classes.popperContainer}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              className={classes.paper}
              style={verticleRadio ? { width: 'auto' } : {}}
            >
              <Box pt={2.125} px={1.25} pb={1.875}>
                <Box
                  pb={1.25}
                  className={classes.headerContainer}
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Label label={header} fontWeight={600} size='medium' />
                  <IconButton
                    className={classes.closeIcon}
                    onClick={handlePopperClose}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </IconButton>
                </Box>
                <Box pt={1.25}>
                  <ActionButtonPopper
                    data={
                      type === 'ADD'
                        ? addOptionData
                        : type === 'EDIT'
                        ? replaceOptionDate
                        : type === 'DELETE'
                        ? deleteOptionData
                        : []
                    }
                    type={type}
                    multiSelect={multiSelect}
                    submitBtnText={submitBtnText}
                    handlePopperClose={handlePopperClose}
                    radioGroup={radioGroup}
                    checkboxGroup={checkboxGroup}
                    onSubmit={value => handleSubmit(value)}
                    selected={header === 'Add AI Model' ? models : []}
                    isAIModelSelect={header === 'Add AI Model'}
                    shortcutKey={shortcutKey}
                    inlineRadio={!verticleRadio}
                  />
                </Box>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default MultiButtonBar;
