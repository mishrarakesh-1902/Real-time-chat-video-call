import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (!chats || chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isActive = selectedUser?._id === chat._id;
        
        return (
          <button
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group text-left ${
              isActive 
                ? 'bg-[rgba(255,255,255,0.08)] border border-[#aec6ff]/30 shadow-[0_4px_24px_rgba(0,0,0,0.2)] relative overflow-hidden' 
                : 'hover:bg-[rgba(255,255,255,0.08)] border border-transparent hover:border-[rgba(255,255,255,0.12)]'
            }`}
            style={isActive ? { boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' } : {}}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#aec6ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            )}
            
            <div className="flex items-center gap-3 relative z-10 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img 
                  className={`w-12 h-12 rounded-full object-cover transition-opacity ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} 
                  src={chat.profilePic || "/avatar.png"} 
                  alt={chat.fullName}
                />
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25C2A0] border-2 border-[#1a1c1f] rounded-full"></div>
                )}
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <span className={`text-[16px] font-semibold truncate w-full ${isActive ? 'text-[#aec6ff]' : 'text-[#e2e2e6]'}`}>
                  {chat.fullName}
                </span>
                <span className="text-sm text-[#c2c6d5] truncate w-full mt-0.5">
                  {chat.lastMessage?.text || "New conversation"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 shrink-0 ml-2 relative z-10">
              <span className="text-xs text-[#c2c6d5] font-bold tracking-wider">
                {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                }) : ''}
              </span>
            </div>
          </button>
        );
      })}
    </>
  );
}

export default ChatsList;
