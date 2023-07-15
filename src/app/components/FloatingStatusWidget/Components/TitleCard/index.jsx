import Show from 'app/hoc/Show';

import {
  faClose,
  faCompressAlt,
  faExpandArrows,
  faSpinner
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './TitleCard.module.scss';

export const TitleCard = ({
  foldersLength,
  expanded = false,
  handleToggle,
  allowClose,
  onClose
}) => {
  return (
    <div className={classes.titleCard}>
      <Show when={!allowClose}>
        <FontAwesomeIcon icon={faSpinner} className={classes.rotate} />
      </Show>

      <div className={classes.titleText}>
        <span>
          {foldersLength
            ? `Uploading ${foldersLength} folders`
            : 'Upload Complete'}
        </span>
      </div>

      <div className={classes.titleActions}>
        <div onClick={() => handleToggle()}>
          {expanded ? (
            <FontAwesomeIcon icon={faCompressAlt} fontSize={14} />
          ) : (
            <FontAwesomeIcon icon={faExpandArrows} fontSize={14} />
          )}
        </div>

        <Show when={allowClose}>
          <FontAwesomeIcon icon={faClose} onClick={onClose} fontSize={18} />
        </Show>
      </div>
    </div>
  );
};
