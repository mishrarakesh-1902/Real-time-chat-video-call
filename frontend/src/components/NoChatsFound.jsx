import { Users } from 'lucide-react';

function NoChatsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-surface-400" />
      </div>
      <h3 className="font-semibold text-surface-700 mb-1">No conversations yet</h3>
      <p className="text-sm text-surface-400">Start a new chat to get started</p>
    </div>
  );
}

export default NoChatsFound;
