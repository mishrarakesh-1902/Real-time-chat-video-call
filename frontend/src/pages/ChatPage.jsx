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
import { ArrowLeft, Search } from 'lucide-react';

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { activeCall, incomingCall } = useAuthStore();
  const [showSidebar, setShowSidebar] = useState(true);

  // On mobile, hide sidebar when a user is selected
  useEffect(() => {
    if (selectedUser) {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } else {
      setShowSidebar(true);
    }
  }, [selectedUser]);

  return (
    <div className="dark bg-[#111316] text-[#e2e2e6] h-screen w-full overflow-hidden flex font-sans selection:bg-[#508efc] selection:text-[#00285d]">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#3578E5]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#7B61FF]/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* LEFT PANE: Sidebar Navigation & List */}
      <aside className={`w-full md:w-80 lg:w-96 flex flex-col bg-[#1a1c1f]/80 backdrop-blur-3xl border-r border-[rgba(255,255,255,0.12)] z-10 shrink-0 relative
          ${selectedUser && !showSidebar ? 'hidden md:flex' : 'flex'}`}>
        {/* Profile Header */}
        <ProfileHeader />

        {/* Tab Switcher & Search */}
        <div className="p-6 pb-2 space-y-4">
          <ActiveTabSwitch />
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d5] group-focus-within:text-[#aec6ff] transition-colors" />
            <input 
              className="w-full bg-[#111316] border border-[rgba(255,255,255,0.12)] text-[#e2e2e6] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#aec6ff] focus:ring-1 focus:ring-[#aec6ff] transition-all placeholder:text-[#c2c6d5] shadow-inner" 
              placeholder="Search conversations..." 
              type="text" 
            />
          </div>
        </div>

        {/* Chat/Contact List */}
        <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1 pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
        </div>
      </aside>

      {/* RIGHT PANE: Active Chat Area */}
      <main className={`flex-1 flex flex-col relative bg-transparent z-20 h-full
        ${!selectedUser || showSidebar ? 'hidden md:flex' : 'flex'} w-full`}>
        {selectedUser && (
          <div className="md:hidden flex items-center gap-3 p-3 border-b border-[rgba(255,255,255,0.12)] bg-[#1a1c1f]">
            <button 
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-[rgba(255,255,255,0.08)] rounded-lg text-[#e2e2e6]"
            >
              <ArrowLeft className="w-5 h-5 text-[#c2c6d5]" />
            </button>
            <span className="font-semibold text-[#e2e2e6]">Back to chats</span>
          </div>
        )}

        {selectedUser ? (
          <ChatContainer />
        ) : (
          <NoConversationPlaceholder />
        )}
      </main>

      {/* ===================== VIDEO CALL LAYERS ===================== */}
      {incomingCall && <IncomingCallModal />}
      {activeCall && <VideoCallModal />}
    </div>
  );
}

export default ChatPage;
