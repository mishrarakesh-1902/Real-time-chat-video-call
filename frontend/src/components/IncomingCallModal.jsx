import { useAuthStore } from '../store/useAuthStore';

function IncomingCallModal() {
  const { incomingCall, acceptCall, rejectCall } = useAuthStore();

  if (!incomingCall) return null;

  return (
    <>
      <style>{`
        @keyframes radar-pulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-radar {
            animation: radar-pulse 3s cubic-bezier(0.0, 0.0, 0.2, 1) infinite;
        }
        .animate-radar-delay {
            animation: radar-pulse 3s cubic-bezier(0.0, 0.0, 0.2, 1) 1.5s infinite;
        }
      `}</style>
      
      <div className="fixed inset-0 z-50 backdrop-blur-3xl bg-[#0c0e11]/80 flex items-center justify-center p-4 md:p-10">
        <div className="relative flex flex-col items-center justify-center p-16 w-full max-w-lg rounded-[2.5rem] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
          
          <div className="absolute inset-0 bg-gradient-to-b from-[#aec6ff]/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          
          <div className="relative w-48 h-48 flex items-center justify-center mb-8 z-20">
            <div className="absolute inset-0 rounded-full bg-[#aec6ff]/30 animate-radar"></div>
            <div className="absolute inset-4 rounded-full bg-[#aec6ff]/40 animate-radar-delay"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#111316] shadow-[0_0_40px_rgba(174,198,255,0.3)] z-10 ring-2 ring-[#aec6ff] ring-offset-4 ring-offset-[#111316]">
              <img 
                alt={incomingCall.fromUser?.fullName || "Unknown User"}
                className="w-full h-full object-cover" 
                src={incomingCall.fromUser?.profilePic?.trim() ? incomingCall.fromUser.profilePic : "/avatar.png"}
                onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.png"; }}
              />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e6] mb-2 z-20 text-center tracking-tight drop-shadow-md">
            {incomingCall.fromUser?.fullName || "Unknown User"}
          </h2>
          
          <div className="flex items-center gap-2 mb-16 z-20">
            <span className="w-3 h-3 rounded-full bg-[#25C2A0] shadow-[0_0_10px_rgba(37,194,160,0.8)] animate-pulse"></span>
            <p className="text-xl font-semibold text-[#c2c6d5]">Incoming Video Call...</p>
          </div>
          
          <div className="flex items-center justify-center gap-16 z-20 w-full px-10">
            <button 
              onClick={rejectCall}
              className="group relative w-16 h-16 rounded-full bg-[#282a2d] border border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#93000a] hover:border-[#ffb4ab] hover:shadow-[0_0_30px_rgba(255,180,171,0.3)] focus:outline-none"
              title="Decline"
            >
              <span className="material-symbols-outlined text-[28px] text-[#c2c6d5] group-hover:text-[#ffdad6] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
            </button>
            
            <button 
              onClick={acceptCall}
              className="group relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00a485] to-[#4dddb9] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(77,221,185,0.5)] focus:outline-none animate-bounce" style={{ animationDuration: '2.5s' }}
              title="Accept call"
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="material-symbols-outlined text-[40px] text-[#003026] drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default IncomingCallModal;
