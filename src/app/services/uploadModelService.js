import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import api from 'app/api';
import store from 'store/index';
import BACKEND_URL from 'store/constants/urls';

const { user } = store.getState();

// const RateLimitedQueue = require('@uppy/utils/lib/RateLimitedQueue');

class UploadModelService {
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
    this.model = null;
    this.metaFile = null;
    // this.requests = new RateLimitedQueue(5);
    this.fileSetQueue = [];
    this.sessionName = '';
    this.uploadSession = {};
    this.uppy
      .use(AwsS3, {
        limit: 5,
        uppy: this.uppy,
        getUploadParameters(file) {
          const { presignedPostData } = file.meta;
          const params = {
            methods: 'POST',
            url: presignedPostData.url,
            fields: presignedPostData.fields
          };
          return params;
        }
      })
      .on('upload', data => {
        this.uploaded = 0;
        this.dispatch({ type: 'SET_TOTAL', total: data.fileIDs.length });
        this.dispatch({ type: 'SHOW_PROGRESS', status: true });
      })
      .on('upload-retry', fileID => {
        this.uppy.retryUpload(fileID);
      })
      .on('upload-error', file => {
        // axios.post(`${BACKEND_URL}/api/v2/org-file/media-storage-ack`, {
        // 	file_id: file.meta.file_id,
        // 	upload_successful: false,
        // })
      })
      .on('upload-success', file => {
        this.uploaded += 1;
        this.dispatch({ type: 'UPDATE_UPLOADED' });
      });
    this.directUppy = new Uppy({
      id: 'directUppy',
      allowMultipleUploads: false,
      meta: { upload_session: 1, subscription: 1 }
    })
      .use(XHRUpload, {
        headers: {
          authorization: `Bearer ${user.accessToken}`
        },
        endpoint: `${BACKEND_URL}/api/v1/classif-ai/ml-model/`,
        method: 'POST',
        fieldName: 'files',
        formData: true,
        allowedMetaFields: [
          'name',
          'use_case',
          'subscription',
          'code',
          'type',
          'defects',
          'version',
          'status'
        ],
        bundle: true
      })

      .on('upload', data => {
        this.uploaded = 0;
        this.dispatch({ type: 'SET_TOTAL', total: data.fileIDs.length });
        this.dispatch({ type: 'SHOW_PROGRESS', status: true });
      })
      .on('upload-retry', fileID => {
        this.uppy.retryUpload(fileID);
      })
      .on('upload-error', file => {
        // axios.post(`${BACKEND_URL}/api/v2/org-file/media-storage-ack`, {
        // 	file_id: file.meta.file_id,
        // 	upload_successful: false,
        // })
      })
      .on('upload-success', file => {
        this.uploaded += 1;
        this.dispatch({ type: 'UPDATE_UPLOADED' });
      });

    this.uploadFiles = this.uploadFiles.bind(this);
    this.checkModelNameExists = this.checkModelNameExists.bind(this);
    // this.preProcessFiles = this.preProcessFiles.bind(this)
    // this.processFileSet = this.processFileSet.bind(this)
  }

  async checkModelNameExists(modelName, cb) {
    let err;
    let res;

    try {
      res = await api.checkModelName(modelName);
      this.sessionName = modelName;
    } catch (error) {
      err = error;
    } finally {
      cb(err, res.data.results.length > 0);
    }
  }

  async uploadFiles(useCase, value) {
    const data = {
      name: this.sessionName,
      use_case: useCase.id,
      subscription: this.subscription,
      code: new Date().toISOString(),
      defects: value.map(item => item.id),
      version: 1,
      status: 'ready_for_deployment',
      folder: []
    };
    if (process.env.REACT_APP_UPLOAD_TYPE === 'direct') {
      const files = this.directUppy.getFiles();
      this.directUppy.setMeta({ ...data });
      files.forEach(file => {
        let name = file.data.webkitRelativePath.split('/');
        name = name.splice(1);
        data.folder.push(name.join('/'));
        this.directUppy.setFileState(file.id, {
          xhrUpload: { fieldName: file.data.webkitRelativePath }
        });
      });
      this.directUppy.upload();
    } else {
      const files = this.uppy.getFiles();
      files.forEach(file => {
        let name = file.data.webkitRelativePath.split('/');
        name = name.splice(1);
        data.folder.push(name.join('/'));
      });
      await api.uploadModel(data).then(_ => {
        files.forEach(file => {
          let name = file.data.webkitRelativePath.split('/');
          name = name.splice(1);
          name = name.join('/');
          const temp = _.data.pre_signed_post_data[name];
          this.uppy.setFileMeta(file.id, {
            presignedPostData: temp
          });
        });
      });
      this.uppy.upload();
    }
  }
}
export default UploadModelService;
