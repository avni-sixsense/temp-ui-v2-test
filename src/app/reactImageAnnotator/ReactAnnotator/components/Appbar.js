import React, { useState } from 'react';
import LeftArrow from '../../assets/images/reviewScreen/arrowLeft.svg';
import RightArrow from '../../assets/images/reviewScreen/arrowRight.svg';
import BookMarkIcon from '../../assets/images/reviewScreen/bookmark.svg';
import MessageIcon from '../../assets/images/reviewScreen/message.svg';
import CloseIcon from '../../assets/images/reviewScreen/close.svg';
import RectangleIcon from '../../assets/images/reviewScreen/rectangle.svg';
import ZoomIn from '../../assets/images/reviewScreen/zoomIn.svg';
import ZoomOut from '../../assets/images/reviewScreen/zoomOut.svg';
import {
  Col,
  CustomInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';
import { IconButton, Button } from '@material-ui/core';

const Appbar = ({
  scale,
  setScale,
  onClickTool,
  imgNavigation,
  activeImg,
  dataLength,
  saveRegion
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  return (
    <>
      <Col className='d-flex' lg={10}>
        <img
          className='pr-3'
          onClick={() => onClickTool('create-box')}
          disabled={false}
          aria-label='Add Bounding Box'
          src={RectangleIcon}
          alt='RectangleIcon'
          style={{
            cursor: 'pointer'
          }}
        />{' '}
        <IconButton
          style={{ color: '#FFFFFF', transform: 'rotate(-90deg)' }}
          className='p-0 px-3'
          onClick={() => onClickTool('select')}
          disabled={false}
          aria-label='Select Region'
          src={RectangleIcon}
          alt='SelectIcon'
        >
          <NearMeOutlinedIcon />
        </IconButton>
        {/* <img
					className="px-3"
					onClick={() => onClickTool('select')}
					disabled={false}
					aria-label="Select Region"
					src={RectangleIcon}
					alt="SelectIcon"
					style={{
						cursor: 'pointer',
					}}
				/> */}
        <img className='px-3' src={LeftArrow} alt='LeftArrow' />
        <img className='px-3' src={RightArrow} alt='RightArrow' />
        <img className='px-3' src={BookMarkIcon} alt='BookMarkIcon' />
        <img className='px-3' src={MessageIcon} alt='MessageIcon' />
        <img
          className='px-3'
          src={ZoomOut}
          alt='ZoomOut'
          style={{
            cursor: 'pointer'
          }}
          onClick={() => onClickTool('zoom-out')}
          disabled={false}
          aria-label='Zoom Out'
          // onClick={() => {
          // 	if (scale - 25 >= 100) setScale(scale - 25)
          // }}
        />
        <img
          className='px-3'
          src={ZoomIn}
          alt='ZoomIn'
          style={{
            cursor: 'pointer'
          }}
          onClick={() => onClickTool('zoom')}
          disabled={false}
          aria-label='Zoom In'
          // onClick={() => {
          // 	if (scale + 25 <= 1000) setScale(scale + 25)
          // }}
        />
        <div className='d-flex px-3'>
          <span
            style={{
              color: '#D5D5D5',
              padding: '0 2% 0 0',
              fontSize: '15px'
            }}
          >
            -
          </span>
          <input
            type='range'
            value={scale}
            min={100}
            max={1000}
            step={1}
            onChange={e => setScale(e.target.value)}
          />
          <span
            style={{
              color: '#D5D5D5',
              padding: '0 0 0 2%',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            +
          </span>
        </div>
        {/* <div
					className="px-3"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput
						type="switch"
						id="exampleCustomSwitch"
						name="customSwitch"
						label="Enable Roll-Over Zoom"
					/>
				</div>
				<div
					className="px-3"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Scan Mode" />
				</div>
				<div
					className="px-3"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Show Regions" />
				</div>
				<div className="px-3">
					<Dropdown isOpen={dropdownOpen} toggle={toggle}>
						<DropdownToggle
							style={{
								backgroundColor: 'transparent',
								border: '0px',
								padding: '0px',
								margin: '0px',
								fontSize: '15px',
							}}
							caret
						>
							View As
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem header>Nothing Added yet</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div> */}
        <Button
          onClick={saveRegion}
          className='p-0 mx-3 m-0'
          size='small'
          style={{ backgroundColor: 'transparent', color: '#FFFFFF' }}
        >
          Save
        </Button>
      </Col>
      <Col className='d-flex'>
        <IconButton
          disabled={activeImg === 0}
          onClick={() => {
            if (activeImg !== 0) {
              imgNavigation(activeImg - 1);
            }
          }}
          className='py-0'
          style={{ color: '#FFFFFF' }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          disabled={activeImg === dataLength - 1}
          onClick={() => {
            if (dataLength - 1 !== activeImg) {
              imgNavigation(activeImg + 1);
            }
          }}
          className='py-0'
          style={{ color: '#FFFFFF' }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
        <img className='pl-5' src={CloseIcon} alt='CloseIcon' />
      </Col>
    </>
  );
};

export default Appbar;
