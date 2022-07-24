export enum EmergencyEvents {
  PLAY_AUDIO = 'npwd:playDispatchAudioStart',
  DISPATCH = 'npwd:dispatchEmergencyService',
}
export enum EmergencyServices {
  POLICE,
  AMBULANCE,
}

export enum AudioTypes {
  START_CALL,
  DISPATCH_POLICE,
  DISPATCH_AMBULANCE,
}

export interface AudioEventArguments {
  type: AudioTypes;
}
