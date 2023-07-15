import api from 'app/api';

export const checkAndActiveWaferAvailability = (
  waferIds,
  forceReview = false
) =>
  new Promise((resolve, reject) => {
    const payload = { wafers: waferIds };

    if (forceReview) {
      payload.ignore_other_active = true;
    }
    api
      .activeWaferBook(payload)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

export const makeWaferInactive = waferIds =>
  new Promise((resolve, reject) => {
    const payload = { wafers: waferIds };

    api
      .inactiveWaferBook(payload)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
