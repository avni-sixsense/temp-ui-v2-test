// @flow

import React, { useEffect, useState, useCallback } from 'react';
import Annotator from '../Annotator';
import { Row } from 'reactstrap';
import cloneDeep from 'lodash/cloneDeep';
import RightSidebar from '../ReactAnnotator/components/RightSidebar';
import LeftSideBar from '../ReactAnnotator/components/LeftSidebar';
import AppBar from './components/Appbar';
import Test1 from '../assets/images/reviewScreen/testImg/test1.bmp';
import Test2 from '../assets/images/reviewScreen/testImg/test2.bmp';
import Test3 from '../assets/images/reviewScreen/testImg/test3.bmp';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import DropDownIcon from '../assets/images/reviewScreen/dropdown.svg';

const data = [
  {
    src: Test1,
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
    regions: [
      {
        type: 'box',
        h: 0.007893452739745621,
        w: 0.012511553144464496,
        x: 0.7993914865524276,
        y: 0.7416257642297427,
        // id: i.toString(),
        color: 'white',
        tags: [{ label: 'bent_lead', value: 1, type: 'Ai Defect' }],
        // cls: defect.region_id,
        // showTags: false,
        // visible: true,
        // highlighted: false,
        // is_user_feedback: false,
        is_new: false,
        is_updated: false,
        editingLabels: false,
        allowedArea: {
          x: 0,
          y: 0,
          w: 1,
          h: 1
        },
        id: Math.random().toString(36).substring(7)
      }
    ]
  },
  {
    src: Test2,
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    src: Test3,
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  }
];

const temp = [
  {
    id: 8366,
    file: 2843,
    ml_model: 1,
    defects: { '4': {} },
    ai_region: null,
    region: {
      coordinates: {
        h: 0.007893452739745621,
        w: 0.012511553144464496,
        x: 0.7993914865524276,
        y: 0.7416257642297427
      }
    },
    is_user_feedback: true,
    is_removed: false,
    created_by: 1,
    created_ts: '2020-09-15T10:00:26.063970Z',
    updated_by: null,
    updated_ts: '2020-09-15T10:00:26.064002Z',
    classification_correctness: null,
    detection_correctness: null
  }
];
export default (props: any) => {
  const inferenceData = {
    data: []
  };

  const [scale, setScale] = useState(100);
  const [activeImg, setActiveImg] = useState(0);

  const handleClick = useCallback(index => {
    setActiveImg(index);
  }, []);

  const [currentMat, setMat] = useState({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: -10,
    f: -10
  });
  const [ih, changeIh] = useState(0);
  const [iw, changeIw] = useState(0);
  const [showTags, toggleShowTags] = useState(true);
  // const [imageBefore, setImageBefore] = useState('')
  const [imageAfter, setImageAfter] = useState('');

  // useEffect(() => {
  // 	if (defaultData) {
  // 		defaultData.org_files.forEach((item) => {
  // 			let src = item.resized_file ? item.resized_file : item.file
  // 			if (item.is_primary) setImageAfter(src)
  // 			// else setImageBefore(src)
  // 		})
  // 	}
  // }, [defaultData])
  // const getRandomColor = () => {
  // 	var letters = '0123456789ABCDEF'
  // 	var color = '#'
  // 	for (var i = 0; i < 6; i++) {
  // 		color += letters[Math.floor(Math.random() * 16)]
  // 	}
  // 	return color
  // }
  const getRegions = useCallback(() => {
    let data = inferenceData.data;
    const regions = [];
    for (let i = 0; i < data.length; i++) {
      let region = {
        type: 'box',
        x: data[i]['extra_model_output']['bounding_box']['xmin'],
        y: data[i]['extra_model_output']['bounding_box']['ymin'],
        w:
          data[i]['extra_model_output']['bounding_box']['xmax'] -
          data[i]['extra_model_output']['bounding_box']['xmin'],
        h:
          data[i]['extra_model_output']['bounding_box']['ymax'] -
          data[i]['extra_model_output']['bounding_box']['ymin'],
        id: i.toString(),
        color: 'black',
        locked: true,
        cls: data[i]['predicted_defect']['name'],
        showTags: false,
        tags: [
          'x: ' + data[i]['extra_model_output']['x']['value'].toString(),
          'y: ' + data[i]['extra_model_output']['y']['value'].toString(),
          'area: ' + data[i]['extra_model_output']['area']['value'].toString()
        ]
      };
      regions.push(region);
    }
    return regions;
  }, [inferenceData]);

  const [afterSawingImages, setAfterSawingImages] = useState([]);
  // const [currentRegions, setCurrentRegions] = useState([])

  // useEffect(() => {
  // 	if (defaultData) {
  // 		let primaryFile = ''
  // 		defaultData.org_files.forEach((item) => {
  // 			if (item.is_primary) primaryFile = item
  // 		})
  // 		setAfterSawingImages([
  // 			{
  // 				src: primaryFile.resized_file
  // 					? `${BACKEND_URL}${primaryFile.resized_file}`
  // 					: `${BACKEND_URL}${primaryFile.file}`,
  // 				name: primaryFile.name,
  // 				regions: getRegions(),
  // 			},
  // 		])
  // 	}
  // }, [defaultData, getRegions])

  const toggleRegionTags = (image_index, region_index) => {
    let tempAfterSawingImages = cloneDeep(afterSawingImages); //[ ...afterSawingImages ]  //afterSawingImages.slice() //Object.assign({},afterSawingImages);
    for (
      let i = 0;
      i < tempAfterSawingImages[image_index]['regions'].length;
      i++
    ) {
      if (i !== region_index) {
        tempAfterSawingImages[image_index]['regions'][i]['showTags'] = false;
        tempAfterSawingImages[image_index]['regions'][i]['color'] = 'black';
        tempAfterSawingImages[image_index]['regions'][i]['zIndex'] = 1;
      } else {
        tempAfterSawingImages[image_index]['regions'][i]['showTags'] =
          !tempAfterSawingImages[image_index]['regions'][i]['showTags'];
        if (tempAfterSawingImages[image_index]['regions'][i]['showTags']) {
          tempAfterSawingImages[image_index]['regions'][i]['color'] = 'red';
          tempAfterSawingImages[image_index]['regions'][i]['zIndex'] = 10;
        } else {
          tempAfterSawingImages[image_index]['regions'][i]['color'] = 'black';
          tempAfterSawingImages[image_index]['regions'][i]['zIndex'] = 1;
        }
      }
    }
    setAfterSawingImages(tempAfterSawingImages);
  };

  const changeMat = mat => {
    setMat(mat);
    setScale(((1 / mat.a) * 100).toFixed(0));
  };
  const moveToPoint = box => {
    changeMat({
      a: 0.1,
      b: 0,
      c: 0,
      d: 0.1,
      e: box['xmin'] * iw - 10,
      f: box['ymin'] * ih - 10
    });
    // toggleShowTags(true)
    // setScale(1000);
  };
  const handleScaleChange = value => {
    // setScale(value)
    let newMat = {
      a: 100 / value,
      b: currentMat['b'],
      c: currentMat['c'],
      d: 100 / value,
      e: currentMat['e'],
      f: currentMat['f']
    };
    const horizontal_move_limit = (1 / newMat.a - 1) * (iw / (1 / newMat.a));
    const vertical_move_limit = (1 / newMat.d - 1) * (ih / (1 / newMat.d));

    if (newMat.e < -10) {
      newMat.e = -10;
    } else if (newMat.e > horizontal_move_limit) {
      newMat.e = horizontal_move_limit;
    }

    if (newMat.f < -10) {
      newMat.f = -10;
    } else if (newMat.f > vertical_move_limit) {
      newMat.f = vertical_move_limit;
    }
    changeMat(newMat);
  };
  const onIhIwChange = (ih, iw) => {
    changeIh(ih);
    changeIw(iw);
  };

  const [selectedTool, setSelectedTool] = useState('pan');
  const handleToolChange = tool => {
    setSelectedTool(tool);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  const [regions, setRegions] = useState([]);
  useEffect(() => {
    let fileRegions = [
      {
        id: 48,
        file: 756,
        ml_model: 1,
        defects: {
          '1': {},
          '2': {}
        },
        ai_region: 47,
        region: {
          coordinates: {
            h: 0.004411764705882353,
            w: 0.028530222006157735,
            x: 0.5372549019607843,
            y: 0.8063725490196079
          }
        },
        is_user_feedback: false,
        is_new: false,
        created_by: 1,
        created_ts: '2020-08-16T07:16:27.978571Z',
        updated_by: null,
        updated_ts: '2020-08-16T07:16:27.978617Z'
      },
      {
        id: 47,
        file: 756,
        ml_model: 1,
        defects: {
          '3': {
            confidence: 0.97237229347229
          }
        },
        ai_region: null,
        region: {
          type: 'box',
          coordinates: {
            h: 0.004411764705882353,
            w: 0.006372549019607843,
            x: 0.5372549019607843,
            y: 0.8063725490196079
          }
        },
        is_user_feedback: false,
        created_by: null,
        created_ts: '2020-08-16T07:14:59.045452Z',
        updated_by: null,
        updated_ts: '2020-08-16T07:14:59.045487Z'
      }
    ];
    if (fileRegions) {
      if (fileRegions) {
        const temp = [];
        fileRegions.forEach((result, i) => {
          const { region } = result;
          const { coordinates } = region;
          const r = {
            type: 'box',
            x: coordinates.x,
            y: coordinates.y,
            w: coordinates.w,
            h: coordinates.h,
            // id: i.toString(),
            color: 'white',
            cls: region.id,
            defect_type: 'Ai Defect',
            // showTags: false,
            // visible: true,
            highlighted: false,
            is_new: false,
            is_updated: true,
            // is_user_feedback: false,
            editingLabels: false,
            id: Math.random().toString(36).substring(7)
            // tags: [
            // 	`x: ${data[i].extra_model_output.x.value.toString()}`,
            // 	`y: ${data[i].extra_model_output.y.value.toString()}`,
            // 	`area: ${data[i].extra_model_output.area.value.toString()}`,
            // ],
          };
          temp.push(r);
        });
        setRegions(temp);
      }
    }
  }, []);

  const handleRegionSave = () => {
    // console.log(currentRegions)
  };

  const onExit = allData => {};

  const [regionTagList, setRegionTagList] = useState([
    { label: 'bent_lead', value: 1, type: 'Other Defect' },
    { label: 'length_deviation', value: 2, type: 'Other Defect' },
    { label: 'burr', value: 3, type: 'Other Defect' },
    { label: 'flake', value: 4, type: 'Other Defect' },
    { label: 'fibre', value: 5, type: 'Other Defect' },
    { label: 'dirt_on_tool', value: 6, type: 'Other Defect' }
  ]);

  const [currentRegions, setCurrentRegions] = useState([]);

  return (
    <div
      className='m-0 p-0'
      style={{
        overflow: 'hidden'
      }}
    >
      <Row style={{ backgroundColor: '#02435D' }} className='p-3'>
        <AppBar
          showTags={showTags}
          onClickTool={handleToolChange}
          scale={parseInt(scale)}
          setScale={handleScaleChange}
          imgNavigation={setActiveImg}
          activeImg={activeImg}
          dataLength={data.length}
          saveRegion={handleRegionSave}
        />
      </Row>
      <div className='d-flex'>
        <LeftSideBar onClick={handleClick} active={activeImg} data={data} />
        <div
          id='ImageDisplay'
          style={{
            backgroundColor: '#E5E5E5',
            width: '100%'
          }}
        >
          <div className='m-3'>
            <div
              className='px-3 py-2 d-flex'
              //  style={{ color: '#02435D', opacity: 0.5 }}
            >
              {/* {currentImage.name} */}
              <Dropdown className='mx-3' isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: '#F0F4F6',
                    color: '#02435D'
                  }}
                >
                  <div className='d-flex justify-content-between'>
                    <span className='mr-3'>Select Record Level Tags</span>
                    <img src={DropDownIcon} alt='icon' />
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Nothing Added yet</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <FormGroup className='mx-3' check>
                <Label check>
                  <Input type='checkbox' name='check1' /> Not Sure
                </Label>
              </FormGroup>
              <FormGroup className='mx-3' check>
                <Label check>
                  <Input type='checkbox' name='check1' /> No Defect
                </Label>
              </FormGroup>
            </div>
            <Annotator
              {...props}
              selectedTool={selectedTool}
              showTags={showTags}
              taskDescription='Draw region around the defects'
              onImagesChange={setAfterSawingImages}
              images={data}
              selectedImage={data[activeImg].src}
              currentMat={currentMat}
              changeMat={changeMat}
              handleScaleChange={handleScaleChange}
              // regions={regions}
              setCurrentRegions={setCurrentRegions}
              onExit={onExit}
              regionTagList={regionTagList}
              rollOverZoom={true}
            />
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};
