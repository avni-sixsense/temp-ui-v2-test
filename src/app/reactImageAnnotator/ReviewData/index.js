import React, { useState, useCallback } from 'react';
import { Row } from 'reactstrap';
import Test1 from 'assests/images/reviewScreen/testImg/test1.bmp';
import Test2 from 'assests/images/reviewScreen/testImg/test2.bmp';
import Test3 from 'assests/images/reviewScreen/testImg/test3.bmp';
import AppBar from '../ReactAnnotator/components/Appbar';
import RightSidebar from '../ReactAnnotator/components/RightSidebar';
import LeftSideBar from '../ReactAnnotator/components/LeftSidebar';
import ImageDisplay from '../ReactAnnotator/components/ImageDisplay';

const data = [
  {
    img: 'https://i.picsum.photos/id/866/700/700.jpg?hmac=okSiT-lCPUFd4FKquYxQQsmSohsM-H41ZXTbscUqFBA',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://poojaratele.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/7/_/7_5.jpeg',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://poojaratele.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/_/s_2.jpeg',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://poojaratele.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/7/_/7_18.jpg',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://poojaratele.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/4/_/4_2_5.jpg',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://guesseu.scene7.com/is/image/GuessEU/M63H24W7JF0-L302-ALTGHOST?wid=1500&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: '	:	https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: '	:	https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: '	:	https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/arctichare.png',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/barbara.bmp',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/boy.bmp',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/cameraman.tif',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/fprint3.pgm',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/frymire.png',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/girl.png',
    name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.bmp',
    name: '84PMBG51A06_Tray004_R008C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  },
  {
    img: 'https://homepages.cae.wisc.edu/~ece533/images/goldhill.png',
    name: '84PMBG51A06_Tray007_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp'
  }
];

const Reviewdata = () => {
  const [activeImg, setActiveImg] = useState(1);

  const handleClick = useCallback(index => {
    setActiveImg(index);
  }, []);

  return (
    <div
      className='m-0 p-0'
      style={{
        overflow: 'hidden'
      }}
    >
      <Row style={{ backgroundColor: '#02435D' }} className='p-3'>
        <AppBar />
      </Row>
      <div className='d-flex' style={{ height: window.innerHeight }}>
        <LeftSideBar data={data} onClick={handleClick} active={activeImg} />
        <ImageDisplay
          data={data}
          active={activeImg}
          handleChange={handleClick}
        />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Reviewdata;
