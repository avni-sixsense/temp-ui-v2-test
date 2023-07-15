import React, { useState } from 'react';
import MenuBtn from '../../assets/images/reviewScreen/menuBtn.svg';
import DropDownIcon from '../../assets/images/reviewScreen/dropdown.svg';
import {
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import AIPredictedTags from './AIPredictedTags';
import GroundTruth from './GroundTruth';
import Metadata from './Metadata';

const RightSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  return (
    <Col style={{ backgroundColor: '#FFFFFF' }}>
      <div className='clearfix'>
        <Button
          className='mx-1 my-4'
          style={{
            height: '30px',
            backgroundColor: 'rgba(2, 67, 93, 0.06)',
            color: '#02435D',
            fontSize: '12px'
          }}
        >
          Add to Glossary
        </Button>
        <Button
          className='mx-1 my-4'
          style={{
            height: '30px',
            backgroundColor: 'rgba(2, 67, 93, 0.06)',
            color: '#02435D',
            fontSize: '12px'
          }}
        >
          Edit
        </Button>
        <Button
          className='mx-1 my-4'
          style={{
            height: '30px',
            backgroundColor: 'rgba(2, 67, 93, 0.06)',
            color: '#02435D',
            fontSize: '12px'
          }}
        >
          Delete
        </Button>
        <img
          className='float-right py-1 my-4 px-5'
          src={MenuBtn}
          alt='menuBtn'
        />
      </div>
      <div className='mx-1'>
        <span
          style={{
            fontSize: '12px',
            color: '#02435D'
          }}
        >
          Select Model
        </span>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            style={{
              width: '90%',
              textAlign: 'left',
              backgroundColor: '#F0F4F6',
              color: '#02435D'
            }}
          >
            <div className='d-flex justify-content-between'>
              <span>New</span>
              <img src={DropDownIcon} alt='icon' />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Nothing Added yet</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <AIPredictedTags />
      <GroundTruth />
      <Metadata />
    </Col>
  );
};

export default RightSidebar;
