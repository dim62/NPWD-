import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { IApp } from '@os/apps/config/apps';
import { SnackbarContent, CustomContentProps } from 'notistack';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const StyledMessage = styled('div')({
  color: 'white',
  fontSize: 16,
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  overflow: 'hidden',
  boxOrient: 'vertical',
  lineClamp: 2,
});

interface NotificationBaseProps extends CustomContentProps {
  app: IApp;
  secondaryTitle?: string;
  path?: string;
  onClick?: () => void;
}

export type NotificationBaseComponent = React.FC<NotificationBaseProps>;

const StyledSnackbar = styled(SnackbarContent)({
  padding: '14px 16px',
  display: 'flex',
  background: 'rgba(38,38,38,0.85) !important',
  borderRadius: '12px !important',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  backdropFilter: 'blur(4px)',
});

const NotificationBase = forwardRef<HTMLDivElement, NotificationBaseProps>((props, ref) => {
  const { app, message, secondaryTitle, path, onClick } = props;
  const [t] = useTranslation();
  const history = useHistory();

  const handleNotisClick = () => {
    path ? history.push(path) : onClick();
  };

  return (
    <StyledSnackbar onClick={handleNotisClick} ref={ref} style={{ minWidth: '340px' }}>
      <Box display="flex" alignItems="center" color="white" width="100%" mb={0.7}>
        <Box
          p="5px"
          borderRadius={30}
          bgcolor={app.backgroundColor}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <app.NotificationIcon fontSize="inherit" />
        </Box>
        <Box color="#bfbfbf" fontWeight={400} paddingLeft={1} flexGrow={1} fontSize={16}>
          {t(app.nameLocale)}
        </Box>
        <Box>
          <Typography color="#bfbfbf">{secondaryTitle}</Typography>
        </Box>
      </Box>
      <StyledMessage>{message}</StyledMessage>
    </StyledSnackbar>
  );
});

export default NotificationBase;
