import { AudioEventArguments, AudioTypes, EmergencyEvents } from '../../typings/emergency';
import { RegisterNuiCB } from './cl_utils';
import { Sound } from './sounds/client-sound.class';
import { Ringtone } from './sounds/client-ringtone.class';

let callSound: Sound;
let ringtone: Ringtone;
const callSoundName = 'Remote_Ring';
const hangUpSoundName = 'Hang_Up';
const soundSet = 'Phone_SoundSet_Default';
const hangUpSoundSet = 'Phone_SoundSet_Michael';

RegisterNuiCB(EmergencyEvents.DISPATCH, (transaction, cb) => {
  //TODO: implement
  console.log('dispatch');
  cb({});
});

RegisterNuiCB<AudioEventArguments>(EmergencyEvents.PLAY_AUDIO, (args, cb) => {
  console.log('Data in cl_emergency', args.type);
  switch (args.type) {
    case AudioTypes.START_CALL:
      callSound = new Sound(callSoundName, soundSet);
      callSound.play();
      setTimeout(() => {
        callSound.stop();
        cb({});
      }, 1000);
      break;
  }
});
