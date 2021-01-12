import { atom } from 'recoil';

export const bankState = {
  transactions: atom({
    key: 'transactionList',
    default: [],
  }),
  bankModal: atom({
    key: 'modalVisibility',
    default: false,
  }),
  transferSuccessful: atom({
    key: 'bankAlert',
    default: null,
  }),
  bankCredentials: atom({
    key: 'bankCredentails',
    default: null,
  }),
  notification: atom({
    key: 'bankNotification',
    default: null,
  }),
};
