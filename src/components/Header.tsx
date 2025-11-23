export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/Puddle Logo Mascot.png"
              alt="Puddle Pool Services of Monmouth County"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Puddle Pool Services of Monmouth County</h1>
              <p className="text-sm text-gray-500">Your Job Is To Swim!</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
