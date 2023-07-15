import { faCaretDown, faCaretRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  CircularProgress,
  makeStyles,
  Typography
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/styles';
import CustomSwitch from 'app/components/CustomSwitch';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[16]
  },
  subTitle: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[13]
  }
}));

const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    border: 'none',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    },
    borderBottom: `1px solid #CEE0F8`
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    },
    '.toggle-contianer': {
      display: 'flex'
    },
    justifyContent: 'space-between'
  },
  expanded: {}
})(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(0)
  }
}))(MuiAccordionDetails);

const Collapse = ({
  content,
  open,
  title,
  subTitle,
  showToggle = false,
  isLoading,
  nonCollapse = false,
  toggleDisabled,
  toggleChecked
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(open);
  }, [open]);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary>
        <Box display='flex' alignItems='center'>
          {showToggle && (
            <CustomSwitch
              disabled={toggleDisabled}
              checked={toggleChecked}
              handleChecked={() => {}}
              label={false}
            />
          )}
          <Box>
            <Typography className={classes.title}>{title}</Typography>
            {subTitle && (
              <Typography className={classes.subTitle}>{subTitle}</Typography>
            )}
          </Box>
        </Box>
        {!nonCollapse ? (
          expanded ? (
            <FontAwesomeIcon icon={faCaretDown} />
          ) : (
            <FontAwesomeIcon icon={faCaretRight} />
          )
        ) : (
          ''
        )}
      </AccordionSummary>
      <AccordionDetails>
        {isLoading ? <CircularProgress /> : content}
      </AccordionDetails>
    </Accordion>
  );
};

export default Collapse;
