import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { MessageCircle } from 'lucide-react';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (!chats || chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <button
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          className="w-full p-3 rounded-xl flex items-center gap-3
                   hover:bg-white hover:shadow-sm transition-all duration-200
                   text-left group"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-surface-100">
              <img
                src={chat.profilePic || "/avatar.png"}
                alt={chat.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online indicator */}
            {onlineUsers.includes(chat._id) && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent-500 
                            rounded-full ring-2 ring-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-surface-900 truncate">
                {chat.fullName}
              </h4>
              {chat.lastMessage && (
                <span className="text-xs text-surface-400">
                  {new Date(chat.lastMessage.createdAt).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <p className="text-sm text-surface-500 truncate mt-0.5">
              {chat.lastMessage?.text || (
                <span className="flex items-center gap-1 text-surface-400">
                  <MessageCircle className="w-3 h-3" />
                  New conversation
                </span>
              )}
            </p>
          </div>
        </button>
      ))}
    </>
  );
}

export default ChatsList;
