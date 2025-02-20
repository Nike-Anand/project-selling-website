import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [purchasedProjects, setPurchasedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('purchased_projects')
          .eq('id', user.id)
          .single();

        if (data && data.purchased_projects) {
          setPurchasedProjects(data.purchased_projects);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-100 font-sans antialiased flex flex-col min-h-screen">
      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className="bg-blue-300 text-black w-64 space-y-6 py-7 px-2 hidden md:block">
          <div className="text-center text-2xl font-bold">User Panel</div>
          <nav className="space-y-2">
            <button className="flex items-center space-x-2 py-2 px-4 bg-blue-700 rounded-md w-full text-left">
              <i className="fas fa-tachometer-alt"></i>
              <span>Purchase History</span>
            </button>
          </nav>
          <div className="text-sm text-gray-700 px-4">APPS</div>
          <nav className="space-y-2">
            <a className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md" href="#">
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </a>
            <a className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md" href="#">
              <i className="fas fa-comments"></i>
              <span>Chat</span>
            </a>
            <a className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md" href="#">
              <i className="fas fa-user"></i>
              <span>User</span>
            </a>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between bg-blue-300 p-4 shadow-md">
            <div className="flex items-center space-x-4">
              <i className="fas fa-bars text-white md:hidden"></i>
              <div className="relative">
                <input className="bg-gray-200 rounded-full pl-10 pr-4 py-2 focus:outline-none" placeholder="Search..." type="text" />
                <i className="fas fa-search absolute left-3 top-2.5 text-gray-600"></i>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-bell text-white"></i>
              <i className="fas fa-cog text-white"></i>
              <div className="flex items-center space-x-2">
                <img alt="User avatar" className="w-10 h-10 rounded-full" height="40" src="https://storage.googleapis.com/a1aa/image/TZ_jDcLvFRP-ePGutekiMu7xIYmhUaMJ6bygbc6N_D4.jpg" width="40" />
                <div>
                  <div className="text-black font-semibold">{user?.email}</div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-4">
            {loading ? (
              <p>Loading purchase history...</p>
            ) : (
              purchasedProjects.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Purchase History</h2>
                  <ul>
                    {purchasedProjects.map((project, index) => (
                      <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No purchases found.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
