import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Show from 'app/hoc/Show';

import { selectUseCaseDict } from 'store/helpers/selector';
import {
  selectActiveFileSetUseCaseId,
  selectIsMultiSelected,
  selectSelectAll
} from 'store/reviewData/selector';

import AiAssistanceContainer from './components/AiAssistance';
import NoDefectContainer from './components/NoDefectContainer';
import ClassificationContainer from './components/Classification';
// import Analysis from './Analysis'
import CollapseBar from './components/CollapseBar';
import CopyToFolder from './components/CopyToFolder';
// import DetectionContainer from './components/Detection';
import FinalLables from './components/FinalLabels';
import { Information } from './components/Information';
// import ModelSelectGrouped from './ModelSelectGrouped'
import NoteContainer from './components/NoteContainer';
// import SimilarImagesDrawer from './SimilarImagesDrawer'
import WaferMap from './components/WaferMap';
import WaferSummary from './components/WaferSummary';
import SidebarBackdrop from './components/SidebarBackdrop';

import BulkReplaceContainer from './components/BulkReplace';

import classes from './Sidebar.module.scss';

const DISABLE_TEXT_FOR_DETECTION =
  'Coming soon for ‘Detection & Classification’ use cases';

const mapRightSidebarState = createStructuredSelector({
  isMultiSelected: selectIsMultiSelected,
  selectAll: selectSelectAll,
  activeFileSetUseCaseId: selectActiveFileSetUseCaseId,
  useCaseDict: selectUseCaseDict
});

const Sidebar = () => {
  const { isMultiSelected, selectAll, activeFileSetUseCaseId, useCaseDict } =
    useSelector(mapRightSidebarState);

  const useCase = useCaseDict[activeFileSetUseCaseId] ?? {};

  const isClassification = useCase.type === 'CLASSIFICATION';
  const isDetection = useCase.type === 'CLASSIFICATION_AND_DETECTION';

  const COLLAPSABLE_COMPS = [
    {
      title: 'Wafer Map',
      component: WaferMap,
      props: {},
      show: true
    },
    {
      title: 'AI Assistance',
      component: AiAssistanceContainer,
      props: {},
      show: true
    },
    {
      title: 'Mark as no defect',
      component: NoDefectContainer,
      props: {},
      show: isDetection && !isMultiSelected
    },
    {
      title: 'Final Label',
      component: FinalLables,
      props: { useCase },
      show: isClassification && !isMultiSelected && !selectAll
    },
    {
      title: 'Add Label to Selected Images',
      component: BulkReplaceContainer,
      props: { useCase },
      show:
        Object.keys(useCase).length > 0 &&
        useCase.type === 'CLASSIFICATION' &&
        useCase.classification_type === 'SINGLE_LABEL' &&
        (isMultiSelected || selectAll)
    },
    {
      title: 'Classification',
      component: ClassificationContainer,
      props: {},
      show:
        Object.keys(useCase).length > 0 &&
        isClassification &&
        (isMultiSelected || selectAll)
    },
    // {
    //   title: 'Detection',
    //   component: DetectionContainer,
    //   props: {},
    //   show:
    //     Object.keys(useCase).length > 0 &&
    //     (useCase?.type === 'CLASSIFICATION_AND_DETECTION' ||
    //       useCase?.type === 'DETECTION') &&
    //     isMultiSelected
    // },
    {
      title: 'Copy images to another folder',
      component: CopyToFolder,
      props: {
        disabledText: isDetection ? DISABLE_TEXT_FOR_DETECTION : null
      },
      show: true
    },
    {
      title: 'Add Note',
      component: NoteContainer,
      props: {},
      show: !isMultiSelected && !selectAll
    },
    {
      title: 'Wafer Summary',
      component: WaferSummary,
      props: {},
      show: true
    },
    {
      title: 'image metadata',
      component: Information,
      props: {},
      show: !isMultiSelected && !selectAll
    }
  ];

  return (
    <>
      <aside className={classes.sidebar}>
        {COLLAPSABLE_COMPS.map((item, index) => (
          <Show when={item.show} key={index}>
            <CollapseBar title={item.title}>
              <item.component {...item.props} />
            </CollapseBar>
          </Show>
        ))}
      </aside>

      <SidebarBackdrop useCase={useCase} />
    </>
  );
};

export default Sidebar;
