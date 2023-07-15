import { memo } from 'react';

import Show from 'app/hoc/Show';
import CommonButton from 'app/components/ReviewButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WithCondition from 'app/hoc/WithCondition';

const ImageActionButtonsContainer = ({ imageActionBtns }) => {
  return imageActionBtns.map(({ onClick, icon, show, Comp }, idx) => (
    <Show key={idx} when={show ?? true}>
      <WithCondition
        when={Comp}
        then={<Comp />}
        or={
          <CommonButton
            onClick={onClick}
            icon={<FontAwesomeIcon icon={icon} />}
            size='sm'
            variant='secondary'
          />
        }
      />
    </Show>
  ));
};

export default memo(ImageActionButtonsContainer);
