import { useChatStore } from '../store/useChatStore';

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  const tabs = [
    { id: 'chats', label: 'Chats' },
    { id: 'contacts', label: 'Contacts' },
  ];

  return (
    <div 
      className="flex p-1 rounded-xl border border-[rgba(255,255,255,0.12)] w-full"
      style={{ background: '#282a2d', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#451dc6] text-[#b7aaff] shadow-sm'
                : 'text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default ActiveTabSwitch;
