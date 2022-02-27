import { useContactActions } from './useContactActions';
import { AddContactExportData, ContactEvents, ContactsDatabaseLimits } from '@typings/contact';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import qs from 'qs';
import { useApp } from '@os/apps/hooks/useApps';
import { useNuiEvent } from '@common/hooks/useNuiEvent';

export const useContactsListener = () => {
  const { path } = useApp('CONTACTS');
  const { getContactByNumber } = useContactActions();
  const history = useHistory();

  const addContactExportHandler = useCallback(
    (contactData: AddContactExportData) => {
      const contact = getContactByNumber(contactData.number);

      const queryData = qs.stringify({
        addNumber: contactData.number.slice(0, ContactsDatabaseLimits.number),
        name: contactData.name?.slice(0, ContactsDatabaseLimits.display),
        avatar: contactData.avatar?.slice(0, ContactsDatabaseLimits.avatar),
      });

      if (!contact) {
        return history.push({
          pathname: `${path}/-1`,
          search: `?${queryData}`,
        });
      }

      history.push({
        pathname: `${path}/${contact.id}`,
        search: `?${queryData}`,
      });
    },
    [getContactByNumber, history, path],
  );

  useNuiEvent<AddContactExportData>(
    'CONTACTS',
    ContactEvents.ADD_CONTACT_EXPORT,
    addContactExportHandler,
  );
};
