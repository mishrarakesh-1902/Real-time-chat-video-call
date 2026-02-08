import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import { FileText, Download } from 'lucide-react';

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Memoize callback functions to prevent unnecessary re-subscriptions
  const handleSubscribe = useCallback(() => {
    if (selectedUser?._id) {
      subscribeToMessages();
    }
  }, [selectedUser, subscribeToMessages]);

  const handleUnsubscribe = useCallback(() => {
    unsubscribeFromMessages();
  }, [unsubscribeFromMessages]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    handleSubscribe();
    return () => handleUnsubscribe();
  }, [handleSubscribe, handleUnsubscribe]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages && messages.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === authUser?._id;
              const showDate = index === 0 || 
                new Date(msg.createdAt).toDateString() !== 
                new Date(messages[index - 1].createdAt).toDateString();

              return (
                <div key={msg._id}>
                  {/* Date separator */}
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span className="px-3 py-1 text-xs text-surface-400 bg-white rounded-full shadow-sm">
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      {!isOwn && (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={selectedUser?.profilePic || "/avatar.png"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isOwn
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-white text-surface-800 shadow-sm rounded-bl-md'
                        }`}
                      >
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Shared"
                            className="rounded-lg max-h-60 object-cover mb-2"
                          />
                        )}
                        {msg.document && (
                          <a
                            href={msg.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
                              isOwn
                                ? 'bg-white/20 hover:bg-white/30'
                                : 'bg-surface-100 hover:bg-surface-200'
                            }`}
                          >
                            <FileText className={`w-5 h-5 ${
                              isOwn ? 'text-white' : 'text-surface-500'
                            }`} />
                            <span className={`text-sm truncate flex-1 ${
                              isOwn ? 'text-white' : 'text-surface-700'
                            }`}>
                              {msg.documentName || 'Document'}
                            </span>
                            <Download className={`w-4 h-4 ${
                              isOwn ? 'text-white/80' : 'text-surface-400'
                            }`} />
                          </a>
                        )}
                        {msg.text && (
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        )}
                        <p className={`text-xs mt-1 ${
                          isOwn ? 'text-white/70' : 'text-surface-400'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
