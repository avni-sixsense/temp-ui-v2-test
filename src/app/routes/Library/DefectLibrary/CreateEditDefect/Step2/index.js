import Box from '@material-ui/core/Box';
import api from 'app/api';
import CommonButton from 'app/components/CommonButton';
import CommonDialog from 'app/components/CommonDialog';
import useForm from 'app/hooks/useForm';
import { validateFiles } from 'app/utils/helpers';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import CommonDataCard from './CommonDataCard';
import DefectForm from './DefectForm';

const DefectLibStep2 = ({
  uploadService,
  dispatchGlobal,
  addEntry,
  setAddEntry,
  setLoading,
  loading,
  setStep2Dirty,
  step2Dirty
}) => {
  const { defect } = uploadService.current;
  const [selected, setSelected] = useState({});
  const [edit, setEdit] = useState(false);
  const [index, setIndex] = useState(null);
  const [filesChanged, setFilesChanged] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);

  const metaInfo = useSelector(({ dataLibrary }) => dataLibrary.tableStructure);

  const queryClient = useQueryClient();

  const {
    state: formState,
    dispatch,
    isFormValid
  } = useForm(metaInfo.filter(item => item.associated_with_defects));

  const { data: useCaseMetaInfo = [] } = useQuery(
    ['getUseCaseMetaInfo', defect],
    context => api.getUseCaseMetaInfo(...context.queryKey),
    { enabled: !!defect }
  );

  useEffect(() => {
    if (formState.isDirty || filesChanged) {
      setStep2Dirty(true);
    }
  }, [formState, filesChanged, setStep2Dirty]);

  const onChange = e => {
    dispatch({
      type: 'form',
      field: e.target.name,
      value: e.target.value
    });
  };

  const inputFilesRef = useRef(null);

  function handleFilesUpload(e) {
    const { uppy1, uploadMetaFiles, reset } = uploadService.current;
    reset();
    const { validFiles } = validateFiles(Array.from(e.target.files));
    if (!validFiles.length) {
      return;
    }
    validFiles.forEach(file => {
      uppy1.addFile({
        name: `${file.name}-${Date.now()}`,
        data: file,
        preview: URL.createObjectURL(file)
      });
    });
    setFilesChanged(true);
    uploadMetaFiles();
  }

  const handleSetEntry = () => {
    setAddEntry(true);
    setLoading(false);
    setSaveClicked(false);
    metaInfo.forEach(field => {
      if (field.associated_with_defects) {
        dispatch({
          type: 'init',
          field: field.field,
          value: ''
        });
      }
    });
  };

  const handleSave = () => {
    const { defect, uppy1 } = uploadService.current;

    if (edit && (formState.isDirty || filesChanged || step2Dirty)) {
      const data = {};

      if (formState.isDirty) {
        metaInfo.forEach(field => {
          if (!data.meta_info) {
            data.meta_info = {};
          }
          if (field.associated_with_defects) {
            data.meta_info[field.field] = formState[field.field];
          }
        });
      }
      if (filesChanged || step2Dirty) {
        const files = uppy1.getFiles();
        const ids = files.map(file => file.meta.fileSetId);
        data.reference_file_ids = ids;
      }
      api.updateUseCaseMetaInfo(data, selected.id).then(() => {
        setAddEntry(false);
        setEdit(false);
        setSelected({});
        setIndex('');
        setStep2Dirty(false);
        uppy1.reset();
        uploadService.current.step2Ids = [];
        queryClient.invalidateQueries('getUseCaseMetaInfo');
      });
    } else if (formState.isDirty || filesChanged || step2Dirty) {
      const data = {};
      metaInfo.forEach(field => {
        if (!data.meta_info) {
          data.meta_info = {};
        }
        if (field.associated_with_defects) {
          data.meta_info[field.field] = formState[field.field];
        }
      });
      const files = uppy1.getFiles();
      const ids = files.map(file => file.meta.fileSetId);
      data.reference_file_ids = ids;
      api.useCaseMetaInfo(defect, data).then(() => {
        setAddEntry(false);
        queryClient.invalidateQueries('getUseCaseMetaInfo');
        dispatch({ type: 'reset' });
        setStep2Dirty(false);
        uppy1.reset();
        uploadService.current.step2Ids = [];
      });
    }
    queryClient.invalidateQueries('defects');
    setSaveClicked(false);
    setLoading(false);
  };

  const showFileDialogue = () => {
    const valid = isFormValid();
    if (valid) {
      inputFilesRef.current.click();
    }
  };

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    if (formState.isDirty || step2Dirty) {
      setOpen(true);
    } else {
      setSelected('');
      setEdit(false);
      setOpen(false);
      setAddEntry(false);
      setIndex('');
      setLoading(false);
      uploadService.current.step2Ids = [];
    }
    // setAddEntry(false)
  };

  const handleSaveClick = () => {
    if (loading) {
      uploadService.current.handleSave = handleSave;
      uploadService.current.saveClicked = true;
      setSaveClicked(true);
    } else {
      handleSave();
    }
  };

  const handleEdit = (data, index) => {
    metaInfo.forEach(field => {
      if (field.associated_with_defects) {
        dispatch({
          type: 'init',
          field: field.field,
          value: data.meta_info[field.field]
        });
      }
    });
    const { uppy1 } = uploadService.current;
    data.reference_files.forEach(file => {
      uppy1.addFile({
        name: `${file.id}-${file.name}`,
        data: file,
        preview: file.url,
        source: 'remote',
        isRemote: true,
        meta: {
          fileSetId: file.id
        }
      });
    });
    uppy1.getFiles().forEach(file => {
      uppy1.setFileState(file.id, {
        progress: {
          uploadComplete: true,
          uploadStarted: Date.now(),
          precentage: 100,
          bytesTotal: 1000,
          bytesUploaded: 1000
        }
      });
    });
    setIndex(index);
    setFilesChanged(false);
    setEdit(true);
    setAddEntry(true);
    setSelected(data);
  };

  const handleDelete = data => {
    api
      .deleteUseCaseMetaInfo(data.id)
      .then(() => {
        queryClient.invalidateQueries('getUseCaseMetaInfo');
        queryClient.invalidateQueries('defects');
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const handleDiscard = () => {
    setOpen(false);
  };

  const handleContinue = () => {
    const { uppy1, reset } = uploadService.current;
    uppy1.reset();
    reset();
    setSelected('');
    setEdit(false);
    setOpen(false);
    setAddEntry(false);
    setIndex('');
    setLoading(false);
  };

  const handleFileDelete = () => {
    setStep2Dirty(true);
  };

  return (
    <>
      <Box>
        <CommonButton
          text='Add New Entry'
          disabled={addEntry}
          onClick={handleSetEntry}
        />
      </Box>
      {addEntry && (
        <DefectForm
          onChange={onChange}
          state={formState}
          handleSave={handleSaveClick}
          handleCancel={handleCancel}
          selected={selected}
          setSelected={setSelected}
          edit={edit}
          errors={formState.errors}
          showFileDialogue={showFileDialogue}
          filesChanged={filesChanged}
          loading={loading}
          saveClicked={saveClicked}
          uploadService={uploadService}
          step2Dirty={step2Dirty}
          handleFileDelete={handleFileDelete}
        />
      )}
      <Box my={2}>
        {useCaseMetaInfo.map((data, i) =>
          i === index ? (
            ''
          ) : (
            <CommonDataCard
              data={data}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              index={i}
              key={i}
            />
          )
        )}
      </Box>
      <input
        type='file'
        style={{ display: 'none' }}
        multiple
        ref={inputFilesRef}
        onChange={handleFilesUpload}
      />
      <CommonDialog
        message='Are you sure you want to discard the changes?'
        open={open}
        actions={[
          {
            text: 'Discard',
            callback: handleContinue,
            variant: 'tertiary'
          },
          {
            text: 'Continue',
            callback: handleDiscard
          }
        ]}
      />
    </>
  );
};

export default DefectLibStep2;
