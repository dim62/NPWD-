import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { noteStates } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { NotesEvents } from '../../../../../typings/notes';

export const useNotesService = () => {
  const { addAlert } = useSnackbar();
  const setNotes = useSetRecoilState(noteStates.noteItems);
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('NOTES', NotesEvents.SEND_NOTE, setNotes);
  useNuiEvent('NOTES', NotesEvents.SEND_ALERT, handleAddAlert);
};
