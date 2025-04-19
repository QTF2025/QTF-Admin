// ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, List } from 'antd';
import ChatMessage from './ChatMessage';

import './ChatwindowStyle.scss';



const { Content } = Layout;

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { content: 'Hello, I need help with an issue.', isCustomer: true },
    { content: 'Sure, what seems to be the problem?', isCustomer: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
    //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageSubmit = () => {
    if (newMessage.trim() === '') return;
    const newMessageObj = { content: newMessage, isCustomer: true }; // Assuming customer is sending the message
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    // Simulate support team response (for demo purposes)
    setTimeout(() => {
      const supportResponse = { content: 'Please provide more details about the issue.', isCustomer: false };
      setMessages(prevMessages => [...prevMessages, supportResponse]);
    }, 1000); // Simulate delay in support team response
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          style={{ flex: 1, overflow: 'auto' }}
          renderItem={item => (
            <List.Item style={{ textAlign: item.isCustomer ? 'right' : 'left' }}>
              <ChatMessage message={item.content} isCustomer={item.isCustomer} />
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
        <div style={{ marginTop: '20px' }}>
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onPressEnter={handleMessageSubmit} />
          <Button type="primary" onClick={handleMessageSubmit} style={{ marginLeft: '10px' }}>Send</Button>
        </div>
      </Content>
    </Layout>
  );
};

export default ChatWindow;
