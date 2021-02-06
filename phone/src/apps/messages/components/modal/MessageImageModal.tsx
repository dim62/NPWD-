import React, { useCallback, useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import Nui from '../../../../os/nui-events/utils/Nui';
import Modal from '../../../../ui/components/Modal';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import useStyles from './modal.styles';
import { useHistory, useLocation } from 'react-router-dom';
import { ContextMenu } from '../../../../ui/components/ContextMenu';
import { deleteQueryFromLocation } from '../../../../common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';

interface IProps {
  isOpen: boolean;
  messageGroupId: string | undefined;
  onClose(): void;
  image?: string;
}

export const MessageImageModal = ({
  isOpen,
  messageGroupId,
  onClose,
  image,
}: IProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { pathname, search } = useLocation();

  const [message, setMessage] = useState('');
  const [pasteVisible, setPasteVisible] = useState(false);
  const [queryParamImagePreview, setQueryParamImagePreview] = useState(null);

  const sendImageMessage = useCallback(
    (m) => {
      Nui.send('phone:sendMessage', {
        groupId: messageGroupId,
        message: m,
      });
      onClose();
    },
    [messageGroupId, onClose]
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      setQueryParamImagePreview(null);
      sendImageMessage(image);

      console.log('++++', { pathname, search });
      history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
    },
    [history, pathname, search, sendImageMessage]
  );

  useEffect(() => {
    if (!image) return;
    setQueryParamImagePreview(image);
  }, [image, sendFromQueryParam]);

  const sendFromClipboard = (event) => {
    if (event.key === 'Enter') {
      sendImageMessage(message);
    }
  };

  const menuOptions = useMemo(
    () => [
      {
        label: 'Paste from clipboard',
        icon: <FileCopyIcon />,
        onClick: () => setPasteVisible(true),
      },
      {
        label: 'Camera / Gallery',
        icon: <PhotoLibraryIcon />,
        onClick: () =>
          history.push(
            `/camera?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`
          ),
      },
    ],
    [history, pathname, search]
  );

  return (
    <>
      <ContextMenu open={isOpen} options={menuOptions} onClose={onClose} />
      <Modal
        visible={queryParamImagePreview}
        handleClose={() => setQueryParamImagePreview(null)}
      >
        <Box py={1}>
          <Typography paragraph>Do you want to share this image?</Typography>
          <PictureResponsive
            src={queryParamImagePreview}
            alt={'Share gallery image preview'}
          />
          <Button
            fullWidth
            variant='contained'
            onClick={() => sendFromQueryParam(queryParamImagePreview)}
          >
            Share
          </Button>
        </Box>
      </Modal>
      <Modal visible={pasteVisible} handleClose={() => setPasteVisible(false)}>
        <div>
          <TextField
            placeholder='A link to your image or gif'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className={classes.input}
            inputProps={{
              className: classes.messagesInput,
            }}
            inputRef={(input) => input && input.focus()}
            onKeyPress={sendFromClipboard}
          />
        </div>
      </Modal>
    </>
  );
};
