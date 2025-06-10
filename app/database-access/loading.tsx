export default function DatabaseAccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="h-10 w-10 bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-700 rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="h-8 w-8 bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded w-12 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-6 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
