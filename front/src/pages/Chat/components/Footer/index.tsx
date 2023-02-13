import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, InputBase, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import EmojiPicker from 'emoji-picker-react';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

import Store from '../../../../store/conversation';

import Flexbox from '../../../../components/Flexbox';

interface Props {
  socket: any;
  store: Store;
  chatId: number;
  receiverId: number;
}

// TODO memo this component
const Footer = ({ socket, chatId, store, receiverId }: Props): JSX.Element => {
  const { data, replied, edited } = store;

  const [isPicker, setIsPicker] = useState(false);

  const handleCreateUpdateMessage = async (): Promise<void> => {
    if (!store.text) return;

    try {
      const response = await store.createUpdateMessage(chatId);

      if (!response || !data) return;

      const event = response.chatId ? 'sendMessage' : 'updateMessage';
      socket.emit(event, { ...response, receiverId });
    } finally {
      store.setText('');
    }
  };

  const handleEmojiClick = (emojiObject: any): void => {
    store.setText(store.text + emojiObject.emoji);
  };

  return (
    <Box>
      {/* TODO create common component with replied */}
      {edited ? (
        <Flexbox sx={{ p: 1, borderLeft: `1px solid ${grey['300']}` }}>
          <Flexbox>
            <EditOutlinedIcon color="primary" sx={{ mr: 1 }} />
            <Box>
              <Typography color="primary">Редактирование</Typography>
              <Typography>{edited.text}</Typography>
            </Box>
          </Flexbox>
          <IconButton size="small" onClick={() => store.setText('')}>
            <CloseIcon />
          </IconButton>
        </Flexbox>
      ) : null}
      {replied ? (
        <Flexbox sx={{ p: 1, borderLeft: `1px solid ${grey['300']}` }}>
          <Flexbox>
            <ReplyIcon color="primary" sx={{ mr: 1 }} />
            <Box>
              <Typography color="primary">{replied.fullname}</Typography>
              <Typography>{replied.text}</Typography>
            </Box>
          </Flexbox>
          <IconButton size="small" onClick={() => store.setRepliedMessage(undefined)}>
            <CloseIcon />
          </IconButton>
        </Flexbox>
      ) : null}
      <Flexbox sx={{ p: 1, borderLeft: `1px solid ${grey['300']}`, backgroundColor: 'white' }}>
        <AttachFileIcon />
        <InputBase
          multiline
          value={store.text}
          onChange={(e) => store.setText(e.target.value)}
          sx={{ mr: 1, ml: 1, flex: 1, maxHeight: '130px', overflow: 'auto', paddingBottom: '6px' }}
          placeholder="Write a message..."
        />
        {isPicker ? (
          <Box sx={{ position: 'absolute', bottom: '60px', right: '10px' }}>
            <EmojiPicker
              skinTonesDisabled
              searchDisabled
              emojiVersion="5.0"
              height="300px"
              width="300px"
              onEmojiClick={handleEmojiClick}
            />
          </Box>
        ) : null}
        <IconButton size="small" sx={{ mr: 1 }} onClick={() => setIsPicker((prev) => !prev)}>
          <EmojiEmotionsOutlinedIcon />
        </IconButton>
        <IconButton size="small" color="primary" onClick={handleCreateUpdateMessage}>
          <SendIcon />
        </IconButton>
      </Flexbox>
    </Box>
  );
};

export default observer(Footer);