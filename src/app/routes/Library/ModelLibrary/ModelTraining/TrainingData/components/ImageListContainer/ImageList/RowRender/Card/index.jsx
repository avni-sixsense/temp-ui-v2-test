import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Show from 'app/hoc/Show';

import Image from '../Image';
import CardCheckbox from './CardCheckbox';
import CardLabels from './CardLabels';
import CardTags from './CardTags';

import { handleCardClick } from 'app/utils/modelTraining';

import {
  selectFileSetByIndex,
  selectIsSelectedByIndex
} from 'store/modelTraining/selector';

import classes from './Card.module.scss';

const mapFileSetState = index =>
  createStructuredSelector({
    fileSet: selectFileSetByIndex(index),
    isSelected: selectIsSelectedByIndex(index)
  });

const Card = ({ style, index }) => {
  const { fileSet, isSelected } = useSelector(mapFileSetState(index));

  if (!fileSet) return null;

  return (
    <div
      className={clsx(classes.cardContainer, {
        [classes.selected]: isSelected
      })}
      style={style}
      onClick={e => handleCardClick(e, index, isSelected)}
      id={`thumbnail-card-${index}`}
    >
      <div className={classes.card}>
        <Image
          id={`thumbnail-img-${index}`}
          src={fileSet.src}
          alt={fileSet.name}
        />

        <CardCheckbox isSelected={isSelected} index={index} />

        <div className={classes.cardInfo}>
          <div className={classes.innerContainer}>
            <div className={classes.index}>{index + 1}</div>
            <CardLabels fileSetId={fileSet.id} />
          </div>

          <div>
            <Show when={fileSet.tags}>
              <CardTags tags={fileSet.tags?.map(d => d.name).join(', ')} />
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
