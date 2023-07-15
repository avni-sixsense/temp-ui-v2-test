import {
  faCheck,
  faExclamationTriangle,
  faPen,
  faTimesCircle
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import TruncateText from 'app/components/TruncateText';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDefectById } from 'store/defectLibrary/selectors';
import classes from './HotkeyItem.module.scss';

const mapDefectToState = id =>
  createStructuredSelector({
    defect: selectDefectById(id)
  });

const HotkeyItem = ({ defectId }) => {
  const { defect } = useSelector(mapDefectToState(defectId));
  const [newShortcutKey, setNewShortcutKey] = useState(defect.hot_key || '');
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const handleUpdateKey = () => {
    setIsUpdatingKey(true);
  };

  const handleKeyChange = e => {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Backspace') {
      setNewShortcutKey('');
      return;
    }

    const avoidableKeys = ['Shift', 'Alt', 'Meta', 'Control'];
    const shortcutKey = [];
    if (e.ctrlKey || e.metaKey) {
      shortcutKey.push('ctrl');
    }
    if (e.shiftKey) shortcutKey.push('shift');

    if (e.altKey) shortcutKey.push('alt');

    if (e.key.includes('Arrow')) shortcutKey.push(e.key.split('Arrow')[1]);

    if (e.key && !avoidableKeys.includes(e.key)) shortcutKey.push(e.key);

    setNewShortcutKey(shortcutKey.join('+'));
  };

  const handleConfirmShortcut = () => {
    api
      .updateDefect({ hot_key: newShortcutKey || null }, defectId)
      .then(({ data }) => {
        // update the hotkey here in the redux
        dispatch({
          type: 'UPDATE_DEFECT_LIB_DATA_BY_ID',
          payload: { id: data.id, data }
        });
        setIsUpdatingKey(false);
        setIsError(false);
      })
      .catch(response => {
        console.log({ response });
        setIsError(true);
      });
  };

  const handleCancelShortcut = () => {
    setIsUpdatingKey(false);
    setNewShortcutKey(defect.hot_key || '');
  };

  const handleClearShortcut = () => {
    api
      .updateDefect({ hot_key: null }, defectId)
      .then(({ data }) => {
        // update the hotkey here in the redux
        dispatch({
          type: 'UPDATE_DEFECT_LIB_DATA_BY_ID',
          payload: { id: data.id, data }
        });
        setNewShortcutKey('');
        setIsError(false);
      })
      .catch(({ response }) => {
        console.log({ response });
        setIsError(true);
      });
  };

  const getShortCutLabel = shortcutKey => {
    const isMac = navigator.platform === 'MacIntel';
    if (shortcutKey && isMac && shortcutKey.toLowerCase().includes('ctrl'))
      return shortcutKey.replaceAll('command', '⌘');
    return shortcutKey;
  };

  return (
    <div className={classes.container}>
      <div className={classes.defectContainer}>
        <TruncateText
          key={isUpdatingKey}
          classNames={{ root: classes.label }}
          label={defect.name}
        />

        <WithCondition
          when={!defect.hot_key || isUpdatingKey}
          then={
            <WithCondition
              when={!isUpdatingKey}
              then={
                <CommonButton
                  text='Assign Hotkey'
                  variant='tertiary'
                  onClick={handleUpdateKey}
                />
              }
              or={
                <div className={classes.actionBtn}>
                  <input
                    value={getShortCutLabel(newShortcutKey)}
                    onKeyDown={handleKeyChange}
                    placeholder='Press keys combination'
                  />

                  <CommonButton
                    icon={<FontAwesomeIcon icon={faCheck} />}
                    variant='tertiary'
                    wrapperClass={classes.icon}
                    size='xs'
                    onClick={handleConfirmShortcut}
                  />

                  <CommonButton
                    icon={<FontAwesomeIcon icon={faTimesCircle} />}
                    variant='tertiary'
                    wrapperClass={classes.icon}
                    size='xs'
                    onClick={handleCancelShortcut}
                  />
                </div>
              }
            />
          }
          or={
            <div className={classes.actionBtn}>
              <Typography>{getShortCutLabel(defect.hot_key)}</Typography>

              <CommonButton
                icon={<FontAwesomeIcon icon={faPen} />}
                variant='tertiary'
                wrapperClass={classes.icon}
                size='xs'
                onClick={handleUpdateKey}
              />

              <CommonButton
                icon={<FontAwesomeIcon icon={faTimesCircle} />}
                variant='tertiary'
                wrapperClass={classes.icon}
                size='xs'
                onClick={handleClearShortcut}
              />
            </div>
          }
        />
      </div>

      <Show when={isError}>
        <div className={classes.errorContainer}>
          <FontAwesomeIcon icon={faExclamationTriangle} />

          <Typography>
            Assign unique hotkey, {getShortCutLabel(newShortcutKey)} is assigned
            to another defect.
          </Typography>
        </div>
      </Show>
    </div>
  );
};

export default HotkeyItem;
