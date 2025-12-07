import React, { useState } from 'react';
import { LogOut, User, Layout, Bell } from 'lucide-react';

interface HeaderProps {
  activeTabLabel: string;
}

const Header: React.FC<HeaderProps> = ({ activeTabLabel }) => {

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
      {/* Left side: Breadcrumb / Title */}
      <div className="flex items-center gap-2">
         {/* Mobile menu toggle could go here */}
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex md:hidden items-center justify-center text-white mr-2">
            <Layout size={18} />
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">EduDash</h1>
            <span className="text-xs text-gray-500">{activeTabLabel}</span>
        </div>
      </div>

      {/* Right side: User Profile & Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Supervisor User</span>
            <span className="text-xs text-gray-500">Supervisor</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <User size={18} />
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;