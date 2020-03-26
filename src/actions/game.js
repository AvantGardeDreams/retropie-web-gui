import fetch from 'isomorphic-fetch';

import { GAME_DETAILS } from '../constants';

export function details(system, game) {
  return {
    type: GAME_DETAILS,
    payload: new Promise(resolve => {
      fetch(`/api/${system}/${game}`).then(response => {
        resolve(response.json());
      });
    })
  };
}

