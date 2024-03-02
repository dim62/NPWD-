import React, { Fragment } from 'react';
import { AppIcon } from './AppIcon';
import { Box, Grid, GridSize } from '@mui/material';
import { Link } from 'react-router-dom';
import { IApp } from '@os/apps/config/apps';

interface GridMenuProps {
  items: IApp[];
  Component?: React.ElementType;
  xs?: GridSize;
}

export const GridMenu: React.FC<GridMenuProps> = ({ items, Component = AppIcon, xs }) => {
  return (
    <div className="grid grid-cols-4 gap-y-4">
      {items &&
        items.length &&
        items.map((item) => (
          <Fragment key={item.id}>
            {!item.isDisabled && (
              <Grid item xs={xs} key={item.id}>
                <Box textAlign="center">
                  <Link to={item.path}>
                    <Component {...item} />
                  </Link>
                </Box>
              </Grid>
            )}
          </Fragment>
        ))}
    </div>
  );
};
