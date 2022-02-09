import MessagesDB, { _MessagesDB } from './messages.db';
import {
  createGroupHashID,
  getIdentifiersFromParticipants,
  messagesLogger,
} from './messages.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import {
  DeleteConversationRequest,
  Message,
  MessageConversation,
  MessageEvents,
  MessagesRequest,
  PreDBMessage,
} from '../../../typings/messages';
import PlayerService from '../players/player.service';

class _MessagesService {
  private readonly messagesDB: _MessagesDB;

  constructor() {
    this.messagesDB = MessagesDB;
    messagesLogger.debug('Messages service started');
  }

  async handleFetchMessageConversations(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<MessageConversation[]>,
  ) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    try {
      const conversations = await MessagesDB.getConversations(phoneNumber);

      resp({ status: 'ok', data: conversations });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleFetchMessages(
    reqObj: PromiseRequest<MessagesRequest>,
    resp: PromiseEventResp<Message[]>,
  ) {
    try {
      const messages = await MessagesDB.getMessages(reqObj.data);

      resp({ status: 'ok', data: messages });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleCreateMessageConversation(
    reqObj: PromiseRequest<string[]>,
    resp: PromiseEventResp<any>,
  ) {
    const sourcePhoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    const participants = reqObj.data;
    const conversationList = createGroupHashID(participants);

    try {
      await MessagesDB.createConversation([...participants, sourcePhoneNumber], conversationList);
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleDeleteConversation(
    reqObj: PromiseRequest<DeleteConversationRequest>,
    resp: PromiseEventResp<void>,
  ) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const conversationId = reqObj.data.conversationId;

    await this.messagesDB.deleteConversation(conversationId, phoneNumber);
    try {
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleSendMessage(reqObj: PromiseRequest<PreDBMessage>, resp: PromiseEventResp<Message>) {
    try {
      const player = PlayerService.getPlayer(reqObj.source);
      const authorPhoneNumber = player.getPhoneNumber();
      const messageData = reqObj.data;
      const participants = getIdentifiersFromParticipants(messageData.conversationList);
      const userIdentifier = player.getIdentifier();

      const messageId = await this.messagesDB.createMessage({
        userIdentifier,
        authorPhoneNumber,
        conversationId: messageData.conversationId,
        message: messageData.message,
        is_embed: messageData.is_embed,
        embed: messageData.embed,
      });

      resp({
        status: 'ok',
        data: {
          ...messageData,
          conversation_id: messageData.conversationId,
          author: authorPhoneNumber,
          id: messageId,
          message: messageData.message,
          embed: messageData.embed,
          is_embed: messageData.is_embed,
        },
      });

      // participantId is the participants phone number
      for (const participantId of participants) {
        if (participantId !== player.getPhoneNumber()) {
          const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(
            participantId,
            true,
          );
          
          const participantNumber = await PlayerService.getPhoneNumberFromIdentifier(
            participantIdentifier,
          );

          const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

          await this.messagesDB.setMessageUnread(messageData.conversationId, participantNumber);

          if (participantPlayer) {
            emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, messageData);
            emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
              conversationName: player.getPhoneNumber(),
              conversationId: messageData.conversationId,
              message: messageData.message,
              is_embed: messageData.is_embed,
              embed: messageData.embed,
            });
          }
        }
      }
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleSetMessageRead(src: number, conversationId: number) {
    const phoneNumber = PlayerService.getPlayer(src).getPhoneNumber();

    try {
      await this.messagesDB.setMessageRead(conversationId, phoneNumber);
    } catch (err) {
      messagesLogger.error(`Failed to read message. Error: ${err.message}`);
    }
  }

  async handleDeleteMessage(reqObj: PromiseRequest<Message>, resp: PromiseEventResp<void>) {
    try {
      await this.messagesDB.deleteMessage(reqObj.data);

      resp({ status: 'ok' });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;
