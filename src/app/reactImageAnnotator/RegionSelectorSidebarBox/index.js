// @flow

import React, { Fragment, useState } from 'react';
import SidebarBoxContainer from '../SidebarBoxContainer';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import RegionIcon from '@material-ui/icons/PictureInPicture';
import Grid from '@material-ui/core/Grid';
import ReorderIcon from '@material-ui/icons/SwapVert';
import PieChartIcon from '@material-ui/icons/PieChart';
import TrashIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import VisibleIcon from '@material-ui/icons/Visibility';
import VisibleOffIcon from '@material-ui/icons/VisibilityOff';
import styles from './styles';
import classnames from 'classnames';

const useStyles = makeStyles(styles);

const Chip = ({ color, text }) => {
  const classes = useStyles();
  return (
    <span className={classes.chip}>
      <div className='color' style={{ backgroundColor: color }} />
      <div className='text'>{text}</div>
    </span>
  );
};

const Row = ({
  header,
  highlighted,
  order,
  classification,
  area,
  tags,
  trash,
  lock,
  visible,
  onClick
}) => {
  const classes = useStyles();
  const [mouseOver, changeMouseOver] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className={classnames(classes.row, { header, highlighted })}
    >
      <Grid container alignItems='center'>
        <Grid item xs={2}>
          <div style={{ textAlign: 'right', paddingRight: 10 }}>{order}</div>
        </Grid>
        <Grid item xs={5}>
          {classification}
        </Grid>
        <Grid item xs={2}>
          <div style={{ textAlign: 'right', paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
      </Grid>
    </div>
  );
};

export default ({
  regions,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion
}) => {
  const classes = useStyles();
  return (
    <SidebarBoxContainer
      title='Regions'
      subTitle=''
      icon={<RegionIcon style={{ color: grey[700] }} />}
      expandedByDefault
    >
      <div className={classes.container}>
        <Row
          header
          highlighted={false}
          order={<ReorderIcon className='icon' />}
          classification={<div style={{ paddingLeft: 10 }}>Class</div>}
          area={<PieChartIcon className='icon' />}
          trash={<TrashIcon className='icon' />}
          lock={<LockIcon className='icon' />}
          visible={<VisibleIcon className='icon' />}
        />
        <div
          style={{
            borderTop: `1px solid ${grey[200]}`,
            marginTop: 2,
            marginBottom: 2
          }}
        />
        {regions.map((r, i) => (
          <Row
            header={false}
            highlighted={r.highlighted}
            onClick={() => onSelectRegion(r)}
            key={r.id}
            order={`#${i + 1}`}
            classification={
              <Chip text={r.cls || ''} color={r.color || '#ddd'} />
            }
            area=''
            trash={
              <TrashIcon onClick={() => onDeleteRegion(r)} className='icon2' />
            }
            lock={
              r.locked ? (
                <LockIcon
                  onClick={() => onChangeRegion({ ...r, locked: false })}
                  className='icon2'
                />
              ) : (
                <UnlockIcon
                  onClick={() => onChangeRegion({ ...r, locked: true })}
                  className='icon2'
                />
              )
            }
            visible={
              r.visible || r.visible === undefined ? (
                <VisibleIcon
                  onClick={() => onChangeRegion({ ...r, visible: false })}
                  className='icon2'
                />
              ) : (
                <VisibleOffIcon
                  onClick={() => onChangeRegion({ ...r, visible: true })}
                  className='icon2'
                />
              )
            }
          />
        ))}
      </div>
    </SidebarBoxContainer>
  );
};
