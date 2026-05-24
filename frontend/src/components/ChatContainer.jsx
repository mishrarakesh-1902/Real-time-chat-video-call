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
    <div className="flex flex-col h-full bg-transparent">
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:px-10 flex flex-col gap-6 scroll-smooth z-10 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages && messages.length > 0 ? (
          <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === authUser?._id;
              const showDate = index === 0 || 
                new Date(msg.createdAt).toDateString() !== 
                new Date(messages[index - 1].createdAt).toDateString();

              return (
                <div key={msg._id} className="w-full flex flex-col gap-6">
                  {/* Date separator */}
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-xs font-bold uppercase tracking-wider text-[#c2c6d5] shadow-sm" style={{ backdropFilter: 'blur(12px)' }}>
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex items-end gap-3 max-w-[85%] group ${isOwn ? 'self-end flex-row-reverse' : ''}`}>
                    {/* Spacer for alignment on own messages, or avatar on others */}
                    {isOwn ? (
                      <div className="w-8 shrink-0 hidden sm:block"></div>
                    ) : (
                      <img
                        className="w-8 h-8 rounded-full object-cover mb-1 shrink-0 shadow-sm"
                        src={selectedUser?.profilePic || "/avatar.png"}
                        alt={selectedUser?.fullName}
                      />
                    )}

                    <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                      {/* Timestamp */}
                      <span className={`text-[12px] text-[#c2c6d5] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {isOwn && <span className="material-symbols-outlined text-[14px] text-[#aec6ff]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>}
                      </span>
                      
                      {/* Bubble */}
                      <div
                        className={`p-4 shadow-md leading-relaxed
                          ${isOwn
                            ? 'bg-gradient-to-r from-[#3578E5] to-[#7B61FF] text-white rounded-[20px] rounded-br-sm shadow-[0_4px_20px_rgba(53,120,229,0.3)]'
                            : 'bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-[#e2e2e6] rounded-[20px] rounded-bl-sm'
                          }`}
                        style={isOwn ? { boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' } : { backdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
                      >
                        {msg.image && (
                          <div className={`p-1.5 rounded-[16px] mb-2 ${isOwn ? 'bg-gradient-to-br from-[#3578E5] to-[#7B61FF] shadow-[0_8px_30px_rgba(53,120,229,0.25)] relative group/img overflow-hidden' : 'bg-[#1a1c1f]/50 border border-[rgba(255,255,255,0.12)] relative group/img overflow-hidden'}`}>
                             {isOwn && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none z-10"></div>}
                             <img
                               src={msg.image}
                               alt="Shared"
                               className={`rounded-[10px] max-w-sm w-full object-cover ${isOwn ? 'border border-white/10' : ''}`}
                             />
                             <div className="absolute bottom-3 right-3 bg-[#111316]/80 px-2 py-1 rounded-lg text-white text-[10px] uppercase font-bold tracking-wider flex items-center gap-1" style={{ backdropFilter: 'blur(12px)' }}>
                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                             </div>
                          </div>
                        )}
                        {msg.document && (
                          <div className={`p-4 rounded-[16px] flex flex-col gap-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-72 mb-2
                            ${isOwn ? 'bg-white/10 border border-white/20' : 'bg-[#1a1c1f] border border-[rgba(255,255,255,0.12)]'}`}>
                             <div className="flex items-start justify-between">
                               <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isOwn ? 'bg-white/20 border-white/30 text-white' : 'bg-gradient-to-br from-[#93000a] to-[#282a2d] text-[#ffb4ab] border-[rgba(255,255,255,0.12)]'}`}>
                                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                               </div>
                               <a
                                 href={msg.document}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className={`p-1.5 rounded-full transition-colors ${isOwn ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)]'}`}
                               >
                                 <Download className="w-5 h-5" />
                               </a>
                             </div>
                             <div>
                               <p className={`text-[16px] font-semibold truncate ${isOwn ? 'text-white' : 'text-[#e2e2e6]'}`}>{msg.documentName || 'Document'}</p>
                               <p className={`text-sm mt-0.5 ${isOwn ? 'text-white/70' : 'text-[#c2c6d5]'}`}>Document File</p>
                             </div>
                          </div>
                        )}
                        {msg.text && (
                          <p className="text-base">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} className="h-4" />
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
