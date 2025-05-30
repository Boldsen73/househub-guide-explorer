
import React from 'react';
import { TrendingUp, Home, Users, Archive } from 'lucide-react';

interface AdminNavigationTabsProps {
  activeTab: 'overview' | 'cases' | 'users' | 'archive';
  onTabChange: (tab: 'overview' | 'cases' | 'users' | 'archive') => void;
}

const AdminNavigationTabs = ({ activeTab, onTabChange }: AdminNavigationTabsProps) => {
  const tabs = [
    { key: 'overview', label: 'Oversigt', icon: TrendingUp },
    { key: 'cases', label: 'Sager', icon: Home },
    { key: 'users', label: 'Brugere', icon: Users },
    { key: 'archive', label: 'Arkiv', icon: Archive }
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onTabChange(key as any)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavigationTabs;
