import React from 'react';
import { ContactList } from '../List/ContactList';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { ContactAlert } from '../alert/ContactAlert';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  icon: {
    color: '#fff',
    fontSize: 30,
  },
}));

export const ContactPage = () => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <>
      <ContactList />
      <Fab
        onClick={() => history.push('/contacts/add')}
        style={{ backgroundColor: '#2196f3', color: '#fff' }}
        className={classes.absolute}
      >
        <PersonAddIcon />
      </Fab>
      <ContactAlert />
    </>
  );
};
