import React from 'react';
import { List, Avatar } from 'antd';

interface ChatMessageProps {
  message: string;
  isCustomer: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCustomer }) => {
  const author = isCustomer ? 'Customer' : 'Support Team';
  const avatarSrc = isCustomer
    ? 'https://example.com/customer-avatar.png'
    : 'https://example.com/support-avatar.png';

  return (
    <List.Item style={{ textAlign: isCustomer ? 'right' : 'left' }}>
      <List.Item.Meta
        avatar={<Avatar src={avatarSrc} alt={author} />}
        title={author}
        description={message}
      />
    </List.Item>
  );
};

export default ChatMessage;
