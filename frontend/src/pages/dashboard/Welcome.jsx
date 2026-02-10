import { LayoutDashboard, Users, Palette, MessageSquare } from "lucide-react";

export default function Welcome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-600">
          Select a menu from the sidebar to get started managing your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border hover:border-blue-600 transition">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Users</h3>
          <p className="text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border hover:border-blue-600 transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Creators</h3>
          <p className="text-sm text-gray-600">
            View and manage creative artisan profiles
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border hover:border-blue-600 transition">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Palette className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Artworks</h3>
          <p className="text-sm text-gray-600">
            Browse and manage artwork portfolios
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border hover:border-blue-600 transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Requests</h3>
          <p className="text-sm text-gray-600">
            Handle project requests and communications
          </p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Tip</h3>
        <p className="text-sm text-blue-800">
          Use the sidebar navigation to access different sections of the
          dashboard. Your available menus depend on your role and permissions.
        </p>
      </div>
    </div>
  );
}
