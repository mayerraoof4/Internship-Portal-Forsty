import PortalLayout from "@/components/layouts/portal/PortalLayout";
import Divider from "@/components/core-ui/Divider";
import { useEffect, useState } from "react";
import {
  PaperAirplaneIcon,
  TrashIcon,
  CheckIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import MessagesService, { type Conversation } from "@/services/messages.service";
import { useAuth } from "@/providers";

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const service = new MessagesService();

  // Get user's role
  const getUserRole = () => {
    if (!user?.user_type_id) return null;
    if (typeof user.user_type_id === "string") return null;
    return user.user_type_id.user_type_name || null;
  };

  const userRole = getUserRole();

  useEffect(() => {
    loadConversations();
    const handleUpdate = () => loadConversations();
    window.addEventListener("messagesUpdated", handleUpdate);
    return () => window.removeEventListener("messagesUpdated", handleUpdate);
  }, []);

  const loadConversations = () => {
    setLoading(true);
    const convs = service.getConversations();
    setConversations(convs);
    if (convs.length > 0 && !selectedConversation) {
      setSelectedConversation(convs[0]);
    }
    setLoading(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark as read when selecting
    if (conversation.unreadCount > 0) {
      service.markAsRead(conversation.id);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversation.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    service.sendMessage(selectedConversation.id, messageText);
    const updated = service.getConversation(selectedConversation.id);
    if (updated) {
      setSelectedConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConversation.id ? updated : c))
      );
    }
    setMessageText("");
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (window.confirm("Delete this conversation?")) {
      service.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    }
  };

  const totalUnread = service.getTotalUnreadCount();

  return (
    <PortalLayout 
      title={`Messages (${totalUnread} unread) ${userRole ? `• You: ${userRole.replace("_", " ")}` : ""}`}
    >
      <div className="h-screen -mx-6 -my-6 flex flex-col bg-gray-50">
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              {totalUnread > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {totalUnread} unread message{totalUnread !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <EnvelopeIcon className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-indigo-50 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50"
                      } ${conversation.unreadCount > 0 ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3
                              className={`text-sm font-semibold text-gray-900 truncate ${
                                conversation.unreadCount > 0 ? "font-bold" : ""
                              }`}
                            >
                              {conversation.participantName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {conversation.participantRole}
                          </p>
                          <p
                            className={`text-sm text-gray-600 truncate mt-1 ${
                              conversation.unreadCount > 0 ? "font-medium" : ""
                            }`}
                          >
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(conversation.lastMessageTime).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex md:flex-col flex-1 bg-white overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConversation.participantAvatar}
                      alt={selectedConversation.participantName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.participantName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm text-gray-500">
                          {selectedConversation.participantRole}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          You: <span className="font-medium capitalize">{userRole?.replace("_", " ")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteConversation(selectedConversation.id)
                    }
                    className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete conversation"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <Divider />

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                    selectedConversation.messages.map((message) => {
                      const isOwn = message.senderId === "current-user";
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md rounded-lg px-4 py-3 ${
                              isOwn
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`mt-1 flex items-center gap-1 justify-end ${
                                isOwn ? "text-indigo-200" : "text-gray-500"
                              }`}
                            >
                              <span className="text-xs">
                                {new Date(message.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {isOwn && message.isRead && (
                                <CheckIcon className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Select a conversation to start</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default MessagesPage;
