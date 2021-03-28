import React from 'react';
import { AppWrapper } from '../../../ui/components/AppWrapper';
import { AppContent } from '../../../ui/components/AppContent';
import { MarketplaceTitle } from './MarketplaceTitle';
import { MarketplaceListContainer } from './SelloutList/MarketplaceListContainer';
import { NavigationBar } from './navigation/NavigationBar';
import { Switch, Route } from 'react-router-dom';
import { ListingFormContainer } from './form/ListingFormContainer';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { MarketplaceThemeProvider } from '../providers/MarketplaceThemeProvider';

export const MarketplaceApp = () => {
  return (
    <MarketplaceThemeProvider>
      <AppWrapper id="sellout-app">
        <MarketplaceTitle />
        <AppContent>
          <Switch>
            <Route path="/marketplace" exact component={MarketplaceListContainer} />
            <Route path="/marketplace/new" component={ListingFormContainer} />
          </Switch>
        </AppContent>
        <NavigationBar />
      </AppWrapper>
    </MarketplaceThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'SELLOUT',
    method: 'setListings',
    data: [
      {
        id: 1,
        name: 'Some guy',
        number: '111-1134',
        title: 'eeeeeeeeeeeeeeeeeeeeeeeee',
        description:
          'skldfsd sajsfjklsdfj sdajsklfjdsjklas jskj sdjsd jasdkl sdjsf jasdklsfjfj kljasdkf jkaf jsdkla jsk jdkla j kljasdkf jkld jasd kljk',
        url: 'https://beta.iodine.gg/706Y3.jpeg',
      },
      {
        id: 2,
        name: 'Some other dude',
        number: '666-6666',
        title: 'Material',
        description: 'Selling my wife',
        url: '',
      },
    ],
  },
]);
