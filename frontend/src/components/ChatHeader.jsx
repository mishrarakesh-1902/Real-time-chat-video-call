import { useState } from 'react';
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
    <header className="h-20 px-6 md:px-10 flex justify-between items-center z-30 shrink-0 shadow-sm border-b border-[rgba(255,255,255,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(40px)', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            className="w-12 h-12 rounded-full object-cover ring-1 ring-[rgba(255,255,255,0.12)]" 
            src={selectedUser?.profilePic?.trim() ? selectedUser.profilePic : "/avatar.png"} 
            alt={selectedUser?.fullName} 
            onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.png"; }}
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25C2A0] border-2 border-[#111316] rounded-full shadow-[0_0_8px_rgba(37,194,160,0.5)]"></div>
          )}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#e2e2e6] tracking-tight">{selectedUser?.fullName || 'Unknown User'}</h1>
          {isOnline ? (
            <p className="text-sm text-[#25C2A0] font-medium flex items-center gap-1.5">
              Online
            </p>
          ) : (
            <p className="text-sm text-[#8c909f]">Offline</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={handleVideoCall}
          disabled={!selectedUser?._id || !isOnline || isCalling}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
            !selectedUser?._id || !isOnline || isCalling
              ? 'bg-[rgba(255,255,255,0.03)] text-[#424753] border border-transparent cursor-not-allowed'
              : 'bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-[#e2e2e6] hover:bg-[#333538] hover:scale-105'
          }`}
          title={!selectedUser?._id ? 'Select a user' : !isOnline ? 'User is offline' : 'Start video call'}
        >
          {isCalling ? (
            <span className="w-5 h-5 border-2 border-[#aec6ff] border-t-transparent rounded-full animate-spin" />
          ) : (
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
          )}
        </button>
        
        <button className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#e2e2e6] hover:bg-[#333538] hover:scale-105 transition-all shadow-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
        </button>
        
        <div className="w-px h-6 bg-[rgba(255,255,255,0.12)] mx-1 hidden sm:block"></div>
        
        <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)] transition-all">
          <span className="material-symbols-outlined">search</span>
        </button>
        
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)] transition-all">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
