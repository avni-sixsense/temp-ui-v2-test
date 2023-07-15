import { memo } from 'react';

import Show from 'app/hoc/Show';

import Tooltip from '@material-ui/core/Tooltip';

import classes from './CardTags.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/pro-solid-svg-icons';

const CardTags = ({ tags }) => {
  return (
    <Show when={tags.length}>
      <div className={classes.container}>
        <Tooltip title={tags}>
          <FontAwesomeIcon icon={faTags} />
        </Tooltip>
      </div>
    </Show>
  );
};

export default memo(CardTags);
