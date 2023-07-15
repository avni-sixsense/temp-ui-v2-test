import Bold700 from './fonts/IBMPlexSans-Bold.ttf';
// import BoldItalic from './fonts/IBMPlexSans-BoldItalic.ttf'
// import ExtraLight from './fonts/IBMPlexSans-ExtraLight.ttf'
// import ExtraLightItalic from './fonts/IBMPlexSans-ExtraLightItalic.ttf'
// import Italic from './fonts/IBMPlexSans-Italic.ttf'
// import Light from './fonts/IBMPlexSans-Light.ttf'
// import LightItalic from './fonts/IBMPlexSans-LightItalic.ttf'
import Medium500 from './fonts/IBMPlexSans-Medium.ttf';
// import MediumItalic from './fonts/IBMPlexSans-MediumItalic.ttf'
import Regular400 from './fonts/IBMPlexSans-Regular.ttf';
import SemiBold600 from './fonts/IBMPlexSans-SemiBold.ttf';
// import SemiBoldItalic from './fonts/IBMPlexSans-SemiBoldItalic.ttf'
// import Thin from './fonts/IBMPlexSans-Thin.ttf'
// import ThinItalic from './fonts/IBMPlexSans-ThinItalic.ttf'

const IBMPlexBold = {
  fontFamily: 'IBMPlexBold',
  src: `
    local(IBMPlex-Bold),
    url(${Bold700}) format("truetype");`
};

const IBMPlexRegular = {
  fontFamily: 'IBMPlexRegular',
  src: `
    local(IBMPlex-Regular),
    url(${Regular400}) format("truetype");`
};
const IBMPlexMedium = {
  fontFamily: 'IBMPlexMedium',
  src: `
    local(IBMPlex-Medium),
    url(${Medium500}) format("truetype");`
};
const IBMPlexSemiBold = {
  fontFamily: 'IBMPlexSemiBold',
  src: `
    local(IBMPlex-Semi-Bold),
    url(${SemiBold600}) format("truetype");`
};

export default {
  IBMPlexBold,
  IBMPlexRegular,
  IBMPlexMedium,
  IBMPlexSemiBold
};
