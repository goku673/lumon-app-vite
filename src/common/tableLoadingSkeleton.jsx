const ShimmerCell = () => <div className="h-4 bg-gray-200 rounded animate-pulse"></div>

const TableLoadingSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-3">
        {/* Skeleton Header */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {[...Array(cols)].map((_, i) => (
            <div key={`header-col-${i}`} className={`col-span-${Math.floor(12 / cols)}`}>
              <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        {/* Skeleton Rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={`row-${i}`} className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 last:border-b-0">
            {[...Array(cols)].map((_, j) => (
              <div key={`cell-${i}-${j}`} className={`col-span-${Math.floor(12 / cols)}`}>
                <ShimmerCell />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableLoadingSkeleton;
