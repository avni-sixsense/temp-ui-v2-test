import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import BubbleChart from 'app/components/charts/bubbleChart';
import LineChart from 'app/components/charts/line-chart';
import PieChart from 'app/components/charts/pie-chart';
import StackBar from 'app/components/charts/stack-bar';
import CommonButton from 'app/components/ReviewButton';
import EmptyBoxIcon from 'assests/images/emptyBox.svg';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ChartCard from './components/chartCard';
import DataCard from './components/dataCard';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalChart: {
    width: '50%'
  },
  emptyBoxTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  emptyBoxSubTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  }
}));

const AIResultsBody = ({ columns, handleWidgetClick }) => {
  const classes = useStyles();

  const initialData = {
    data: {
      1: {
        id: 1,
        content: 'Yield Loss',
        value: '42%'
      },
      2: {
        id: 2,
        content: 'Yield Loss',
        value: '43%'
      },
      3: {
        id: 3,
        content: 'Yield Loss',
        value: '44%'
      },
      4: {
        id: 4,
        content: 'Yield Loss',
        value: '45%'
      },
      5: {
        id: 5,
        content: 'Bar Chart',
        isChart: true,
        chartComp: <StackBar />
      },
      6: {
        id: 6,
        content: 'Line Chart',
        isChart: true,
        chartComp: <LineChart />
      },
      7: {
        id: 7,
        content: 'Bubble Chart',
        isChart: true,
        chartComp: <BubbleChart />
      },
      8: {
        id: 8,
        content: 'Pie Chart',
        isChart: true,
        chartComp: <PieChart />
      }
    },
    columns: {},
    columnOrder: []
  };

  const [draggableData, setDraggableData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDataId, setModalDataId] = useState(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalDataId(null);
    }, 500);
  };

  const handleModalOpen = id => {
    setModalDataId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (columns === 2) {
      const col1 = { id: 'col1', dataIds: [] };
      const col2 = { id: 'col2', dataIds: [] };
      Object.keys(draggableData.data).map((key, index) => {
        if ((index + 1) % 2 === 0) {
          col2.dataIds.push(draggableData.data[key].id);
        } else {
          col1.dataIds.push(draggableData.data[key].id);
        }
      });
      setDraggableData({
        ...draggableData,
        columns: { col1, col2 },
        columnOrder: ['col1', 'col2']
      });
    } else if (columns === 3) {
      const col1 = { id: 'col1', dataIds: [] };
      const col2 = { id: 'col2', dataIds: [] };
      const col3 = { id: 'col3', dataIds: [] };
      Object.keys(draggableData.data).map((key, index) => {
        if ((index + 1) % 3 === 0) {
          col3.dataIds.push(draggableData.data[key].id);
        } else if ((index + 1) % 3 === 2) {
          col2.dataIds.push(draggableData.data[key].id);
        } else if ((index + 1) % 3 === 1) {
          col1.dataIds.push(draggableData.data[key].id);
        }
      });
      setDraggableData({
        ...draggableData,
        columns: { col1, col2, col3 },
        columnOrder: ['col1', 'col2', 'col3']
      });
    } else if (columns === 4) {
      const col1 = { id: 'col1', dataIds: [] };
      const col2 = { id: 'col2', dataIds: [] };
      const col3 = { id: 'col3', dataIds: [] };
      const col4 = { id: 'col4', dataIds: [] };
      Object.keys(draggableData.data).map((key, index) => {
        if ((index + 1) % 4 === 0) {
          col4.dataIds.push(draggableData.data[key].id);
        } else if ((index + 1) % 4 === 3) {
          col3.dataIds.push(draggableData.data[key].id);
        } else if ((index + 1) % 4 === 2) {
          col2.dataIds.push(draggableData.data[key].id);
        } else if ((index + 1) % 4 === 1) {
          col1.dataIds.push(draggableData.data[key].id);
        }
      });
      setDraggableData({
        ...draggableData,
        columns: { col1, col2, col3, col4 },
        columnOrder: ['col1', 'col2', 'col3', 'col4']
      });
    }
  }, [columns]);

  const handleDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = draggableData.columns[source.droppableId];
    const finish = draggableData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.dataIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, parseInt(draggableId, 10));

      const newColumn = {
        ...start,
        dataIds: newTaskIds
      };
      setDraggableData({
        ...draggableData,
        columns: {
          ...draggableData.columns,
          [newColumn.id]: newColumn
        }
      });
    } else {
      const startTaskIds = Array.from(start.dataIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        dataIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.dataIds);
      finishTaskIds.splice(destination.index, 0, parseInt(draggableId, 10));
      const newFinish = {
        ...finish,
        dataIds: finishTaskIds
      };

      setDraggableData({
        ...draggableData,
        columns: {
          ...draggableData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      });
    }
  };

  return (
    <>
      {Object.keys(draggableData.data).length ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box display='flex' alignItems='flex-start' flexWrap='wrap'>
            {Object.keys(draggableData.columns).map((key, index) => (
              <Droppable key={index} droppableId={key}>
                {provided => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    px={1.5}
                    mb={2.5}
                    width={
                      columns === 4
                        ? '25%'
                        : columns === 3
                        ? '33%'
                        : columns === 2
                        ? '50%'
                        : '100%'
                    }
                  >
                    {draggableData.columns[key].dataIds.map(
                      (dataKey, index) => (
                        <Box key={dataKey} mb={2.5}>
                          {draggableData.data[dataKey].isChart ? (
                            <ChartCard
                              title={draggableData.data[dataKey].content}
                              subTitle='Which lots have high yield loss?'
                              index={index}
                              id={draggableData.data[dataKey].id}
                              handleModalOpen={handleModalOpen}
                              isModalOpen={isModalOpen}
                              chartComp={draggableData.data[dataKey].chartComp}
                            />
                          ) : (
                            <DataCard
                              title={draggableData.data[dataKey].content}
                              value={draggableData.data[dataKey].value}
                              subTitle='Lorem Ipsum'
                              index={index}
                              id={draggableData.data[dataKey].id}
                            />
                          )}
                        </Box>
                      )
                    )}
                    {provided.placeholder}
                  </Box>
                  // </div>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
        >
          <Box maxWidth='270px' mt={16.375}>
            <img src={EmptyBoxIcon} alt='EmptyBox' />
            <Box mt={1.5}>
              <Typography className={classes.emptyBoxTitle}>
                Empty Dashboard
              </Typography>
            </Box>
            <Box mt={0.5}>
              <Typography className={classes.emptyBoxSubTitle}>
                No widget is added to this dashboard. Please add a widget to
                populate the dashboard.
              </Typography>
            </Box>
            <Box
              mt={1.5}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <CommonButton
                text='Add Widget'
                icon={<FontAwesomeIcon icon={faPlus} />}
                size='sm'
                onClick={handleWidgetClick}
              />
            </Box>
          </Box>
        </Box>
      )}
      <Modal
        open={isModalOpen}
        className={classes.modal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={isModalOpen}>
          <ChartCard
            title={draggableData.data[modalDataId]?.content}
            subTitle='Which lots have high yield loss?'
            id={modalDataId}
            handleModalOpen={handleModalOpen}
            wrapperClass={classes.modalChart}
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            chartComp={draggableData.data[modalDataId]?.chartComp}
          />
        </Fade>
      </Modal>
    </>
  );
};

export default AIResultsBody;
