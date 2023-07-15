import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import datatypeImg from 'assests/images/datatype.svg';
import scopeImg from 'assests/images/scope.svg';
import stationtypeImg from 'assests/images/stationtype.svg';
import testImg from 'assests/images/z.jpeg';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(8)
  },
  headImg: {
    width: '847px',
    height: '320px',
    borderRadius: '8px'
  },
  menuItem: {
    ...theme.typeFace.cabin875,
    display: 'flex',
    minWidth: '100px'
  },
  menu: {
    display: 'flex',
    padding: '0 !important',
    marginTop: theme.spacing(2.5)
  },
  menuItemImg: {
    margin: theme.spacing(0, 0.5)
  },
  dividerVertical: {
    margin: theme.spacing(0, 2),
    border: `1px solid ${alpha(theme.colors.marineBlue, 0.3)}`,
    height: '20px'
  },
  dividerHorizontal: {
    width: ' 21px',
    height: '3px',
    objectFit: 'contain',
    borderRadius: '1.5px',
    backgroundColor: theme.colors.salmonTwo,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  menuButton: {
    display: 'flex'
  },
  contentHeading: {
    ...theme.typeFace.FuturaBT1,
    color: theme.colors.marineBlue,
    fontWeight: '900',
    lineHeight: '1.5rem',
    marginBottom: '2px'
  },
  problemContent: {
    ...theme.typeFace.cabin875,
    color: theme.colors.marineBlue,
    opacity: '0.7',
    margin: '6px 0'
  },
  content: {
    ...theme.typeFace.cabin1,
    color: theme.colors.marineBlue,
    opacity: '0.7',
    margin: '6px 0'
  },
  link: {
    ...theme.typeFace.link,
    ...theme.typeFace.futura1
  },
  data: {
    maxWidth: '847px'
  }
}));

function LearnMore(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const handleDemo = () => {
    navigate('/tryDemo');
  };
  const handleUnlock = () => {
    navigate('/unlock');
  };
  return (
    <>
      <Grid
        container
        className={classes.root}
        justifyContent='center'
        direction='column'
        alignItems='center'
        spacing={5}
      >
        <Grid container>
          <Grid container justifyContent='flex-end' item xs>
            <Typography variant='h6' className={classes.link}>
              <Link to='/'>{`< Back`}</Link>
            </Typography>
          </Grid>
          <Grid container justifyContent='center' item xs={8}>
            <img className={classes.headImg} src={testImg} alt='' />
          </Grid>
          <Grid item xs />
        </Grid>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          item
          lg={12}
          className={classes.menu}
          spacing={2}
        >
          <Grid container item justifyContent='center' alignItems='center'>
            <Typography variant='caption' className={classes.menuItem}>
              <img alt='' src={scopeImg} className={classes.menuItemImg} />
              Scope Name Here
            </Typography>
            <Divider
              orientation='vertical'
              className={classes.dividerVertical}
              light
            />
            <Typography className={classes.menuItem}>
              <img alt='' src={datatypeImg} className={classes.menuItemImg} />
              Data type Here
            </Typography>
            <Divider
              orientation='vertical'
              className={classes.dividerVertical}
            />
            <Typography className={classes.menuItem}>
              <img
                alt=''
                src={stationtypeImg}
                className={classes.menuItemImg}
              />
              Station type Here
            </Typography>
          </Grid>
          <Grid container item justifyContent='center' alignItems='center'>
            <Button name='tryDemoBtn' onClick={handleDemo}>
              Try Demo
            </Button>
            <Divider
              orientation='vertical'
              className={classes.dividerVertical}
            />
            <Button name='unlockBtn' onClick={handleUnlock}>
              Unlock
            </Button>
          </Grid>
        </Grid>
        <Grid container justifyContent='center'>
          <Grid item xs />
          <Grid item className={classes.data} xs={8}>
            <Divider className={classes.dividerHorizontal} />
            <Grid
              container
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              item
            >
              <Typography className={classes.contentHeading}>
                Problem
              </Typography>
              <Typography className={classes.problemContent}>
                Today, operators manually classify defects by referring to a
                defect library. The classifications are influenced by human
                judgment and it requires experience to train operators to expert
                level proficiency.
              </Typography>
              <Typography className={classes.problemContent}>
                Adding a new defect to the library is also decided by operators,
                making the process chaotic and inconsistent.
              </Typography>
            </Grid>
            <Divider className={classes.dividerHorizontal} />
            <Grid
              container
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              item
            >
              <Typography className={classes.contentHeading}>
                Our Solution
              </Typography>
              <Typography className={classes.content}>
                We provide them an automatic review and classification system
                that scans through volumes of images within seconds.
              </Typography>
              <Typography className={classes.content}>
                In addition, we also gave them insights about the precise
                location, the area occupied by each defect and the number of
                defects present in an image. This new information enables a
                faster and more accurate review.
              </Typography>
            </Grid>
            <Divider className={classes.dividerHorizontal} />
            <Grid
              container
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              item
            >
              <Typography className={classes.contentHeading}>
                Example
              </Typography>
              <Typography className={classes.content}>
                Our defect classification system can categorize defects into
                categories like Crater, Micro scratch, Missing Holes, Oxide
                Patterns, etc.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
    </>
  );
}

export default LearnMore;
