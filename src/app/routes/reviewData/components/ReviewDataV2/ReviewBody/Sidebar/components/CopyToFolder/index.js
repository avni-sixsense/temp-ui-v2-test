import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
// import api from 'app/api'
// import DatasetContainer from 'app/components/Dataset'
import clsx from 'clsx';
import CommonButton from 'app/components/ReviewButton';
// import { encodeURL, getParamsObjFromEncodedString } from 'app/utils/helpers'
import React, { useState } from 'react';

// import { queryClient, useQuery } from 'react-query'
// import { useDispatch, useSelector } from 'react-redux'
// import { useLocation } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { removeFileSet, setSelectAll } from 'store/reviewData/actions'
import CopyDialog from './copyDialog';

const useStyles = makeStyles(theme => ({
  buttonBar: {
    backgroundColor: 'rgba(28, 42, 66, 0.7)',
    borderRadius: '4px',
    border: `0.2px solid ${theme.colors.grey[13]}`
  },
  button: {
    margin: '5px 10px 5px 10px'
  },
  buttonDisabled: {
    opacity: 0.48
  }
}));

const CopyToFolder = ({ disabledText }) => {
  const classes = useStyles();
  // const dispatch = useDispatch()
  // const location = useLocation()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDisabled = !!disabledText;
  // const { activeImg, data: fileSets, selectAll } = useSelector(({ review }) => review)

  // const { data: dataSet } = useQuery(['dataSetList'], api.getDataset)

  const handleBtnClick = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // const handleCreateDataset = (data) => {
  // 	const payload = {
  // 		name: data,
  // 		is_locked: 'false',
  // 		description: '',
  // 	}
  // 	return new Promise((resolve, reject) =>
  // 		api
  // 			.createDataset(payload)
  // 			.then((res) => {
  // 				queryClient.invalidateQueries('dataSetList')
  // 				toast('Created new Dataset successfully')
  // 				resolve(res.data)
  // 			})
  // 			.catch(({ response }) => {
  // 				if (response?.status === 400) {
  // 					toast('Dataset with the provided name already exists.')
  // 				} else {
  // 					toast('Something went wrong, please try again.')
  // 				}
  // 				reject()
  // 			})
  // 	)
  // }

  // const handleAddDataset = (data) => {
  // 	const parsedParams = getParamsObjFromEncodedString(location.search)

  // 	// const encodedString = btoa(`id__in=${activeImg.map((x) => fileSets[x].fileSetId).join(',')}`)
  // 	let encodedString = null
  // 	if (!selectAll) {
  // 		encodedString = btoa(`id__in=${activeImg.map((x) => fileSets[x].fileSetId).join(',')}`)
  // 	} else {
  // 		encodedString = encodeURL(parsedParams)
  // 	}
  // 	const payload = {
  // 		file_set_filters: encodedString,
  // 	}
  // 	api.addFilesetsToDataset(data.map((x) => x.id).join(','), payload)
  // 		.then(() => {
  // 			toast('Files Added to Dataset successfully')
  // 			dispatch(setSelectAll(false))
  // 		})
  // 		.catch(() => {
  // 			toast('Something went wrong.')
  // 		})
  // }

  // const handleRemoveDataSet = (data) => {
  // 	const parsedParams = getParamsObjFromEncodedString(location.search)
  // 	let encodedString = null
  // 	if (!selectAll) {
  // 		encodedString = btoa(`id__in=${activeImg.map((x) => fileSets[x].fileSetId).join(',')}`)
  // 	} else {
  // 		encodedString = encodeURL(parsedParams)
  // 	}

  // 	const payload = {
  // 		file_set_filters: encodedString,
  // 	}
  // 	api.deleteFileSetFromDataset(data.map((x) => x.id).join(','), payload)
  // 		.then(() => {
  // 			dispatch(removeFileSet(activeImg.map((item) => fileSets[item]?.id)))
  // 			queryClient.invalidateQueries('dataSetLib')
  // 			toast('Files removed from Dataset successfully')
  // 			dispatch(setSelectAll(false))
  // 		})
  // 		.catch(() => {
  // 			toast('Something went wrong.')
  // 		})
  // }

  return (
    <>
      <Box
        className={classes.buttonBar}
        display='flex'
        alignItems='center'
        flexWrap='wrap'
        py={0.5}
      >
        <CommonButton
          wrapperClass={clsx(classes.button, {
            [classes.buttonDisabled]: isDisabled
          })}
          onClick={handleBtnClick}
          text='Copy to folder'
          icon={<FontAwesomeIcon icon={faCopy} />}
          variant='secondary'
          size='xs'
          toolTip={isDisabled}
          toolTipMsg={disabledText}
          disabled={isDisabled}
        />
        {/* <DatasetContainer
					size="xs"
					text="Add to Datasets"
					data={dataSet?.results || []}
					lightTheme={false}
					creatableFunc={handleCreateDataset}
					disabled={!activeImg.length}
					onSubmit={handleAddDataset}
				/>
				<DatasetContainer
					size="xs"
					text="Remove from dataset"
					data={dataSet?.results || []}
					lightTheme={false}
					removeDialog
					creatableFunc={handleCreateDataset}
					disabled={!activeImg.length}
					onSubmit={handleRemoveDataSet}
				/> */}
      </Box>
      {isDialogOpen && <CopyDialog handleClose={handleClose} />}
    </>
  );
};

export default CopyToFolder;
