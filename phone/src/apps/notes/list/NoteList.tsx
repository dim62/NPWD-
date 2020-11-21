import { List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

import { useNoteModal } from '../hooks/useNoteModal';
import { useNoteDetail } from '../hooks/useNoteDetail';

// add search bar later
const NoteList = ({ notes }) => {
  const { setNoteModal } = useNoteModal();
  const { setDetail } = useNoteDetail();

  const handleNoteModal = (note) => {
    setNoteModal(true);
    setDetail(note);
  };

  return (
    <List>
      {notes.map((note) => (
        <ListItem
          key={note.id}
          button
          divider
          onClick={() => handleNoteModal(note)}
        >
          <ListItemText>
            <strong>{note.title}</strong>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default NoteList;
