import { faFilter, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import CommonButton from 'app/components/ReviewButton';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const FilterActions = ({
  handleClearFilters,
  handleApplyFilters,
  lightTheme
}) => {
  const location = useLocation();
  const [showClearButton, setShowClearButton] = useState(false);

  useEffect(() => {
    const parsedParams = queryString.parse(location.search);
    if ((parsedParams?.other_filters || '').length) {
      setShowClearButton(true);
    } else {
      setShowClearButton(false);
    }
  }, [location.search]);

  return (
    <>
      {showClearButton && (
        <Box pl={2} display='flex' alignItems='center'>
          <CommonButton
            text='Clear Filters'
            onClick={handleClearFilters}
            size='sm'
            variant={lightTheme ? 'tertiary' : 'secondary'}
            icon={<FontAwesomeIcon icon={faTimes} />}
          />
        </Box>
      )}
      <Box pl={2} display='flex' alignItems='center'>
        <CommonButton
          text='Apply Filters'
          onClick={handleApplyFilters}
          size='sm'
          variant={lightTheme ? 'primary' : 'secondary'}
          icon={<FontAwesomeIcon icon={faFilter} />}
        />
      </Box>
    </>
  );
};

export default FilterActions;
