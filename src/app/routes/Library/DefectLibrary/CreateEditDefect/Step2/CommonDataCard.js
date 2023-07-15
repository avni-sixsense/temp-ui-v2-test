import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/CommonButton';
import DeleteIcon from 'assests/images/icons/delete.svg';
import PencileIcon from 'assests/images/icons/pencil.svg';
import React, { useCallback, useState } from 'react';

const useStyle = makeStyles(theme => ({
  records: {
    background: 'rgba(223,239,245,0.5)'
  },
  items: {
    borderTop: '2px solid #E6E6E6'
  },
  img: {
    width: '100px',
    height: '100px',
    marginRight: '8px',
    borderRadius: 10,
    marginBottom: theme.spacing(1)
  }
}));

const CommonDataCard = ({ data, handleDelete, handleEdit, index }) => {
  const classes = useStyle();
  const [hover, setHover] = useState(false);

  const handleHower = useCallback(() => {
    setHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  return (
    <Box
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleHower}
      className={classes.records}
      p={2}
      my={1}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex'>
          {Object.entries(data.meta_info).map(([key, value]) => {
            return (
              <Box key={key} mr={1}>
                <Typography variant='body1' className='ss-capital' gutterBottom>
                  {key}
                </Typography>
                <Typography variant='body2' gutterBottom>
                  {value}
                </Typography>
              </Box>
            );
          })}
        </Box>
        {hover && (
          <Box display='flex' alignItems='center'>
            <Box display='flex' mx={1}>
              <img src={DeleteIcon} alt='' />
              <CommonButton
                text='Delete'
                onClick={() => handleDelete(data)}
                variant='quaternary'
              />
            </Box>
            <Box display='flex' mx={1}>
              <img src={PencileIcon} alt='' />
              <CommonButton
                text='Edit'
                onClick={() => handleEdit(data, index)}
                variant='quaternary'
              />
            </Box>
          </Box>
        )}
      </Box>
      <Box display='flex' className={classes.items} pt={1} flexWrap='wrap'>
        {data.reference_files.map((file, index) => {
          return (
            <img src={file.url} alt='' className={classes.img} key={index} />
          );
        })}
      </Box>
    </Box>
  );
};

export default CommonDataCard;
