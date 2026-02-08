import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import IncomingCallModal from '../components/IncomingCallModal';
import VideoCallModal from '../components/VideoCallModal';

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { activeCall, incomingCall } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-elevated overflow-hidden flex">
        {/* LEFT SIDEBAR */}
        <div className="w-80 border-r border-surface-200 flex flex-col bg-surface-50">
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

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col bg-white">
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
