import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

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

  return (
    <div className="fixed inset-0 z-50 bg-surface-900 flex flex-col">
      {/* ===================== VIDEO AREA ===================== */}
      <div className="flex-1 relative min-h-0">
        {/* Remote Video (Full Screen) */}
        {remoteStream ? (
          <video
            ref={(el) => {
              if (el && remoteStream) el.srcObject = remoteStream;
            }}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-800">
            <div className="text-center px-4">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-surface-700 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl sm:text-4xl text-surface-400">👤</span>
              </div>
              <p className="text-white text-sm sm:text-lg">Connecting...</p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) - Responsive sizing */}
        <div className="absolute top-3 right-3 w-24 h-18 sm:top-4 sm:right-4 sm:w-40 sm:h-28 md:w-48 md:h-36 rounded-lg sm:rounded-xl overflow-hidden shadow-elevated ring-2 ring-surface-800/50">
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
            <div className="w-full h-full bg-surface-800 flex items-center justify-center">
              <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-surface-400" />
            </div>
          )}
        </div>

        {/* Call Timer */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-surface-800/80 backdrop-blur-sm rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-xs sm:text-sm font-medium">In call</span>
          </div>
        </div>
      </div>

      {/* ===================== CONTROLS - Fully Responsive ===================== */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 bg-surface-800 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-2.5 sm:p-3 md:p-4 rounded-full transition-all flex-shrink-0 ${
              isMuted
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-surface-700 text-white hover:bg-surface-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleCamera}
            className={`p-2.5 sm:p-3 md:p-4 rounded-full transition-all flex-shrink-0 ${
              isCameraOff
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-surface-700 text-white hover:bg-surface-600'
            }`}
            title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isCameraOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="p-2.5 sm:p-3 md:p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex-shrink-0"
            title="End call"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
