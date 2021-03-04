import React, { useEffect } from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MessageModal } from './modal/MessageModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import NewMessageGroupButton from './form/NewMessageGroupButton';
import Nui from '../../../os/nui-events/utils/Nui';
import { MessagesThemeProvider } from '../providers/MessagesThemeProvider';

export const MessagesApp = () => {
  const messages = useApp('MESSAGES');
  const history = useHistory();

  useEffect(() => {
    Nui.send('phone:fetchMessageGroups');
  }, []);

  return (
    <MessagesThemeProvider>
      <AppWrapper id="messages-app">
        <AppTitle app={messages} />
        <AppContent>
          <Switch>
            <Route path="/messages/conversations/:groupId" component={MessageModal} />
            <Route
              exact
              path="/messages"
              render={() => (
                <>
                  <MessagesList />
                </>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={['/messages/new/:phoneNumber', '/messages/new']}
              render={() => <MessageGroupModal />}
            />
          </Switch>
        </AppContent>
        <NewMessageGroupButton onClick={() => history.push('/messages/new')} />
      </AppWrapper>
    </MessagesThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'MESSAGES',
    method: 'phone:fetchMessagesSuccess',
    data: [
      {
        id: 1,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 2,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 3,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 4,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 5,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        isRead: true,
        groupId: '2',
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 6,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 7,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: true,
        updatedAt: Date.now(),
      },
      {
        id: 8,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
      {
        id: 9,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        groupId: '2',
        isRead: true,
        isMine: true,
        updatedAt: Date.now(),
      },
    ],
  },
  {
    app: 'MESSAGES',
    method: 'phone:fetchMessageGroupsSuccess',
    data: [
      {
        groupId: '2',
        groupDisplay: 'dev-chat',
        isGroupChat: true,
        avatar: null,
        label: null,
        updatedAt: Date.now(),
        unreadCount: 3,
      },
      {
        groupId: '3',
        groupDisplay: 'Chip',
        isGroupChat: true,
        avatar: null,
        label: null,
        updatedAt: Date.now(),
        unreadCount: 0,
      },
    ],
  },
]);

InjectDebugData(
  [
    {
      app: 'MESSAGES',
      method: 'createMessagesBroadcast',
      data: {
        groupId: '2',
        number: '777-7777',
        message: 'Hi! Just checking in on you!',
      },
    },
    {
      app: 'MESSAGES',
      method: 'createMessagesBroadcast',
      data: {
        groupId: '2',
        number: 'Kidz',
        message: 'Hi! You are awesome!',
      },
    },
    {
      app: 'MESSAGES',
      method: 'createMessagesBroadcast',
      data: {
        groupId: '3',
        number: 'Kidz',
        message: 'I am testing this like crazy',
      },
    },
  ],
  3000
);
