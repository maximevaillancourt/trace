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

export function updateProductIdToView(productId) {
  return {
    type: types.UPDATE_PRODUCT_ID_TO_VIEW,
    payload: productId
  };
}

function hideAlert() {
  return {
    type: types.HIDE_ALERT,
  };
}

function showAlertWithContent({color, content}) {
  return {
    type: types.SHOW_ALERT_WITH_CONTENT,
    payload: {
      color: color,
      content: content
    }
  };
}

export function createAlert({color, content}) {
  return dispatch => {
    dispatch(showAlertWithContent({color, content}))

    /*
    // hide alert after 5 seconds
    setTimeout(() => {
      dispatch(hideAlert())
    }, 5000)
    */
  }
}
  