// lib/types/messages.ts
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface MessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
}