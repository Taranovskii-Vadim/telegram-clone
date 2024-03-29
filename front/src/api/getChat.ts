import { Chat } from 'src/store/conversation/types';

import { Method, Route, CommonChatDTO } from './types';

class GetChat implements Route {
  method: Method = 'GET';

  getUrl(chatId?: string): string {
    return `/chats/${chatId}`;
  }

  getData({ id, title, memberId }: CommonChatDTO): Chat {
    return { id, title, receiverId: memberId };
  }
}

export default new GetChat();
