import fetch from 'isomorphic-fetch';

import { FETCH_LIST, DELETE_FILE, DOWNLOAD_FILE } from '../constants';

export function list(system) {
  return {
    type: FETCH_LIST,
    payload: new Promise(resolve => {
      fetch(`/api/list/${system}`).then(response => {
        resolve(response.json());
      });
    })
  };
}

export function downloadFile(system, file) {
  const payload = {
    method: 'GET'
  }

  return {
    type: DOWNLOAD_FILE,
    payload: new Promise(resolve => {
      fetch(`/api/downloadfile/${system}/${file}`, payload).then(response => {
        resolve(response.json());
      });
    })
  };
}

export function deleteFile(system, file) {
  const formData  = new FormData();

  formData.append('file', file);

  const payload = {
    method: 'POST',
    body: formData,
  };

  return {
    type: DELETE_FILE,
    payload: new Promise(resolve => {
      fetch(`/api/deletefile/${system}`, payload).then(response => {
        resolve(response.json());
      });
    })
  };
}
