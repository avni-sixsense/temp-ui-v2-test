import { faBookmark as LightBookmark } from '@fortawesome/pro-light-svg-icons';
import { faBookmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import CommonButton from 'app/components//ReviewButton';
import React, { useEffect, useState } from 'react';
import { queryClient } from 'react-query';

// import CommentPopup from './Comment'

const useStyle = makeStyles(theme => ({
  actionButtons: {
    marginLeft: '0.750rem',
    '& svg': {
      color: '#FFFFFF'
    }
  },
  aiDefectBox: {
    borderRadius: '4px'
  },
  dashedBorder: {
    border: `1.5px dashed ${theme.colors.yellow[600]}`
  }
}));

const FilterBar = ({ fileSet = {}, subscriptionId }) => {
  const classes = useStyle();

  const handleBookMarkClick = () => {
    api
      .bookmarkFileSet(fileSet.id, {
        is_bookmarked: !fileSet.is_bookmarked,
        subscription: subscriptionId
      })
      .then(() => queryClient.invalidateQueries('fileSet'));
  };

  // const [otherDefectsList, setOtherDefectsList] = useState([])
  // const [selectedDefect, setSelectedDefect] = useState([])
  // const [aiDefectsList, setAiDefectsList] = useState([])
  // const [anchorEl, setAnchorEl] = useState(null)
  // console.log({ otherDefectsList, selectedDefect })

  // useEffect(() => {
  // 	setSelectedDefect(otherDefectsList.filter((x) => x.value))
  // }, [otherDefectsList])

  // useEffect(() => {
  // 	// if (otherDefectsList.length !== Object.keys(otherDefects || {}).length) {
  // 	const temp = []
  // 	Object.keys(otherDefects).forEach((defect) => {
  // 		temp.push({
  // 			name: defect,
  // 			...otherDefects[defect],
  // 		})
  // 	})
  // 	setOtherDefectsList(temp)
  // 	// }
  // }, [otherDefects])

  // useEffect(() => {
  // 	if (aiDefectsList.length !== Object.keys(aiDefects || {}).length) {
  // 		const temp = []
  // 		Object.keys(aiDefects).forEach((defect) => {
  // 			temp.push({
  // 				label: aiDefects[defect].name,
  // 				type: 'Ai Defect',
  // 				...aiDefects[defect],
  // 			})
  // 		})
  // 		setAiDefectsList(temp)
  // 	}
  // }, [aiDefects])

  // const handleCommentClick = (event) => {
  // 	if (!anchorEl) {
  // 		setAnchorEl(event.currentTarget)
  // 	} else {
  // 		setAnchorEl(null)
  // 	}
  // }

  // const tempTags = [
  // 	{
  // 		id: 1,
  // 		name: 'Tag 1',
  // 	},
  // 	{
  // 		id: 2,
  // 		name: 'Tag 2',
  // 	},
  // 	{
  // 		id: 3,
  // 		name: 'Tag 3',
  // 	},
  // ]

  return (
    <Box
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      pr={2}
      py={1}
    >
      <Box display='flex' alignItems='center'>
        {Object.keys(fileSet).length > 0 && (
          <CommonButton
            wrapperClass={classes.actionButtons}
            onClick={handleBookMarkClick}
            variant='secondary'
            size='l'
            icon={
              fileSet?.is_bookmarked ? (
                <FontAwesomeIcon icon={faBookmark} />
              ) : (
                <FontAwesomeIcon icon={LightBookmark} />
              )
            }
          />
        )}
        {/* <Box ml={1} width="75%">
					<InputChipSelect data={tempTags} onChange={() => {}} />
				</Box> */}
      </Box>
      {/* <Box width="80%" display="flex" alignItems="center" justifyContent="flex-end">
				{
					// useCase?.type === 'CLASSIFICATION_AND_DETECTION' ||
					useCase?.type === 'CLASSIFICATION' && activeImg.length === 1 && (
						<Box width="50%" display="flex" flexDirection="row-reverse">
							<Box ml={1} width={isAnnotation ? '50%' : 'auto'}>
								{isAnnotation ? (
									<InputChipSelect
										multiSelect={useCase?.classification_type === 'MULTI_LABEL'}
										value={userClassification}
										onChange={handleOtherDefectChange}
										data={otherDefects || []}
										disabled={!isAnnotation}
									/>
								) : (
									<Box p={0} display="flex" alignItems="center" justifyContent="flex-end">
										<RegionLabel
											allowedTags={[]}
											onOpen={() => {}}
											onChange={() => {}}
											onClose={() => {}}
											onDelete={() => {}}
											onCheck={() => {}}
											editing={false}
											region={{ tags: userClassification }}
											isAnnotation={false}
										/>
									</Box>
								)}
							</Box>
							<Box>
								{aiDefects.length > 0 && (
									<Box
										p={0}
										className={
											isAnnotation
												? `${classes.aiDefectBox} ${classes.dashedBorder}`
												: `${classes.aiDefectBox}`
										}
									>
										<RegionLabel
											allowedTags={[]}
											onOpen={() => {}}
											onChange={() => {}}
											onClose={() => {}}
											onDelete={() => {}}
											onCheck={handleCheckClick}
											editing={false}
											region={{ tags: aiDefects }}
											isAnnotation={isAnnotation}
											isAiRegion
										/>
									</Box>
								)}
							</Box>
						</Box>
					)
				}
			</Box> */}
      {/* <CommentPopup anchorEl={anchorEl} /> */}
    </Box>
  );
};

export default FilterBar;
