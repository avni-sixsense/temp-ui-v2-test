// import { faArrowAltFromTop, faCog } from '@fortawesome/pro-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import CommonButton from 'app/components/ReviewButton'
import React from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  root: {
    borderRadius: '4px',
    border: `0.2px solid ${theme.colors.grey[0]}`,
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.base,
    minHeight: '360px'
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
  subTitle = '',
  wrapperClass = '',
  chartComp,
  isLoading
}) => {
  const classes = useStyles();

  return (
    <Box className={`${classes.root} ${wrapperClass}`}>
      <Box
        className={classes.titleContainer}
        py={1}
        pl={1.75}
        // mb={1.5}
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
          {/* <CommonButton
						icon={<FontAwesomeIcon icon={faCog} />}
						size="sm"
						variant="tertiary"
						wrapperClass={classes.btns}
					/>
					<CommonButton
						icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
						size="sm"
						variant="tertiary"
						text="Export"
						wrapperClass={classes.btns}
						onClick={() => {}}
					/> */}
        </Box>
      </Box>
      <Box pl={1.5} pr={1.25}>
        {isLoading ? (
          <Box py={2} display='flex' alignItems='center'>
            <CircularProgress />
          </Box>
        ) : (
          <Box>{chartComp}</Box>
        )}
      </Box>
    </Box>
  );
};

export default DataCard;
