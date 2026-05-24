import { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-6 border-b border-[rgba(255,255,255,0.12)] flex justify-between items-center" style={{ background: 'rgba(255, 255, 255, 0.08)', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}>
      <div className="flex items-center gap-3">
        <button
          className="relative group cursor-pointer border-none outline-none focus:outline-none"
          onClick={() => fileInputRef.current.click()}
        >
          <img 
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[rgba(255,255,255,0.12)] group-hover:ring-[#aec6ff] transition-all duration-300" 
            src={selectedImg || authUser?.profilePic || "/avatar.png"} 
            alt="Profile" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
            <span className="material-symbols-outlined text-white text-sm">edit</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25C2A0] border-2 border-[#1a1c1f] rounded-full shadow-[0_0_8px_rgba(37,194,160,0.6)] animate-pulse"></div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </button>
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-lg text-[#e2e2e6]">{authUser?.fullName || 'Guest User'}</h2>
          <p className="text-sm text-[#25C2A0] flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25C2A0] inline-block"></span>
            Online
          </p>
        </div>
      </div>
      
      <div className="flex gap-1 relative" ref={dropdownRef}>
        <button 
          onClick={toggleSound}
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${isSoundEnabled ? 'text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)]' : 'text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)]'}`}
          title={isSoundEnabled ? "Mute Notifications" : "Unmute Notifications"}
        >
          <span className="material-symbols-outlined text-xl">{isSoundEnabled ? 'notifications' : 'notifications_off'}</span>
        </button>
        
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${showDropdown ? 'bg-[#508efc]/20 text-[#aec6ff]' : 'text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.08)]'}`} 
          title="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#282a2d] rounded-xl shadow-xl 
                        border border-[rgba(255,255,255,0.12)] py-2 z-50 overflow-hidden"
               style={{ backdropFilter: 'blur(20px)' }}>
            <button className="w-full px-4 py-2.5 text-left text-sm text-[#e2e2e6] 
                           hover:bg-[rgba(255,255,255,0.08)] flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined text-sm">person</span>
              Profile
            </button>
            <hr className="my-1 border-[rgba(255,255,255,0.08)]" />
            <button
              onClick={logout}
              className="w-full px-4 py-2.5 text-left text-sm text-[#ffb4ab] 
                     hover:bg-[rgba(255,180,171,0.1)] flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
