import Collection from '@discordjs/collection';
import { CallEvents, CallHistoryItem, CallRejectReasons } from '../../../typings/call';
import CallsDB, { CallsRepo } from './calls.db';
import { v4 as uuidv4 } from 'uuid';
import PlayerService from '../players/player.service';
import { callLogger } from './calls.utils';

class CallsService {
  private callMap: Collection<string, CallHistoryItem>;
  private readonly callsDB: CallsRepo;

  constructor() {
    this.callMap = new Collection();
    this.callsDB = CallsDB;
    callLogger.debug('Call service started');
  }

  private setCallInMap(transmitterNumber: string, callObj: CallHistoryItem): void {
    this.callMap.set(transmitterNumber, callObj);
    callLogger.debug(`Call obj set with key ${transmitterNumber}, value:`);
    callLogger.debug(callObj);
  }

  private retrieveOngoingCall(transmitterNumber: string): CallHistoryItem {
    const obj = this.callMap.get(transmitterNumber);
    if (!obj) {
      throw new Error(`Call does not exist in Map with key ${transmitterNumber}`);
    }
    return obj;
  }

  async handleInitializeCall(src: number, receivingNumber: string): Promise<void> {
    // Create initial call data
    const transmittingPlayer = PlayerService.getPlayer(src);
    const transmitterNumber = transmittingPlayer.getPhoneNumber();
    const startCallTimeUnix = Math.floor(new Date().getTime() / 1000);
    const callIdentifier = uuidv4();

    const receiverIdentifier = await PlayerService.getIdentifierFromPhoneNumber(
      receivingNumber,
      true,
    );

    if (!receiverIdentifier) {
      emitNet(CallEvents.SEND_ALERT, src, {
        message: 'DIALER_INVALID_NUMBER',
        type: 'error',
      });
    }

    // Will be null if the player is offline
    const receivingPlayer = PlayerService.getPlayerFromIdentifier(receiverIdentifier);

    callLogger.debug(`Receiving Identifier: ${receiverIdentifier}`);
    callLogger.debug(`Receiving source: ${receivingPlayer.source} `);

    const callObj: CallHistoryItem = {
      identifier: callIdentifier,
      transmitter: transmitterNumber,
      transmitterSource: transmittingPlayer.source,
      receiver: receivingNumber,
      receiverSource: receivingPlayer.source,
      start: startCallTimeUnix.toString(),
      is_accepted: false,
    };

    if (!receivingPlayer) {
      // TODO: handle offline player

      // FIXME: Add actual localization for this.
      emitNet(CallEvents.SEND_ALERT, src, {
        message: 'Could not reach player',
        type: 'error',
      });
      return;
    }

    this.setCallInMap(callObj.transmitter, callObj);

    await this.callsDB
      .saveCall(callObj)
      .catch((e) =>
        callLogger.error(
          `Unable to save call object for transmitter number ${transmitterNumber}. Error: ${e.message}`,
        ),
      );

    emitNet(CallEvents.START_CALL, src, transmitterNumber, receivingNumber, true);
    emitNet(
      CallEvents.START_CALL,
      receivingPlayer.source,
      transmitterNumber,
      receivingNumber,
      false,
    );
  }

  async handleAcceptCall(src: number, transmitterNumber: string): Promise<void> {
    // We retrieve the call that was accepted from the current calls map
    const curCallAccepted = this.callMap.get(transmitterNumber);
    // We update its reference
    curCallAccepted.is_accepted = true;

    const channelId = src;

    await this.callsDB.updateCall(curCallAccepted, true, null);
    callLogger.debug(`Call with key ${transmitterNumber} was updated to be accepted`);

    // player who is being called
    emitNet(
      CallEvents.WAS_ACCEPTED,
      curCallAccepted.receiverSource,
      channelId,
      curCallAccepted,
      false,
    );
    // player who is calling
    emitNet(
      CallEvents.WAS_ACCEPTED,
      curCallAccepted.transmitterSource,
      channelId,
      curCallAccepted,
      true,
    );
  }

  async handleFetchCalls(src: number, limit: number): Promise<void> {
    const player = PlayerService.getPlayer(src);

    const calls = await this.callsDB.fetchCalls(player.getPhoneNumber(), limit);
    emitNet(CallEvents.FETCH_CALLS, src, calls);
  }

  async handleRejectCall(src: number, transmitterNumber: string, reason: CallRejectReasons): Promise<void> {
    const currentCall = this.callMap.get(transmitterNumber);

    const endCallTimeUnix = Math.floor(new Date().getTime() / 1000);

    if (!currentCall) {
      callLogger.error(
        `Call with transmitter number ${transmitterNumber} does not exist in current calls map!`,
      );
      return;
    }

    // player who is called and initiasted the rejection.
    emitNet(CallEvents.WAS_REJECTED, currentCall.receiverSource);

    // player who is calling and recieved the rejection.
    emitNet(CallEvents.WAS_REJECTED, currentCall.transmitterSource);

    if (reason && CallRejectReasons[reason]) {
      emitNet(CallEvents.SEND_ALERT, src, {
        message: `DIALER_${reason}`,
        type: 'error',
      });
    }

    await this.callsDB.updateCall(currentCall, false, endCallTimeUnix);

    this.callMap.delete(transmitterNumber);
  }

  async handleEndCall(src: number, transmitterNumber: string) {
    const endCallTimeUnix = Math.floor(new Date().getTime() / 1000);

    const currentCall = this.callMap.get(transmitterNumber);

    if (!currentCall) {
      callLogger.error(
        `Call with transmitter number ${transmitterNumber} does not exist in current calls map!`,
      );
      return;
    }

    if (currentCall.is_accepted) {
      emitNet(CallEvents.WAS_ENDED, currentCall.receiverSource);
    }
    // player who is calling
    emitNet(CallEvents.WAS_ENDED, currentCall.transmitterSource);

    await this.callsDB.updateCall(currentCall, true, endCallTimeUnix);

    // Clear from memory
    this.callMap.delete(transmitterNumber);
  }
}

export default new CallsService();
