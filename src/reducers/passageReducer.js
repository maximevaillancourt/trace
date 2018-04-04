import initialState from './initialState';
import * as types from '../actions/actionTypes';

// TODO: split into multiple (cleaner) reducers
// see best practices here: https://medium.com/@kylpo/redux-best-practices-eef55a20cc72
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_WEB3_INSTANCE:
      return Object.assign({}, state, {
        web3: action.payload
      });
    case types.SET_WEB3_ACCOUNTS:
      return Object.assign({}, state, {
        web3Accounts: action.payload
      });
    case types.SET_PASSAGE_INSTANCE:
      return Object.assign({}, state, {
        passageInstance: action.payload
      });
    default:
      return state;
  }
}