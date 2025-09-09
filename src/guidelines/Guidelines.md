# Python GUI Toolbox System Guidelines

This project implements a comprehensive mechanic's toolbox interface for organizing and creating Python GUI components.

## General Guidelines

* Maintain the authentic metallic toolbox aesthetic with realistic 3D perspective effects
* Use proper z-index layering to ensure drawers open in correct order (higher toolboxes have higher z-indexes)
* Preserve the 3D transformation effects for lid opening and drawer perspective
* Keep component drag-and-drop functionality smooth and responsive
* Maintain proper canvas scaling and minimization features

## Design System Rules

### Toolbox Structure
* **Top Toolbox**: Basic and input components with canvas lid (z-index 96-100)
* **Middle Toolbox**: Dialogs, system components, and Component Creator (z-index 88-95) 
* **Bottom Toolbox**: Development tools - IDE, Console, File Explorer (z-index 87-89)
* Each toolbox must touch the one above it (-mt-2 spacing)

### Drawer Specifications
* **Small drawers**: 23px height for top row, 27px for middle row front drawers
* **Large drawers**: 40px height for top toolbox, 45px for middle toolbox, 67px for bottom toolbox deep drawers
* All drawers use metallic gradient: `from-gray-300 via-gray-400 to-gray-500`
* Drawer content height: IDE/Console/Explorer/Creator = 450px, others = 200px

### Canvas Requirements
* **Normal size**: 320px height
* **Expanded size**: 640px height (double)
* **Minimized size**: 60px height (header only)
* Must include minimize, expand, and close controls
* Grid background with 20px spacing when not minimized

### Component Creator Specifications
* Must be in a large drawer (middle-deep-2) for proper functionality
* Include all 4 tabs: Create, Edit, Library, Templates
* Support real-time preview, property editing, and Python code generation
* Enable export/import of custom components

### Color Palette
* **Toolbox gradients**: 
  - Top: `from-gray-400 via-gray-500 to-gray-600`
  - Middle: `from-gray-500 via-gray-600 to-gray-700` 
  - Bottom: `from-gray-600 via-gray-700 to-gray-800`
* **Drawer content**: `from-gray-200 via-gray-250 to-gray-300`
* **Navigation controls**: `from-gray-500 via-gray-600 to-gray-700`

### Navigation System
* Left/right arrows for cycling through toolbox sets
* "New" button for creating additional toolbox sets
* Navigation bar positioned between lid and top drawer row
* Arrow buttons with 3D perspective effects (rotateY ±5deg)

### Typography and Iconography
* Use Lucide React icons consistently throughout
* Drawer labels must be concise (single words when possible)
* Component labels should be descriptive but brief
* Maintain 14px base font size from globals.css

## Development Practices

### Component Organization
* Keep main ToolBox component focused on layout and state management
* Separate complex features (IDE, Creator, Explorer) into dedicated components
* Use proper TypeScript interfaces for all component props and state
* Maintain consistent naming conventions (PascalCase for components)

### State Management
* Use React useState for drawer states, canvas state, and toolbox sets
* Implement proper drag-and-drop with native HTML5 API
* Maintain canvas item state with unique IDs and positioning
* Preserve toolbox set navigation state

### Performance Considerations
* Use proper z-index management to avoid rendering issues
* Implement smooth transitions (duration-300 to duration-700)
* Optimize drawer opening animations with perspective transforms
* Use proper event handling for drag operations

### Accessibility
* Ensure all interactive elements have proper titles/tooltips
* Use semantic HTML elements where appropriate
* Maintain keyboard navigation support
* Provide visual feedback for interactive states

## File Structure Rules

* Main components in `/components/` directory
* UI components remain in `/components/ui/` (ShadCN)
* Specialized toolbox components as separate files
* Import statements should use relative paths for local components
* Maintain clean separation between layout and functionality components

This project represents a sophisticated visual development environment for Python GUI applications, combining the familiar metaphor of a mechanic's toolbox with modern web development practices.