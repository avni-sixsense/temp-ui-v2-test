import {
  faArrowAltFromTop,
  faFunction,
  faGripHorizontal,
  faPlus,
  faTimes
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AdvanceFilter from 'app/components/AdvanceFilter/AdvanceFilter';
import CommonButton from 'app/components/ReviewButton';
import MatricPopper from './components/matric-popper';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  subHeader: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[19]
  },
  container: {
    backgroundColor: theme.colors.grey[0]
  },
  widgetContainer: {
    borderRadius: '8px',
    backgroundColor: theme.colors.grey[1],
    border: `0.5px solid ${theme.colors.grey[5]}`
  },
  popperTitleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  gridContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  gridNumber: {
    borderRadius: '4px',
    backgroundColor: theme.colors.grey[3],
    width: '77px',
    height: '40px',
    cursor: 'pointer'
  },
  activeGridNumber: {
    borderRadius: '4px',
    backgroundColor: theme.colors.blue[300],
    width: '77px',
    height: '40px',
    cursor: 'pointer'
  },
  popperContainer: {
    width: 359,
    height: 194,
    boxShadow: theme.colors.shadow.lg
  }
}));

const Header = ({ setColumns, columns, handleWidgetClick }) => {
  const classes = useStyles();
  const [layoutAnchor, setLayoutAnchor] = useState(null);
  const [layoutPopperOpen, setLayoutPopper] = useState(false);
  const [matricAnchor, setMatricAnchor] = useState(null);
  const [matricPopperOpen, setMatricPopper] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(columns);

  const handleLayoutPopper = event => {
    if (layoutAnchor) {
      setLayoutAnchor(null);
      setLayoutPopper(false);
    } else {
      setLayoutAnchor(event.currentTarget);
      setLayoutPopper(true);
    }
  };

  const handleMatricPopper = event => {
    if (matricAnchor) {
      setMatricAnchor(null);
      setMatricPopper(false);
    } else {
      setMatricAnchor(event.currentTarget);
      setMatricPopper(true);
    }
  };

  const handleGridChange = () => {
    setColumns(selectedGrid);
    handleLayoutPopper();
  };

  return (
    <Box
      pt={4.5}
      pb={5.25}
      pr={2.5}
      pl={3}
      mb={2.5}
      className={classes.container}
    >
      <Box mb={2.5}>
        <Typography className={classes.header}>AI Results</Typography>
        <Typography className={classes.subHeader}>
          This information will be displayed publicly so be careful what you
          share.{' '}
        </Typography>
      </Box>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box width='75%'>
          <AdvanceFilter lightTheme />
        </Box>
        <Box
          width='15%'
          display='flex'
          alignItems='center'
          justifyContent='space-around'
          className={classes.widgetContainer}
          p={1}
        >
          <CommonButton
            onClick={handleLayoutPopper}
            icon={<FontAwesomeIcon icon={faGripHorizontal} />}
            size='sm'
            variant='tertiary'
          />
          <CommonButton
            icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
            size='sm'
            variant='tertiary'
          />
          <CommonButton
            icon={<FontAwesomeIcon icon={faFunction} />}
            size='sm'
            variant='tertiary'
            text='Metrics'
            onClick={handleMatricPopper}
          />
          <CommonButton
            icon={<FontAwesomeIcon icon={faPlus} />}
            size='sm'
            variant='primary'
            text='Add Widget'
            onClick={handleWidgetClick}
          />
          <Popper
            placement='bottom-end'
            open={layoutPopperOpen}
            anchorEl={layoutAnchor}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper className={classes.popperContainer}>
                  <Box px={1.5} pt={1.625} pb={2}>
                    <Box
                      pb={1.25}
                      mb={1.5}
                      className={classes.popperTitleContainer}
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Typography>Layout Options</Typography>
                      <CommonButton
                        onClick={handleLayoutPopper}
                        icon={<FontAwesomeIcon icon={faTimes} />}
                        size='sm'
                        variant='tertiary'
                        text='Close'
                      />
                    </Box>
                    <Box>
                      <Typography>Select Layout Grid</Typography>
                      <Box
                        pb={1.5}
                        className={classes.gridContainer}
                        mt={1}
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        {[2, 3, 4].map(grid => (
                          <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            className={
                              grid === selectedGrid
                                ? classes.activeGridNumber
                                : classes.gridNumber
                            }
                            onClick={() => setSelectedGrid(grid)}
                          >
                            {`${grid} Columns`}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box
                      mt={1}
                      display='flex'
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      <Box ml={1}>
                        <CommonButton
                          onClick={handleLayoutPopper}
                          size='sm'
                          variant='tertiary'
                          text='Cancel'
                        />
                      </Box>
                      <Box ml={1}>
                        <CommonButton
                          onClick={handleGridChange}
                          icon={<FontAwesomeIcon icon={faPlus} />}
                          size='sm'
                          variant='primary'
                          text='Select Layout'
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Popper
            placement='bottom-end'
            open={matricPopperOpen}
            anchorEl={matricAnchor}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <MatricPopper handleClick={handleMatricPopper} />
              </Fade>
            )}
          </Popper>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
