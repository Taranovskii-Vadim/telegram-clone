import { action, makeObservable, observable } from 'mobx';

import { api } from '../../api';
import getChat from '../../api/getChat';

import getMessages from '../../api/getMessages';
import postMessage from '../../api/postMessage';

import { Message, MessagePayload, Chat } from './types';

class ChatStore {
  data: Chat | undefined = undefined;

  isLoading = true;

  isFormLoading = false;

  isUserOnline = false;

  messages: Message[] = [];

  constructor() {
    makeObservable(this, {
      messages: observable,
      isLoading: observable,
      isFormLoading: observable,
      isUserOnline: observable,

      setIsLoading: action,
      setLastMessage: action,
      setIsUserOnline: action,
      setIsFormLoading: action,
    });
  }

  setIsUserOnline = (value: boolean): void => {
    this.isUserOnline = value;
  };

  setIsLoading = (value: boolean): void => {
    this.isLoading = value;
  };

  setLastMessage = (senderId: number, text: string): void => {
    const id = this.messages[this.messages.length - 1].id + 1;
    this.messages.push({ id, senderId, text });
  };

  setIsFormLoading = (value: boolean): void => {
    this.isFormLoading = value;
  };

  addMessage = async (senderId: number, text: string): Promise<void> => {
    if (this.data) {
      try {
        this.setIsFormLoading(true);

        const chatId = this.data.id;
        const payload: MessagePayload = { senderId, chatId, text };

        const id = await api(postMessage, payload);

        this.messages.push({ id, ...payload });
      } finally {
        this.setIsFormLoading(false);
      }
    }
  };

  fetchData = async (chatId: number): Promise<void> => {
    try {
      this.setIsLoading(true);

      const result = await api(getChat, undefined, chatId);
      // TODO here we get last 10 messages after that we must load them by scroll
      const messages = await api(getMessages, undefined, chatId);

      this.data = result;
      this.messages = messages;
    } finally {
      this.setIsLoading(false);
    }
  };
}

export default ChatStore;