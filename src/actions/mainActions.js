import * as types from './actionTypes';

export function updateName(name) {
  return {
    type: types.UPDATE_NEW_PRODUCT_NAME,
    payload: name
  };
}

export function updateDescription(description) {
  return {
    type: types.UPDATE_NEW_PRODUCT_DESCRIPTION,
    payload: description
  };
}

export function updateLocation(location) {
  return {
    type: types.UPDATE_NEW_PRODUCT_LOCATION,
    payload: location
  };
}

export function setWeb3Instance(web3) {
  return {
    type: types.SET_WEB3_INSTANCE,
    payload: web3
  };
}

export function setPassageInstance(passage) {
  return {
    type: types.SET_PASSAGE_INSTANCE,
    payload: passage
  };
}

export function setWeb3Accounts(web3Accounts) {
  return {
    type: types.SET_WEB3_ACCOUNTS,
    payload: web3Accounts
  };
}

export function addProduct(product) {
  return {
    type: types.ADD_PRODUCT,
    payload: product
  };
}

// use this as a thunk template
export function fetchStuff() {
  return dispatch => {
    /*
    return fetch(url(), {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(receiveStuff(json)));
    */
  };
}