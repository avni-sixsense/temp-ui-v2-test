import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import api from 'app/api';

import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import SideDrawerBody from 'app/components/SideDrawerBody';
import SideDrawerBodyForms from 'app/components/SideDrawerBody/SideDrawerBodyForms';
import SideDrawerDropZone from 'app/components/SideDrawerBody/SideDrawerDropZone';
import Show from 'app/hoc/Show';
import SSRadioGroup from 'app/components/SSRadioGroup';
import SSButton from 'app/components/SSButton';
import FolderUpload from '../FolderUpload';

import { selectIsFilterLoading } from 'store/filter/selector';

import classes from './UploadDataBody.module.scss';
import useApi from 'app/hooks/useApi';
import { getUseCases } from 'app/api/Usecase';

const UPLOAD_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/bmp',
  'image/tif',
  'image/tiff'
];

const FOLDER_UPLOAD_OPTIONS = [
  { value: false, label: 'Create Folder' },
  { value: true, label: 'Upload Folders' }
];

const ERROR_FOLDER_UPLOAD_OPTIONS = [
  { value: 'true', label: 'Auto-rename & Upload' },
  { value: 'false', label: 'Abort upload for these folders' }
];

const UploadDataBody = ({
  selectedSession,
  sessionUploadCount,
  setSessionUploadCount
}) => {
  const [isFoldersUpload, setIsFoldersUpload] = useState(false);
  const [isFilesUploading, setIsFilesUploading] = useState(false);
  const [allFolders, setAllFolders] = useState([]);
  const [currentUseCase, setCurrentUseCase] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState(
    selectedSession?.name ?? ''
  );
  const [isFoldersNameExists, setIsFoldersNameExists] = useState(true);
  const [isAutoRenameFolder, setIsAutoRenameFolder] = useState('true');
  const [retry, setRetry] = useState(true);
  const [isWrongFileTypeUpload, setIsWrongFileTypeUpload] = useState(false);

  const isFilterLoading = useSelector(selectIsFilterLoading);

  const { subscriptionId } = useParams();

  const { data: useCases, isLoading: isUsecaseLoading } = useApi(
    getUseCases,
    { subscription_id: subscriptionId, get_all_records: true, allowedKeys: [] },
    {
      enabled: !isFilterLoading
    }
  );

  useEffect(() => {
    if (selectedSession && useCases) {
      setCurrentUseCase(
        useCases.results.find(d => d.id === selectedSession.use_case)
      );
    }
  }, [useCases]);

  const handleUpload = folders => {
    if (folders.length) setAllFolders(folders);
    setIsFilesUploading(false);
  };

  const handleUseCaseSelect = useCase => {
    if (useCase) setCurrentUseCase(useCase);
  };

  const disabled = !!selectedSession || isFilesUploading || !!allFolders.length;

  return (
    <SideDrawerBody>
      <SideDrawerBodyForms
        fields={[
          {
            show: !selectedSession,
            id: 'folder-radio',
            type: 'radio',
            options: FOLDER_UPLOAD_OPTIONS,
            config: {
              value: isFoldersUpload,
              onChange: val => setIsFoldersUpload(val === 'true')
            },
            disabled,
            direction: 'column'
          },
          {
            show: !isFoldersUpload,
            id: 'folder-name',
            label: 'Folder Name',
            onChange: e => setCurrentFolderName(e.target.value),
            placeholder: 'Enter folder name',
            value: currentFolderName,
            disabled
          },
          {
            id: 'use-case',
            type: 'select',
            label: 'Use Case',
            selected: currentUseCase,
            models: useCases?.results ?? [],
            placeholder: 'Select use case',
            onChange: handleUseCaseSelect,
            disabled,
            isLoading: isUsecaseLoading
          }
        ]}
      />

      <SideDrawerDropZone
        show={!allFolders.length}
        acceptedFileTypes={UPLOAD_FILE_TYPES}
        isFoldersUpload={isFoldersUpload}
        onUploadStart={() => setIsFilesUploading(true)}
        onUploadEnd={handleUpload}
        disabled={
          !currentUseCase || (!isFoldersUpload && !currentFolderName.length)
        }
        spinnerProps={{ isLoading: isFilesUploading }}
        label={isFoldersUpload && 'Drag and drop folders here'}
      />

      <Show when={retry && !isFoldersNameExists}>
        <div>
          <div className={classes.error}>
            <div className={classes.errorInfo}>
              <WarningRoundedIcon className={classes.icon} />
              <span>
                One or more folder with same name already exists in the use
                case.
              </span>
            </div>

            <SSRadioGroup
              config={{
                value: isAutoRenameFolder,
                onChange: setIsAutoRenameFolder
              }}
              options={ERROR_FOLDER_UPLOAD_OPTIONS}
            />

            <SSButton className={classes.btn} onClick={() => setRetry(false)}>
              Apply
            </SSButton>
          </div>
        </div>
      </Show>

      <Show when={isWrongFileTypeUpload}>
        <div>
          <div className={classes.error}>
            <div className={classes.errorInfo}>
              <WarningRoundedIcon className={classes.icon} />
              <span>Only folders can be uploaded.</span>
            </div>
          </div>
        </div>
      </Show>

      <Show when={allFolders.length > 0}>
        <div className={classes.folderUploadContainer}>
          {allFolders.map((folder, idx) => {
            const folderName = isFoldersUpload
              ? folder.folderName
              : currentFolderName;

            return (
              <Show
                key={idx}
                when={folderName}
                sad={() => {
                  if (!isWrongFileTypeUpload) setIsWrongFileTypeUpload(true);
                }}
              >
                <FolderUpload
                  folderName={folderName}
                  files={folder.files}
                  useCase={currentUseCase}
                  selectedSession={selectedSession}
                  sessionUploadCount={sessionUploadCount}
                  setSessionUploadCount={setSessionUploadCount}
                  isFoldersNameExists={isFoldersNameExists}
                  setIsFoldersNameExists={setIsFoldersNameExists}
                  isAutoRenameFolder={isAutoRenameFolder}
                  retry={retry}
                  setRetry={setRetry}
                />
              </Show>
            );
          })}
        </div>
      </Show>
    </SideDrawerBody>
  );
};

export default UploadDataBody;
