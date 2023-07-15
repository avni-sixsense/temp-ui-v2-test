import React from 'react';
import { Input } from '@material-ui/core';
import ThumbnailCard from './ThumbnailCard';

const LeftSideBar = ({ data, onClick, active }) => {
  return (
    <div
      className='d-flex flex-column align-items-center'
      style={{
        width: '120px',
        backgroundColor: '#FFFFFF',
        overflow: 'scroll'
      }}
    >
      <div className='p-3'>
        <Input placeholder='search' />
      </div>
      {data.map((e, index) => (
        <ThumbnailCard
          active={index === active}
          onClick={onClick}
          key={index}
          index={index}
          img={e.src}
        />
      ))}
    </div>
  );
};

export default LeftSideBar;
