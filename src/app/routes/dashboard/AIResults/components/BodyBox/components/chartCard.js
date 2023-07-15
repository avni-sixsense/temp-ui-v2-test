import {
  faArrowAltFromTop,
  faCog,
  faCompress,
  faExpand
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import CustomizedRadio from 'app/components/ReviewRadio';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  root: {
    borderRadius: '8px',
    border: `0.2px solid ${theme.colors.grey[6]}`,
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.base
  },
  value: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: theme.colors.grey[18]
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  btns: {
    marginLeft: theme.spacing(1)
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  modalTitleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  modalText: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  modalContainer: {
    maxWidth: '286px'
  },
  formControl: {
    marginRight: theme.spacing(2)
  },
  radioContrainer: {
    paddingLeft: '10px'
  }
}));

const DataCard = ({
  title = '',
  value = '',
  subTitle = '',
  wrapperClass = '',
  index,
  id,
  handleModalOpen,
  isModalOpen,
  handleModalClose,
  chartComp
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [radioValue, setRadioValue] = useState('PDF');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleModalRadio = event => {
    setRadioValue(event.target.value);
  };

  const submitModal = () => {
    handleClose();
  };

  return (
    <>
      {index ? (
        <Draggable draggableId={String(id)} index={index}>
          {provided => (
            <Box
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              mx={1.25}
              className={`${classes.root} ${wrapperClass}`}
            >
              <Box
                className={classes.titleContainer}
                py={1}
                pl={1.75}
                mb={1.5}
                pr={1.25}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Box>
                  <Box>
                    <Typography className={classes.title}>{title}</Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.subTitle}>
                      {subTitle}
                    </Typography>
                  </Box>
                </Box>
                <Box display='flex' alignItems='center'>
                  <CommonButton
                    icon={<FontAwesomeIcon icon={faExpand} />}
                    size='sm'
                    variant='tertiary'
                    wrapperClass={classes.btns}
                    onClick={() => handleModalOpen(id)}
                  />

                  <CommonButton
                    icon={<FontAwesomeIcon icon={faCog} />}
                    size='sm'
                    variant='tertiary'
                    wrapperClass={classes.btns}
                  />
                  <CommonButton
                    icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
                    size='sm'
                    variant='tertiary'
                    text='Export'
                    wrapperClass={classes.btns}
                    onClick={handleOpen}
                  />
                </Box>
              </Box>
              <Box pl={1.5} pr={1.25}>
                <Box mb={0.5}>{chartComp}</Box>
              </Box>
            </Box>
          )}
        </Draggable>
      ) : (
        <Box mx={1.25} className={`${classes.root} ${wrapperClass}`}>
          <Box
            className={classes.titleContainer}
            py={1}
            pl={1.75}
            mb={1.5}
            pr={1.25}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <Box>
                <Typography className={classes.title}>{title}</Typography>
              </Box>
              <Box>
                <Typography className={classes.subTitle}>{subTitle}</Typography>
              </Box>
            </Box>
            <Box display='flex' alignItems='center'>
              <CommonButton
                icon={<FontAwesomeIcon icon={faCompress} />}
                size='sm'
                variant='tertiary'
                wrapperClass={classes.btns}
                onClick={handleModalClose}
              />
              <CommonButton
                icon={<FontAwesomeIcon icon={faCog} />}
                size='sm'
                variant='tertiary'
                wrapperClass={classes.btns}
              />
              <CommonButton
                icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
                size='sm'
                variant='tertiary'
                text='Export'
                wrapperClass={classes.btns}
                onClick={handleOpen}
              />
            </Box>
          </Box>
          <Box pl={1.5} pr={1.25}>
            <Box mb={0.5}>{chartComp}</Box>
          </Box>
        </Box>
      )}
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Paper>
          <Box
            className={classes.modalContainer}
            pt={2.125}
            px={1.25}
            pb={1.875}
          >
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              pb={1.25}
              mb={1.25}
              className={classes.modalTitleContainer}
            >
              <Typography className={classes.modalTitle}>
                Export Widget
              </Typography>
            </Box>
            <Box mb={1.25}>
              <Typography className={classes.modalText}>
                Which format do you want to export the widget in?
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' mb={2.5}>
              <FormControl
                className={classes.radioContrainer}
                component='fieldset'
              >
                <RadioGroup value={radioValue} onChange={handleModalRadio}>
                  <Box display='flex'>
                    <Box mr={2}>
                      <FormControlLabel
                        className={classes.formControl}
                        value='PDF'
                        control={<CustomizedRadio label='PDF' lightTheme />}
                      />
                    </Box>
                    <Box mr={2}>
                      <FormControlLabel
                        className={classes.formControl}
                        value='PNG'
                        control={<CustomizedRadio label='PNG' lightTheme />}
                      />
                    </Box>
                    <Box mr={2}>
                      <FormControlLabel
                        className={classes.formControl}
                        value='XLS'
                        control={<CustomizedRadio label='XLS' lightTheme />}
                      />
                    </Box>
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display='flex' alignItems='center'>
              <Box mr={1.25}>
                <CommonButton
                  text='Export Widget'
                  size='sm'
                  onClick={submitModal}
                />
              </Box>
              <Box mr={1.25}>
                <CommonButton
                  text='Cancel'
                  size='sm'
                  variant='tertiary'
                  onClick={handleClose}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default DataCard;
