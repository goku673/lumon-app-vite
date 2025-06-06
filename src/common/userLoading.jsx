const UserLoadingSkeleton = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="space-y-1">
      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

export default UserLoadingSkeleton;