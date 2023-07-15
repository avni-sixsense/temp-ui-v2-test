import CanvasGridModeSwitch from './CanvasGridModeSwitch';
import Search from './Search';

import SelectedImageCount from './SelectedImageCount';
import SelectAll from './SelectAll';
import Sorting from './Sorting';
import FolderTags from './FolderTags';

import classes from './ReviewSettings.module.scss';

const ReviewSettings = () => {
  return (
    <div className={classes.reviewSettings}>
      <div>
        <CanvasGridModeSwitch />

        <Search />
      </div>

      <div>
        <SelectedImageCount />

        <SelectAll />

        <FolderTags />

        <Sorting />
      </div>
    </div>
  );
};

export default ReviewSettings;
