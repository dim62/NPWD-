import { Client } from 'esx.js';
import ClientUtils from './cl_utils';

import './cl_main';
import './cl_twitter';
import './cl_contacts';
import './cl_sellout';
import './cl_bank';
import './cl_notes';
import './cl_photo';
import './cl_messages';
import './cl_call';
import './functions';

export let ESX: Client = null;

setTick(() => {
  while (ESX === null) {
    emit('esx:getSharedObject', (obj: Client) => (ESX = obj));
  }
});

export const ClUtils = new ClientUtils();
