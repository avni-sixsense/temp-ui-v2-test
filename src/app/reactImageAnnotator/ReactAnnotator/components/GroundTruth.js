import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import DropDownIcon from '../../assets/images/reviewScreen/dropdown.svg';

const GroundTruth = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  return (
    <div className='mx-1 my-4'>
      <span style={{ fontSize: '16px', color: '#02435D' }}>Label</span>
      <div
        style={{
          border: '1px solid #DDDDDD',
          width: '100%',
          height: '1px'
        }}
      ></div>
      <div className='my-2'>
        <span
          style={{
            fontSize: '12px',
            color: '#02435D'
          }}
        >
          Select Version History
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
    </div>
  );
};

export default GroundTruth;
