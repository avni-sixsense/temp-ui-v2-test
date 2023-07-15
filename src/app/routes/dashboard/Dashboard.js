import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import SyncIcon from '@material-ui/icons/Sync';
import api from 'app/api';
import CommonButton from 'app/components/CommonButton';
import Filters from 'app/components/Filters';
import React, { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Route, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import AIPerformance from './AIPerformance';
import AIResults from './AIResults';
import OverKillDrawer from './components/Drawer';

const useStyles = makeStyles(() => ({
  button1: {
    width: 170,
    height: 49
  },
  button2: {
    width: 158,
    height: 49
  }
}));

const typeData = [
  { id: 1, name: 'Training', value: 'TRAIN' },
  { id: 2, name: 'Testing', value: 'TEST,VALIDATION' }
];

const Dashboard = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const aiResultScreen = pathname.includes('ai-results');
  const { subscriptionId } = useParams();
  const paramsString = useSelector(({ filters }) => filters.paramsString);
  const [downloading, setDownloading] = useState(false);
  const [downloadingLeadCsv, setDownloadingLeadCsv] = useState(false);

  const queryClient = useQueryClient();

  const { data: summary = {} } = useQuery(
    ['dashboardPerformaceSummary', subscriptionId, paramsString, false],
    context => api.dashboardPerformaceSummary(...context.queryKey),
    {
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  );
  const [open, setOpen] = React.useState(false);
  const [selectedDefects, setSelectedDefects] = useState([
    { name: 'Non Visible Defects', value: 'Non Visible Defects' }
  ]);

  const { data: defects = [] } = useQuery(
    ['defects', subscriptionId],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const { data: overKillSelected } = useQuery(
    ['subscription', subscriptionId],
    context => api.getSubscription(...context.queryKey.slice(1)),
    { enabled: !!subscriptionId }
  );

  useEffect(() => {
    if (defects?.results) {
      const defectList = defects?.results.filter(defect =>
        overKillSelected?.overkill_defect_config.includes(defect.id)
      );
      setSelectedDefects([
        { name: 'Non Visible Defects', value: 'Non Visible Defects' },
        ...defectList
      ]);
    }
  }, [overKillSelected, defects]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadClick = model => {
    if (model) {
      setDownloading(true);
      api.aiResultsCsv(paramsString, subscriptionId).then(_ => {
        const filename =
          _.headers['content-disposition'].split('file_name=')[1];
        const a = window.document.createElement('a');
        a.href = `data:text/csv;charset=utf-8,${encodeURI(_.data)}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setDownloading(false);
      });
    }
  };

  const handleLeadCsvDownloadClick = model => {
    if (model) {
      setDownloadingLeadCsv(true);
      api
        .leadLevelCsv(paramsString, subscriptionId)
        .then(_ => {
          if (_.data.pre_signed_url) {
            const a = window.document.createElement('a');
            a.href = _.data.pre_signed_url;
            a.download = 'leadLevel.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            toast.error(
              `There's no data available in the selected filters to generate the csv`
            );
          }
        })
        .finally(() => {
          setDownloadingLeadCsv(false);
        });
    }
  };

  const modelKey = 'ml_model_id__in';

  const handleSelectedDefects = selected => {
    api
      .updateOverkillDefect(subscriptionId, {
        overkill_defect_config: selected
          .filter(x => x.name !== 'Non Visible Defects')
          .map(x => x.id)
      })
      .then(res => {
        const defectList = defects?.results.filter(defect =>
          res?.data.overkill_defect_config.includes(defect.id)
        );
        setSelectedDefects([
          { name: 'Non Visible Defects', value: 'Non Visible Defects' },
          ...defectList
        ]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleRefreshClick = () => {
    queryClient.invalidateQueries('dashboardPerformaceSummary');
    if (aiResultScreen) {
      queryClient.invalidateQueries('appilcationCharts');
      queryClient.invalidateQueries('trendChart');
      queryClient.invalidateQueries('getImage');
    } else {
      queryClient.invalidateQueries('preformanceSummary');
      queryClient.invalidateQueries('report');
      queryClient.invalidateQueries('modelDefects');
      queryClient.invalidateQueries('confusionMatrix');
      queryClient.invalidateQueries('classWiseMatrix');
    }
  };

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between'>
        <Filters
          folderFilter
          dateFilter
          modelFilter={!aiResultScreen}
          typeFilter={!aiResultScreen}
          modelKey={modelKey}
          autoModelFilter={aiResultScreen}
          typeData={typeData}
        />
        {aiResultScreen ? (
          <Box my={4} display='flex' alignItems='center'>
            <Box mr={1}>
              <CommonButton
                text={
                  downloading ? (
                    <CircularProgress size={15} />
                  ) : (
                    'Download lot level defect stats'
                  )
                }
                disabled={downloading}
                onClick={handleDownloadClick}
                wrapperClass={classes.button1}
              />
            </Box>
            <Box>
              <CommonButton
                text={
                  downloadingLeadCsv ? (
                    <CircularProgress size={15} />
                  ) : (
                    'Download lead level CSV'
                  )
                }
                disabled={downloadingLeadCsv}
                onClick={handleLeadCsvDownloadClick}
                wrapperClass={classes.button2}
              />
            </Box>
            <Box
              ml={1}
              className='ss_pointer'
              onClick={() => {
                setOpen(true);
              }}
            >
              <SettingsIcon />
            </Box>
            <Box ml={1} className='ss_pointer' onClick={handleRefreshClick}>
              <SyncIcon />
            </Box>
          </Box>
        ) : (
          <Box my={4} display='flex' alignItems='center'>
            <Box ml={1} className='ss_pointer' onClick={handleRefreshClick}>
              <SyncIcon />
            </Box>
          </Box>
        )}
      </Box>
      <Route
        path={`/dashboard/${subscriptionId}/ai-performance`}
        render={() => (
          <AIPerformance summary={summary} subscriptionId={subscriptionId} />
        )}
      />
      <Route
        path={`/dashboard/${subscriptionId}/ai-results`}
        render={() => (
          <AIResults
            summary={summary}
            subscriptionId={subscriptionId}
            modelKey={modelKey}
            selectedDefects={selectedDefects}
          />
        )}
      />
      {open && (
        <OverKillDrawer
          selectedDefects={selectedDefects}
          setSelectedDefects={handleSelectedDefects}
          handleClose={handleClose}
        />
      )}
    </Box>
  );
};

export default Dashboard;
