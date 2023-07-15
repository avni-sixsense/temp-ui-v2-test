import { useState, useEffect } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import clsx from 'clsx';

import { convertToArray, decodeURL, encodeURL } from 'app/utils/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/pro-solid-svg-icons';

import {
  setContainerMeta,
  setAppliedForAllModelId,
  setImageModes
} from 'store/reviewData/actions';

import CommonButton from 'app/components/ReviewButton';
import ShowCurrentCount from '../ShowCurrentCount';

import classes from './NavigateWaferBook.module.scss';

const NavigateWaferBook = ({ text, className }) => {
  const location = useLocation();
  const { annotationType } = useParams();
  const [, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const [currentWaferIndex, setCurrentWaferIndex] = useState(0);
  const [allWafersId, setAllWafersId] = useState([]);

  useEffect(() => {
    const allCurrentWafersId = convertToArray(
      decodeURL(queryString.parse(window.location.search).contextual_filters)
        .allWafersId
    );

    setAllWafersId(allCurrentWafersId);
  }, []);

  useEffect(() => {
    if (allWafersId.length > 0) {
      const currentWaferId = decodeURL(
        queryString.parse(location.search).contextual_filters
      ).wafer_id__in[0];

      setCurrentWaferIndex(
        allWafersId.findIndex(d => Number(d) === currentWaferId)
      );
    }
  }, [location.search, allWafersId]);

  const handleIconClick = delta => {
    const params = queryString.parse(location.search);

    const contextual_filters = decodeURL(params.contextual_filters);

    contextual_filters.wafer_id__in = allWafersId[currentWaferIndex + delta];

    const newParams = queryString.stringify({
      ...params,
      contextual_filters: encodeURL(contextual_filters)
    });

    dispatch(setAppliedForAllModelId(null));
    dispatch(setContainerMeta(null));
    dispatch(setImageModes(annotationType));

    setSearchParams(newParams);
  };

  return (
    <div className={classes.waferInfoContainer}>
      <span className={clsx(className, classes.navigateWaferBook)}>
        <CommonButton
          onClick={() => handleIconClick(-1)}
          icon={<FontAwesomeIcon icon={faAngleLeft} />}
          disabled={currentWaferIndex === 0}
          size='sm'
          variant='secondary'
          wrapperClass={classes.icon}
          shortcutKey={['command+shift+left', 'ctrl+shift+left']}
        />

        <span>{text}</span>

        <span className={classes.values}>
          {currentWaferIndex + 1} / {allWafersId.length}
        </span>

        <span>Wafer</span>

        <CommonButton
          icon={<FontAwesomeIcon icon={faAngleRight} />}
          disabled={currentWaferIndex + 1 === allWafersId.length}
          onClick={() => handleIconClick(1)}
          size='sm'
          variant='secondary'
          wrapperClass={classes.icon}
          shortcutKey={['command+shift+right', 'ctrl+shift+right']}
        />
      </span>

      <span className={clsx(className, classes.navigateWaferBook)}>
        <ShowCurrentCount className={classes.values} />
        <span>Images</span>
      </span>
    </div>
  );
};

export default NavigateWaferBook;
