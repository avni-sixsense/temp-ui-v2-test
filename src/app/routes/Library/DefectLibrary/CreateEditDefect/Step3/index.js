import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonButton from 'app/components/CommonButton';
import DefectImg from 'assests/images/defect.png';
import React, { useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import CommonDataCard from './CommonDataCard';
import DefectForm from './DefectForm';

const useStyle = makeStyles(() => ({
  paperModal: {
    zIndex: 9999
  }
}));

const DefectLibStep3 = ({ uploadService }) => {
  const { defect } = uploadService.current;
  const classes = useStyle();
  const [addEntry, setAddEntry] = useState(false);
  const [selected, setSelected] = useState('');
  const [edit, setEdit] = useState(false);
  const [index, setIndex] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState([]);

  const queryClient = useQueryClient();

  const useCase = useSelector(({ common }) => common.useCase);

  const { data: defectData = {} } = useQuery(
    ['defect', defect],
    context => api.getDefect(...context.queryKey),
    { enabled: !!defect }
  );

  const inputFilesRef = useRef(null);

  function handleFilesUpload(e) {
    const { uppy1, uploadMetaFiles } = uploadService.current;
    uppy1.reset();
    const names = [];
    const files = Array.from(e.target.files);
    files.forEach(file => {
      uppy1.addFile({
        name: file.name,
        data: file
      });
      names.push({ name: file.name });
    });
    setFiles(files);
    uploadMetaFiles(names, setFileIds);
  }

  const handleSetEntry = () => {
    setAddEntry(true);
  };

  const handleSave = edit => {
    const { defect } = uploadService.current;

    const data = {
      use_case: selected.id
    };

    data.reference_file_ids = fileIds;
    data.defect = defect;

    if (edit) {
      api.updateUseCaseDefects(data, selected.id).then(() => {
        setAddEntry(false);
        setEdit(false);
        queryClient.invalidateQueries('defect');
      });
    } else {
      api.useCaseDefects(data).then(() => {
        setAddEntry(false);
        queryClient.invalidateQueries('defect');
      });
    }
  };

  const showFileDialogue = () => {
    inputFilesRef.current.click();
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(true);
    // setAddEntry(false)
  };

  const handleEdit = (data, index) => {
    setIndex(index);
    setEdit(true);
    setSelected(useCase.filter(item => item.id === data.use_case)?.[0]);
    setAddEntry(true);
  };

  const handleDelete = data => {
    api
      .deleteUseCase(data.id)
      .then(() => {
        queryClient.invalidateQueries('defect');
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const handleDiscard = () => {
    setSelected('');
    setFiles([]);
    setFileIds([]);
    setEdit(false);
    setOpen(false);
    setAddEntry(false);
  };

  const handleContinue = () => {
    setOpen(false);
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
          handleSave={handleSave}
          handleCancel={handleCancel}
          selected={selected}
          setSelected={setSelected}
          edit={edit}
          index={index}
          useCases={useCase}
          showFileDialogue={showFileDialogue}
          files={files}
        />
      )}
      <Box my={2}>
        {defectData?.use_case_defects?.map((data, index) => (
          <CommonDataCard
            defect={DefectImg}
            data={data}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            index={index}
            key={index}
          />
        ))}
      </Box>
      <input
        type='file'
        style={{ display: 'none' }}
        multiple
        ref={inputFilesRef}
        onChange={handleFilesUpload}
      />
      <Dialog open={open} onClose={handleClose} className={classes.paperModal}>
        <Paper className={classes.paper}>
          <Box px={7} py={10} textAlign='center'>
            <Box my={1}>
              <Typography variant='h1'>
                Are you sure you want to discard the changes?
              </Typography>
            </Box>
            {/* <Box my={1}>
							<Typography variant="h5">
								Contrary to popular belief, Lorem Ipsum is not simply random text.
							</Typography>
						</Box> */}
            <Box mt={5} justifyContent='center' display='flex'>
              <Box mx={1}>
                <CommonButton
                  text='Discard'
                  variant='tertiary'
                  onClick={handleDiscard}
                />
              </Box>
              <Box mx={1}>
                <CommonButton
                  text='Continue'
                  variant='primary'
                  onClick={handleContinue}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Dialog>
    </>
  );
};

export default DefectLibStep3;
