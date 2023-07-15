import { faAngleDown, faAngleRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Label from 'app/components/Label';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  collapseIcon: {
    color: theme.colors.grey[10],
    padding: 0,
    fontSize: '1rem'
  },
  root: {
    borderTop: `1px solid ${theme.colors.grey[15]}`,
    borderBottom: `1px solid ${theme.colors.grey[15]}`
  },
  collapsedMenu: {
    padding: theme.spacing(0, 2, 2, 2)
  }
}));

const CollapseBar = ({ title, children, nonCollapseComp = false }) => {
  const classes = useStyles();
  const [isCollapse, setIsCollapse] = useState(false);

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <Box className={classes.root}>
      <Box
        p={2}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        onClick={title && handleCollapse}
        style={title && { cursor: 'pointer' }}
      >
        <Show when={title && !nonCollapseComp}>
          <Label label={title} variant='secondary' size='xSmall' uppercase />

          <IconButton className={classes.collapseIcon} onClick={handleCollapse}>
            <WithCondition
              when={isCollapse}
              then={<FontAwesomeIcon icon={faAngleRight} />}
              or={<FontAwesomeIcon icon={faAngleDown} />}
            />
          </IconButton>
        </Show>

        <Show when={title && nonCollapseComp}>
          <Label label={title} variant='secondary' size='xSmall' uppercase />
        </Show>
      </Box>

      <Show when={!isCollapse || nonCollapseComp}>
        <Box className={classes.collapsedMenu}>{children}</Box>
      </Show>
    </Box>
  );
};

export default CollapseBar;
