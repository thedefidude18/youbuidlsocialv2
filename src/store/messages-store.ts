import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { orbis } from '@/lib/orbis';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    did: string;
    username?: string;
  };
  recipient: {
    did: string;
    username?: string;
  };
  streamId?: string;
  read: boolean;
}

export interface Thread {
  id: string;
  participants: {
    did: string;
    username?: string;
  }[];
  lastMessage?: Message;
  updatedAt: string;
}

interface MessagesState {
  threads: Thread[];
  messages: Record<string, Message[]>;
  unreadCount: number;
  activeThread: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setActiveThread: (threadId: string | null) => void;
  sendMessage: (content: string, recipientDid: string) => Promise<void>;
  fetchThreads: () => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
  markThreadAsRead: (threadId: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      threads: [],
      messages: {},
      unreadCount: 0,
      activeThread: null,
      isLoading: false,
      error: null,

      setActiveThread: (threadId) => set({ activeThread: threadId }),

      sendMessage: async (content, recipientDid) => {
        try {
          set({ isLoading: true, error: null });
          
          const res = await orbis.createPost({
            body: content,
            context: 'youbuidl:dm',
            encrypted_to: recipientDid,
          });

          if (res.status !== 200) {
            throw new Error(res.error || 'Failed to send message');
          }

          // Update local state
          const message: Message = {
            id: res.doc,
            content,
            timestamp: new Date().toISOString(),
            sender: {
              did: res.did,
            },
            recipient: {
              did: recipientDid,
            },
            streamId: res.doc,
            read: true,
          };

          set((state) => ({
            messages: {
              ...state.messages,
              [recipientDid]: [...(state.messages[recipientDid] || []), message],
            },
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchThreads: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await orbis.getDMs();
          
          if (error) throw new Error(error.message);

          const threads: Thread[] = data.map((thread: any) => ({
            id: thread.stream_id,
            participants: [
              { did: thread.creator, username: thread.creator_details?.profile?.username },
              { did: thread.recipient, username: thread.recipient_details?.profile?.username }
            ],
            lastMessage: {
              id: thread.stream_id,
              content: thread.content?.body || '',
              timestamp: thread.timestamp,
              sender: {
                did: thread.creator,
                username: thread.creator_details?.profile?.username
              },
              recipient: {
                did: thread.recipient,
                username: thread.recipient_details?.profile?.username
              },
              read: thread.read || false
            },
            updatedAt: thread.timestamp
          }));

          set({ threads });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMessages: async (threadId) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await orbis.getMessages(threadId);
          
          if (error) throw new Error(error.message);

          const messages: Message[] = data.map((msg: any) => ({
            id: msg.stream_id,
            content: msg.content?.body || '',
            timestamp: msg.timestamp,
            sender: {
              did: msg.creator,
              username: msg.creator_details?.profile?.username
            },
            recipient: {
              did: msg.recipient,
              username: msg.recipient_details?.profile?.username
            },
            streamId: msg.stream_id,
            read: msg.read || false
          }));

          set((state) => ({
            messages: {
              ...state.messages,
              [threadId]: messages,
            },
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      markThreadAsRead: async (threadId) => {
        try {
          await orbis.updateMessage(threadId, { read: true });
          
          set((state) => {
            const messages = { ...state.messages };
            if (messages[threadId]) {
              messages[threadId] = messages[threadId].map(msg => ({ ...msg, read: true }));
            }
            
            const unreadCount = Object.values(messages)
              .flat()
              .filter(msg => !msg.read).length;

            return { messages, unreadCount };
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },
    }),
    {
      name: 'messages-storage',
    }
  )
);
