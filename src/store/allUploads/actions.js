export function addAllUploadsData(data) {
  return { type: 'ADD_ALL_UPLOAD_DATA', payload: data };
}

export function updataAllUploadsDataById(data) {
  return { type: 'UPDATE_ALL_UPLOAD_DATA_BY_ID', payload: data };
}
