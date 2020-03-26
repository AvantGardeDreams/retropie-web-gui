import {Record} from 'immutable';
import * as actions from '../constants';

const InitialState = Record({
  isChecking: true,
  details: [],
});

const initialState = new InitialState;

export default function game(state = initialState, action) {
  if (typeof state == undefined) {
    return initialState;
  }

  switch (action.type) {
    case actions.GAME_DETAILS_SUCCESS:
    {
      return state.set('isChecking', false)
                  .set('details', action.payload);
    }
  }

  return state;
}
