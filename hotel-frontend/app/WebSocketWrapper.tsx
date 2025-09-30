'use client';

import { WebSocketProvider } from '@hotel_manage/contexts';
import React from 'react';

const WebSocketWrapper = ({ children }: { children: any }) => {
  return <WebSocketProvider>{children}</WebSocketProvider>;
};

export default WebSocketWrapper;
