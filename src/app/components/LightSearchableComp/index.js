import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import DataComp from './components/dataComp';

const useStyles = makeStyles(theme => ({
  searchBar: {
    backgroundColor: theme.colors.grey[1],
    '& input': {
      color: theme.colors.grey[18],
      fontSize: '0.8125rem',
      fontWeight: 500,
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

const SearchableComp = ({ placeholder, onEdit }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = event => {
    setSearchText(event.target.value || '');
  };

  const tempData = [
    {
      title: 'Yield Loss % Over Time',
      tag: '5 charts',
      subTitle: 'Lorem Ipsum'
    },
    {
      title: 'Metric B',
      tag: '5 charts'
    }
  ];

  return (
    <Box>
      <TextField
        fullWidth
        className={classes.searchBar}
        value={searchText}
        onChange={handleSearchChange}
        placeholder={placeholder}
        variant='outlined'
        size='small'
      />
      <Box my={1.5}>
        {tempData
          .filter(x => x.title.toLowerCase().includes(searchText.toLowerCase()))
          .map(data => (
            <Box mb={1.875}>
              <DataComp
                tag={data.tag}
                title={data.title}
                subTitle={data.subTitle}
                onEdit={onEdit}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default SearchableComp;
