import React, { useState } from 'react';
import { NavItem, NavItemId, Unit } from '../App';
import { Layout, ArrowLeft, Bell } from 'lucide-react';

interface SidebarProps {
  activeTab: NavItemId;
  setActiveTab: (id: NavItemId) => void;
  navItems: NavItem[];
  selectedUnit?: Unit | null;
  onBack?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, navItems, selectedUnit, onBack }) => {
  const [unreadNotifications] = useState(3); // Mock unread notifications count

  return (
    <aside className="w-50 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        {selectedUnit && onBack ? (
           <button 
             onClick={onBack}
             className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
           >
             <ArrowLeft size={20} />
             <div className="flex flex-col items-start">
               <span className="font-bold text-gray-900 leading-tight text-sm line-clamp-1">{selectedUnit.title}</span>
               <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Back to Main</span>
             </div>
           </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Layout size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 leading-tight">EduDash</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Support Dashboard</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-colors duration-150
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item.icon && <item.icon size={16} />}
                {item.label}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon && <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />}
                <span>{item.label}</span>
              </div>
              {item.id === 'task-list' && unreadNotifications > 0 && (
                <div className="relative">
                  <Bell size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
};
export default Sidebar;