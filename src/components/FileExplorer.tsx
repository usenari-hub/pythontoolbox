import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  Database,
  Archive,
  Settings,
  Grid3X3,
  List,
  LayoutGrid,
  Search,
  Filter,
  ArrowUp,
  Home,
  HardDrive,
  Network,
  Share2,
  Link,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  Scissors,
  Monitor
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  path: string;
  extension?: string;
}

export const FileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/Projects/MyGUIApp');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
  const [showHidden, setShowHidden] = useState(false);

  const [fileItems, setFileItems] = useState<FileItem[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      modified: '2023-12-15 14:30',
      path: '/Projects/MyGUIApp/src'
    },
    {
      id: '2',
      name: 'assets',
      type: 'folder',
      modified: '2023-12-15 09:15',
      path: '/Projects/MyGUIApp/assets'
    },
    {
      id: '3',
      name: 'docs',
      type: 'folder',
      modified: '2023-12-14 16:45',
      path: '/Projects/MyGUIApp/docs'
    },
    {
      id: '4',
      name: 'main.py',
      type: 'file',
      size: '3.2 KB',
      modified: '2023-12-15 14:28',
      path: '/Projects/MyGUIApp/main.py',
      extension: 'py'
    },
    {
      id: '5',
      name: 'requirements.txt',
      type: 'file',
      size: '1.1 KB',
      modified: '2023-12-15 10:22',
      path: '/Projects/MyGUIApp/requirements.txt',
      extension: 'txt'
    },
    {
      id: '6',
      name: 'README.md',
      type: 'file',
      size: '2.5 KB',
      modified: '2023-12-14 18:30',
      path: '/Projects/MyGUIApp/README.md',
      extension: 'md'
    },
    {
      id: '7',
      name: 'config.json',
      type: 'file',
      size: '856 B',
      modified: '2023-12-13 11:15',
      path: '/Projects/MyGUIApp/config.json',
      extension: 'json'
    },
    {
      id: '8',
      name: 'screenshot.png',
      type: 'file',
      size: '156 KB',
      modified: '2023-12-12 15:42',
      path: '/Projects/MyGUIApp/screenshot.png',
      extension: 'png'
    }
  ]);

  const breadcrumbParts = currentPath.split('/').filter(Boolean);

  const getFileIcon = (item: FileItem, size = 14) => {
    if (item.type === 'folder') {
      return <Folder size={size} className="text-blue-400" />;
    }
    
    switch (item.extension) {
      case 'py':
        return <Code size={size} className="text-blue-400" />;
      case 'txt':
      case 'md':
        return <FileText size={size} className="text-gray-400" />;
      case 'json':
        return <Database size={size} className="text-yellow-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image size={size} className="text-green-400" />;
      case 'zip':
      case 'tar':
      case 'gz':
        return <Archive size={size} className="text-purple-400" />;
      default:
        return <File size={size} className="text-gray-400" />;
    }
  };

  const toggleSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedItems(new Set());
  };

  const navigateUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      navigateToPath('/' + parts.join('/'));
    }
  };

  const sortedItems = [...fileItems].sort((a, b) => {
    // Folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        if (a.type === 'folder' && b.type === 'folder') return 0;
        const sizeA = a.size ? parseInt(a.size) : 0;
        const sizeB = b.size ? parseInt(b.size) : 0;
        return sizeB - sizeA;
      case 'modified':
        return new Date(b.modified).getTime() - new Date(a.modified).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Monitor size={16} className="text-blue-400" />
          <span className="font-medium">File Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-1 hover:bg-gray-700 rounded"
            title={`Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View`}
          >
            {viewMode === 'list' ? <Grid3X3 size={12} /> : <List size={12} />}
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Refresh"
          >
            <RefreshCw size={12} />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Settings"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={navigateUp}
            className="p-1 hover:bg-gray-700 rounded"
            title="Go Up"
          >
            <ArrowUp size={12} />
          </button>
          <button
            onClick={() => navigateToPath('/Projects')}
            className="p-1 hover:bg-gray-700 rounded"
            title="Home"
          >
            <Home size={12} />
          </button>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <HardDrive size={10} />
            <span>/</span>
            {breadcrumbParts.map((part, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => navigateToPath('/' + breadcrumbParts.slice(0, index + 1).join('/'))}
                  className="hover:text-white"
                >
                  {part}
                </button>
                {index < breadcrumbParts.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search files..."
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-32"
          />
          <Search size={12} className="text-gray-400" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-1">
          <button
            className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded text-xs"
            title="New Folder"
          >
            <Plus size={10} />
            <span>New</span>
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Copy"
            disabled={selectedItems.size === 0}
          >
            <Copy size={10} className={selectedItems.size === 0 ? 'text-gray-600' : ''} />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Cut"
            disabled={selectedItems.size === 0}
          >
            <Scissors size={10} className={selectedItems.size === 0 ? 'text-gray-600' : ''} />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Delete"
            disabled={selectedItems.size === 0}
          >
            <Trash2 size={10} className={selectedItems.size === 0 ? 'text-gray-600' : 'text-red-400'} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
          >
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="modified">Modified</option>
          </select>
          
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              id="showHidden"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              className="text-xs"
            />
            <label htmlFor="showHidden" className="text-xs text-gray-400">
              Hidden
            </label>
          </div>
        </div>
      </div>

      {/* File List/Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === 'list' ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 p-2 text-xs text-gray-400 border-b border-gray-700">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-4">Modified</div>
            </div>
            
            {/* Items */}
            {sortedItems.map(item => (
              <div
                key={item.id}
                className={`grid grid-cols-12 gap-2 p-2 text-xs hover:bg-gray-800 cursor-pointer rounded ${
                  selectedItems.has(item.id) ? 'bg-blue-900 hover:bg-blue-800' : ''
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="col-span-6 flex items-center space-x-2">
                  {getFileIcon(item)}
                  <span className={`${item.type === 'folder' ? 'text-blue-300' : 'text-gray-300'}`}>
                    {item.name}
                  </span>
                </div>
                <div className="col-span-2 text-gray-400">
                  {item.size || '--'}
                </div>
                <div className="col-span-4 text-gray-400">
                  {item.modified}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-3">
            {sortedItems.map(item => (
              <div
                key={item.id}
                className={`flex flex-col items-center p-3 hover:bg-gray-800 cursor-pointer rounded ${
                  selectedItems.has(item.id) ? 'bg-blue-900 hover:bg-blue-800' : ''
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="mb-2">
                  {getFileIcon(item, 24)}
                </div>
                <div className={`text-xs text-center ${item.type === 'folder' ? 'text-blue-300' : 'text-gray-300'}`}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.size || ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>{fileItems.length} items</span>
          {selectedItems.size > 0 && (
            <>
              <span>•</span>
              <span>{selectedItems.size} selected</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>{currentPath}</span>
        </div>
      </div>
    </div>
  );
};