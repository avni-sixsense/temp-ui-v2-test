import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import {
  faExclamationTriangle,
  faTimes
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';

import api from 'app/api';

import InputChipSelect from 'app/components/InputChipSelect';
import Label from 'app/components/Label';
import CommonButton from 'app/components/ReviewButton';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import CustomizedRadio from 'app/components/ReviewRadio';
import AiModelSelector from '../AiAssistance/AiModelSelector/ModelSelector';
import Show from 'app/hoc/Show';

import { getDateFromParams } from 'app/utils/helpers';

import { setSelectAll, setTaskId } from 'store/reviewData/actions';
import useApi from 'app/hooks/useApi';
import { getUseCases } from 'app/api/Usecase';
import { converObjArraytoString } from 'app/utils/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[17],
    width: 322,
    borderRadius: '4px'
  },
  headerContainer: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`,
    '& p': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.colors.grey[0]
    },
    '& svg': {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: theme.colors.grey[8],
      cursor: 'pointer'
    }
  },
  title: {
    marginBottom: theme.spacing(0.75)
  },
  radioBtn: {
    marginRight: theme.spacing(3)
  },
  warning: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 600
  }
}));

const CopyDialog = ({ handleClose }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { subscriptionId } = useParams();
  const location = useLocation();

  const {
    activeImg,
    data: fileSets,
    selectAll,
    searchText
  } = useSelector(({ review }) => review);

  const [showUsecase, setShowUsecase] = useState(false);
  const [selectedUsecase, setSelectedUsecase] = useState({});
  const [selectedFolder, setSelectedFolders] = useState({});
  const [isRadioChecked, setIsRadioChecked] = useState('skip_image');
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useState('');
  const [isCopyGT, setIsCopyGT] = useState(true);

  const hasUserClickedCopyGtCheckbox = useRef(false);

  const queryClient = useQueryClient();

  const currentFolderUseCaseId = fileSets[activeImg[0]].use_case;

  const { data: foldersData, isLoading: isFolderLoading } = useQuery(
    ['copyFoldersList', 10, null, null, subscriptionId, true, searchParams],
    context => api.getUploadSessionsFilters(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const { data: foldersDataCount, isLoading: isFolderCountLoading } = useQuery(
    ['copyFoldersCount', 10, 0, null, subscriptionId, false, searchParams],
    context => api.getUploadSessionsFilters(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const { data: useCases, isLoading: isUseCaseLoading } = useApi(
    getUseCases,
    {
      subscription_id: subscriptionId,
      get_all_records: true,
      allowedKeys: []
    },
    { enabled: !!showUsecase }
  );

  const handleCreateFolder = name => {
    setSelectedFolders({ name, isNew: true });
    setShowUsecase(true);

    if (isCopyGT) setIsCopyGT(false);

    return new Promise(resolve => {
      resolve({ name, isNew: true });
    });
  };

  const handleIsCopyGt = useCaseId => {
    if (!hasUserClickedCopyGtCheckbox.current) {
      if (useCaseId === currentFolderUseCaseId) {
        setIsCopyGT(true);
      } else if (isCopyGT) {
        setIsCopyGT(false);
      }
    }
  };

  const handleFolderChange = value => {
    setSelectedFolders(value);

    handleIsCopyGt(value.use_case);

    if (!value?.isNew) {
      setShowUsecase(false);
      setSelectedUsecase({});
    }
  };

  const handleUsecaseChange = value => {
    setSelectedUsecase(value);
    handleIsCopyGt(value.id);
  };

  const handleSubmit = () => {
    if (showUsecase) {
      api
        .getSessionId({
          name: selectedFolder?.name,
          subscription: subscriptionId,
          use_case: selectedUsecase.id
        })
        .then(res => {
          const parsedParams = converObjArraytoString(
            getDateFromParams(window.location.search, undefined, true)
          );
          delete parsedParams.packId;
          const tempObj = { should_copy_gt: isCopyGT };
          const uploadSessionId = String(res?.data?.id);
          tempObj.file_set_filters = parsedParams;

          tempObj.upload_session_id = uploadSessionId;
          tempObj.skip_existing_images = isRadioChecked !== 'keep_both';

          if (!selectAll) {
            tempObj.file_set_filters.id__in = activeImg
              .map(x => fileSets[x]?.fileSetId)
              .join(',');
          } else {
            if (searchText) {
              tempObj.file_set_filters['files__name__icontains'] = searchText;
            }
          }

          api
            .copyFilesToFolder(tempObj)
            .then(res => {
              dispatch(setTaskId(res?.task_id));
              handleClose();
              dispatch(setSelectAll(false));
              toast(res.message);
            })
            .catch(() => {
              handleClose();
              toast.error('Somthing went wrong.');
            });
          queryClient.invalidateQueries('copyFoldersList');
        })
        .catch(() => {
          // handleClose()
          toast.error('Folder with same name already exists.');
        });
    } else {
      const parsedParams = converObjArraytoString(
        getDateFromParams(window.location.search, undefined, true)
      );
      delete parsedParams.packId;
      const tempObj = { should_copy_gt: isCopyGT };
      const uploadSessionId = String(selectedFolder?.id);

      tempObj.file_set_filters = parsedParams;
      tempObj.upload_session_id = uploadSessionId;
      tempObj.skip_existing_images = isRadioChecked !== 'keep_both';

      if (!selectAll) {
        tempObj.file_set_filters.id__in = activeImg
          .map(x => fileSets[x]?.fileSetId)
          .join(',');
      } else {
        if (searchText) {
          tempObj.file_set_filters['files__name__icontains'] = searchText;
        }
      }

      api
        .copyFilesToFolder(tempObj)
        .then(res => {
          dispatch(setTaskId(res?.task_id));
          handleClose();
          dispatch(setSelectAll(false));
          toast(res.message);
        })
        .catch(() => {
          handleClose();
          toast.error('Somthing went wrong.');
        });
    }
  };

  const handleRadioChanges = value => {
    setIsRadioChecked(value);
  };

  const debounceSearch = () => {
    setSearchParams(search);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedQuery = useCallback(debounce(debounceSearch, 500), [search]);

  useEffect(() => {
    delayedQuery();

    return delayedQuery.cancel;
  }, [search]);

  const handleSearch = value => {
    setSearch(value);

    if (!value) {
      setSearchParams('');
      queryClient.invalidateQueries('copyFoldersList');
      queryClient.invalidateQueries('copyFoldersCount');
    }
  };

  const useCaseId = showUsecase ? selectedUsecase.id : selectedFolder.use_case;

  const isCopyGtDisabled = selectedFolder.use_case
    ? useCaseId !== currentFolderUseCaseId
    : false;

  const handleCopyGtChange = e => {
    hasUserClickedCopyGtCheckbox.current = true;
    setIsCopyGT(e.target.checked);
  };

  return (
    <Dialog open>
      <Box py={2} px={1.25} className={classes.root}>
        <Box
          pb={1.25}
          mb={2.5}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          className={classes.headerContainer}
        >
          <Label label='Copy images to Folder for Training' size='medium' />
          <FontAwesomeIcon icon={faTimes} onClick={handleClose} />
        </Box>

        <Box mb={1.75}>
          <Label
            label='Enter Folder Name'
            fontWeight={600}
            className={classes.title}
          />

          <AiModelSelector
            multiSelect={false}
            data={foldersData?.results || []}
            value={Object.keys(selectedFolder).length ? [selectedFolder] : []}
            placeholder='Folder Name'
            creatable
            onChange={handleFolderChange}
            creatableFunc={handleCreateFolder}
            itemcount={foldersDataCount?.count || 0}
            nextUrl={foldersData?.next}
            search={search}
            handleSearch={handleSearch}
            isinitialDataLoading={isFolderLoading || isFolderCountLoading}
          />
        </Box>

        {showUsecase && (
          <Box mb={1.75}>
            <Label label='Enter Use case Name' fontWeight={600} />
            {isUseCaseLoading ? (
              <CircularProgress />
            ) : (
              <InputChipSelect
                limitTags={4}
                multiSelect={false}
                data={useCases?.results || []}
                value={
                  Object.keys(selectedUsecase).length ? [selectedUsecase] : []
                }
                placeholder='Usecase Name'
                onChange={handleUsecaseChange}
              />
            )}
          </Box>
        )}

        <Box mb={0.75}>
          <Label
            label='If an image with same name already exists in the folder?'
            variant='secondary'
          />
        </Box>

        <Box mb={1.25} display='flex' alignItems='center'>
          <CustomizedRadio
            label='Skip image'
            checked={isRadioChecked === 'skip_image'}
            onChange={() => handleRadioChanges('skip_image')}
            wrapperClass={classes.radioBtn}
          />

          <CustomizedRadio
            label='Keep Both'
            checked={isRadioChecked === 'keep_both'}
            onChange={() => handleRadioChanges('keep_both')}
            wrapperClass={classes.radioBtn}
          />
        </Box>

        <Box mt={2} mb={2} display='flex' alignItems='center'>
          <CustomizedCheckbox
            checked={isCopyGT}
            onChange={handleCopyGtChange}
            label='Copy Defect Label'
            disabled={isCopyGtDisabled}
          />
        </Box>

        <Show when={isCopyGtDisabled}>
          <Box
            mt={-1}
            mb={2}
            display='flex'
            alignItems='flex-start'
            bgcolor='#090F17'
            borderRadius={5}
            p={1}
            border='1px solid #D97706'
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              color='#D97706'
              style={{ marginTop: 5, marginRight: 8 }}
            />

            <Typography className={classes.warning}>
              Defect labels can't be copied if the selected folder belongs to a
              different use case.
            </Typography>
          </Box>
        </Show>

        <Box display='flex'>
          <CommonButton
            text='Confirm'
            disabled={
              !Object.keys(selectedFolder).length ||
              (showUsecase && !Object.keys(selectedUsecase).length)
            }
            onClick={handleSubmit}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default CopyDialog;
