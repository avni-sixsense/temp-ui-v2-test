import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import api from 'app/api';
import { converObjArraytoString, encodeURL } from 'app/utils/helpers';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import store from 'store/index';
import BACKEND_URL from 'store/constants/urls';
import {
  setMetaUploadCount,
  setUploaded,
  setUploadStatus,
  startSession
} from 'store/upload/actions';

const { user } = store.getState();

// const RateLimitedQueue = require('@uppy/utils/lib/RateLimitedQueue');

class UploaderService {
  constructor(dispatch, subscription) {
    this.uppy = new Uppy({
      allowMultipleUploads: false
    });
    this.metaUppy = new Uppy({
      id: 'metaUppy',
      allowMultipleUploads: false
    }).use(XHRUpload, {
      headers: {
        authorization: `Bearer ${user.accessToken}`
      },
      method: 'PATCH',
      fieldName: 'file'
    });
    this.dispatch = dispatch;
    this.subscription = subscription;
    this.sessionId = '';
    this.totalFiles = 0;
    this.uploaded = 0;
    this.model = {};
    this.metaFile = null;
    // this.requests = new RateLimitedQueue(5);
    this.fileSetQueue = [];
    this.sessionName = '';
    this.uploadSession = null;
    this.bulkCreate = false;
    this.params = '';
    this.uppy
      .use(AwsS3, {
        limit: 5,
        uppy: this.uppy,
        getUploadParameters(file) {
          const postData = {
            upload_session: file.meta.sessionId,
            subscription: file.meta.subscription,
            files: [
              {
                name: file.name
              }
            ]
          };

          return api.uploadFiles(postData).then(_ => {
            const { data } = _;
            const presignedPostData = data.files[0].pre_signed_post_data;
            const params = {
              methods: 'POST',
              url: presignedPostData.url,
              fields: presignedPostData.fields
            };
            this.uppy.setFileMeta(file.id, {
              fileSetId: data.id
            });
            return params;
          });
        }
      })
      .on('upload', data => {
        this.dispatch(setUploadStatus(true));
        const total = data.fileIDs.length + this.uploadSession?.file_sets;
        const uploaded = this.uploadSession?.file_sets;
        this.dispatch(
          startSession({
            session: this.uploadSession.id,
            total,
            uploaded: uploaded || 0
          })
        );
      })
      .on('upload-retry', fileID => {
        this.uppy.retryUpload(fileID);
      })
      .on('upload-error', file => {
        toast.error(`Failed to upload file ${file.name}.`);
        // axios.post(`${BACKEND_URL}/api/v2/org-file/media-storage-ack`, {
        // 	file_id: file.meta.file_id,
        // 	upload_successful: false,
        // })
      })
      .on('upload-success', file => {
        this.uploaded += 1;
        const payload = {
          session: this.uploadSession.id
        };
        this.dispatch(setUploaded(payload));
        if (this.model[file.meta.upload_session]) {
          const apiPayload = {
            ml_model: Array.isArray(this.model[this.uploadSession.id])
              ? this.model[this.uploadSession.id][0]
              : this.model[this.uploadSession.id],
            file_set: file.meta.fileSetId
          };
          api.fileSetInferenceQueue(apiPayload);
        } else {
          this.fileSetQueue.push(file.meta.fileSetId);
        }
      })
      .on('complete', result => {
        if (this.metaFile) {
          this.uploadFileMeta();
        } else {
          this.uppy.setState({
            metaFileUploaded: false
          });
        }
        this.dispatch(setUploadStatus(false));
      });
    this.directUppy = new Uppy({
      id: 'directUppy',
      allowMultipleUploads: false
    })
      .use(XHRUpload, {
        headers: {
          authorization: `Bearer ${user.accessToken}`
        },
        endpoint: `${BACKEND_URL}/api/v1/classif-ai/file-set/`,
        method: 'POST',
        fieldName: 'files',
        formData: true,
        allowedMetaFields: ['upload_session', 'subscription']
      })
      .on('upload', data => {
        this.dispatch(setUploadStatus(true));
        const total = data.fileIDs.length + this.uploadSession?.file_sets;
        const uploaded = this.uploadSession?.file_sets;
        this.dispatch(
          startSession({
            session: this.uploadSession.id,
            total,
            uploaded: uploaded || 0
          })
        );
      })
      .on('upload-retry', fileID => {
        this.directUppy.retryUpload(fileID);
      })
      .on('upload-error', file => {
        toast.error(`Failed to upload file ${file.name}.`);
        // axios.post(`${BACKEND_URL}/api/v2/org-file/media-storage-ack`, {
        // 	file_id: file.meta.file_id,
        // 	upload_successful: false,
        // })
      })
      .on('upload-success', (file, response) => {
        this.uploaded += 1;
        const payload = {
          session: this.uploadSession.id
        };
        this.dispatch(setUploaded(payload));
        if (this.model[this.model[file.meta.upload_session]]) {
          const apiPayload = {
            ml_model: Array.isArray(this.model[this.uploadSession.id])
              ? this.model[this.uploadSession.id][0]
              : this.model[this.uploadSession.id],
            file_set: response.body.id
          };
          api.fileSetInferenceQueue(apiPayload);
        } else {
          this.fileSetQueue.push(response.body.id);
        }
      })
      .on('complete', () => {
        if (this.metaFile) {
          this.uploadFileMeta();
        } else {
          this.directUppy.setState({
            metaFileUploaded: false
          });
        }
        this.dispatch(setUploadStatus(false));
      });
    // this.preProcessFiles = this.preProcessFiles.bind(this)
    // this.processFileSet = this.processFileSet.bind(this)
    this.getSesionId = this.getSesionId.bind(this);
    this.inferenceQueue = this.inferenceQueue.bind(this);
    this.uploadFileMeta = this.uploadFileMeta.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  async getSesionId(name, errorCallback, setSession, useCaseId) {
    const data = {
      name,
      subscription: this.subscription,
      use_case: useCaseId
    };
    let sessionData = null;
    if (this.uploadSession) {
      sessionData = this.uploadSession;
      this.sessionId = this.uploadSession.id;
    } else {
      sessionData = await api
        .getSessionId(data)
        .then(response => response.data)
        .catch(e => {
          if (errorCallback) {
            errorCallback();
          }
          toast.error(e?.response?.data?.name?.[0]);
        });
      if (!sessionData) {
        return;
      }
      this.sessionId = sessionData.id;
      this.uploadSession = sessionData;
      setSession(sessionData);
    }
    // this.uploadFiles()
    // successCallback()
  }

  uploadFiles(successCallback) {
    if (process.env.REACT_APP_UPLOAD_TYPE !== 's3') {
      this.directUppy.getPlugin('XHRUpload').setOptions({
        headers: {
          authorization: `Bearer ${user.accessToken}`
        }
      });
    }
    const uppy =
      process.env.REACT_APP_UPLOAD_TYPE === 's3' ? this.uppy : this.directUppy;
    const files = uppy.getFiles();
    const payload = {
      session: this.uploadSession.id,
      total: files.length + this.uploadSession?.file_sets,
      uploaded: this.uploadSession?.file_sets
    };
    this.dispatch(startSession(payload));
    files.forEach(file => {
      uppy.setFileMeta(file.id, {
        upload_session: this.uploadSession.id,
        sessionId: this.uploadSession.id,
        subscription: this.subscription
      });
    });
    uppy.upload();
    successCallback();
  }

  inferenceQueue(model) {
    this.model[this.uploadSession.id] = model;
    if (this.params.length || this.bulkCreate) {
      const postData = {};
      const parsedParams = queryString.parse(this.params, {
        arrayFormat: 'comma',
        parseNumbers: true
      });
      const fileSetFilters = {};
      Object.entries(parsedParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          fileSetFilters[key] = value;
        } else if (key.includes('date')) {
          fileSetFilters[key] = value;
        } else {
          fileSetFilters[key] = [value];
        }
      });
      postData.file_set_filters = encodeURL(
        converObjArraytoString(fileSetFilters)
      );
      postData.ml_model_id = model[0];
      return api.bulkCreateFileSetInferenceQueue(postData);
    }
    if (this.fileSetQueue.length) {
      const promiseArray = [];
      this.fileSetQueue.forEach(el => {
        const payload = {
          ml_model: Array.isArray(model) ? model[0] : model,
          file_set: el
        };
        promiseArray.push(api.fileSetInferenceQueue(payload));
      });
      return Promise.all(promiseArray)
        .then(() => {
          this.fileSetQueue = [];
        })
        .catch(e => console.log(e));
    }
    return '';
  }

  uploadFileMeta() {
    const uppy =
      process.env.REACT_APP_UPLOAD_TYPE === 's3' ? this.uppy : this.directUppy;
    const state = uppy.getState();
    if (state.totalProgress === 100 && !state?.metaFileUploaded) {
      const formData = new FormData();
      uppy.setState({ metaFileUploaded: true });
      formData.append('file', this.metaFile);
      formData.append('upload_session_id', this.uploadSession.id);
      api.uploadMetaInfo(formData).then(() => {
        this.dispatch(setMetaUploadCount());
        this.metaFile = '';
        uppy.setState({
          metaFileUploaded: false
        });
      });
    }
  }
}
export default UploaderService;

// processFileSet(slicedFileSet) {
// 		const files = this.uppy.getFiles()
// 		return new Promise((resolve) => {
// 			axios
// 				.post(`${BACKEND_URL}/api/v1/classif-ai/file-set`, {
// 					files: slicedFileSet,
// 				})
// 				.then((_) => {
// 					const { response } = _.data
// 					files.forEach((file) => {
// 						const responseData = response[file.meta.originalName]
// 						if (responseData) {
// 							let orgFile = null
// 							// eslint-disable-next-line no-shadow
// 							responseData.files.forEach((file) => {
// 								if (file.meta.isPrimary === file.is_primary) {
// 									orgFile = file
// 								}
// 							})
// 							this.uppy.setFileMeta(file.id, {
// 								file_id: orgFile.id,
// 								presignedPostData: orgFile.pre_signed_post_data,
// 							})
// 						}
// 					})
// 				})
// 				.then(() => resolve())
// 		})
// 	}

// 	async preProcessFiles() {
// 		let i = 0
// 		const batchSize = 25
// 		const promises = []
// 		for (i = 0; i < this.fileSets.length; i += batchSize) {
// 			const slicedFileSet = this.fileSets.slice(i, i + batchSize)
// 			const processFileSet = this.requests.wrapPromiseFunction(
// 				// eslint-disable-next-line no-shadow
// 				(slicedFileSet) => {
// 					return this.processFileSet(slicedFileSet)
// 				}
// 			)
// 			promises.push(processFileSet(slicedFileSet))
// 		}

// 		await Promise.all(promises).then(() => {
// 			this.uppy.upload()
// 		})
// 	}
