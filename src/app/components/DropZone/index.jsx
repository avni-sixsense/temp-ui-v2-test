import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import path from 'path';

import WithSpinner from 'app/hoc/WithSpinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/pro-solid-svg-icons';

import classes from './DropZone.module.scss';

function getFilesWebkitDataTransferItems(
  dataTransferItems,
  acceptedFileTypes = []
) {
  const folders = {};
  const result = [{ folderName: '', files: [] }];
  let i = 0;

  function traverseFileTreePromise(item, currentPath = '') {
    return new Promise((resolve, reject) => {
      if (item.isFile) {
        const folder = currentPath.split(path.sep)[0];

        if (folders[folder] === undefined) {
          folders[folder] = i;
          i += 1;

          result[folders[folder]] = { folderName: folder, files: [] };
        }

        item.file(file => {
          if (acceptedFileTypes.includes(file.type)) {
            result[folders[folder]].files.push(file);
            resolve(file);
          } else {
            const error = new Error('Unsupported file type');
            result[folders[folder]].files.push(error);
            reject(error);
          }
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();

        const allFiles = [];

        const readEntries = () => {
          dirReader.readEntries(entries => {
            if (entries.length) {
              allFiles.push(...entries);
              readEntries();
            } else {
              const entriesPromises = [];

              // eslint-disable-next-line no-restricted-syntax
              for (const entr of allFiles) {
                entriesPromises.push(
                  traverseFileTreePromise(
                    entr,
                    currentPath + item.name + path.sep
                  )
                );
              }

              resolve(Promise.allSettled(entriesPromises));
            }
          });
        };

        readEntries();
      }
    });
  }

  return new Promise(resolve => {
    const entriesPromises = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const it of dataTransferItems) {
      entriesPromises.push(traverseFileTreePromise(it.webkitGetAsEntry()));
    }

    Promise.allSettled(entriesPromises).then(() => {
      resolve(result);
    });
  });
}

function emitResult(files, isFoldersUpload = false) {
  const folders = {};
  const result = [{ folderName: '', files: [] }];
  let i = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    if (isFoldersUpload) {
      const folder = file.webkitRelativePath.split(path.sep)[0];

      if (folders[folder] === undefined) {
        folders[folder] = i;
        i += 1;

        result[folders[folder]] = { folderName: folder, files: [] };
      }

      result[folders[folder]].files.push(file);
    } else {
      result[i].files.push(file);
    }
  }

  return result;
}

const DropZone = ({
  acceptedFileTypes,
  isFoldersUpload = false,
  onUploadStart,
  onUploadEnd,
  label,
  isMultiUpload = true,
  disabled = false
}) => {
  const [hoverState, setHoverState] = useState(false);

  const inputRef = useRef(null);

  const onDragOver = event => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) setHoverState(true);
  };

  const onDrop = async event => {
    event.preventDefault();
    event.stopPropagation();

    if (hoverState) setHoverState(false);

    // eslint-disable-next-line no-unused-expressions
    onUploadStart?.();

    const items = isMultiUpload
      ? event.dataTransfer.items
      : [event.dataTransfer.items[0]];

    return onUploadEnd?.(
      await getFilesWebkitDataTransferItems(items, acceptedFileTypes)
    );
  };

  const onDragLeave = event => {
    event.preventDefault();
    event.stopPropagation();

    if (hoverState) setHoverState(false);
  };

  const onInputChange = event => {
    // eslint-disable-next-line no-unused-expressions
    onUploadStart?.();
    return onUploadEnd?.(emitResult(event.target.files, isFoldersUpload));
  };

  const additionalInputProps = isFoldersUpload
    ? { directory: '', webkitdirectory: '', mozdirectory: '' }
    : { accept: acceptedFileTypes?.join(',') };

  return (
    <>
      <input
        type='file'
        ref={inputRef}
        className={classes.input}
        multiple={isMultiUpload}
        {...additionalInputProps}
        onChange={onInputChange}
      />

      <div
        aria-hidden
        className={clsx(classes.container, hoverState && classes.hover)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faFileUpload} className={classes.icon} />
        <span className={classes.label}>
          {label || 'Drag the images or click to choose files and upload'}
        </span>
      </div>
    </>
  );
};

export default WithSpinner(DropZone);
