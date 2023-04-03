import { action, makeObservable, observable } from 'mobx';

import { api } from 'src/api';
import { formatDate } from 'src/utils';
import getChat from 'src/api/getChat';
import getMessages from 'src/api/getMessages';
import postMessage from 'src/api/postMessage';
import patchMessage from 'src/api/patchMessage';

import user from '../user';

import { Store, Message, CreateMessageDTO, Chat, UpdateMessageDTO } from './types';

class ConversationStore implements Store {
  isLoading = true;

  currentText: string = '';

  messages: Message[] = [];

  data: U<Chat> = undefined;

  editedId: Message['id'] = 0;

  constructor() {
    makeObservable(this, {
      editedId: observable,
      messages: observable,
      isLoading: observable,
      currentText: observable,

      setEdited: action,
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

  setEdited = (value: Message['id'], text: string): void => {
    this.editedId = value;
    this.setCurrentText(text);
  };

  pushMessage = (value: Message): void => {
    this.messages.push(value);
  };

  setMessage = (id: Message['id'], value: Partial<Message>): void => {
    const idx = this.messages.findIndex((item) => item.id === id);

    this.messages[idx] = { ...this.messages[idx], ...value };
  };

  createMessage = async (): Promise<void> => {
    if (!this.currentText) return;
    // WARN we create temp id and createdAt in front just for show message before get api response
    const tempId = Date.now();
    const createdAt = formatDate(new Date());

    try {
      if (!this.data) throw new Error('Not found chat data');
      if (!user.data || !user.socket) throw new Error('Not found user data');

      const text = this.currentText;

      const sender: Message['sender'] = { id: user.data.id, fullname: user.data.fullname };

      this.pushMessage({ id: tempId, createdAt, text, sender, isEdited: false, isLoading: true, error: '' });

      const payload: CreateMessageDTO = { text, senderId: sender.id, chatId: this.data.id };

      const result = await api(postMessage, payload);

      this.setMessage(tempId, result);

      user.socket.emit('sendMessage', { ...result, receiverId: this.data.receiverId });
    } catch (e) {
      this.setMessage(tempId, { isLoading: false, error: e instanceof Error ? e.message : (e as string) });
    } finally {
      this.setCurrentText('');
    }
  };

  updateMessage = async (): Promise<void> => {
    const id = this.editedId;

    try {
      const payload: UpdateMessageDTO = { text: this.currentText };

      this.setMessage(id, { ...payload, isEdited: true, isLoading: true });

      // WARN here we can recive updated message from api and set it to store just like in create
      await api(patchMessage, payload, id.toString());
    } catch (e) {
      this.setMessage(id, { isLoading: false, error: e instanceof Error ? e.message : (e as string) });
    } finally {
      this.setMessage(id, { isLoading: false });
      this.setEdited(0, '');
    }
  };

  submitMessage = (): void => {
    if (this.editedId) {
      this.updateMessage();
    } else {
      this.createMessage();
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
