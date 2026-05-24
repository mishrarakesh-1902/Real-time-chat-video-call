import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

export default function VideoCallModal() {
  const { 
    localStream, 
    remoteStream, 
    endCall, 
    toggleMute, 
    toggleCamera,
    isMuted,
    isCameraOff 
  } = useAuthStore();
  const { selectedUser } = useChatStore();

  return (
    <>
      <style>{`
        .glass-panel {
            box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
        @keyframes pulse-glow {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
            50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(255, 77, 79, 0); }
        }
        .animate-recording {
            animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      
      <div className="fixed inset-0 z-50 bg-[#0c0e11] text-[#e2e2e6] h-screen w-screen overflow-hidden antialiased flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          {remoteStream ? (
            <video
              ref={(el) => {
                if (el && remoteStream) el.srcObject = remoteStream;
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
             <div className="w-full h-full bg-[#111316] flex items-center justify-center opacity-90">
               <span className="material-symbols-outlined text-6xl text-[#424753]">person</span>
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#111316]/80 via-transparent to-[#111316]/90 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 w-full px-4 md:px-10 py-8 flex justify-between items-start">
          <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.08)] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-full p-1 pr-6 glass-panel shadow-sm transition-transform hover:scale-[1.02]">
            <img 
              alt={selectedUser?.fullName || "Unknown User"} 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#111316]" 
              src={selectedUser?.profilePic?.trim() ? selectedUser.profilePic : "/avatar.png"}
              onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.png"; }}
            />
            <span className="text-xl font-semibold text-[#e2e2e6]">{selectedUser?.fullName || "Unknown User"}</span>
          </div>
          
          <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.08)] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-full px-4 py-2 glass-panel shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c2c6d5]">In call</span>
            <div className="w-2 h-2 rounded-full bg-[#FF4D4F] animate-recording"></div>
          </div>
        </div>
        
        <div className="relative z-10 w-full px-4 md:px-10 py-10 flex flex-col items-end gap-8">
          <div className="w-32 md:w-48 aspect-[3/4] bg-[#1e2023] rounded-xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.12)] glass-panel relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:border-[#424753]">
            {localStream && !isCameraOff ? (
              <video
                ref={(el) => {
                  if (el && localStream) el.srcObject = localStream;
                }}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1e2023] flex items-center justify-center">
                 <span className="material-symbols-outlined text-[#424753] text-4xl">videocam_off</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111316]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="material-symbols-outlined text-[#e2e2e6] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>switch_camera</span>
            </div>
          </div>
          
          <div className="w-full flex justify-center pb-8">
            <div className="flex items-center gap-6 bg-[rgba(255,255,255,0.08)] backdrop-blur-2xl border border-[rgba(255,255,255,0.12)] rounded-full p-2 md:p-3 glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <button 
                onClick={toggleMute}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 group relative ${
                  isMuted ? 'bg-[#ffb4ab] text-[#93000a]' : 'bg-[#333538] hover:bg-[#424753] text-[#e2e2e6]'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isMuted ? 'mic_off' : 'mic'}
                </span>
              </button>
              
              <button 
                onClick={toggleCamera}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 group relative ${
                  isCameraOff ? 'bg-[#ffb4ab] text-[#93000a]' : 'bg-[#333538] hover:bg-[#424753] text-[#e2e2e6]'
                }`}
                title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isCameraOff ? 'videocam_off' : 'videocam'}
                </span>
              </button>
              
              <div className="w-px h-8 bg-[rgba(255,255,255,0.12)] mx-1"></div>
              
              <button 
                onClick={endCall}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FF4D4F] hover:bg-[#ff3333] text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(255,77,79,0.3)] hover:shadow-[0_0_30px_rgba(255,77,79,0.5)] hover:scale-105 group"
                title="End call"
              >
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>call_end</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
