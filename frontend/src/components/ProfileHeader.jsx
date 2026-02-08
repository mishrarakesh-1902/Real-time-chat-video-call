import { useState, useRef } from 'react';
import { LogOut, Bell, Settings, User, Menu, X } from 'lucide-react';
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
    <div className="p-4 border-b border-surface-200 bg-white">
      <div className="flex items-center justify-between">
        {/* Avatar & User Info */}
        <div className="flex items-center gap-3">
          <button
            className="relative group"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-surface-100">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                          flex items-center justify-center rounded-2xl transition-opacity">
              <User className="w-5 h-5 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </button>

          <div>
            <h3 className="font-semibold text-surface-900">
              {authUser?.fullName || 'Guest User'}
            </h3>
            <p className="text-sm text-surface-500">
              {authUser?.email || 'guest@example.com'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl transition-colors ${
              isSoundEnabled 
                ? 'text-surface-600 hover:bg-surface-100' 
                : 'text-surface-400 bg-surface-50'
            }`}
            title={isSoundEnabled ? 'Mute sounds' : 'Unmute sounds'}
          >
            {isSoundEnabled ? (
              <Bell className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`p-2.5 rounded-xl transition-colors ${
                showDropdown ? 'bg-primary-100 text-primary-600' : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-elevated 
                            border border-surface-100 py-2 z-50 animate-fade-in">
                <button className="w-full px-4 py-2.5 text-left text-sm text-surface-700 
                               hover:bg-surface-50 flex items-center gap-3">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-surface-700 
                               hover:bg-surface-50 flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-2 border-surface-100" />
                <button
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 
                         hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
