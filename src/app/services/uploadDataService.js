import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import api from 'app/api';
import BACKEND_URL from 'store/constants/urls';
import { refreshToken } from 'app/utils/refreshToken';

class MyPlugin extends XHRUpload {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'example';
    this.id = 'MyPlugin';
    this.prepareUpload = this.prepareUpload.bind(this);
  }

  async prepareUpload() {
    this.opts.headers.authorization = `Bearer ${await refreshToken()}`;
    return Promise.resolve();
  }

  install() {
    this.uppy.addPreProcessor(this.prepareUpload);
    this.uppy.addUploader(this.handleUpload);
  }

  uninstall() {
    this.uppy.removePreProcessor(this.prepareUpload);
  }
}

class UploadDataService {
  constructor() {
    this.shouldRetry = false;

    this.uppy = new Uppy({ allowMultipleUploads: false });

    this.uppy.use(AwsS3, {
      limit: 5,
      uppy: this.uppy,
      getUploadParameters: file => {
        if (
          !this.shouldRetry ||
          !this.uppy.store.state.files[file.id].meta.AWSAccessKeyId
        ) {
          const postData = {
            upload_session: file.meta.sessionId,
            subscription: file.meta.subscription,
            files: [{ name: file.name }]
          };

          return api.uploadFiles(postData).then(_ => {
            const { data } = _;
            const presignedPostData = data.files[0].pre_signed_post_data;

            const params = {
              methods: 'POST',
              url: presignedPostData.url,
              fields: presignedPostData.fields
            };

            this.uppy.setFileMeta(file.id, { fileSetId: data.id });

            return params;
          });
        } else {
          const currentFile = this.uppy.store.state.files[file.id];
          const { AWSAccessKeyId, key, policy, signature } = currentFile.meta;
          const fields = { AWSAccessKeyId, key, policy, signature };

          return {
            methods: 'POST',
            url: currentFile.xhrUpload.endpoint,
            fields
          };
        }
      }
    });

    this.directUppy = new Uppy({
      id: 'direct-uppy',
      allowMultipleUploads: false
    });

    this.directUppy.use(MyPlugin, {
      endpoint: `${BACKEND_URL}/api/v1/classif-ai/file-set/`,
      method: 'POST',
      fieldName: 'files',
      formData: true,
      allowedMetaFields: ['upload_session', 'subscription'],
      limit: 2,
      withCredentials: true
    });

    this.uppyCurrent =
      process.env.REACT_APP_UPLOAD_TYPE === 's3' ? this.uppy : this.directUppy;

    this.uppyCurrent.once('complete', ({ failed }) => {
      if (failed.length > 0) {
        this.shouldRetry = true;
      }
    });
  }
}
export default UploadDataService;
