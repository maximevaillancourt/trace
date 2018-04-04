import * as types from './actionTypes';

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