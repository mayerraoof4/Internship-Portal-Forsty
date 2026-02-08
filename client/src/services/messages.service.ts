export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "internship_seeker" | "company";
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

class MessagesService {
  private readonly localStorageKey = "conversations";
  private readonly currentUserId = "current_user";
  private readonly currentUserRole: "internship_seeker" | "company" = "internship_seeker";

  getConversations(): Conversation[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : this.getDefaultConversations();
  }

  private getDefaultConversations(): Conversation[] {
    const defaults: Conversation[] = [
      {
        id: "conv_1",
        participantId: "user_google",
        participantName: "Google Internships",
        participantAvatar: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
        participantRole: "company",
        unreadCount: 2,
        messages: [
          {
            id: "msg_1",
            conversationId: "conv_1",
            senderId: "user_google",
            senderName: "Google Internships",
            senderAvatar: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
            content: "Hi! We're interested in your profile. Would you like to discuss the Frontend Developer position?",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            isRead: false,
          },
          {
            id: "msg_2",
            conversationId: "conv_1",
            senderId: "user_google",
            senderName: "Google Internships",
            senderAvatar: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
            content: "The position offers great learning opportunities and competitive stipend.",
            timestamp: new Date(Date.now() - 250000).toISOString(),
            isRead: false,
          },
        ],
        lastMessage: "The position offers great learning opportunities and competitive stipend.",
        lastMessageTime: new Date(Date.now() - 250000).toISOString(),
      },
      {
        id: "conv_2",
        participantId: "user_amazon",
        participantName: "Amazon Careers",
        participantAvatar: "https://images.unsplash.com/photo-1612208695882-02f2322b7da9?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
        participantRole: "company",
        unreadCount: 0,
        messages: [
          {
            id: "msg_3",
            conversationId: "conv_2",
            senderId: this.currentUserId,
            senderName: "You",
            senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "Thanks for the opportunity! I'm very interested in the Data Science internship.",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            isRead: true,
          },
          {
            id: "msg_4",
            conversationId: "conv_2",
            senderId: "user_amazon",
            senderName: "Amazon Careers",
            senderAvatar: "https://images.unsplash.com/photo-1612208695882-02f2322b7da9?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
            content: "Great! We'd like to schedule an interview with you next week.",
            timestamp: new Date(Date.now() - 500000).toISOString(),
            isRead: true,
          },
        ],
        lastMessage: "Great! We'd like to schedule an interview with you next week.",
        lastMessageTime: new Date(Date.now() - 500000).toISOString(),
      },
      {
        id: "conv_3",
        participantId: "user_microsoft",
        participantName: "Microsoft Internships",
        participantAvatar: "https://images.unsplash.com/photo-1633356713696-01d4ce27e5b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
        participantRole: "company",
        unreadCount: 0,
        messages: [
          {
            id: "msg_5",
            conversationId: "conv_3",
            senderId: "user_microsoft",
            senderName: "Microsoft Internships",
            senderAvatar: "https://images.unsplash.com/photo-1633356713696-01d4ce27e5b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80",
            content: "Your application has been received. We'll review it and get back to you soon.",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            isRead: true,
          },
        ],
        lastMessage: "Your application has been received. We'll review it and get back to you soon.",
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    localStorage.setItem(this.localStorageKey, JSON.stringify(defaults));
    return defaults;
  }

  getConversation(id: string): Conversation | null {
    const conversations = this.getConversations();
    return conversations.find((c) => c.id === id) || null;
  }

  sendMessage(conversationId: string, content: string): Message {
    const conversations = this.getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) throw new Error("Conversation not found");

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: this.currentUserId,
      senderName: "You",
      senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    conversation.messages.push(message);
    conversation.lastMessage = content;
    conversation.lastMessageTime = message.timestamp;

    localStorage.setItem(this.localStorageKey, JSON.stringify(conversations));

    window.dispatchEvent(new CustomEvent("messagesUpdated"));

    return message;
  }

  markAsRead(conversationId: string): void {
    const conversations = this.getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (conversation) {
      conversation.messages.forEach((msg) => {
        if (msg.senderId !== this.currentUserId) {
          msg.isRead = true;
        }
      });
      conversation.unreadCount = 0;
      localStorage.setItem(this.localStorageKey, JSON.stringify(conversations));

      window.dispatchEvent(new CustomEvent("messagesUpdated"));
    }
  }

  deleteConversation(id: string): boolean {
    const conversations = this.getConversations();
    const updated = conversations.filter((c) => c.id !== id);

    if (updated.length === conversations.length) return false;

    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("messagesUpdated"));

    return true;
  }

  getTotalUnreadCount(): number {
    const conversations = this.getConversations();
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }
}

export default MessagesService;
