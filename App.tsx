import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import { LayoutDashboard, Users, UserCog, ClipboardList, Plus, ListTodo, MessageSquare, FileText, Settings, Tag, Bell } from 'lucide-react';

// Define the navigation items here to share state between Sidebar and App
export type NavItemId = 
  | 'main' | 'units-list' | 'admin-list' | 'supervisor-list' | 'task-list' | 'labels' | 'add-task'
  | 'unit-student-list' | 'unit-messages' | 'unit-follow-up' | 'unit-templates' | 'unit-tasks' | 'unit-settings';

export interface NavItem {
  id: NavItemId;
  label: string;
  icon?: React.ElementType;
  isAction?: boolean; // For buttons like "Unit List"
}

export interface Unit {
  id: number;
  title: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItemId>('main');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const mainNavItems : NavItem[] = [
    { id: 'main', label: 'Main', icon: LayoutDashboard },
    { id: 'units-list', label: 'Unit List', icon: ClipboardList },
    { id: 'admin-list', label: 'Admin List', icon: UserCog },
    { id: 'supervisor-list', label: 'Supervisor List', icon: Users },
    { id: 'task-list', label: 'Task List', icon: ListTodo },
    { id: 'labels', label: 'Labels', icon: Tag },
  ];

  const unitNavItems : NavItem[] = [
    { id: 'unit-student-list', label: 'Student List', icon: Users },
    { id: 'unit-settings', label: 'Unit Settings', icon: Settings }
  ];

  const handleUnitSelect = (unit: Unit, targetTab?: NavItemId) => {
    setSelectedUnit(unit);
    setActiveTab(targetTab || 'unit-student-list');
  };

  const handleBackToDashboard = () => {
    setSelectedUnit(null);
    setActiveTab('main');
  };

  const handleTabChange = (tab: NavItemId) => {
    setActiveTab(tab);
  };

  const currentNavItems = selectedUnit ? unitNavItems : mainNavItems;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={currentNavItems}
        selectedUnit={selectedUnit}
        onBack={handleBackToDashboard}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTabLabel={currentNavItems.find(i => i.id === activeTab)?.label || 'Dashboard'} />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <DashboardView 
            activeTab={activeTab} 
            onUnitSelect={handleUnitSelect}
            onTabChange={handleTabChange}
            selectedUnit={selectedUnit}
          />
        </main>
      </div>
    </div>
  );
};

export default App;