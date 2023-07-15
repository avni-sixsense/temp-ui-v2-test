import { faPlus, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import SearchableComp from 'app/components/LightSearchableComp';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  textFieldTitle: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  container: {
    width: 479
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  searchCompContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  matricTextfield: {
    backgroundColor: theme.colors.grey[2],
    '& input': {
      color: theme.colors.grey[18],
      fontSize: '0.875rem',
      fontWeight: 600,
      '&::placeholder': {
        color: theme.colors.grey[6],
        opacity: theme.colors.opacity[10]
      },
      '&:-ms-input-placeholder': {
        color: theme.colors.grey[6]
      },
      '&::-ms-input-placeholder': {
        color: theme.colors.grey[6]
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `0.8px solid ${theme.colors.grey[4]}`,
      borderRadius: '4px'
    }
  }
}));

const MatricPopper = ({ handleClick }) => {
  const classes = useStyles();
  const [isAddMatric, setAddMatric] = useState(false);
  const [matricName, setMatricName] = useState('');
  const [matricDescription, setMatricDescription] = useState('');
  const [marticFormula, setMarticFormula] = useState('');

  const handleMatricNameChange = event => {
    setMatricName(event.target.value || '');
  };

  const handleMatricDescription = event => {
    setMatricDescription(event.target.value || '');
  };

  const handleAddMatric = () => {
    setAddMatric(!isAddMatric);
  };
  const handleMatricFormula = event => {
    setMarticFormula(event.target.value || '');
  };

  const handleEdit = data => {
    setAddMatric(true);
    setMatricName(data.title);
    setMatricDescription(data.subTitle);
  };

  return (
    <Paper className={classes.container}>
      <Box px={1.5} pt={1.5} pb={2}>
        <Box mb={1.5} pb={1.25} className={classes.titleContainer}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography className={classes.title}>Metrics</Typography>
            <CommonButton
              text='Close'
              variant='tertiary'
              size='sm'
              icon={<FontAwesomeIcon icon={faTimes} />}
              onClick={handleClick}
            />
          </Box>
          <Typography className={classes.subTitle}>
            Metrics are formula based on the data dimensions that we track.
          </Typography>
        </Box>
        <Box mb={1.5} className={classes.searchCompContainer}>
          <SearchableComp placeholder='Search Metric...' onEdit={handleEdit} />
        </Box>
        {isAddMatric && (
          <Box>
            <Box mb={1.5}>
              <Typography className={classes.textFieldTitle}>
                Metric Name
              </Typography>
              <TextField
                fullWidth
                className={classes.matricTextfield}
                value={matricName}
                onChange={handleMatricNameChange}
                placeholder='Matric Name'
                variant='outlined'
                size='small'
              />
            </Box>
            <Box mb={1.5}>
              <Typography className={classes.textFieldTitle}>
                Metric Description
              </Typography>
              <TextField
                fullWidth
                className={classes.matricTextfield}
                value={matricDescription}
                onChange={handleMatricDescription}
                placeholder='Matric Description'
                variant='outlined'
                size='small'
              />
            </Box>
            <Box mb={1.5}>
              <Typography className={classes.textFieldTitle}>
                Metric Formula
              </Typography>
              <TextField
                fullWidth
                className={classes.matricTextfield}
                value={marticFormula}
                onChange={handleMatricFormula}
                placeholder='Add Formula'
                variant='outlined'
                size='small'
              />
            </Box>
          </Box>
        )}
        <Box display='flex' alignItems='center' justifyContent='flex-start'>
          <CommonButton
            onClick={handleAddMatric}
            text='Add Metric'
            icon={<FontAwesomeIcon icon={faPlus} />}
            size='m'
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default MatricPopper;
