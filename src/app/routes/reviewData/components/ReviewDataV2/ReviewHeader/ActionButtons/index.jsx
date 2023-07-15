import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import Show from 'app/hoc/Show';
import CommonButton from 'app/components/ReviewButton';
import ActionModal from './ActionModal';

import { goToPreviousRoute } from 'app/utils/navigation';

import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOut,
  faTag,
  faVectorSquare
} from '@fortawesome/pro-solid-svg-icons';

import { makeWaferInactive } from 'app/utils/waferbook';
import { convertToArray, decodeURL } from 'app/utils/helpers';

import classes from './ActionButtons.module.scss';

const ActionButtons = () => {
  const navigate = useNavigate();
  const { subscriptionId, annotationType, packId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseReview = async () => {
    if (annotationType === MANUAL_CLASSIFY || annotationType === AUDIT) {
      const allWafersId = convertToArray(
        decodeURL(queryString.parse(window.location.search).contextual_filters)
          .allWafersId
      ).map(d => parseInt(d, 10));

      try {
        await makeWaferInactive(allWafersId);
      } catch ({ response }) {
        toast('Something went wrong.');
        return;
      }
    }

    goToPreviousRoute(navigate, `/${subscriptionId}/${packId}/library/data`);
  };

  const handleToggleModal = () => setIsModalOpen(d => !d);

  const actionBtns = [
    {
      text: 'Submit For Auditing',
      icon: faTag,
      onClick: handleToggleModal,
      show: annotationType === AUDIT
    },
    {
      text: 'Update Klarf File',
      icon: faVectorSquare,
      onClick: handleToggleModal,
      show: annotationType === MANUAL_CLASSIFY,
      shortcutKey: ['command+u', 'ctrl+u']
    },
    {
      text: 'Exit',
      icon: faSignOut,
      onClick: handleCloseReview,
      variant: 'secondary'
    }
  ];

  return (
    <>
      <div className={classes.actionBtns}>
        {actionBtns.map(
          (
            {
              text,
              onClick,
              icon,
              show = true,
              variant = 'primary',
              shortcutKey = ''
            },
            i
          ) => (
            <Show when={show} key={i}>
              <CommonButton
                key={i}
                text={text}
                onClick={onClick}
                icon={<FontAwesomeIcon icon={icon} />}
                size='sm'
                variant={variant}
                shortcutKey={shortcutKey}
              />
            </Show>
          )
        )}
      </div>

      <Show when={isModalOpen}>
        <ActionModal
          isModalOpen={isModalOpen}
          handleToggleModal={handleToggleModal}
          annotationType={annotationType}
          subscriptionId={subscriptionId}
        />
      </Show>
    </>
  );
};

export default ActionButtons;
