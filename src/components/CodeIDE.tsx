import React, { useState, useRef } from 'react';
import { 
  Play, 
  Save, 
  FileText, 
  Plus, 
  X, 
  Copy, 
  Download, 
  Upload,
  Settings,
  Search,
  RotateCcw,
  RotateCw,
  Bug,
  Terminal,
  Folder
} from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  modified: boolean;
}

export const CodeIDE: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'main.py',
      content: `# Python GUI Application
import tkinter as tk
from tkinter import ttk

class MainApplication:
    def __init__(self, root):
        self.root = root
        self.root.title("Python GUI App")
        self.root.geometry("800x600")
        
        # Create main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Add widgets
        self.create_widgets()
    
    def create_widgets(self):
        # Title label
        title_label = ttk.Label(
            self.main_frame, 
            text="My Python GUI Application"
        )
        title_label.grid(row=0, column=0, columnspan=2, pady=10)
        
        # Input field
        self.entry_var = tk.StringVar()
        entry = ttk.Entry(
            self.main_frame, 
            textvariable=self.entry_var,
            width=30
        )
        entry.grid(row=1, column=0, padx=5, pady=5)
        
        # Button
        button = ttk.Button(
            self.main_frame,
            text="Process",
            command=self.on_button_click
        )
        button.grid(row=1, column=1, padx=5, pady=5)
        
        # Result text area
        self.text_area = tk.Text(
            self.main_frame,
            height=10,
            width=50
        )
        self.text_area.grid(row=2, column=0, columnspan=2, pady=10)
    
    def on_button_click(self):
        user_input = self.entry_var.get()
        result = f"You entered: {user_input}"
        self.text_area.insert(tk.END, result + "\\n")

if __name__ == "__main__":
    root = tk.Tk()
    app = MainApplication(root)
    root.mainloop()`,
      language: 'python',
      modified: false
    },
    {
      id: '2',
      name: 'widgets.py',
      content: `# Custom Widget Library
import tkinter as tk
from tkinter import ttk

class CustomButton(ttk.Button):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, **kwargs)
        self.configure(style='Custom.TButton')
    
class CustomFrame(ttk.Frame):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, **kwargs)
        self.configure(style='Custom.TFrame')`,
      language: 'python',
      modified: false
    }
  ]);

  const [activeFileId, setActiveFileId] = useState('1');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  const activeFile = files.find(f => f.id === activeFileId);

  const updateFileContent = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content, modified: true }
        : file
    ));
  };

  const createNewFile = () => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: 'untitled.py',
      content: '# New Python file\n',
      language: 'python',
      modified: false
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const closeFile = (fileId: string) => {
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;
    
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    
    if (activeFileId === fileId && newFiles.length > 0) {
      const newActiveIndex = Math.min(fileIndex, newFiles.length - 1);
      setActiveFileId(newFiles[newActiveIndex].id);
    }
  };

  const runCode = () => {
    if (!activeFile) return;
    
    setIsRunning(true);
    setOutput('Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(prev => prev + `Executed: ${activeFile.name}\n`);
      setOutput(prev => prev + 'Code execution completed successfully.\n');
      setIsRunning(false);
    }, 2000);
  };

  const saveFile = () => {
    if (!activeFile) return;
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, modified: false }
        : file
    ));
    
    // Simulate file save
    console.log('Saved file:', activeFile.name);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal size={16} className="text-blue-400" />
          <span className="font-medium">Python IDE</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={createNewFile}
            className="p-1 hover:bg-gray-700 rounded"
            title="New File"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={saveFile}
            className="p-1 hover:bg-gray-700 rounded"
            title="Save File"
          >
            <Save size={14} />
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`p-1 rounded ${isRunning ? 'text-gray-500' : 'text-green-400 hover:bg-gray-700'}`}
            title="Run Code"
          >
            <Play size={14} />
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {files.map(file => (
          <div
            key={file.id}
            className={`flex items-center space-x-2 px-3 py-2 border-r border-gray-700 cursor-pointer min-w-max ${
              activeFileId === file.id 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
            onClick={() => setActiveFileId(file.id)}
          >
            <FileText size={12} />
            <span className="text-xs">
              {file.name}
              {file.modified && <span className="text-orange-400">*</span>}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="hover:bg-gray-600 rounded p-0.5"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                Line 1, Column 1
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">
                {activeFile?.language || 'python'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-gray-700 rounded text-xs">
                <Search size={12} />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded text-xs">
                <Settings size={12} />
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 p-0">
            {activeFile ? (
              <textarea
                value={activeFile.content}
                onChange={(e) => updateFileContent(e.target.value)}
                className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none border-0 outline-none"
                placeholder="Start coding..."
                style={{ 
                  lineHeight: '1.5',
                  tabSize: 4
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No file selected</p>
                  <button
                    onClick={createNewFile}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Create New File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-1/3 border-l border-gray-700 flex flex-col">
          <div className="p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bug size={12} className="text-red-400" />
                <span className="text-xs font-medium">Output</span>
              </div>
              <button
                onClick={() => setOutput('')}
                className="p-1 hover:bg-gray-700 rounded text-xs"
                title="Clear Output"
              >
                <RotateCcw size={10} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-2 bg-gray-900 text-gray-300 font-mono text-xs overflow-y-auto">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500 text-center mt-8">
                <Terminal size={24} className="mx-auto mb-2 opacity-50" />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Python 3.9</span>
          <span>•</span>
          <span>UTF-8</span>
          <span>•</span>
          <span>{files.filter(f => f.modified).length} unsaved changes</span>
        </div>
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Running...</span>
            </div>
          )}
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};