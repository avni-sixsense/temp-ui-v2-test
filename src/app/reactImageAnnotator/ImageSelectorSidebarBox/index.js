// @flow

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SidebarBoxContainer from '../SidebarBoxContainer';
import CollectionsIcon from '@material-ui/icons/Collections';
import { grey } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
  img: { width: 40, height: 40, borderRadius: 8 }
});

export default ({ images, onSelect }) => {
  const classes = useStyles();
  return (
    <SidebarBoxContainer
      title='Images'
      subTitle={`(${images.length})`}
      icon={<CollectionsIcon style={{ color: grey[700] }} />}
    >
      <div>
        <List>
          {images.map((img, i) => (
            <ListItem button onClick={() => onSelect(img)} dense key={i}>
              <img className={classes.img} src={img.src} />
              <ListItemText
                primary={img.name}
                secondary={`${(img.regions || []).length} Labels`}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </SidebarBoxContainer>
  );
};
