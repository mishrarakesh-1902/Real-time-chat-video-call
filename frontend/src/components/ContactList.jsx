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
        <p className="text-red-500 text-sm mb-2">{error}</p>
        <button 
          onClick={() => getAllContacts()}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        {searchTerm ? (
          <>
            <p className="text-surface-400 mb-2">No contacts found for "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              Clear search
            </button>
          </>
        ) : (
          <p className="text-surface-400">No contacts available</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-100 border-none rounded-xl text-sm
                     placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        {filteredContacts.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="w-full p-3 rounded-xl flex items-center gap-3
                     hover:bg-white hover:shadow-sm transition-all duration-200
                     text-left group"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-surface-100">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              {onlineUsers.includes(user._id) && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent-500 
                              rounded-full ring-2 ring-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-surface-900 truncate">
                {user.fullName}
              </h4>
              <p className="text-sm text-surface-500 truncate">
                {user.email}
              </p>
            </div>

            {/* Status badge */}
            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
              onlineUsers.includes(user._id)
                ? 'bg-accent-100 text-accent-700'
                : 'bg-surface-100 text-surface-500'
            }`}>
              {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContactList;
