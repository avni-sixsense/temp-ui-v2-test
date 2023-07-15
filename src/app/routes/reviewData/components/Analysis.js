import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useState } from 'react';

const Analysis = ({ imageDefects, model, results }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  const TableHeader = () => (
    <Grid container>
      <Grid
        item
        xs={4}
        style={{
          backgroundColor: '#FFFFFF',
          borderRight: '0.5px solid #E3E3E3',
          borderBottom: '0.5px solid #E3E3E3',
          padding: '8px'
        }}
      />
      <Grid
        item
        xs={4}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#7E7E7E',
          borderRight: '0.5px solid #E3E3E3',
          borderBottom: '0.5px solid #E3E3E3',
          padding: '8px'
        }}
      >
        AI Predicted
      </Grid>
      <Grid
        item
        xs={4}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#7E7E7E',
          borderBottom: '0.5px solid #E3E3E3',
          padding: '8px'
        }}
      >
        Label
      </Grid>
    </Grid>
  );

  const TableData = () => (
    <Grid container>
      <Grid
        item
        xs={4}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#7E7E7E',
          borderRight: '0.5px solid #E3E3E3',
          padding: '8px'
        }}
      >
        Defect Tags
      </Grid>
      <Grid
        item
        xs={4}
        style={{
          backgroundColor: '#FFFFFF',
          wordBreak: 'break-all',
          borderRight: '0.5px solid #E3E3E3',
          padding: '8px'
        }}
      >
        {imageDefects.ai
          ? Array.isArray(imageDefects.ai)
            ? imageDefects.ai.join(', ')
            : imageDefects.ai
          : results.length > 0 &&
            (results[0].status === 'PENDING' ||
              results[0].status === 'PROCESSING')
          ? ''
          : results.length > 0 && results[0].status === 'FINISHED'
          ? 'No Defect'
          : ''}
      </Grid>
      <Grid
        item
        xs={4}
        style={{
          backgroundColor: '#FFFFFF',
          wordBreak: 'break-all',
          padding: '8px'
        }}
      >
        {Array.isArray(imageDefects.gt)
          ? imageDefects.gt.join(', ')
          : imageDefects.gt}
      </Grid>
    </Grid>
  );

  return model ? (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        margin: '16px 16px',
        padding: '16px'
      }}
    >
      <Card
        style={{
          border: '0.5px solid #E3E3E3',
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12)'
        }}
      >
        <Box
          display='flex'
          alignItems='center'
          style={{
            backgroundColor: '#F1FAFE',
            color: '#02435D',
            padding: '8px',
            borderBottom: '1px solid rgba(0,0,0,.125)'
          }}
          onClick={toggle}
        >
          {isOpen ? <ExpandMoreIcon /> : <NavigateNextIcon />}
          <span style={{ margin: '0 8px' }}>Image #1</span>
        </Box>
        <Collapse in={isOpen}>
          <CardContent style={{ padding: 0, margin: 0 }}>
            <TableHeader />
            <TableData />
          </CardContent>
        </Collapse>
      </Card>
    </div>
  ) : null;
};

export default Analysis;
