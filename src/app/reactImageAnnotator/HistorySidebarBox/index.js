// @flow

import React, { setState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SidebarBoxContainer from '../SidebarBoxContainer';
import HistoryIcon from '@material-ui/icons/History';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import UndoIcon from '@material-ui/icons/Undo';
import moment from 'moment';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles({
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: grey[500],
    textAlign: 'center',
    padding: 20
  }
});

export default ({
  history,
  onRestoreHistory
}: {
  history: Array<{ name: string, time: Date }>
}) => {
  const classes = useStyles();

  return (
    <SidebarBoxContainer
      title='History'
      icon={<HistoryIcon style={{ color: grey[700] }} />}
      expandedByDefault
    >
      <List>
        {history.length === 0 && (
          <div className={classes.emptyText}>No History Yet</div>
        )}
        {history.map(({ name, time }, i) => (
          <ListItem button dense key={i}>
            <ListItemText
              primary={name}
              secondary={moment(time).format('LT')}
            />
            {i === 0 && (
              <ListItemSecondaryAction onClick={onRestoreHistory}>
                <IconButton>
                  <UndoIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    </SidebarBoxContainer>
  );
};
