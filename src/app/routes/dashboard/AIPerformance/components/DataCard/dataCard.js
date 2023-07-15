import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { NumberFormater } from 'app/utils/helpers';
import React from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[18]
  },
  root: {
    borderRadius: '8px',
    // border: `0.2px solid ${theme.colors.grey[6]}`,
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.base,
    minWidth: '200px'
  },
  value: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: theme.colors.grey[18]
  },
  subTitleKey: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10],
    whiteSpace: 'nowrap'
  },
  subTitleValue: {
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: theme.colors.grey[10]
  },
  btns: {
    marginLeft: theme.spacing(1)
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  isErrorCard: {
    fontWeight: 700,
    fontSize: '14px',
    color: theme.colors.red[600],
    paddingLeft: theme.spacing(1.875),
    paddingBottom: theme.spacing(0.875)
  },
  positiveImprovement: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.green[600],
    paddingBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(1)
  },
  negativeImprovement: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.red[600],
    paddingBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(1)
  },
  versusText: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10],
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(0.5)
  },
  cursor: {
    cursor: 'pointer'
  },
  holdCardBorder: {
    border: `1px solid ${theme.colors.red[700]}`
  }
}));

const useStylesBootstrap = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontWeight: 500,
    fontSize: '0.75rem'
  }
}));

const DataCard = ({
  title = '',
  value = '',
  subTitle = {},
  wrapperClass = '',
  improvement,
  isLoading,
  onClick,
  isHoldCard,
  tooltip = '',
  isErrorCard = 0
}) => {
  const classes = useStyles();
  const tooltipClasses = useStylesBootstrap();

  return (
    <Tooltip classes={tooltipClasses} title={tooltip}>
      <Box
        onClick={onClick || (() => {})}
        flex={1}
        mr={1.5}
        my={0.75}
        className={`${classes.root} ${wrapperClass} ${
          onClick ? classes.cursor : ''
        } ${
          isHoldCard && value !== 0 && value !== 'N/A'
            ? classes.holdCardBorder
            : ''
        }`}
      >
        <Box
          className={classes.titleContainer}
          py={0.5}
          pl={1.75}
          // pr={1.25}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <Typography className={classes.title}>{title}</Typography>
          </Box>
          <Box>
            {/* <CommonButton
						icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
						size="sm"
						variant="tertiary"
						wrapperClass={classes.btns}
					/> */}
          </Box>
        </Box>
        <Box pl={1.5} pr={1.25}>
          {isLoading ? (
            <Box py={2} display='flex' alignItems='center'>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box display='flex' alignItems='flex-end'>
                <Typography className={classes.value}>
                  {NumberFormater(value)}
                </Typography>
                {(improvement || improvement === 0) && (
                  <Typography
                    className={
                      (improvement || improvement === 0) && improvement >= 0
                        ? classes.positiveImprovement
                        : classes.negativeImprovement
                    }
                  >
                    {improvement >= 0
                      ? `${`+${improvement}%`}`
                      : `${`${improvement}%`}`}
                  </Typography>
                )}
                {isErrorCard > 0 && (
                  <Typography
                    className={classes.isErrorCard}
                  >{`${isErrorCard} wafers failed`}</Typography>
                )}
                {(improvement || improvement === 0) && (
                  <Typography
                    className={classes.versusText}
                  >{` vs Target: 90%`}</Typography>
                )}
              </Box>
              <Box pb={1.5} display='flex' alignItems='center'>
                {Object.keys(subTitle).map(x => (
                  <Box display='flex' alignItems='center' mr={6}>
                    <Typography
                      className={classes.subTitleKey}
                    >{`${x}: `}</Typography>
                    <Typography className={classes.subTitleValue}>
                      {subTitle[x]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default DataCard;
