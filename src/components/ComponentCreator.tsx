import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Save, 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings, 
  Palette, 
  Code, 
  Play, 
  Square, 
  Type, 
  Circle, 
  Image, 
  List, 
  Grid3X3,
  ChevronRight,
  ChevronDown,
  CheckSquare,
  ToggleLeft,
  SlidersHorizontal,
  Menu,
  Calendar,
  Monitor,
  Layers,
  MousePointer,
  X,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Link,
  Folder,
  FileText
} from 'lucide-react';

interface ComponentProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select';
  value: any;
  options?: string[];
  description?: string;
}

interface ComponentEvent {
  name: string;
  type: 'click' | 'change' | 'hover' | 'focus' | 'custom';
  action: string;
  enabled: boolean;
}

interface CustomComponent {
  id: string;
  name: string;
  type: string;
  category: string;
  icon: React.ReactNode;
  properties: ComponentProperty[];
  events: ComponentEvent[];
  style: {
    width: number;
    height: number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
    margin: number;
  };
  pythonCode: string;
  created: Date;
  modified: Date;
}

interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  baseComponent: string;
  presetProperties: ComponentProperty[];
  category: string;
}

export const ComponentCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'library' | 'templates'>('create');
  const [selectedComponentType, setSelectedComponentType] = useState('button');
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const [customComponents, setCustomComponents] = useState<CustomComponent[]>([
    {
      id: '1',
      name: 'Custom Button',
      type: 'button',
      category: 'Custom',
      icon: <Square size={14} />,
      properties: [
        { name: 'text', type: 'string', value: 'Click Me', description: 'Button text label' },
        { name: 'enabled', type: 'boolean', value: true, description: 'Button enabled state' },
        { name: 'variant', type: 'select', value: 'primary', options: ['primary', 'secondary', 'outline'], description: 'Button style variant' }
      ],
      events: [
        { name: 'onClick', type: 'click', action: 'print("Button clicked!")', enabled: true }
      ],
      style: {
        width: 120,
        height: 32,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        margin: 4
      },
      pythonCode: `import tkinter as tk\nfrom tkinter import ttk\n\nclass CustomButton(ttk.Button):\n    def __init__(self, parent, **kwargs):\n        super().__init__(parent, **kwargs)\n        self.configure(command=self.on_click)\n    \n    def on_click(self):\n        print("Button clicked!")`,
      created: new Date(),
      modified: new Date()
    }
  ]);

  const [componentTemplates] = useState<ComponentTemplate[]>([
    {
      id: '1',
      name: 'Data Entry Form',
      description: 'Complete form with labels, inputs, and validation',
      baseComponent: 'frame',
      presetProperties: [
        { name: 'title', type: 'string', value: 'Data Entry', description: 'Form title' },
        { name: 'required', type: 'boolean', value: true, description: 'Required field validation' }
      ],
      category: 'Forms'
    },
    {
      id: '2',
      name: 'Chart Widget',
      description: 'Interactive chart with customizable data',
      baseComponent: 'canvas',
      presetProperties: [
        { name: 'chartType', type: 'select', value: 'line', options: ['line', 'bar', 'pie'], description: 'Chart type' },
        { name: 'animated', type: 'boolean', value: true, description: 'Enable animations' }
      ],
      category: 'Visualization'
    }
  ]);

  const [currentComponent, setCurrentComponent] = useState<CustomComponent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const componentTypes = [
    { id: 'button', name: 'Button', icon: <Square size={16} />, category: 'Basic' },
    { id: 'label', name: 'Label', icon: <Type size={16} />, category: 'Basic' },
    { id: 'input', name: 'Input Field', icon: <Edit3 size={16} />, category: 'Input' },
    { id: 'checkbox', name: 'Checkbox', icon: <CheckSquare size={16} />, category: 'Input' },
    { id: 'radio', name: 'Radio Button', icon: <Circle size={16} />, category: 'Input' },
    { id: 'slider', name: 'Slider', icon: <SlidersHorizontal size={16} />, category: 'Input' },
    { id: 'dropdown', name: 'Dropdown', icon: <Menu size={16} />, category: 'Input' },
    { id: 'listbox', name: 'List Box', icon: <List size={16} />, category: 'Container' },
    { id: 'frame', name: 'Frame', icon: <Square size={16} />, category: 'Container' },
    { id: 'panel', name: 'Panel', icon: <Layers size={16} />, category: 'Container' },
    { id: 'canvas', name: 'Canvas', icon: <MousePointer size={16} />, category: 'Drawing' },
    { id: 'image', name: 'Image', icon: <Image size={16} />, category: 'Display' },
    { id: 'table', name: 'Table', icon: <Grid3X3 size={16} />, category: 'Display' }
  ];

  const createNewComponent = () => {
    const selectedType = componentTypes.find(t => t.id === selectedComponentType);
    if (!selectedType) return;

    const newComponent: CustomComponent = {
      id: Date.now().toString(),
      name: `New ${selectedType.name}`,
      type: selectedComponentType,
      category: 'Custom',
      icon: selectedType.icon,
      properties: [
        { name: 'name', type: 'string', value: `new_${selectedComponentType}`, description: 'Component identifier' },
        { name: 'visible', type: 'boolean', value: true, description: 'Component visibility' }
      ],
      events: [],
      style: {
        width: 100,
        height: 30,
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
        padding: 4,
        margin: 2
      },
      pythonCode: `# Generated Python code for ${selectedType.name}\nimport tkinter as tk\nfrom tkinter import ttk\n\nclass Custom${selectedType.name}:\n    pass`,
      created: new Date(),
      modified: new Date()
    };

    setCustomComponents(prev => [...prev, newComponent]);
    setCurrentComponent(newComponent);
    setActiveTab('edit');
  };

  const updateComponentProperty = (propName: string, value: any) => {
    if (!currentComponent) return;
    
    const updatedComponent = {
      ...currentComponent,
      properties: currentComponent.properties.map(prop =>
        prop.name === propName ? { ...prop, value } : prop
      ),
      modified: new Date()
    };
    
    setCurrentComponent(updatedComponent);
    setCustomComponents(prev => prev.map(comp => 
      comp.id === currentComponent.id ? updatedComponent : comp
    ));
  };

  const addProperty = () => {
    if (!currentComponent) return;
    
    const newProperty: ComponentProperty = {
      name: 'newProperty',
      type: 'string',
      value: '',
      description: 'New property description'
    };
    
    updateComponent({
      ...currentComponent,
      properties: [...currentComponent.properties, newProperty]
    });
  };

  const addEvent = () => {
    if (!currentComponent) return;
    
    const newEvent: ComponentEvent = {
      name: 'onNewEvent',
      type: 'click',
      action: '# Add your code here',
      enabled: true
    };
    
    updateComponent({
      ...currentComponent,
      events: [...currentComponent.events, newEvent]
    });
  };

  const updateComponent = (updatedComponent: CustomComponent) => {
    setCurrentComponent(updatedComponent);
    setCustomComponents(prev => prev.map(comp => 
      comp.id === updatedComponent.id ? updatedComponent : comp
    ));
  };

  const deleteComponent = (componentId: string) => {
    setCustomComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (currentComponent?.id === componentId) {
      setCurrentComponent(null);
    }
  };

  const exportComponent = (component: CustomComponent) => {
    const exportData = {
      component,
      exportedAt: new Date(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePythonCode = (component: CustomComponent) => {
    return `"""
Generated Python GUI Component: ${component.name}
Created: ${component.created.toLocaleDateString()}
Modified: ${component.modified.toLocaleDateString()}
"""

import tkinter as tk
from tkinter import ttk

class ${component.name.replace(/\s+/g, '')}:
    def __init__(self, parent, **kwargs):
        self.parent = parent
        self.setup_ui()
        self.setup_events()
    
    def setup_ui(self):
        # Component properties
${component.properties.map(prop => `        self.${prop.name} = ${JSON.stringify(prop.value)}`).join('\n')}
        
        # Create ${component.type} widget
        self.widget = ttk.${component.type.charAt(0).toUpperCase() + component.type.slice(1)}(
            self.parent,
            width=${component.style.width},
            height=${component.style.height}
        )
        
        # Apply styling
        self.widget.configure(
            relief='solid',
            borderwidth=${component.style.borderWidth}
        )
    
    def setup_events(self):
${component.events.map(event => `        # ${event.name} event\n        self.widget.bind('<${event.type}>', self.${event.name})`).join('\n')}
    
${component.events.map(event => `    def ${event.name}(self, event=None):\n        ${event.action.split('\n').join('\n        ')}`).join('\n\n')}

# Usage example:
if __name__ == "__main__":
    root = tk.Tk()
    root.title("${component.name} Demo")
    
    component = ${component.name.replace(/\s+/g, '')}(root)
    component.widget.pack(padx=10, pady=10)
    
    root.mainloop()
`;
  };

  const renderComponentPreview = (component: CustomComponent) => {
    return (
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-white flex items-center justify-center"
        style={{
          width: Math.max(component.style.width, 100),
          height: Math.max(component.style.height, 40),
          backgroundColor: component.style.backgroundColor,
          borderColor: component.style.borderColor,
          borderWidth: component.style.borderWidth,
          borderRadius: component.style.borderRadius,
          padding: component.style.padding,
          margin: component.style.margin
        }}
      >
        <div className="flex items-center space-x-2">
          {component.icon}
          <span className="text-sm font-medium">{component.name}</span>
        </div>
      </div>
    );
  };

  const filteredComponents = customComponents.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = componentTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Plus size={16} className="text-blue-400" />
          <span className="font-medium">Component Creator</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`p-1 rounded ${isPreviewMode ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            title={isPreviewMode ? 'Hide Preview' : 'Show Preview'}
          >
            {isPreviewMode ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className={`p-1 rounded ${showAdvancedOptions ? 'bg-orange-600' : 'hover:bg-gray-700'}`}
            title="Advanced Options"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {[
          { id: 'create', label: 'Create', icon: <Plus size={12} /> },
          { id: 'edit', label: 'Edit', icon: <Edit3 size={12} /> },
          { id: 'library', label: 'Library', icon: <Folder size={12} /> },
          { id: 'templates', label: 'Templates', icon: <FileText size={12} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-3 py-2 text-xs border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-blue-400 bg-gray-700 text-white' 
                : 'border-transparent text-gray-300 hover:text-white hover:bg-gray-750'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'create' && (
          <div className="h-full flex">
            {/* Component Type Selection */}
            <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
              <div className="p-3">
                <div className="text-sm font-medium mb-3">Select Component Type</div>
                <div className="space-y-1">
                  {Object.entries(
                    componentTypes.reduce((acc, type) => {
                      if (!acc[type.category]) acc[type.category] = [];
                      acc[type.category].push(type);
                      return acc;
                    }, {} as Record<string, typeof componentTypes>)
                  ).map(([category, types]) => (
                    <div key={category}>
                      <div className="text-xs text-gray-400 mb-1 mt-3 first:mt-0">{category}</div>
                      {types.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedComponentType(type.id)}
                          className={`w-full flex items-center space-x-2 p-2 rounded text-xs transition-colors ${
                            selectedComponentType === type.id 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          {type.icon}
                          <span>{type.name}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Creation Area */}
            <div className="flex-1 p-3">
              <div className="text-sm font-medium mb-3">Create New Component</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Component Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs"
                    placeholder={`Custom ${componentTypes.find(t => t.id === selectedComponentType)?.name || 'Component'}`}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs">
                    <option>Custom</option>
                    <option>Basic</option>
                    <option>Input</option>
                    <option>Container</option>
                    <option>Display</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs h-16 resize-none"
                    placeholder="Describe your component..."
                  />
                </div>

                <button
                  onClick={createNewComponent}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-medium transition-colors"
                >
                  Create Component
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="h-full flex">
            {/* Component List */}
            <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">Components</div>
                  <span className="text-xs text-gray-400">{customComponents.length}</span>
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs mb-3"
                  placeholder="Search components..."
                />

                <div className="space-y-1">
                  {filteredComponents.map(component => (
                    <div
                      key={component.id}
                      onClick={() => setCurrentComponent(component)}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors group ${
                        currentComponent?.id === component.id 
                          ? 'bg-blue-600' 
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {component.icon}
                        <div>
                          <div className="text-xs font-medium">{component.name}</div>
                          <div className="text-xs text-gray-400">{component.type}</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComponent(component.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit Panel */}
            <div className="flex-1 overflow-y-auto">
              {currentComponent ? (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">{currentComponent.name}</div>
                      <div className="text-xs text-gray-400">Modified: {currentComponent.modified.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => exportComponent(currentComponent)}
                        className="p-1 bg-green-600 hover:bg-green-700 rounded"
                        title="Export Component"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={() => {
                          const code = generatePythonCode(currentComponent);
                          navigator.clipboard.writeText(code);
                        }}
                        className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                        title="Copy Python Code"
                      >
                        <Code size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  {isPreviewMode && (
                    <div className="mb-4 p-3 bg-gray-800 rounded">
                      <div className="text-xs text-gray-400 mb-2">Preview</div>
                      {renderComponentPreview(currentComponent)}
                    </div>
                  )}

                  {/* Properties */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Properties</div>
                      <button
                        onClick={addProperty}
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      >
                        Add Property
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentComponent.properties.map((prop, index) => (
                        <div key={index} className="bg-gray-800 p-2 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <input
                              type="text"
                              value={prop.name}
                              onChange={(e) => {
                                const updatedProps = [...currentComponent.properties];
                                updatedProps[index] = { ...prop, name: e.target.value };
                                updateComponent({ ...currentComponent, properties: updatedProps });
                              }}
                              className="bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs font-medium"
                            />
                            <select
                              value={prop.type}
                              onChange={(e) => {
                                const updatedProps = [...currentComponent.properties];
                                updatedProps[index] = { ...prop, type: e.target.value as any };
                                updateComponent({ ...currentComponent, properties: updatedProps });
                              }}
                              className="bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="color">Color</option>
                              <option value="select">Select</option>
                            </select>
                          </div>
                          
                          {prop.type === 'boolean' ? (
                            <input
                              type="checkbox"
                              checked={prop.value}
                              onChange={(e) => updateComponentProperty(prop.name, e.target.checked)}
                              className="text-xs"
                            />
                          ) : prop.type === 'select' ? (
                            <select
                              value={prop.value}
                              onChange={(e) => updateComponentProperty(prop.name, e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs"
                            >
                              {prop.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={prop.type === 'number' ? 'number' : prop.type === 'color' ? 'color' : 'text'}
                              value={prop.value}
                              onChange={(e) => updateComponentProperty(prop.name, prop.type === 'number' ? +e.target.value : e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs"
                            />
                          )}
                          
                          <textarea
                            value={prop.description || ''}
                            onChange={(e) => {
                              const updatedProps = [...currentComponent.properties];
                              updatedProps[index] = { ...prop, description: e.target.value };
                              updateComponent({ ...currentComponent, properties: updatedProps });
                            }}
                            placeholder="Property description..."
                            className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs mt-1 h-12 resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Events</div>
                      <button
                        onClick={addEvent}
                        className="text-xs bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded"
                      >
                        Add Event
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentComponent.events.map((event, index) => (
                        <div key={index} className="bg-gray-800 p-2 rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={event.name}
                              onChange={(e) => {
                                const updatedEvents = [...currentComponent.events];
                                updatedEvents[index] = { ...event, name: e.target.value };
                                updateComponent({ ...currentComponent, events: updatedEvents });
                              }}
                              className="flex-1 bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs"
                            />
                            <select
                              value={event.type}
                              onChange={(e) => {
                                const updatedEvents = [...currentComponent.events];
                                updatedEvents[index] = { ...event, type: e.target.value as any };
                                updateComponent({ ...currentComponent, events: updatedEvents });
                              }}
                              className="bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs"
                            >
                              <option value="click">Click</option>
                              <option value="change">Change</option>
                              <option value="hover">Hover</option>
                              <option value="focus">Focus</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          <textarea
                            value={event.action}
                            onChange={(e) => {
                              const updatedEvents = [...currentComponent.events];
                              updatedEvents[index] = { ...event, action: e.target.value };
                              updateComponent({ ...currentComponent, events: updatedEvents });
                            }}
                            placeholder="Event action code..."
                            className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs h-16 resize-none font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Edit3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Select a component to edit</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">Component Library</div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs"
                  placeholder="Search library..."
                />
                <button className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded">
                  Import
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {filteredComponents.map(component => (
                <div key={component.id} className="bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {component.icon}
                      <div>
                        <div className="text-sm font-medium">{component.name}</div>
                        <div className="text-xs text-gray-400">{component.category}</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => exportComponent(component)}
                        className="p-1 bg-green-600 hover:bg-green-700 rounded"
                        title="Export"
                      >
                        <Download size={10} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentComponent(component);
                          setActiveTab('edit');
                        }}
                        className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                        title="Edit"
                      >
                        <Edit3 size={10} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2">
                    Properties: {component.properties.length} • Events: {component.events.length}
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Created: {component.created.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">Component Templates</div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs"
                placeholder="Search templates..."
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredTemplates.map(template => (
                <div key={template.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium">{template.name}</div>
                      <div className="text-xs text-gray-400">{template.category}</div>
                    </div>
                    <button
                      className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      onClick={() => {
                        // Create component from template
                        const newComponent: CustomComponent = {
                          id: Date.now().toString(),
                          name: template.name,
                          type: template.baseComponent,
                          category: template.category,
                          icon: <Square size={14} />,
                          properties: [...template.presetProperties],
                          events: [],
                          style: {
                            width: 200,
                            height: 100,
                            backgroundColor: '#ffffff',
                            borderColor: '#d1d5db',
                            borderWidth: 1,
                            borderRadius: 4,
                            padding: 8,
                            margin: 4
                          },
                          pythonCode: `# Generated from template: ${template.name}`,
                          created: new Date(),
                          modified: new Date()
                        };
                        setCustomComponents(prev => [...prev, newComponent]);
                        setCurrentComponent(newComponent);
                        setActiveTab('edit');
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                  <p className="text-xs text-gray-300 mb-3">{template.description}</p>
                  <div className="text-xs text-gray-400">
                    Base: {template.baseComponent} • Properties: {template.presetProperties.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};