import { MessageCircle, Users } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageCircle },
    { id: 'contacts', label: 'Contacts', icon: Users },
  ];

  return (
    <div className="px-4 py-2">
      <div className="flex bg-surface-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium
                      transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-surface-900 shadow-sm'
                          : 'text-surface-500 hover:text-surface-700'
                      }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-600' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActiveTabSwitch;
