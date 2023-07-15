import CabinMediumFont from './fonts/Cabin-Medium.ttf';
import CabinRegularFont from './fonts/Cabin-Regular.ttf';
import FuturaBTBookFont from './fonts/Futura-Book-font.ttf';
import FuturaMediumFont from './fonts/Futura-Medium.ttf';

const CabinRegular = {
  fontFamily: 'Cabin',
  src: `
    local(Cabin-Regular),
    url(${CabinRegularFont}) format("truetype");`
};

const CabinMedium = {
  fontFamily: 'Cabin',
  src: `
    local(Cabin-Medium),
    url(${CabinMediumFont}) format("truetype");`
};

const FuturaMedium = {
  fontFamily: 'Futura',
  src: `
    local(Futura-Medium),
    url(${FuturaMediumFont}) format("truetype");`
};

const FuturaBTBook = {
  fontFamily: 'FuturaBT',
  src: `
    local(FuturaBT-Book),
    url(${FuturaBTBookFont}) format("truetype");`
};

export default {
  CabinMedium,
  CabinRegular,
  FuturaMedium,
  FuturaBTBook
};
