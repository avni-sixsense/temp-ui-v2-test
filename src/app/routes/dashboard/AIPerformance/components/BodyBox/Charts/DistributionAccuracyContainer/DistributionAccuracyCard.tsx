import { Box, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';
import classes from './DistributionAccuracyContainer.module.scss';
import { isSameObject } from 'app/utils/helpers';

interface DropDownData {
  label: string;
  value: string;
  comp: React.ReactNode;
}

export const DistributionAccuracyCard = ({
  header,
  data,
  defaultActive
}: {
  header: string;
  data: DropDownData[];
  defaultActive?: DropDownData;
}) => {
  const [dropDownValue, setDropDownValue] = useState<DropDownData>(
    defaultActive || data[0]
  );

  const handledropDownClick = (data: DropDownData) => {
    setDropDownValue(data);
  };

  useEffect(() => {
    if (defaultActive || data?.[0]) {
      setDropDownValue(defaultActive || data[0]);
    }
  }, [defaultActive, data]);

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <Box
          className={classes.header}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pl={2.5}
          py={1}
          pr={1.25}
        >
          <Box display='flex' alignItems='center'>
            <Typography className={classes.dataTableHeader}>
              {header}
            </Typography>
            <Dropdown
              data={data}
              active={dropDownValue}
              onChange={handledropDownClick}
            />
          </Box>
        </Box>
        <Box width='100%' display='flex'>
          {dropDownValue.comp}
        </Box>
      </Paper>
    </Box>
  );
};
