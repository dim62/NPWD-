export type AlertCategory =
  | 'NOTES_ADD_SUCCESS'
  | 'NOTES_ADD_FAILED'
  | 'NOTES_UPDATE_SUCCESS'
  | 'NOTES_UPDATE_FAILED'
  | 'NOTES_DELETE_SUCCESS'
  | 'NOTES_DELETE_FAILED';

export interface INotesAlert {
  alert: AlertCategory;
  setAlert: (type: AlertCategory) => void;
}

export interface Note {
  id?: number;
  title: string;
  content: string;
}

export interface NoteId {
  id: number;
}

export enum NotesEvents {
  ADD_NOTE = 'phone:addNote',
  FETCH_ALL_NOTES = 'phone:fetchAllNotes',
  SEND_NOTE = 'phone:sendNote',
  SEND_NOTE_SUCCESS = 'phone:sendNoteSuccess',
  DELETE_NOTE = 'phone:deleteNote',
  DELETE_NOTE_SUCCESS = 'phone:deleteNoteSuccess',
  UPDATE_NOTE = 'phone:updateNote',
  UPDATE_NOTE_SUCCESS = 'phone:updateNoteSuccess',
  UPDATE_NOTE_FAILURE = 'phone:updateNoteFailure',
  ACTION_RESULT = 'phone:notesActionResult',
}
