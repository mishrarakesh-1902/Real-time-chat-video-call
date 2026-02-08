function UsersLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
          <div className="w-12 h-12 bg-surface-200 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-200 rounded w-24" />
            <div className="h-3 bg-surface-200 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;
