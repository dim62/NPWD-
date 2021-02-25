import React from 'react';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { List } from '../../../../ui/components/List';
import { ListItem } from '../../../../ui/components/ListItem';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useSimcard } from '../../../../os/simcard/hooks/useSimcard';
import { useContacts } from '../../../contacts/hooks/useContacts';
import { ICall } from '../../../../common/typings/call';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  callForward: {
    color: theme.palette.success.main,
  },
  callBack: {
    color: theme.palette.error.main,
  },
}));

export const DialerHistory = ({ calls }) => {
  const { number } = useSimcard();
  const { getDisplayByNumber } = useContacts();

  const classes = useStyles();

  const history = useHistory();

  const { t } = useTranslation();

  const handleCall = (phoneNumber) => {
    Nui.send('phone:beginCall', {
      number: phoneNumber,
    });
  };

  if (!calls?.length) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        paddingTop={35}
      >
        <p>
          You got no friends!
          <span role='img' aria-label='deal with it'>
            😎
          </span>
        </p>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {calls.map((call: ICall) =>
        call.transmitter === number ? (
          <ListItem
            key={call.id}
            divider
          >
            <ListItemIcon>
              {<PhoneForwardedIcon className={classes.callForward} />}
            </ListItemIcon>

            <ListItemText
              primary={getDisplayByNumber(call.receiver)}
              secondary={dayjs.unix(call.start).format(t('DATE_TIME_FORMAT'))}
            />
            <IconButton onClick={() => handleCall(call.receiver)}>
              {<PhoneIcon />}
            </IconButton>

            {getDisplayByNumber(call.transmitter) === call.transmitter ? (
              <IconButton
                onClick={() =>
                  history.push(
                    `/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`
                  )
                }
              >
                {<PersonAddIcon />}
              </IconButton>
            ) : null}
          </ListItem>
        ) : (
          <ListItem
            key={call.id}
            divider
          >
            <ListItemIcon>
              {<PhoneCallbackIcon className={classes.callBack} />}
            </ListItemIcon>

            <ListItemText
              primary={getDisplayByNumber(call.transmitter)}
              secondary={dayjs.unix(call.start).format(t('DATE_TIME_FORMAT'))}
            />
            <IconButton onClick={() => handleCall(call.receiver)}>
              {<PhoneIcon />}
            </IconButton>

            {getDisplayByNumber(call.transmitter) === call.transmitter ? (
              <IconButton
                onClick={() =>
                  history.push(
                    `/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`
                  )
                }
              >
                {<PersonAddIcon />}
              </IconButton>
            ) : null}
          </ListItem>
        )
      )}
    </List>
  );
};
