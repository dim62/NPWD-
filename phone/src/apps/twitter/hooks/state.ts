import { atom } from 'recoil';

export const twitterState = {
  profile: atom({
    key: 'profile',
    default: null,
  }),
  tweets: atom({
    key: 'tweets',
    default: null,
  }),
  filteredTweets: atom({
    key: 'filteredTweets',
    default: null,
  }),
  showCreateTweetModal: atom({
    key: 'showCreateTweetModal',
    default: false,
  }),
  modalMessage: atom({
    key: 'modalMessage',
    default: '',
  }),
  createTweetLoading: atom({
    key: 'createTweetLoading',
    default: false,
  }),
  createTweetSuccessful: atom({
    key: 'createTweetSuccessful',
    default: null,
  }),
  updateProfileLoading: atom({
    key: 'updateProfileLoading',
    default: false,
  }),
  updateProfileSuccess: atom({
    key: 'updateProfileSuccess',
    default: null,
  }),
  unreadTweetsCount: atom({
    key: 'unreadTweetsCount',
    default: 0,
  }),
};
