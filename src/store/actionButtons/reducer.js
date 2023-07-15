import produce from 'immer';
import uniq from 'lodash/uniq';
import initialState from 'store/constants/initial';
import { Review } from 'store/reviewData/constants';

export default function actionButtons(
  state = initialState.reviewButtons,
  action
) {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_REVIEW_ACTION_BUTTONS': {
        const { payload } = action;
        const tempDict = state.data?.[payload.annotationType] || {};
        let tempButtons = [];
        if (payload.annotationType === Review) {
          tempButtons.push('Add AI Model');
        }
        // if (draft.isAIAnnotation) {
        // }
        if (payload.multipleFilesets) {
          tempButtons = tempButtons.concat(tempDict['multiple-fileSets']);
        } else {
          tempButtons = tempButtons.concat(tempDict['single-fileset'] || []);
          if (payload.multipleBoxes) {
            tempButtons = tempButtons.concat(tempDict['multiple-boxes']);
          } else if (payload.singleBox) {
            tempButtons = tempButtons.concat(tempDict['single-box'] || []);
            tempButtons = tempButtons.concat(tempDict['single-box-ai'] || []);
            tempButtons = tempButtons.concat(tempDict['single-box-user'] || []);
            tempButtons = tempButtons.concat(
              tempDict['single-box-other'] || []
            );
            tempButtons = tempButtons.concat(tempDict['single-box-gt'] || []);
          }
        }
        draft.availableButtons = [
          'View all Similar Images',
          ...uniq(tempButtons)
        ];
        break;
      }
      case 'SET_AI_ASSISTANCE_BUTTON': {
        const { payload } = action;
        if (payload) {
          draft.availableButtons.push('Add AI Model');
          draft.isAIAnnotation = true;
        } else {
          draft.availableButtons = state.availableButtons.filter(
            x => x !== 'Add AI Model'
          );
          draft.isAIAnnotation = false;
        }
        break;
      }
      default:
        break;
    }
  });
}
