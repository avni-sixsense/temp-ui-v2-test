import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import store from 'store/index';
import BACKEND_URL from 'store/constants/urls';

// const RateLimitedQueue = require('@uppy/utils/lib/RateLimitedQueue');

const { user } = store.getState();

class DefectLibDirectUpload {
  constructor(dispatch, subscription, setLoading) {
    this.uppy = new Uppy({
      allowMultipleUploads: true
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
    this.uppy1 = new Uppy({
      allowMultipleUploads: true
    });
    this.defect = undefined;
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
    this.step1Ids = [];
    this.step2Ids = [];
    this.handleNext = () => {};
    this.handleSave = () => {};
    this.nextClicked = false;
    this.saveClicked = false;
    this.setLoading = setLoading;
    this.uppy1
      .use(XHRUpload, {
        headers: {
          authorization: `Bearer ${user.accessToken}`
        },
        endpoint: `${BACKEND_URL}/api/v1/classif-ai/file-set/`,
        method: 'POST',
        fieldName: 'files',
        formData: true,
        allowedMetaFields: ['subscription']
      })
      .on('upload', data => {
        this.setLoading(true);
      })
      .on('upload-retry', fileID => {
        this.uppy1.retryUpload(fileID);
      })
      .on('upload-error', file => {
        // axios.post(`${BACKEND_URL}/api/v2/org-file/media-storage-ack`, {
        // 	file_id: file.meta.file_id,
        // 	upload_successful: false,
        // })
      })
      .on('upload-success', (file, response) => {
        this.step2Ids.push(response.body.files?.[0]?.id);
        this.uppy1.setFileMeta(file.id, {
          fileSetId: response.body.files?.[0]?.id
        });
      })
      .on('complete', () => {
        this.setLoading(false);
        if (this.saveClicked) {
          this.handleSave();
        } else {
          this.saveClicked = true;
        }
      });
    this.uppy
      .use(XHRUpload, {
        headers: {
          authorization: `Bearer ${user.accessToken}`
        },
        endpoint: `${BACKEND_URL}/api/v1/classif-ai/file-set/`,
        method: 'POST',
        fieldName: 'files',
        formData: true,
        allowedMetaFields: ['subscription']
      })
      .on('upload', data => {
        this.setLoading(true);
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
      .on('upload-success', (file, response) => {
        this.step1Ids.push(response.body.files?.[0]?.id);
        this.uppy.setFileMeta(file.id, {
          fileSetId: response.body.files?.[0]?.id
        });
      })
      .on('file-removed', file => {
        this.step1Ids.push(file.meta.fileSetId);
      })
      .on('complete', () => {
        this.setLoading(false);
        if (this.nextClicked) {
          this.handleNext();
        } else {
          this.nextClicked = true;
        }
      });

    this.uploadFiles = this.uploadFiles.bind(this);
    this.uploadFormFiles = this.uploadFormFiles.bind(this);
    this.uploadMetaFiles = this.uploadMetaFiles.bind(this);
    this.reset = this.reset.bind(this);
    // this.preProcessFiles = this.preProcessFiles.bind(this)
    // this.processFileSet = this.processFileSet.bind(this)
  }

  reset() {
    this.nextClicked = false;
    this.saveClicked = false;
  }

  async uploadFiles() {
    const files = this.uppy.getFiles();
    files.forEach(file => {
      this.uppy.setFileMeta(file.id, {
        subscription: this.subscription
      });
    });
    this.uppy.upload();
  }

  async uploadFormFiles(data) {
    const files = this.uppy1.getFiles();
    files.forEach(file => {
      this.defect = data.id;
      this.uppy1.setFileMeta(file.id, {
        presignedPostData: data.pre_signed_post_data[file.name]
      });
    });
    this.uppy1.upload();
  }

  async uploadMetaFiles() {
    const files = this.uppy1.getFiles();
    files.forEach(file => {
      this.uppy1.setFileMeta(file.id, {
        subscription: this.subscription
      });
    });
    this.uppy1.upload();
  }
}
export default DefectLibDirectUpload;
