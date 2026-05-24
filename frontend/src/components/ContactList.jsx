import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import { Search } from 'lucide-react';

function ContactList() {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setError(null);
        await getAllContacts();
      } catch (err) {
        setError('Failed to load contacts');
        console.error(err);
      }
    };
    fetchContacts();
  }, [getAllContacts]);

  // Filter contacts based on search
  const filteredContacts = allContacts?.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <p className="text-[#ffb4ab] text-sm mb-2">{error}</p>
        <button 
          onClick={() => getAllContacts()}
          className="text-[#aec6ff] hover:text-[#d8e2ff] text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Search */}
      <div className="pb-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c2c6d5] group-focus-within:text-[#aec6ff] transition-colors" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.12)] rounded-xl text-sm text-[#e2e2e6]
                     placeholder:text-[#8c909f] focus:outline-none focus:border-[#aec6ff]/50 focus:ring-1 focus:ring-[#aec6ff]/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          {searchTerm ? (
            <>
              <p className="text-[#8c909f] mb-2 text-sm">No contacts found for "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-[#aec6ff] hover:text-[#d8e2ff] text-sm transition-colors"
              >
                Clear search
              </button>
            </>
          ) : (
            <p className="text-[#8c909f] text-sm">No contacts available</p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredContacts.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group text-left hover:bg-[rgba(255,255,255,0.08)] border border-transparent hover:border-[rgba(255,255,255,0.12)]"
              >
                <div className="flex items-center gap-3 relative z-10 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img 
                      className="w-12 h-12 rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      src={user.profilePic?.trim() ? user.profilePic : "/avatar.png"}
                      alt={user.fullName}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.png"; }}
                    />
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25C2A0] border-2 border-[#1a1c1f] rounded-full"></div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[16px] text-[#e2e2e6] font-semibold truncate w-full">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-[#c2c6d5] truncate w-full mt-0.5">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                    isOnline
                      ? 'bg-[#25C2A0]/20 text-[#25C2A0] border border-[#25C2A0]/30'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#8c909f] border border-[rgba(255,255,255,0.1)]'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ContactList;
