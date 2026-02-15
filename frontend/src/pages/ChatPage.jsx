import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect } from 'react';

import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import IncomingCallModal from '../components/IncomingCallModal';
import VideoCallModal from '../components/VideoCallModal';
import { ArrowLeft } from 'lucide-react';

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { activeCall, incomingCall } = useAuthStore();
  const [showSidebar, setShowSidebar] = useState(true);

  // On mobile, hide sidebar when a user is selected
  useEffect(() => {
    if (selectedUser) {
      // Check if mobile screen
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } else {
      setShowSidebar(true);
    }
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-screen md:h-[90vh] md:max-w-7xl bg-white md:rounded-3xl shadow-elevated overflow-hidden flex">
        {/* LEFT SIDEBAR - Hidden on mobile when chat is open */}
        <div className={`w-full md:w-80 border-r border-surface-200 flex flex-col bg-surface-50 
          ${selectedUser && !showSidebar ? 'hidden md:flex' : 'flex'}`}>
          {/* Profile Header */}
          <ProfileHeader />

          {/* Tabs */}
          <ActiveTabSwitch />

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm
                         placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                         focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Chat/Contact List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT CHAT AREA - Hidden on mobile when no user selected */}
        <div className={`flex-1 flex flex-col bg-white 
          ${!selectedUser || showSidebar ? 'hidden md:flex' : 'flex'} 
          w-full`}>
          {/* Mobile Header with Back Button */}
          {selectedUser && (
            <div className="md:hidden flex items-center gap-3 p-3 border-b border-surface-200 bg-white">
              <button 
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-surface-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-surface-600" />
              </button>
              <span className="font-semibold text-surface-900">Back to chats</span>
            </div>
          )}
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>

        {/* ===================== VIDEO CALL LAYERS ===================== */}

        {/* Incoming Call Modal */}
        {incomingCall && <IncomingCallModal />}

        {/* Active Video Call */}
        {activeCall && <VideoCallModal />}
      </div>
    </div>
  );
}

export default ChatPage;
