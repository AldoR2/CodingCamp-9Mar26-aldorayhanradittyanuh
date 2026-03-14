# Project Structure

## Directory Layout

```
/
├── index.html          # Main entry point, contains all HTML structure
├── css/
│   └── style.css       # All styling rules
├── js/
│   └── script.js       # All application logic
└── .kiro/
    ├── specs/          # Spec-driven development documents
    └── steering/       # AI assistant guidance documents
```

## File Organization Rules

### HTML (index.html)
- Single HTML file at root
- Contains complete DOM structure for all components
- Links to CSS and JS files using relative paths
- Semantic HTML5 elements preferred

### CSS (css/style.css)
- Single CSS file in css/ directory
- Organized by component sections
- Use clear class names that describe purpose
- Maintain consistent spacing and formatting

### JavaScript (js/script.js)
- Single JavaScript file in js/ directory
- Component-based organization (each feature is a separate object/module)
- Components: GreetingComponent, FocusTimer, TodoList, QuickLinks, Storage
- Each component manages its own state and DOM manipulation
- Use const for component objects to prevent reassignment

## Component Architecture

Each component follows this pattern:
```javascript
const ComponentName = {
  // State properties
  property: initialValue,
  
  // Initialization
  init() {
    // Load data, set up event listeners
  },
  
  // Public methods
  publicMethod() {
    // Component logic
  },
  
  // Private/helper methods
  helperMethod() {
    // Internal logic
  }
};
```

## Data Persistence

Local Storage keys use the prefix `productivity-dashboard-`:
- `productivity-dashboard-tasks`: Array of task objects
- `productivity-dashboard-links`: Array of link objects

## Naming Conventions

- **HTML IDs**: kebab-case (e.g., `timer-display`, `todo-list`)
- **CSS Classes**: kebab-case (e.g., `.todo-item`, `.link-button`)
- **JavaScript Variables**: camelCase (e.g., `timeRemaining`, `isRunning`)
- **JavaScript Components**: PascalCase (e.g., `FocusTimer`, `TodoList`)
- **JavaScript Methods**: camelCase (e.g., `updateDisplay()`, `saveTasks()`)
