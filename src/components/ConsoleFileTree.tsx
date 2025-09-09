import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  ChevronRight, 
  ChevronDown,
  Play,
  Square,
  RotateCcw,
  Settings,
  Search,
  Plus,
  Trash2
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean;
  path: string;
}

interface ConsoleMessage {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
}

export const ConsoleFileTree: React.FC = () => {
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    {
      id: '1',
      type: 'info',
      content: 'Python Console initialized',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Python 3.9.7 (default, Sep 16 2021, 16:13:02)',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'input',
      content: '>>> print("Hello, World!")',
      timestamp: new Date()
    },
    {
      id: '4',
      type: 'output',
      content: 'Hello, World!',
      timestamp: new Date()
    }
  ]);

  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: '1',
      name: 'my_project',
      type: 'folder',
      expanded: true,
      path: '/my_project',
      children: [
        {
          id: '2',
          name: 'src',
          type: 'folder',
          expanded: true,
          path: '/my_project/src',
          children: [
            {
              id: '3',
              name: 'main.py',
              type: 'file',
              path: '/my_project/src/main.py'
            },
            {
              id: '4',
              name: 'widgets.py',
              type: 'file',
              path: '/my_project/src/widgets.py'
            },
            {
              id: '5',
              name: 'utils.py',
              type: 'file',
              path: '/my_project/src/utils.py'
            }
          ]
        },
        {
          id: '6',
          name: 'assets',
          type: 'folder',
          expanded: false,
          path: '/my_project/assets',
          children: [
            {
              id: '7',
              name: 'icon.png',
              type: 'file',
              path: '/my_project/assets/icon.png'
            },
            {
              id: '8',
              name: 'styles.css',
              type: 'file',
              path: '/my_project/assets/styles.css'
            }
          ]
        },
        {
          id: '9',
          name: 'requirements.txt',
          type: 'file',
          path: '/my_project/requirements.txt'
        },
        {
          id: '10',
          name: 'README.md',
          type: 'file',
          path: '/my_project/README.md'
        }
      ]
    }
  ]);

  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleMessages]);

  const toggleFolder = (nodeId: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateNode(fileTree));
  };

  const getFileIcon = (fileName: string, type: 'file' | 'folder', expanded?: boolean) => {
    if (type === 'folder') {
      return expanded ? <FolderOpen size={14} /> : <Folder size={14} />;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return <Code size={14} className="text-blue-400" />;
      case 'txt':
      case 'md':
        return <FileText size={14} className="text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image size={14} className="text-green-400" />;
      default:
        return <File size={14} className="text-gray-400" />;
    }
  };

  const executeCommand = () => {
    if (!commandInput.trim()) return;

    const newMessage: ConsoleMessage = {
      id: Date.now().toString(),
      type: 'input',
      content: `>>> ${commandInput}`,
      timestamp: new Date()
    };

    setConsoleMessages(prev => [...prev, newMessage]);
    setCommandHistory(prev => [commandInput, ...prev]);
    setHistoryIndex(-1);

    // Simulate command execution
    setTimeout(() => {
      let output = '';
      const cmd = commandInput.toLowerCase().trim();
      
      if (cmd === 'help()') {
        output = 'Type help() for interactive help, or help(object) for help about object.';
      } else if (cmd.startsWith('print(')) {
        const match = cmd.match(/print\(['"](.*)['"]?\)/);
        output = match ? match[1] : 'None';
      } else if (cmd === 'import os') {
        output = ''; // No output for successful import
      } else if (cmd === 'os.getcwd()') {
        output = '/my_project';
      } else if (cmd === 'dir()') {
        output = "['__annotations__', '__builtins__', '__doc__', '__loader__', '__name__', '__package__', '__spec__']";
      } else if (cmd.includes('error')) {
        const errorMessage: ConsoleMessage = {
          id: (Date.now() + 1).toString(),
          type: 'error',
          content: 'NameError: name \'error\' is not defined',
          timestamp: new Date()
        };
        setConsoleMessages(prev => [...prev, errorMessage]);
        setCommandInput('');
        return;
      } else {
        output = `Command executed: ${commandInput}`;
      }

      if (output) {
        const outputMessage: ConsoleMessage = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: output,
          timestamp: new Date()
        };
        setConsoleMessages(prev => [...prev, outputMessage]);
      }
    }, 500);

    setCommandInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div
          className={`flex items-center space-x-2 py-1 px-2 hover:bg-gray-700 cursor-pointer text-xs`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => node.type === 'folder' ? toggleFolder(node.id) : null}
        >
          {node.type === 'folder' && (
            <div className="w-3">
              {node.expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            </div>
          )}
          {node.type === 'file' && <div className="w-3" />}
          
          <div className="flex items-center space-x-1">
            {getFileIcon(node.name, node.type, node.expanded)}
            <span className={`${node.type === 'folder' ? 'text-blue-300' : 'text-gray-300'}`}>
              {node.name}
            </span>
          </div>
        </div>
        
        {node.type === 'folder' && node.expanded && node.children && (
          renderFileTree(node.children, level + 1)
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex bg-gray-900 text-white">
      {/* File Tree Panel */}
      <div className="w-1/2 border-r border-gray-700 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Folder size={14} className="text-blue-400" />
            <span className="text-xs font-medium">Project Files</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              className="p-1 hover:bg-gray-700 rounded"
              title="New File"
            >
              <Plus size={10} />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded"
              title="Search"
            >
              <Search size={10} />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded"
              title="Refresh"
            >
              <RotateCcw size={10} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {renderFileTree(fileTree)}
        </div>
      </div>

      {/* Console Panel */}
      <div className="w-1/2 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Terminal size={14} className="text-green-400" />
            <span className="text-xs font-medium">Python Console</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={clearConsole}
              className="p-1 hover:bg-gray-700 rounded"
              title="Clear Console"
            >
              <Square size={10} />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded"
              title="Settings"
            >
              <Settings size={10} />
            </button>
          </div>
        </div>

        {/* Console Messages */}
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
          {consoleMessages.map(message => (
            <div
              key={message.id}
              className={`mb-1 ${
                message.type === 'error' ? 'text-red-400' :
                message.type === 'input' ? 'text-green-400' :
                message.type === 'info' ? 'text-blue-400' :
                'text-gray-300'
              }`}
            >
              {message.content}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>

        {/* Command Input */}
        <div className="border-t border-gray-700 p-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 text-xs font-mono">{'>>>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white text-xs font-mono outline-none"
              placeholder="Enter Python command..."
              autoFocus
            />
            <button
              onClick={executeCommand}
              className="p-1 hover:bg-gray-700 rounded text-green-400"
              title="Execute Command"
            >
              <Play size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};