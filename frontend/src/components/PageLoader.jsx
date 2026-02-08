import { MessageCircle } from 'lucide-react';

function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-surface-500 mt-4">Loading ChatFlow...</p>
      </div>
    </div>
  );
}

export default PageLoader;
