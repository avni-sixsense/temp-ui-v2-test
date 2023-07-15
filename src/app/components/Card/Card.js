import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import React from 'react';

import CardActions from './CardActions';
import CardContent from './CardContent';
import CardHeader from './CardHeader';

const useStyle = makeStyles(theme => ({
  btn: {
    borderRadius: '100px'
  },
  card: {
    backgroundColor: 'white',
    // background: `url(${CardBg})`,
    backgroundRepeat: 'no-repeat',
    width: '305px',
    padding: '1%',
    borderRadius: '10px',
    border: `1px solid ${alpha(theme.colors.marineBlue, 0.13)}`,
    boxShadow: `0 10px 20px 5px ${alpha(theme.colors.azure, 0.1)}`,
    margin: '0 2%',
    marginBottom: 16,
    '& .MuiCardContent-root': {
      padding: 0
    },
    '& .MuiButton-root': {
      marginLeft: theme.spacing(2.375),
      marginBottom: theme.spacing(2.5)
    }
  }
}));

function DataCard({ locked = false, variant, label, link, data, click }) {
  const classes = useStyle();

  return (
    <Card className={classes.card}>
      <CardHeader locked={locked} url={data?.image} />
      <CardContent data={data} />
      <CardActions
        classes={classes}
        variant={variant}
        label={label}
        link={link}
        data={data}
        click={click}
      />
    </Card>
  );
}

export default DataCard;

DataCard.defaultValue = {
  locked: false
};

DataCard.propTypes = {
  locked: PropTypes.bool,
  variant: PropTypes.string,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  click: PropTypes.func.isRequired
};
