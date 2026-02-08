import { useState } from 'react';
import { Video, Phone, MoreVertical, Search, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

function ChatHeader() {
  const { selectedUser } = useChatStore();
  const { onlineUsers, startCall } = useAuthStore();
  const [isCalling, setIsCalling] = useState(false);

  const isOnline = selectedUser?._id && onlineUsers.includes(selectedUser._id);

  const handleVideoCall = async () => {
    if (!selectedUser?._id) return;
    
    setIsCalling(true);
    try {
      startCall(selectedUser._id);
      toast.success('Calling...');
    } catch (error) {
      toast.error('Failed to start call');
      console.error(error);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="px-6 py-4 border-b border-surface-200 bg-white flex items-center justify-between">
      {/* Left - User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-surface-100">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent-500 rounded-full ring-2 ring-white" />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-surface-900">
            {selectedUser?.fullName || 'Unknown User'}
          </h3>
          <p className="text-sm text-surface-500">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 
                         hover:bg-surface-50 transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Voice Call */}
        <button className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 
                         hover:bg-surface-50 transition-colors"
                title="Voice call coming soon">
          <Phone className="w-5 h-5" />
        </button>

        {/* Video Call */}
        <button 
          onClick={handleVideoCall}
          disabled={!selectedUser?._id || !isOnline || isCalling}
          className={`p-2.5 rounded-xl transition-colors ${
            !selectedUser?._id || !isOnline || isCalling
              ? 'text-surface-300 cursor-not-allowed'
              : 'text-surface-400 hover:text-primary-600 hover:bg-primary-50'
          }`}
          title={!selectedUser?._id ? 'Select a user' : !isOnline ? 'User is offline' : 'Start video call'}
        >
          {isCalling ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </span>
          ) : (
            <Video className="w-5 h-5" />
          )}
        </button>

        {/* More Options */}
        <button className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 
                         hover:bg-surface-50 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
