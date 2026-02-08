import { MessageCircle } from 'lucide-react';

function NoConversationPlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
        <MessageCircle className="w-12 h-12 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">
        Select a conversation
      </h3>
      <p className="text-surface-500 max-w-sm">
        Choose a chat from the sidebar or start a new conversation to begin messaging.
      </p>
    </div>
  );
}

export default NoConversationPlaceholder;
