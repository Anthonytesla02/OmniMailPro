import React, { useState } from 'react';
import { Folder } from '../types/mail';
import {
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  AlertOctagon,
  Trash2,
  Receipt,
  Crown,
  FileCheck,
  TrendingUp,
  Folder as FolderIcon,
  Plus,
  PenSquare,
  Sparkles,
  Smartphone,
  Tag,
  ChevronDown
} from 'lucide-react';

interface FolderSidebarProps {
  folders: Folder[];
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onOpenCompose: () => void;
  onOpenAddFolder: () => void;
  onOpenCodemagic: () => void;
  selectedLabel: string | null;
  onSelectLabel: (label: string | null) => void;
  availableLabels: string[];
}

export const FolderSidebar: React.FC<FolderSidebarProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
  onOpenCompose,
  onOpenAddFolder,
  onOpenCodemagic,
  selectedLabel,
  onSelectLabel,
  availableLabels,
}) => {
  const [showLabels, setShowLabels] = useState(true);

  // Helper for dynamic icon resolution
  const renderIcon = (iconName: string, color?: string) => {
    const props = { className: 'w-4 h-4', style: color ? { color } : undefined };
    switch (iconName) {
      case 'Inbox':
        return <Inbox {...props} />;
      case 'Star':
        return <Star {...props} />;
      case 'Send':
        return <Send {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Archive':
        return <Archive {...props} />;
      case 'AlertOctagon':
        return <AlertOctagon {...props} />;
      case 'Trash2':
        return <Trash2 {...props} />;
      case 'Receipt':
        return <Receipt {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'FileCheck':
        return <FileCheck {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      default:
        return <FolderIcon {...props} />;
    }
  };

  const systemFolders = folders.filter((f) => f.isSystem);
  const customFolders = folders.filter((f) => !f.isSystem);

  return (
    <div className="w-60 bg-slate-950 border-r border-slate-800/80 flex flex-col h-full text-slate-300">
      {/* Compose Email Button */}
      <div className="p-3">
        <button
          onClick={onOpenCompose}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition transform active:scale-95 cursor-pointer"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Business Email</span>
        </button>
      </div>

      {/* Navigation scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Core Folders */}
        <div className="space-y-0.5">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Mail Folders
          </div>
          {systemFolders.map((folder) => {
            const isActive = activeFolderId === folder.id && !selectedLabel;
            return (
              <button
                key={folder.id}
                onClick={() => {
                  onSelectLabel(null);
                  onSelectFolder(folder.id);
                }}
                className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {renderIcon(folder.iconName)}
                <span>{folder.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Business Folders */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Custom Folders
            </span>
            <button
              onClick={onOpenAddFolder}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Add New Folder"
              aria-label="Add New Folder"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {customFolders.map((folder) => {
            const isActive = activeFolderId === folder.id && !selectedLabel;
            return (
              <button
                key={folder.id}
                onClick={() => {
                  onSelectLabel(null);
                  onSelectFolder(folder.id);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {renderIcon(folder.iconName, folder.color)}
                  <span>{folder.name}</span>
                </div>
                {folder.color && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: folder.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Labels & Tags Section */}
        {availableLabels.length > 0 && (
          <div className="space-y-0.5 pt-1">
            <div
              className="flex items-center justify-between px-2 pb-1 cursor-pointer select-none text-slate-400 hover:text-slate-300"
              onClick={() => setShowLabels(!showLabels)}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Labels ({availableLabels.length})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showLabels ? 'rotate-180' : ''
                }`}
              />
            </div>

            {showLabels && (
              <div className="space-y-0.5">
                {availableLabels.map((lbl) => {
                  const isSelected = selectedLabel === lbl;
                  return (
                    <button
                      key={lbl}
                      onClick={() => onSelectLabel(isSelected ? null : lbl)}
                      className={`w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg text-xs transition text-left ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{lbl}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expo & Codemagic Callout Banner at bottom */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/80">
        <button
          onClick={onOpenCodemagic}
          className="w-full p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 hover:border-indigo-400/60 transition group text-left cursor-pointer"
        >
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Codemagic.io Hub
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Package Expo App for iOS & Android with push notifications.
          </p>
          <div className="mt-2 text-[10px] font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View CI/CD YAML & Config →
          </div>
        </button>
      </div>
    </div>
  );
};
