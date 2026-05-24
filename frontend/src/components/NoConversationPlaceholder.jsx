import { MessageCircle } from 'lucide-react';

function NoConversationPlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-transparent z-10">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#508efc] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] pointer-events-none"></div>

      <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#3578E5]/20 to-[#7B61FF]/20 flex items-center justify-center mb-8 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(53,120,229,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <MessageCircle className="w-10 h-10 text-[#aec6ff] relative z-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-[#e2e2e6] mb-3 tracking-tight">
        Your Conversations
      </h3>
      
      <p className="text-[#c2c6d5] max-w-sm text-base leading-relaxed">
        Select a chat from the sidebar or start a new conversation to connect seamlessly with your team.
      </p>

      {/* Decorative pulse indicator */}
      <div className="mt-12 flex gap-2 justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3578E5] animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#508efc] animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF] animate-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}

export default NoConversationPlaceholder;
