export interface ActiveCall {
  active: boolean;
  accepted: boolean;
  isTransmitter: boolean;
  transmitter: string;
  receiver: string;
}

export interface CallHistoryItem {
  id?: number;
  identifier: string;
  transmitter: string;
  transmitterSource?: number;
  receiver: string;
  receiverSource?: number;
  start: number;
  end?: number;
  accepted: boolean;
}

export enum CallEvents {
  INITIALIZE_CALL = 'npwd:beginCall',
  START_CALL = 'npwd:startCall',
  ACCEPT_CALL = 'npwd:acceptCall',
  END_CALL = 'npwd:endCall',
  WAS_ENDED = 'npwd:callEnded',
  WAS_ACCEPTED = 'npwd:callAccepted',
  REJECTED = 'npwd:rejectCall',
  WAS_REJECTED = 'npwd:callRejected',
  FETCH_CALLS = 'npwd:fetchCalls',
  SEND_HISTORY = 'npwd:sendCallHistory',
  SEND_HANGUP_ANIM = 'npwd:sendHangupAnim',
  SET_CALLER = 'npwd:setCaller',
  SET_CALL_MODAL = 'npwd:callModal',
  SET_CALL_HISTORY = 'npwd:setCallHistory',
}
