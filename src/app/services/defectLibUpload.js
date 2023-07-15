import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import api from 'app/api';
import store from 'store/index';

// const RateLimitedQueue = require('@uppy/utils/lib/RateLimitedQueue');

const { user } = store.getState();

class DefectLibUpload {
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
      .use(AwsS3, {
        limit: 5,
        uppy: this.uppy1,
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
              fileSetId: data.files[0].id
            });
            return params;
          });
        }
      })
      .on('upload', data => {
        this.setLoading(true);
        this.uploaded = 0;
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
      .on('upload-success', file => {
        this.step2Ids.push(file.meta.fileSetId);
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
      .use(AwsS3, {
        id: 'form',
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
              fileSetId: data.files[0].id
            });
            return params;
          });
        }
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
      .on('upload-success', file => {
        this.step1Ids.push(file.meta.fileSetId);
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
export default DefectLibUpload;
