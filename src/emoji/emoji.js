import React from 'react';
import Picker from 'emoji-picker-react';

const Emojis = ({pickEmoji}) => {
  return (
      <Picker onEmojiClick={pickEmoji} />
  );
};

export default Emojis