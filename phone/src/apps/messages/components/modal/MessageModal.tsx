import React, { useEffect, useState } from 'react';
import {
  Slide,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import Modal from '../../../../ui/components/Modal';
import { useMessagesState } from '../../hooks/state';
import { makeStyles } from '@mui/styles';
import { useMessageAPI } from '../../hooks/useMessageAPI';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

const useStyles = makeStyles({
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
  tooltip: {
    fontSize: 12,
  },
  modalHide: {
    display: 'none',
  },
  groupdisplay: {
    width: '300px',
    paddingTop: '8px',
    fontSize: '24px',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  largeGroupDisplay: {
    width: '300px',
    paddingTop: '8px',
    fontSize: '20px',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
});

// abandon all hope ye who enter here
export const MessageModal = () => {
  const [t] = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { pathname } = useLocation();
  const { groupId } = useParams<{ groupId: string }>();
  const { activeMessageConversation, setActiveMessageConversation } = useMessages();
  const { fetchMessages } = useMessageAPI();

  const { getContactByNumber, getDisplayByNumber } = useContactActions();
  const [messages, setMessages] = useMessagesState();
  const { deleteConversation } = useMessageAPI();

  const [isLoaded, setLoaded] = useState(false);
  // Multiselect
  const [groupActionsOpen, setGroupActionsOpen] = useState(false);

  useEffect(() => {
    fetchMessages(groupId, 0);
  }, [groupId, fetchMessages]);

  useEffect(() => {
    if (activeMessageConversation && messages) {
      setTimeout(() => {
        setLoaded(true);
      }, MINIMUM_LOAD_TIME);
      return;
    }
    setLoaded(false);
  }, [activeMessageConversation, messages]);

  const closeModal = () => {
    setMessages(null);
    history.push('/messages');
  };

  useEffect(() => {
    if (!groupId) return;
    setActiveMessageConversation(groupId);
  }, [groupId, setActiveMessageConversation]);

  useEffect(() => {
    if (isLoaded) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [isLoaded]);

  // We need to wait for the active conversation to be set.
  if (!activeMessageConversation)
    return (
      <div>
        <CircularProgress />
      </div>
    );

  // don't allow too many characters, it takes too much room
  let header =
    getDisplayByNumber(activeMessageConversation.phoneNumber) ||
    activeMessageConversation.phoneNumber;
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? classes.largeGroupDisplay : classes.groupdisplay;

  const handleAddContact = (number) => {
    const exists = getContactByNumber(number);
    const referal = encodeURIComponent(pathname);
    if (exists) {
      return history.push(`/contacts/${exists.id}/?referal=${referal}`);
    }
    return history.push(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
  };

  const handleDeleteConversation = () => {
    history.push('/messages');
    deleteConversation([groupId]);
  };

  const targetNumber = activeMessageConversation.phoneNumber;

  return (
    <>
      <Modal visible={groupActionsOpen} handleClose={() => setGroupActionsOpen(false)}>
        <Box>
          <Button variant="contained" color="primary" onClick={handleDeleteConversation}>
            {t('MESSAGES.DELETE_CONVERSATION')}
          </Button>
        </Box>
      </Modal>
      <Slide direction="left" in={!!activeMessageConversation}>
        <Paper
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexGrow: 1,
            overflowY: 'hidden',
            flexDirection: 'column',
          }}
        >
          <div className={groupActionsOpen ? classes.backgroundModal : undefined} />
          <Box display="flex" justifyContent="space-between" component={Paper}>
            <Button onClick={closeModal}>
              <ArrowBackIcon fontSize="large" />
            </Button>
            <Typography variant="h5" className={headerClass}>
              {header}
            </Typography>
            <Tooltip
              classes={{ tooltip: classes.tooltip }}
              title={t('MESSAGES.ACTIONS_TITLE')}
              placement="left"
            >
              <IconButton onClick={() => setGroupActionsOpen(true)}>
                <MoreVertIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            {getDisplayByNumber(targetNumber) === targetNumber ? (
              <Button>
                <PersonAddIcon onClick={() => handleAddContact(targetNumber)} fontSize="large" />
              </Button>
            ) : null}
          </Box>
          {isLoaded && activeMessageConversation ? (
            <Conversation messages={messages} activeMessageGroup={activeMessageConversation} />
          ) : (
            <MessageSkeletonList />
          )}
        </Paper>
      </Slide>
    </>
  );
};
