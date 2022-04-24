import React, { useState } from 'react';
import Modal from '@ui/components/Modal';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TextField } from '@ui/components/Input';
import { Button } from '@ui/components/Button';

interface NewChannelModalProps {
  open: boolean;
  closeModal: () => void;
}

export const NewChannelModal: React.FC<NewChannelModalProps> = ({ open, closeModal }) => {
  const [channelValue, setChannelValue] = useState<string>('');
  const [t] = useTranslation();

  return (
    <Modal visible={open} handleClose={closeModal}>
      <Typography>{t('DARKCHAT.NEW_CHANNEL_TITLE')}</Typography>
      <Box mt={3} mb={2}>
        <TextField
          fullWidth
          placeholder={t('DARKCHAT.NEW_CHANNEL_INPUT_PLACEHOLDER')}
          value={channelValue}
          onChange={(e) => setChannelValue(e.currentTarget.value)}
        />
      </Box>

      <Button variant="contained">{t('DARKCHAT.JOIN_BUTTON')}</Button>
    </Modal>
  );
};
