function NoChatHistoryPlaceholder({ name }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">👋</span>
      </div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">
        Start a conversation with {name}
      </h3>
      <p className="text-surface-500 max-w-sm">
        Send a message to begin your chat. This is the beginning of your conversation history.
      </p>
    </div>
  );
}

export default NoChatHistoryPlaceholder;
