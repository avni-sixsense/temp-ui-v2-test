import { useRef } from 'react';

import { Dialog } from '@material-ui/core';

import CommonButton from 'app/components/ReviewButton';

import { SimilarityThresholdInput } from './SimilarityThresholdInput';
import { SimilarityThresholdInfo } from './SimilarityThresholdInfo';
import { DeployModelDialogUseCase } from './DeployModelDialogUseCase';

import classes from './DeployModelDialog.module.scss';

export const DeployModelDialog = ({ model, onDeploy, onCancel }) => {
  const similarityThresholdValueRef = useRef('');
  const infoRef = useRef(null);
  const defaultValue = Number(model.confidence_threshold) * 100
  
  return (
    <Dialog open classes={{ paper: classes.dialogPaper }}>
      <header className={classes.header}>Deploy Model</header>

      <main className={classes.main}>
        <div className={classes.details}>
          <div>
            Model: <span>{model.name}</span>
          </div>

          <div>
            Use case:
            <span>
              <DeployModelDialogUseCase id={model.use_case} />
            </span>
          </div>
        </div>

        <div>
          <div className={classes.similarityThreshold}>
            Similarity Threshold:
            <SimilarityThresholdInput
              defaultValue={defaultValue}
              styles={{ textField: classes.similarityThresholdInput }}
              onChange={value => {
                similarityThresholdValueRef.current = value;
                infoRef.current?.updateValue?.(value);
              }}
            />
          </div>

          <SimilarityThresholdInfo
            ref={infoRef}
            defaultValue={defaultValue}
          />
        </div>
      </main>

      <footer className={classes.footer}>
        <CommonButton
          text='Deploy'
          variant='primary'
          onClick={event =>
            onDeploy(model.id, String(Number(similarityThresholdValueRef.current)/100))(event)
          }
        />

        <CommonButton text='Cancel' variant='tertiary' onClick={onCancel} />
      </footer>
    </Dialog>
  );
};
