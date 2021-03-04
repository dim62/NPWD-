import React from 'react';
import { Box, makeStyles, Backdrop, Paper, BoxProps } from '@material-ui/core';
import { AppContentTypes } from '../interface/InterfaceUI';

const useStyles = makeStyles(() => ({
  wrapper: {
    flex: 1,
  },
  box: {
    width: '100%',
    height: '100%', // allow application to fill entireity of space
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    zIndex: 1,
  },
  paper: {
    width: '100%',
    height: '100%', // allow application to fill entireity of space
  },
}));

export const AppContent = ({
  children,
  style,
  backdrop,
  onClickBackdrop,
  ...props
}: AppContentTypes & BoxProps) => {
  const classes = useStyles();

  return (
    <Paper
      className={classes.wrapper}
      square
      style={backdrop ? { overflow: 'hidden' } : { overflow: 'auto' }}
    >
      <Backdrop className={classes.backdrop} open={backdrop || false} onClick={onClickBackdrop} />
      <Box flexGrow={1} className={classes.box} {...props}>
        <Paper square elevation={0} className={classes.paper}>
          {children}
        </Paper>
      </Box>
    </Paper>
  );
};
