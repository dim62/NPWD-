import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { Route, Switch } from 'react-router-dom';

InjectDebugData([
  {
    app: 'CAMERA',
    method: 'setPhotos',
    data: [
      {
        id: 1,
        image: 'https://i.imgur.com/OO8wx6Z.jpg',
      },
      {
        id: 1,
        image: 'https://i.imgur.com/pqGBiST.jpg',
      },
    ],
  },
]);

const CameraApp = () => {
  const query = useQueryParams();

  const referal = (query.referal as string) || '/camera';

  return (
    <AppWrapper id='camera-app'>
      <AppContent>
        <Switch>
          <Route path='/camera' exact component={GalleryGrid} />
          <Route
            path='/camera/image'
            exact
            render={() => <GalleryModal referal={referal} />}
          />
        </Switch>
      </AppContent>
    </AppWrapper>
  );
};

export default CameraApp;
