import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { ContactList } from './List/ContactList';
import { useApp } from '../../../os/apps/hooks/useApps';
import { AddContactModal } from './ContactModal';
import { useModal } from '../hooks/useModal';
import { SearchContacts } from './List/SearchContacts';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Fab from '@material-ui/core/Fab';
import { InfoModal } from './modal/InfoModal';
import { useContactDetail } from '../hooks/useContactDetail';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backgroundModal: {
      background: 'black',
      opacity: '0.6',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 5,
    },
    absolute: {
      position: 'sticky',
      bottom: theme.spacing(2),
      left: theme.spacing(3),
    },
  })
);

export const ContactsApp = () => {
  const classes = useStyles();
  const { showModal, setShowModal } = useModal();
  const contacts = useApp('CONTACTS');
  const { contactDetail } = useContactDetail();

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <AppWrapper id='contact-app'>
      <AppTitle app={contacts}></AppTitle>
      <SearchContacts />
      <AddContactModal />
      <InfoModal key={contactDetail?.id} />
      <div className={showModal ? classes.backgroundModal : undefined} />
      <AppContent>
        <ContactList />
        <Fab
          onClick={openModal}
          style={{ backgroundColor: '#2196f3', color: '#fff' }}
          className={classes.absolute}
        >
          <PersonAddIcon />
        </Fab>
      </AppContent>
    </AppWrapper>
  );
};
