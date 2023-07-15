import { CircularProgress, TextField } from '@material-ui/core';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import WithCondition from 'app/hoc/WithCondition';
import React, { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import { selectActiveFileSet } from 'store/reviewData/selector';

import classes from './NoteContainer.module.scss';

const mapReviewState = createStructuredSelector({
  fileSet: selectActiveFileSet
});

const NoteContainer = () => {
  const { fileSet } = useSelector(mapReviewState);
  const [inputValue, setInputValue] = useState('');
  const [disabled, setDisabled] = useState(true);

  const { data: comment, isLoading } = useQuery(
    ['textComment', fileSet.file_set],
    context => api.getComment(...context.queryKey),
    { enabled: !!fileSet.file_set }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    setDisabled(true);
  }, [fileSet]);

  useEffect(() => {
    if (comment?.results) {
      const text = comment?.results[0]?.comments[0]?.text || '';
      setInputValue(text);
    }
  }, [comment]);

  useEffect(() => {
    setDisabled(inputValue === (comment?.results[0]?.comments[0]?.text ?? ''));
  }, [inputValue, comment]);

  const handleChange = e => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if ((comment?.results || []).length === 0) {
      api
        .createComment({
          file_set: fileSet.file_set,
          comments: [{ text: inputValue }]
        })
        .then(() => {
          queryClient.invalidateQueries('textComment');
          toast('Added new note successfully');
        })
        .catch(() => {
          toast('Something went wrong, please try again.');
        });
    } else if (inputValue.length === 0) {
      api
        .deleteComment(comment?.results[0]?.comments[0]?.id)
        .then(() => {
          queryClient.invalidateQueries('textComment');
          toast('Deleted note successfully');
        })
        .catch(() => {
          toast('Something went wrong, please try again.');
        });
    } else {
      api
        .updateComment(comment.results[0].id, {
          text: inputValue,
          thread: comment.results[0].id
        })
        .then(() => {
          queryClient.invalidateQueries('textComment');
          toast('Updated note successfully');
        })
        .catch(() => {
          toast('Something went wrong, please try again.');
        });
    }
  };

  return (
    <div className={classes.root}>
      <WithCondition
        when={isLoading}
        then={<CircularProgress size={94} />}
        or={
          <TextField
            multiline
            rows={4}
            fullWidth
            value={inputValue}
            onChange={handleChange}
            variant='outlined'
            className={classes.textArea}
            placeholder='Add note regarding this image…'
            onKeyDown={e => e.stopPropagation()}
          />
        }
      />

      <CommonButton
        wrapperClass={classes.saveBtn}
        text='Save'
        onClick={handleSubmit}
        disabled={disabled}
      />
    </div>
  );
};

export default NoteContainer;
