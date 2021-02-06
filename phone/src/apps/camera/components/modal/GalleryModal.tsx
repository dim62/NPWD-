import React, { useMemo, useState, useCallback } from 'react';
import useStyles from './modal.styles';
import { Button, Paper } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { ICameraPhoto } from '../../hooks/usePhotos';
import { ShareModal } from './ShareModal';

export const GalleryModal = ({ referal = '/camera' }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = useQueryParams();

  const [shareOpen, setShareOpen] = useState(null);

  const meta: ICameraPhoto = useMemo(
    () => ({ id: query.id as string, image: query.image as string }),
    [query]
  );

  const _handleClose = () => {
    history.goBack();
  };

  const handleDeletePhoto = useCallback(() => {
    Nui.send('photo:deletePhoto', {
      id: meta.id,
    });
    history.push(referal);
  }, [history, meta.id, referal]);

  const handleSharePhoto = useCallback(() => {
    setShareOpen(meta);
  }, [meta]);

  if (!meta) return null;

  return (
    <>
      <ShareModal meta={shareOpen} onClose={() => setShareOpen(null)} />
      <Paper className={classes.modal}>
        <div className={shareOpen ? classes.backgroundModal : null} />
        <Button onClick={_handleClose}>
          <ArrowBackIcon />
        </Button>
        <div
          className={classes.image}
          style={{ backgroundImage: `url(${meta.image})` }}
        />
        <div className={classes.actionDiv}>
          <Button onClick={handleDeletePhoto}>
            <DeleteIcon fontSize='large' />
          </Button>
          <Button onClick={handleSharePhoto}>
            <ShareIcon fontSize='large' />
          </Button>
        </div>
      </Paper>
    </>
  );
};
