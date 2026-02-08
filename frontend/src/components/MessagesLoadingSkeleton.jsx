function MessagesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex gap-2 max-w-[70%] ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-8 h-8 bg-surface-200 rounded-full flex-shrink-0" />
            <div className={`h-16 bg-surface-200 rounded-2xl ${i % 2 === 0 ? 'rounded-br-md' : 'rounded-bl-md'}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesLoadingSkeleton;
