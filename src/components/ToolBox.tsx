import React, { useState, useRef } from 'react';
import { 
  Square, 
  Type, 
  ToggleLeft, 
  CheckSquare, 
  Circle, 
  SlidersHorizontal, 
  Activity, 
  List, 
  Menu, 
  Monitor, 
  MessageSquare, 
  Calendar, 
  Image, 
  Play, 
  BarChart3,
  Settings,
  Grid3X3,
  MousePointer,
  Layers,
  Eye,
  Download,
  Upload,
  Save,
  Folder,
  File,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  RectangleHorizontal,
  Trash2,
  Move,
  X,
  Code,
  Terminal,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minimize2,
  Plus
} from 'lucide-react';

import { CodeIDE } from './CodeIDE';
import { ConsoleFileTree } from './ConsoleFileTree';
import { FileExplorer } from './FileExplorer';
import { ComponentCreator } from './ComponentCreator';

interface DrawerProps {
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  height: string;
  width: string;
  children: React.ReactNode;
  label: string;
  position?: 'top' | 'bottom';
  zIndex: number;
}

interface CanvasItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  x: number;
  y: number;
}

interface ToolboxSet {
  id: string;
  name: string;
  description: string;
  created: Date;
  components: CanvasItem[];
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onToggle, height, width, children, label, position = 'top', zIndex }) => {
  const contentHeight = label === 'Code IDE' ? '300px' : 
                       label === 'Console & Files' ? '450px' :
                       label === 'File Explorer' ? '450px' :
                       label === 'Creator' ? '450px' : '200px';

  return (
    <div className="relative" style={{ zIndex: isOpen ? zIndex : 10 }}>
      {/* Drawer Face */}
      <div 
        className={`
          bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 
          border-2 border-gray-600 rounded-sm cursor-pointer
          shadow-lg transition-all duration-300 ease-in-out
          hover:shadow-xl hover:from-gray-400 hover:via-gray-500 hover:to-gray-600
          ${isOpen ? 'shadow-2xl' : ''}
        `}
        style={{ height, width }}
        onClick={onToggle}
      >
        {/* Centered Handle */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3">
          <div className="w-8 h-2 bg-gray-600 rounded-full shadow-inner">
            <div className="w-full h-full bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"></div>
          </div>
          
          {/* Centered Label */}
          <span className="text-sm text-gray-700 font-medium">{label}</span>
          
          {/* Pull indicator */}
          <ChevronDown 
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
              isOpen ? (position === 'bottom' ? '' : 'rotate-180') : ''
            }`} 
          />
        </div>
        
        {/* Corner details */}
        <div className="absolute top-1 left-1 w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="absolute top-1 right-1 w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-gray-600 rounded-full"></div>
      </div>
      
      {/* Drawer Content - Opens Downward or Upward */}
      <div 
        className={`
          absolute left-0 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400
          border-2 border-gray-600 ${position === 'top' ? 'border-t-0' : 'border-b-0'}
          shadow-2xl transition-all duration-500 ease-in-out
          ${position === 'top' ? 'top-full' : 'bottom-full'}
          ${isOpen ? 'translate-y-0 opacity-100' : (position === 'top' ? '-translate-y-full' : 'translate-y-full') + ' opacity-0 pointer-events-none'}
        `}
        style={{ 
          width, 
          height: contentHeight,
          transform: isOpen 
            ? (position === 'top' 
                ? 'perspective(1000px) rotateX(-2deg)' 
                : 'perspective(1000px) rotateX(2deg)')
            : (position === 'top' 
                ? 'perspective(1000px) rotateX(-90deg) translateY(-100%)' 
                : 'perspective(1000px) rotateX(90deg) translateY(100%)'),
          transformOrigin: position === 'top' ? 'top' : 'bottom'
        }}
      >
        {/* 3D Side panels for depth */}
        <div className="absolute -left-2 top-0 w-2 h-full bg-gray-500 transform skew-y-2"></div>
        <div className="absolute -right-2 top-0 w-2 h-full bg-gray-600 transform -skew-y-2"></div>
        
        {/* Content area */}
        <div className="h-full overflow-hidden">
          {/* Special handling for IDE/Console/Explorer/Creator components */}
          {(label === 'Code IDE' || label === 'Console & Files' || label === 'File Explorer' || label === 'Creator') ? (
            <div className="h-full">
              {children}
            </div>
          ) : (
            <div className="p-3 h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 auto-rows-min">
                {children}
              </div>
            </div>
          )}
        </div>
        
        {/* Edge for 3D effect */}
        <div className={`absolute ${position === 'top' ? '-bottom-2' : '-top-2'} left-0 right-0 h-2 bg-gray-600`}
             style={{ 
               transform: position === 'top' ? 'perspective(1000px) rotateX(45deg)' : 'perspective(1000px) rotateX(-45deg)' 
             }}></div>
      </div>
    </div>
  );
};

const DraggableIcon: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  size?: number; 
  onDragStart: (icon: React.ReactNode, label: string) => void;
}> = ({ icon, label, size = 14, onDragStart }) => (
  <div 
    className="flex flex-col items-center p-2 hover:bg-gray-300 rounded cursor-grab active:cursor-grabbing group transition-all hover:scale-105"
    draggable
    onDragStart={() => onDragStart(icon, label)}
  >
    <div className="text-gray-700 group-hover:text-gray-900 mb-1">
      {React.cloneElement(icon as React.ReactElement, { size })}
    </div>
    <span className="text-xs text-gray-600 text-center leading-tight font-normal">{label}</span>
  </div>
);

const CanvasComponent: React.FC<{ 
  item: CanvasItem; 
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}> = ({ item, onMove, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragOffset.x;
        const newY = e.clientY - canvasRect.top - dragOffset.y;
        onMove(item.id, Math.max(0, newX), Math.max(0, newY));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className={`absolute bg-white border-2 border-gray-400 rounded-lg p-2 shadow-lg cursor-move group hover:shadow-xl transition-all ${
        isDragging ? 'z-50 scale-110' : 'z-10'
      }`}
      style={{ left: item.x, top: item.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center space-x-2">
        <div className="text-gray-700">
          {item.icon}
        </div>
        <span className="text-sm text-gray-800 font-normal">{item.label}</span>
        <button
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-2"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export const ToolBox: React.FC = () => {
  const [openDrawers, setOpenDrawers] = useState<Set<string>>(new Set());
  const [lidOpen, setLidOpen] = useState(false);
  const [canvasExpanded, setCanvasExpanded] = useState(false);
  const [canvasMinimized, setCanvasMinimized] = useState(false);
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<{ icon: React.ReactNode; label: string } | null>(null);
  
  // Multi-toolbox set management
  const [toolboxSets, setToolboxSets] = useState<ToolboxSet[]>([
    {
      id: '1',
      name: 'Default Toolbox Set',
      description: 'Standard Python GUI components and development tools',
      created: new Date(),
      components: []
    }
  ]);
  const [currentToolboxIndex, setCurrentToolboxIndex] = useState(0);

  const toggleDrawer = (id: string) => {
    const newOpenDrawers = new Set(openDrawers);
    if (newOpenDrawers.has(id)) {
      newOpenDrawers.delete(id);
    } else {
      newOpenDrawers.add(id);
    }
    setOpenDrawers(newOpenDrawers);
  };

  const handleDragStart = (icon: React.ReactNode, label: string) => {
    setDraggedComponent({ icon, label });
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedComponent) {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newItem: CanvasItem = {
          id: `item-${Date.now()}`,
          icon: draggedComponent.icon,
          label: draggedComponent.label,
          x: Math.max(0, x - 50),
          y: Math.max(0, y - 25)
        };
        
        setCanvasItems(prev => [...prev, newItem]);
        setDraggedComponent(null);
      }
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const moveCanvasItem = (id: string, x: number, y: number) => {
    setCanvasItems(prev => prev.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
  };

  const deleteCanvasItem = (id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const closeLid = () => {
    setLidOpen(false);
    setCanvasExpanded(false);
    setCanvasMinimized(false);
  };

  const toggleCanvasSize = () => {
    setCanvasExpanded(!canvasExpanded);
  };

  const toggleCanvasMinimized = () => {
    setCanvasMinimized(!canvasMinimized);
  };

  // Navigation functions for toolbox sets
  const navigateToolboxSet = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentToolboxIndex(prev => prev > 0 ? prev - 1 : toolboxSets.length - 1);
    } else {
      setCurrentToolboxIndex(prev => prev < toolboxSets.length - 1 ? prev + 1 : 0);
    }
  };

  const createNewToolboxSet = () => {
    const newSet: ToolboxSet = {
      id: Date.now().toString(),
      name: `Toolbox Set ${toolboxSets.length + 1}`,
      description: 'Custom toolbox set for specific project',
      created: new Date(),
      components: [...canvasItems] // Copy current canvas items
    };
    setToolboxSets(prev => [...prev, newSet]);
    setCurrentToolboxIndex(toolboxSets.length);
  };

  const currentToolboxSet = toolboxSets[currentToolboxIndex];
  const canvasHeight = canvasMinimized ? 60 : (canvasExpanded ? 640 : 320);

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 min-h-screen" style={{ paddingTop: '24rem' }}>
      {/* TOP TOOLBOX */}
      <div className="bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 p-3 rounded-lg shadow-2xl border-4 border-gray-700 relative w-full max-w-3xl">
        {/* Canvas Area - Connected to lid position with expandable/minimizable height */}
        {lidOpen && (
          <div 
            id="canvas"
            className="absolute left-3 right-3 bg-gradient-to-br from-white to-gray-100 border-4 border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden transition-all duration-500"
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            style={{ 
              height: `${canvasHeight}px`,
              bottom: '100%',
              marginBottom: '-4px',
              transform: 'perspective(1000px) rotateX(-3deg)',
              transformOrigin: 'bottom'
            }}
          >
            {/* Grid background */}
            {!canvasMinimized && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #666 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              ></div>
            )}
            
            {/* Canvas header */}
            <div className="bg-gray-600 text-white p-3 font-medium flex items-center justify-between" style={{ fontSize: '14px' }}>
              <div className="flex items-center space-x-2">
                <Move size={16} />
                <span>GUI Designer Canvas - {currentToolboxSet.name}</span>
                <span className="bg-gray-700 px-2 py-1 rounded" style={{ fontSize: '12px' }}>
                  {canvasMinimized ? 'Minimized' : canvasExpanded ? 'Expanded' : 'Normal'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleCanvasMinimized}
                  className="hover:bg-gray-700 p-1 rounded transition-colors"
                  type="button"
                  title={canvasMinimized ? 'Restore Canvas' : 'Minimize Canvas'}
                >
                  {canvasMinimized ? <ChevronUp size={16} /> : <Minimize2 size={16} />}
                </button>
                {!canvasMinimized && (
                  <button
                    onClick={toggleCanvasSize}
                    className="hover:bg-gray-700 p-1 rounded transition-colors"
                    type="button"
                    title={canvasExpanded ? 'Collapse Canvas' : 'Expand Canvas'}
                  >
                    <ChevronDown className={`transform transition-transform ${canvasExpanded ? 'rotate-180' : ''}`} size={16} />
                  </button>
                )}
                <button
                  onClick={closeLid}
                  className="hover:bg-gray-700 p-1 rounded transition-colors"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Canvas content - only show when not minimized */}
            {!canvasMinimized && (
              <div className="relative w-full h-full p-4">
                {canvasItems.map(item => (
                  <CanvasComponent
                    key={item.id}
                    item={item}
                    onMove={moveCanvasItem}
                    onDelete={deleteCanvasItem}
                  />
                ))}
                
                {/* Drop zone indicator */}
                {canvasItems.length === 0 && (
                  <div className="absolute inset-4 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Grid3X3 size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="font-normal">Drag GUI components here to design your interface</p>
                      <p className="opacity-75 mt-2 font-normal" style={{ fontSize: '12px' }}>
                        Use minimize button when canvas extends too high • Click expand to {canvasExpanded ? 'collapse' : 'double'} canvas size
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lid - Full width, no side borders */}
        <div className="mb-3 relative -mx-3">
          <div 
            className={`
              w-full h-12 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 
              border-2 border-gray-600 border-l-0 border-r-0 cursor-pointer shadow-lg
              transition-all duration-700 ease-in-out
            `}
            onClick={() => setLidOpen(!lidOpen)}
            style={{
              transform: lidOpen 
                ? 'perspective(800px) rotateX(75deg) scaleY(0.3)' 
                : 'perspective(800px) rotateX(0deg) scaleY(1)',
              transformOrigin: 'bottom'
            }}
          >
            <div className="flex items-center justify-center h-full space-x-3">
              <div className="w-8 h-4 bg-gray-600 rounded shadow-inner flex items-center justify-center">
                <div className="w-4 h-1 bg-gray-500 rounded"></div>
              </div>
              <span className="text-gray-700 font-medium" style={{ fontSize: '14px' }}>PYTHON GUI CANVAS</span>
              <ChevronDown className={`w-5 h-5 text-gray-700 transition-transform duration-700 ${lidOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Hinges */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gray-600 rounded-full shadow-inner"></div>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-600 rounded-full shadow-inner"></div>
          </div>
        </div>

        {/* Navigation Controls for Toolbox Sets - Inside toolbox, below lid, above drawers */}
        <div className="mb-3 -mx-3">
          <div className="bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700 p-2 border-2 border-gray-700 border-l-0 border-r-0 border-t-0">
            <div className="flex items-center justify-between">
              {/* Left Arrow */}
              <button
                onClick={() => navigateToolboxSet('prev')}
                className="flex items-center justify-center w-8 h-8 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 border-2 border-gray-700 rounded shadow-lg hover:shadow-xl transition-all hover:from-gray-500 hover:via-gray-600 hover:to-gray-700"
                title="Previous Toolbox Set"
                style={{
                  transform: 'perspective(500px) rotateY(-5deg)',
                }}
              >
                <ChevronLeft size={14} className="text-gray-200" />
              </button>
              
              {/* Center Info */}
              <div className="flex-1 text-center">
                <div className="font-medium text-gray-200" style={{ fontSize: '14px' }}>{currentToolboxSet.name}</div>
                <div className="text-gray-300" style={{ fontSize: '12px' }}>
                  Set {currentToolboxIndex + 1} of {toolboxSets.length} • {currentToolboxSet.description}
                </div>
              </div>
              
              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={createNewToolboxSet}
                  className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-b from-blue-500 to-blue-700 border border-blue-800 rounded text-white shadow-md hover:shadow-lg transition-all hover:from-blue-600 hover:to-blue-800"
                  title="Create New Toolbox Set"
                  style={{ fontSize: '12px' }}
                >
                  <Plus size={10} />
                  <span>New</span>
                </button>
                
                {/* Right Arrow */}
                <button
                  onClick={() => navigateToolboxSet('next')}
                  className="flex items-center justify-center w-8 h-8 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 border-2 border-gray-700 rounded shadow-lg hover:shadow-xl transition-all hover:from-gray-500 hover:via-gray-600 hover:to-gray-700"
                  title="Next Toolbox Set"
                  style={{
                    transform: 'perspective(500px) rotateY(5deg)',
                  }}
                >
                  <ChevronRight size={14} className="text-gray-200" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Small Drawers - Reduced height by 1/3 - Highest z-index */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <Drawer
            id="top-1"
            isOpen={openDrawers.has('top-1')}
            onToggle={() => toggleDrawer('top-1')}
            height="23px"
            width="100%"
            label="Basic"
            zIndex={100}
          >
            <DraggableIcon icon={<Square size={14} />} label="Button" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Type size={14} />} label="Label" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Square size={14} />} label="Entry" onDragStart={handleDragStart} />
            <DraggableIcon icon={<CheckSquare size={14} />} label="Checkbox" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Circle size={14} />} label="Radio" onDragStart={handleDragStart} />
            <DraggableIcon icon={<ToggleLeft size={14} />} label="Toggle" onDragStart={handleDragStart} />
            <DraggableIcon icon={<SlidersHorizontal size={14} />} label="Slider" onDragStart={handleDragStart} />
            <DraggableIcon icon={<List size={14} />} label="Listbox" onDragStart={handleDragStart} />
          </Drawer>
          
          <Drawer
            id="top-2"
            isOpen={openDrawers.has('top-2')}
            onToggle={() => toggleDrawer('top-2')}
            height="23px"
            width="100%"
            label="Input"
            zIndex={99}
          >
            <DraggableIcon icon={<Menu size={14} />} label="Menu" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Calendar size={14} />} label="Calendar" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Search size={14} />} label="Search" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Filter size={14} />} label="Filter" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Image size={14} />} label="Image" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Activity size={14} />} label="Progress" onDragStart={handleDragStart} />
            <DraggableIcon icon={<BarChart3 size={14} />} label="Chart" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Grid3X3 size={14} />} label="Table" onDragStart={handleDragStart} />
          </Drawer>
          
          {/* Container Controls Drawer - Moved from middle drawer, now in small drawer */}
          <Drawer
            id="top-3"
            isOpen={openDrawers.has('top-3')}
            onToggle={() => toggleDrawer('top-3')}
            height="23px"
            width="100%"
            label="Containers"
            zIndex={98}
          >
            <DraggableIcon icon={<RectangleHorizontal size={14} />} label="Panel" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Layers size={14} />} label="Group Box" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Square size={14} />} label="Split" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Grid3X3 size={14} />} label="Tab" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Monitor size={14} />} label="Scroll" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Eye size={14} />} label="Viewport" onDragStart={handleDragStart} />
            <DraggableIcon icon={<List size={14} />} label="Stack" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Folder size={14} />} label="Accordion" onDragStart={handleDragStart} />
          </Drawer>
        </div>

        {/* Top 2 Large Drawers - Reduced height by half */}
        <div className="space-y-1">
          <Drawer
            id="top-large-1"
            isOpen={openDrawers.has('top-large-1')}
            onToggle={() => toggleDrawer('top-large-1')}
            height="40px"
            width="100%"
            label="Layout & Containers"
            zIndex={97}
          >
            <DraggableIcon icon={<RectangleHorizontal size={16} />} label="Frame" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Layers size={16} />} label="Panel" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Grid3X3 size={16} />} label="Grid" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Monitor size={16} />} label="Window" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Square size={16} />} label="Group Box" onDragStart={handleDragStart} />
            <DraggableIcon icon={<List size={16} />} label="Stack Panel" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Eye size={16} />} label="Scroll View" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Folder size={16} />} label="Tab Control" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Settings size={16} />} label="Split Panel" onDragStart={handleDragStart} />
            <DraggableIcon icon={<MousePointer size={16} />} label="Canvas" onDragStart={handleDragStart} />
            <DraggableIcon icon={<RefreshCw size={16} />} label="Spinner" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Download size={16} />} label="File Drop" onDragStart={handleDragStart} />
          </Drawer>
          
          <Drawer
            id="top-large-2"
            isOpen={openDrawers.has('top-large-2')}
            onToggle={() => toggleDrawer('top-large-2')}
            height="40px"
            width="100%"
            label="Advanced Widgets"
            zIndex={96}
          >
            <DraggableIcon icon={<Play size={16} />} label="Media Player" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Calendar size={16} />} label="Date Picker" onDragStart={handleDragStart} />
            <DraggableIcon icon={<BarChart3 size={16} />} label="Plot Widget" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Type size={16} />} label="Rich Text" onDragStart={handleDragStart} />
            <DraggableIcon icon={<MousePointer size={16} />} label="Drawing Canvas" onDragStart={handleDragStart} />
            <DraggableIcon icon={<RefreshCw size={16} />} label="Spinner" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Download size={16} />} label="File Drop" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Upload size={16} />} label="Upload Zone" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Save size={16} />} label="Property Grid" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Search size={16} />} label="Search Control" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Filter size={16} />} label="Filter Panel" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Image size={16} />} label="Image Viewer" onDragStart={handleDragStart} />
          </Drawer>
        </div>
      </div>

      {/* MIDDLE TOOLBOX - Touching the top toolbox */}
      <div className="bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700 p-3 rounded-lg shadow-2xl border-4 border-gray-800 w-full max-w-3xl -mt-2">
        {/* Middle 3 Front Drawers */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <Drawer
            id="middle-front-1"
            isOpen={openDrawers.has('middle-front-1')}
            onToggle={() => toggleDrawer('middle-front-1')}
            height="27px"
            width="100%"
            label="Dialogs"
            zIndex={95}
          >
            <DraggableIcon icon={<MessageSquare size={14} />} label="Info Dialog" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Square size={14} />} label="Error Dialog" onDragStart={handleDragStart} />
            <DraggableIcon icon={<RectangleHorizontal size={14} />} label="Warning" onDragStart={handleDragStart} />
            <DraggableIcon icon={<List size={14} />} label="Question" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Folder size={14} />} label="File Dialog" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Save size={14} />} label="Save Dialog" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Download size={14} />} label="Color Picker" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Upload size={14} />} label="Font Dialog" onDragStart={handleDragStart} />
          </Drawer>
          
          <Drawer
            id="middle-front-2"
            isOpen={openDrawers.has('middle-front-2')}
            onToggle={() => toggleDrawer('middle-front-2')}
            height="27px"
            width="100%"
            label="System"
            zIndex={94}
          >
            <DraggableIcon icon={<File size={14} />} label="Directory" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Search size={14} />} label="Find Dialog" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Settings size={14} />} label="Preferences" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Monitor size={14} />} label="About Dialog" onDragStart={handleDragStart} />
            <DraggableIcon icon={<BarChart3 size={14} />} label="Matplotlib" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Image size={14} />} label="PIL Image" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Play size={14} />} label="OpenCV" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Grid3X3 size={14} />} label="NumPy Array" onDragStart={handleDragStart} />
          </Drawer>
          
          <Drawer
            id="middle-front-3"
            isOpen={openDrawers.has('middle-front-3')}
            onToggle={() => toggleDrawer('middle-front-3')}
            height="27px"
            width="100%"
            label="Libraries"
            zIndex={93}
          >
            <DraggableIcon icon={<Type size={14} />} label="Terminal" onDragStart={handleDragStart} />
            <DraggableIcon icon={<MessageSquare size={14} />} label="Console" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Calendar size={14} />} label="Pandas DataFrame" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Search size={14} />} label="SciPy Plot" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Settings size={14} />} label="Seaborn Chart" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Download size={14} />} label="File Browser" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Eye size={14} />} label="Jupyter Console" onDragStart={handleDragStart} />
            <DraggableIcon icon={<RefreshCw size={14} />} label="Live Plot" onDragStart={handleDragStart} />
          </Drawer>
        </div>

        {/* Middle 3 Deep Drawers */}
        <div className="space-y-1">
          <Drawer
            id="middle-deep-1"
            isOpen={openDrawers.has('middle-deep-1')}
            onToggle={() => toggleDrawer('middle-deep-1')}
            height="45px"
            width="100%"
            label="Advanced Components"
            zIndex={92}
          >
            <DraggableIcon icon={<Calendar size={16} />} label="Calendar Widget" onDragStart={handleDragStart} />
            <DraggableIcon icon={<BarChart3 size={16} />} label="Chart Control" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Grid3X3 size={16} />} label="Data Grid" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Type size={16} />} label="Rich Text Editor" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Image size={16} />} label="Image Viewer" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Play size={16} />} label="Media Player" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Monitor size={16} />} label="Web Browser" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Search size={16} />} label="Search Control" onDragStart={handleDragStart} />
            <DraggableIcon icon={<List size={16} />} label="Tree View" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Folder size={16} />} label="Property Browser" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Settings size={16} />} label="Tool Panel" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Eye size={16} />} label="Preview Pane" onDragStart={handleDragStart} />
          </Drawer>
          
          {/* Component Creator Drawer - Moved from top small drawer, now in large drawer */}
          <Drawer
            id="middle-deep-2"
            isOpen={openDrawers.has('middle-deep-2')}
            onToggle={() => toggleDrawer('middle-deep-2')}
            height="45px"
            width="100%"
            label="Creator"
            zIndex={91}
          >
            <ComponentCreator />
          </Drawer>
          
          <Drawer
            id="middle-deep-3"
            isOpen={openDrawers.has('middle-deep-3')}
            onToggle={() => toggleDrawer('middle-deep-3')}
            height="45px"
            width="100%"
            label="Python Specialized"
            zIndex={90}
          >
            <DraggableIcon icon={<BarChart3 size={16} />} label="Matplotlib Plot" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Image size={16} />} label="PIL Image Display" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Play size={16} />} label="OpenCV Camera" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Grid3X3 size={16} />} label="NumPy Array View" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Type size={16} />} label="Jupyter Console" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Calendar size={16} />} label="Pandas DataFrame" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Search size={16} />} label="SciPy Plot" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Settings size={16} />} label="Seaborn Chart" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Download size={16} />} label="File Browser" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Upload size={16} />} label="Data Importer" onDragStart={handleDragStart} />
            <DraggableIcon icon={<Save size={16} />} label="Model Viewer" onDragStart={handleDragStart} />
            <DraggableIcon icon={<MessageSquare size={16} />} label="Chat Interface" onDragStart={handleDragStart} />
          </Drawer>
        </div>
      </div>

      {/* BOTTOM TOOLBOX - Third toolbox with IDE, Console, and File Explorer */}
      <div className="bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 p-3 rounded-lg shadow-2xl border-4 border-gray-900 w-full max-w-3xl -mt-2">
        {/* 3 Stacked Full-Width Drawers */}
        <div className="space-y-1">
          {/* Code IDE Drawer */}
          <Drawer
            id="bottom-ide"
            isOpen={openDrawers.has('bottom-ide')}
            onToggle={() => toggleDrawer('bottom-ide')}
            height="45px"
            width="100%"
            label="Code IDE"
            zIndex={89}
          >
            <CodeIDE />
          </Drawer>
          
          {/* Console & Files Drawer */}
          <Drawer
            id="bottom-console"
            isOpen={openDrawers.has('bottom-console')}
            onToggle={() => toggleDrawer('bottom-console')}
            height="67px"
            width="100%"
            label="Console & Files"
            zIndex={88}
          >
            <ConsoleFileTree />
          </Drawer>
          
          {/* File Explorer Drawer */}
          <Drawer
            id="bottom-explorer"
            isOpen={openDrawers.has('bottom-explorer')}
            onToggle={() => toggleDrawer('bottom-explorer')}
            height="67px"
            width="100%"
            label="File Explorer"
            zIndex={87}
          >
            <FileExplorer />
          </Drawer>
        </div>
      </div>

      {/* Floating Info Panel - Shows current toolbox set info */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg max-w-xs" style={{ fontSize: '12px' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Toolbox System v2.0</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        <div className="text-gray-300 space-y-1 font-normal">
          <div>Active Set: {currentToolboxSet.name}</div>
          <div>Components on Canvas: {canvasItems.length}</div>
          <div>Created: {currentToolboxSet.created.toLocaleDateString()}</div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400 font-normal">
          <div>• Use left/right arrows to cycle sets</div>
          <div>• Canvas can expand/minimize</div>
          <div>• Create custom components in Creator</div>
        </div>
      </div>
    </div>
  );
};