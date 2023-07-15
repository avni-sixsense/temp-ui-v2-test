import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import api from 'app/api';
import Label from 'app/components/Label';
import { NumberFormater } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectActiveFileSet } from 'store/reviewData/selector';

// const waferDetails = {
// 	Total: 100,
// 	Auto: 50,
// 	Manual: 50,
// 	'Manual Reclass Pending': 10,
// }

const mapReviewState = createStructuredSelector({
  fileSet: selectActiveFileSet
});

const WaferSummary = () => {
  const { fileSet } = useSelector(mapReviewState);
  const [wafer, setWafer] = useState({
    Total: 'N/A',
    Auto: 'N/A',
    Manual: 'N/A'
    // 'Manual Reclass Pending': 'N/A',
  });

  const { data: waferSummary, isLoading } = useQuery(
    ['waferSummary', fileSet?.wafer],
    context => api.getWaferSummary(...context.queryKey),
    { enabled: !!fileSet?.wafer }
  );

  useEffect(() => {
    if (waferSummary?.[0]) {
      const { total, manual, auto_classified } = waferSummary[0];
      setWafer({
        Total: NumberFormater(total),
        Auto: NumberFormater(auto_classified),
        Manual: NumberFormater(manual)
        // 'Manual Reclass Pending': auto_classified - audited,
      });
    } else {
      setWafer({
        Total: 'N/A',
        Auto: 'N/A',
        Manual: 'N/A'
        // 'Manual Reclass Pending': 'N/A',
      });
    }
  }, [waferSummary]);

  return (
    <Box display='flex' alignItems='flex-start' justifyContent='space-between'>
      {isLoading ? (
        <CircularProgress />
      ) : (
        Object.keys(wafer).map((key, index) => (
          <Box
            key={index}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'
          >
            <Box mb={0.5}>
              <Label label={key} variant='secondary' />
            </Box>
            <Box>
              <Label label={wafer[key]} fontWeight={600} />
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default WaferSummary;
