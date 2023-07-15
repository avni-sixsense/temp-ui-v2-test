import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loading from 'assests/images/loading.svg';
import React from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '629px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    marginTop: theme.spacing(5),
    backgroundColor: 'transparent',
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  title: {
    ...theme.typeFace.futuraBT125,
    fontWeight: 'normal',
    lineHeight: '1.6rem',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: theme.colors.marineBlue
  },
  StrongFont: {
    fontWeight: '900'
  },
  successImg: {
    margin: '5%',
    width: '629px',
    height: '323px'
  }
}));

function LoadingPage(props) {
  const classes = useStyles();
  const [completed, setCompleted] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progress = React.useRef(() => {});
  React.useEffect(() => {
    progress.current = () => {
      if (completed > 100) {
        setCompleted(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setCompleted(completed + diff);
        setBuffer(completed + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    function tick() {
      progress.current();
    }
    const timer = setInterval(tick, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Paper elevation={0} className={classes.paper}>
        <Grid container className={classes.container} justifyContent='center'>
          <Grid item>
            <Typography variant='h1' className={classes.title}>
              Loading <span className={classes.StrongFont}>classifAI</span>{' '}
              Platform
            </Typography>
          </Grid>
          <Grid item>
            <img src={Loading} className={classes.successImg} alt='' />
          </Grid>
          <Grid item>
            <LinearProgress
              variant='determinate'
              color='secondary'
              value={completed}
              valueBuffer={buffer}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default LoadingPage;
