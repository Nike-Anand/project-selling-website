import React, { useState } from 'react';
import { 
  BellIcon, 
  CogIcon, 
  ChartBarIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  LifeRingIcon, 
  MenuIcon, 
  SearchIcon 
} from 'lucide-react';

const TPROAdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const DashboardCard = ({ title, value, icon, graphSrc, additionalContent }) => (
    <div className="bg-violet-400 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-black">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {additionalContent}
        </div>
        {icon}
      </div>
      {graphSrc && <img alt={`Graph showing ${title}`} className="mt-4" src={graphSrc} />}
    </div>
  );

  const SidebarLink = ({ icon, text }) => (
    <a className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md" href="#">
      {icon}
      <span>{text}</span>
    </a>
  );

  return (
    <div className="bg-gray-100 font-sans antialiased flex min-h-screen">
      <div className={`bg-[#201F31] text-white w-64 space-y-6 py-7 px-2 
        ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="text-center text-2xl font-bold">Admin Panel</div>
        
        <nav className="space-y-2">
          <SidebarLink icon={<ChartBarIcon />} text="Dashboard" />
          <SidebarLink icon={<ChartBarIcon />} text="Analytics" />
          <SidebarLink icon={<ShoppingCartIcon />} text="eCommerce" />
        </nav>
        
        <div className="text-sm text-gray-400 px-4">APPS</div>
        
        <nav className="space-y-2">
          {[
            { icon: <i className="fas fa-envelope" />, text: 'Email' },
            { icon: <i className="fas fa-comments" />, text: 'Chat' },
            { icon: <i className="fas fa-check-square" />, text: 'Todo' },
            { icon: <i className="fas fa-calendar-alt" />, text: 'Calendar' },
            { icon: <i className="fas fa-user" />, text: 'User' }
          ].map((link, index) => (
            <SidebarLink key={index} icon={link.icon} text={link.text} />
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-[#201F31] p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <MenuIcon 
              className="text-white md:hidden cursor-pointer" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <div className="relative">
              <input 
                className="bg-gray-200 rounded-full pl-10 pr-4 py-2 focus:outline-none" 
                placeholder="Search..." 
                type="text"
              />
              <SearchIcon className="absolute left-3 top-2.5 text-gray-600" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <BellIcon className="text-white" />
            <CogIcon className="text-white" />
            
            <div className="flex items-center space-x-2">
              <img 
                alt="User avatar" 
                className="w-10 h-10 rounded-full" 
                src="https://storage.googleapis.com/a1aa/image/TZ_jDcLvFRP-ePGutekiMu7xIYmhUaMJ6bygbc6N_D4.jpg"
              />
              <div>
                <div className="text-white font-semibold">Anand</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#201F31] p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard 
              title="Subscribers Gained" 
              value="92.6k" 
              icon={<UsersIcon className="text-white text-3xl" />}
              graphSrc="https://storage.googleapis.com/a1aa/image/WnbozYEx8-kGN1FIVB5Qe01VJ9kdi1t60a8Pxfm9AYY.jpg"
            />
            
            <DashboardCard 
              title="Orders Received" 
              value="97.5k" 
              icon={<ShoppingCartIcon className="text-white text-3xl" />}
              graphSrc="https://storage.googleapis.com/a1aa/image/PDBek_cJVRYJnGPswQNqedTJb78yue2o6C2VYPVpBcg.jpg"
            />
            
            <DashboardCard 
              title="Avg Sessions" 
              value="2.7k" 
              icon={<ChartBarIcon className="text-white text-3xl" />}
              graphSrc="https://storage.googleapis.com/a1aa/image/cdqoX7G5kJPRMzEU2ht3h6taRgFMr6Xc-Vie1pfa33s.jpg"
              additionalContent={
                <>
                  <div className="text-green-900 text-sm">+5.2% vs last 7 days</div>
                  <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full">
                    View Details
                  </button>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Goal: 1000000</span>
                      <span>Users: 100k</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention: 90%</span>
                      <span>Duration: 1yr</span>
                    </div>
                  </div>
                </>
              }
            />
            
            <DashboardCard 
              title="Support Tracker" 
              value="163" 
              icon={<LifeRingIcon className="text-white text-3xl" />}
              graphSrc="https://storage.googleapis.com/a1aa/image/bwRJ6NZqdIshZObA-y4UKsL3L5vXlqWtrJYD1eINPCI.jpg"
              additionalContent={
                <>
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-semibold">83%</div>
                    <div className="text-gray-500">Completed Tickets</div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    {[
                      { label: 'New Tickets', value: '29' },
                      { label: 'Open Tickets', value: '63' },
                      { label: 'Response Time', value: '1d' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="text-gray-500">{item.label}</div>
                        <div className="text-xl font-semibold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TPROAdminDashboard;