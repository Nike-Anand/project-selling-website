import { useAuthStore } from '../lib/store';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuthStore();

  if (!isAdmin) {
    return <div>Unauthorized access</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600">Manage users and permissions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Project Statistics</h2>
          <p className="text-gray-600">View project analytics</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-600">Configure system preferences</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
