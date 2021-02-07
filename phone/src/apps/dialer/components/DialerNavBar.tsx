import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { NavLink, useLocation } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonIcon from '@material-ui/icons/Person';
import HistoryIcon from '@material-ui/icons/History';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    color: '#43a047',
  },
}));

const DialerNavBar = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [page, setPage] = useState(pathname);

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation
      value={page}
      onChange={handleChange}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label='History'
        value='/phone'
        component={NavLink}
        icon={<HistoryIcon />}
        to='/phone'
      />
      <BottomNavigationAction
        label='Dial'
        value='/phone/dial'
        color="secondary"
        component={NavLink}
        icon={<PhoneIcon />}
        to='/phone/dial'
      />
      <BottomNavigationAction
        label='Contacts'
        value='/phone/contacts'
        color="secondary"
        component={NavLink}
        icon={<PersonIcon />}
        to='/phone/contacts'
      />
    </BottomNavigation>
  );
};

export default DialerNavBar;
