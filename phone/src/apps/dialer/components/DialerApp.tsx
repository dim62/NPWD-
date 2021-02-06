import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { DialerHistory } from './views/DialerHistory';
import { useApp } from '../../../os/apps/hooks/useApps';
import { Switch, Route } from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { useDialHistory } from '../hooks/useDialHistory';
import InjectDebugData from '../../../os/debug/InjectDebugData';

InjectDebugData([
  {
    app: 'DAILER',
    method: 'setHistory',
    data: [
      {
        id: 1,
        transmitter: '636-6496',
        start: 1612301545782,
      },
      {
        id: 2,
        transmitter: '777-7777',
        start: 1612301545782,
      },
    ],
  },
]);

export const DialerApp = () => {
  const history = useDialHistory();

  const dialer = useApp('DIALER');
  return (
    <AppWrapper>
      <AppTitle app={dialer} />
      <AppContent>
        <Switch>
          <Route path='/phone/dial'>
            <DialPage />
          </Route>
          <Route path='/phone'>
            <DialerHistory calls={history} />
          </Route>
          {/*<Route path='/phone/contacts'></Route>*/}
        </Switch>
      </AppContent>
      <DialerNavBar />
    </AppWrapper>
  );
};
