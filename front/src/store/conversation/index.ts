import { action, makeObservable, observable } from 'mobx';

import { api } from 'src/api';
import getChat from 'src/api/getChat';
import getMessages from 'src/api/getMessages';

import user from '../user';
import { CommonChat } from '../types';

import { Store, Message } from './types';

class ConversationStore implements Store {
  isLoading = true;

  currentText: string = '';

  messages: Message[] = [];

  data: CommonChat | undefined = undefined;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      messages: observable,
      currentText: observable,

      setIsLoading: action,
      setCurrentText: action,
    });
  }

  setIsLoading = (value: boolean): void => {
    this.isLoading = value;
  };

  setCurrentText = (value: string): void => {
    this.currentText = value;
  };

  setMessage = (id: Message['id'], value: Partial<Message>): void => {
    const idx = this.messages.findIndex((item) => item.id === id);

    this.messages[idx] = { ...this.messages[idx], ...value };
  };

  createMessage = async (): Promise<void> => {
    // WARN we create temp id and createdAt in front just for show message before get api response
    const tempId = 2;

    try {
      if (!user.data) throw new Error('Not found user data');

      const createdAt = '';

      const text = this.currentText;
      const sender: Message['sender'] = { id: user.data.id, fullname: user.data.fullname };

      this.messages.push({ id: tempId, createdAt, text, sender, isLoading: true, error: '' });

      // here we must call post req and receive actual id and createdAt data

      // this.setMessage(tempId, {});
    } catch (e) {
      this.setMessage(tempId, { isLoading: false, error: e instanceof Error ? e.message : (e as string) });
    } finally {
      this.setCurrentText('');
    }
  };

  fetchData = async (conversationId: string): Promise<void> => {
    try {
      this.setIsLoading(true);

      const chat = await api(getChat, undefined, conversationId);
      const messages = await api(getMessages, undefined, conversationId);

      this.data = chat;
      this.messages = messages;
    } catch (e) {
      console.error(e);
    } finally {
      this.setIsLoading(false);
    }
  };
}

export default ConversationStore;
