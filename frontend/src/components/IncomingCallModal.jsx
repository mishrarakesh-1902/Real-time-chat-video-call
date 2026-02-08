import { Phone, Video, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

function IncomingCallModal() {
  const { incomingCall, acceptCall, rejectCall } = useAuthStore();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-elevated animate-slide-up">
        {/* Avatar */}
        <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary-100">
          <img
            src={incomingCall.fromUser?.profilePic || "/avatar.png"}
            alt={incomingCall.fromUser?.fullName || "Unknown User"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Caller Info */}
        <h3 className="text-xl font-bold text-surface-900 mb-1">
          {incomingCall.fromUser?.fullName || "Unknown User"}
        </h3>
        <p className="text-surface-500 mb-6">Incoming video call...</p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-red-500 font-medium">Ringing...</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          {/* Reject */}
          <button
            onClick={rejectCall}
            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Decline"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Accept Video */}
          <button
            onClick={acceptCall}
            className="p-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
            title="Accept call"
          >
            <Video className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCallModal;
