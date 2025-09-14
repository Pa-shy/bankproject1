import React from 'react';
import { 
  BarChart3, 
  Upload, 
  FileText, 
  Monitor, 
  Database,
  ChevronRight
} from 'lucide-react';

type View = 'dashboard' | 'upload' | 'reports' | 'monitor' | 'database';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const menuItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: BarChart3 },
  { id: 'upload' as View, label: 'Upload Data', icon: Upload },
  { id: 'reports' as View, label: 'Reports', icon: FileText },
  { id: 'monitor' as View, label: 'Real-time Monitor', icon: Monitor },
  { id: 'database' as View, label: 'Database', icon: Database },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Revenue Assurance
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-blue-600" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};