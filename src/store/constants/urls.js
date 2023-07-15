const CUSTOMER_BACKEND_URL = {
  GIGA_PROD: 'https://sixsense-api.sgp-aws.gfoundries.com',
  GIGA: 'http://staging-sixsense-api.sgp-aws.gfoundries.com',
  GF7: 'https://f7staging-sixsense-api.sgp-aws.gfoundries.com',
  GF7_PROD: 'https://f7prod-sixsense-api.sgp-aws.gfoundries.com'
};

// eslint-disable-next-line import/no-mutable-exports
let BACKEND_URL = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  BACKEND_URL = 'https://infineon.staging1.sixsense.ai';
  // BACKEND_URL = 'http://127.0.0.1:8000';
} else {
  BACKEND_URL =
    process.env.REACT_APP_USE_ORIGIN_URL === 'true'
      ? // eslint-disable-next-line no-restricted-globals
        location.origin
      : CUSTOMER_BACKEND_URL[process.env.REACT_APP_CUSTOMER];
}

export default BACKEND_URL;
