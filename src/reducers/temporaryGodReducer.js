import initialState from './initialState';
import * as types from '../actions/actionTypes';

// TODO: split into multiple (cleaner) reducers
// see best practices here: https://medium.com/@kylpo/redux-best-practices-eef55a20cc72
export default function temporaryGodReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_NEW_PRODUCT_DESCRIPTION:
      return Object.assign({}, state, {
        description: action.payload
      });
    case types.UPDATE_NEW_PRODUCT_NAME:
      return Object.assign({}, state, {
        name: action.payload
      });
    case types.UPDATE_NEW_PRODUCT_LOCATION:
      return Object.assign({}, state, {
        location: action.payload
      });
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
    case types.ADD_PRODUCT:
      return Object.assign({}, state, {
        products: [...state.products, action.payload]
      });
    case types.UPDATE_PRODUCT_ID_TO_VIEW:
      return Object.assign({}, state, {
        productIdToView: action.payload
      });
    default:
      return state;
  }
}