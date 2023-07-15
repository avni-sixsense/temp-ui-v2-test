// @flow

// import { Chip } from '@material-ui/core'
import {
  faCheck,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faPlus,
  faTrashAlt
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
// import IconButton from '@material-ui/core/IconButton'
// import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import InputChipSelect from 'app/components/InputChipSelect';
import Show from 'app/hoc/Show/index.jsx';
// import TextField from '@material-ui/core/TextField'
// import Typography from '@material-ui/core/Typography'
// import ClearIcon from '@material-ui/icons/Clear'
// import DeleteIcon from '@material-ui/icons/Delete'
// import DoneIcon from '@material-ui/icons/Done'
// import HistoryIcon from '@material-ui/icons/History'
// import SortIcon from '@material-ui/icons/Sort'
// import Autocomplete from '@material-ui/lab/Autocomplete'
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';

// import CustomizedCheckbox from '../Checkbox'
import type { Region } from '../../reactImageAnnotator/ImageCanvas/region-tools.js';
import CommonButton from '../ReviewButton';
import ReviewTags from '../ReviewTags';
import styles from './styles';

const useStyles = makeStyles(styles);

type Props = {
  region: Region,
  editing?: boolean,
  allowedClasses?: Array<string>,
  allowedTags?: Array<string>,
  cls?: string,
  tags?: Array<string>,
  onDelete: Region => null,
  onChange: Region => null,
  onClose: Region => null,
  onOpen: Region => null,
  onCheck: Region => null,
  allowZoomIn: boolean
};

const RegionLabel = ({
  region,
  editing,
  allowedClasses = ['Laptop', 'Mouse', 'Compuda'],
  allowedTags = ['Dog', 'Cat', 'Woof', 'Electronic Device'],
  onDelete,
  onChange,
  onClose,
  onOpen,
  onCheck,
  isEditingLocked = false,
  zoomToRegion,
  zoomOut,
  allAiDefects = false,
  // isAnnotation = true,
  isAiRegion = false,
  isDetectionTags = false,
  allowZoomIn = false,
  maxLabelWidth = '100%',
  toggleZoom = false,
  isNoDefect
}: Props) => {
  const classes = useStyles();
  const [value, setValue] = useState([]);
  const [tags, setTags] = useState([]);
  const [zoomIn, setZoomIn] = useState(true);

  useEffect(() => {
    if (toggleZoom) {
      setZoomIn(true);
    }
  }, [toggleZoom]);

  useEffect(() => {
    if (
      region.tags &&
      region.tags.length &&
      tags.length !== region.tags.length + allowedTags.length
    ) {
      const t = region.tags.map(c => c.id);
      const temp = allowedTags.filter(c => !t.includes(c.id));
      setTags([...temp, ...region.tags.filter(item => !item.is_ai_tag)]);
      const r = [...region.tags.filter(item => !item.is_ai_tag)];
      setValue(r);
    } else if (allowedTags.length) {
      setTags([...allowedTags]);
    }
  }, [region.tags, allowedTags]);

  const handleApplyClick = data => {
    const { tags: regionTags } = region;
    const aiTags = regionTags?.filter(tag => tag.is_ai_tag) ?? [];
    onChange({
      ...region,
      tags: [...aiTags, ...(data || [])]
    });
    setValue(data);
    onClose(region);
  };

  const deleteDefectTag = defectValue => {
    handleApplyClick(value.filter(x => x.id !== defectValue));
  };

  return (
    <Box
      className={classnames(classes.regionInfo, {
        highlighted: region.highlighted
      })}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Show when={editing && !isAiRegion}>
          <InputChipSelect
            data={tags || []}
            onChange={handleApplyClick}
            value={value}
            multiSelect
            shouldFocus={!value.length}
          />
        </Show>
        <Show when={region.cls}>
          <div className='name'>
            <div className='circle' style={{ backgroundColor: region.color }} />
            {region.cls}
          </div>
        </Show>

        <Box display='grid' gridAutoFlow='column' gridGap={5}>
          {!editing &&
            (region?.tags ?? []).map((t, index) => {
              return (
                <ReviewTags
                  key={index}
                  label={t.name}
                  removable={!(isAiRegion || t.is_ai_tag)}
                  onClick={() => deleteDefectTag(t.id)}
                  size='small'
                  variant={isAiRegion || t.is_ai_tag ? 'amber' : 'blue'}
                  sublabel={t.confidence ?? ''}
                  maxWidth={maxLabelWidth}
                  isNoDefect={isNoDefect}
                />
              );
            })}

          <Show when={!isAiRegion && !editing && !isNoDefect}>
            <CommonButton
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={allAiDefects ? () => {} : () => onOpen(region)}
              variant={isAiRegion || isDetectionTags ? 'custom' : 'primary'}
              customBackground={isDetectionTags ? region.color : '#D97706'}
              size='xs'
              disabled={isAiRegion}
              wrapperClass={classes.iconButtons}
            />
          </Show>

          <Show when={allowZoomIn && !isNoDefect}>
            <CommonButton
              icon={
                <FontAwesomeIcon
                  icon={zoomIn ? faMagnifyingGlassPlus : faMagnifyingGlassMinus}
                />
              }
              onClick={() => {
                if (zoomIn) {
                  zoomToRegion(region);
                } else {
                  zoomOut();
                }

                setZoomIn(d => !d);
              }}
              variant={isAiRegion || isDetectionTags ? 'custom' : 'primary'}
              customBackground={isDetectionTags ? region.color : '#D97706'}
              size='xs'
              wrapperClass={classes.iconButtons}
            />
          </Show>

          <Show when={!isAiRegion && !isNoDefect}>
            <CommonButton
              icon={<FontAwesomeIcon icon={faTrashAlt} />}
              onClick={allAiDefects ? () => {} : () => onDelete(region)}
              variant={isAiRegion || isDetectionTags ? 'custom' : 'primary'}
              customBackground={isDetectionTags ? region.color : '#D97706'}
              size='xs'
              disabled={isAiRegion}
              wrapperClass={classes.iconButtons}
            />
          </Show>

          <Show when={isAiRegion}>
            <CommonButton
              icon={<FontAwesomeIcon icon={faCheck} />}
              onClick={() => onCheck(region)}
              variant={isAiRegion || isDetectionTags ? 'custom' : 'primary'}
              customBackground={isDetectionTags ? region.color : '#D97706'}
              size='xs'
              wrapperClass={classes.iconButtons}
              shortcutKey='k'
            />
          </Show>
        </Box>
      </div>
    </Box>
  );
};

export default RegionLabel;
