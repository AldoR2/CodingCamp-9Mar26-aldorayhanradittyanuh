# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript that provides users with essential productivity tools in a clean, distraction-free interface. The application consists of four main components: a greeting display with current time/date and optional custom name, a 25-minute focus timer, a to-do list manager with duplicate prevention, and a quick links panel for frequently visited websites. Users can switch between light and dark themes for comfortable viewing in different lighting conditions.

All data persistence is handled client-side using the browser's Local Storage API, eliminating the need for backend infrastructure. The application follows a component-based architecture where each feature (greeting, timer, todos, links, theme) operates independently with its own state management and DOM manipulation logic.

The design prioritizes simplicity, performance, and maintainability. The entire application loads from three files (index.html, style.css, script.js) and provides immediate visual feedback for all user interactions within 100ms. Theme changes are applied globally using CSS custom properties (CSS variables) for efficient styling updates.

## Architecture

### System Architecture

The application follows a modular, component-based architecture within a single-page application (SPA) structure:

```
┌─────────────────────────────────────────────┐
│           index.html (Entry Point)          │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│   style.css    │    │   script.js     │
│  (Styling +    │    │  (Application)  │
│   CSS Vars)    │    │                 │
└────────────────┘    └────────┬────────┘
                               │
        ┌──────────────────────┼──────────────────────┬──────────────┐
        │                      │                      │              │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐  ┌──▼────────┐
│ Greeting       │  │ Focus Timer      │  │ Todo List        │  │ Theme     │
│ Component      │  │ Component        │  │ Component        │  │ Manager   │
│ (+ Name Input) │  │                  │  │ (+ Dup Check)    │  │           │
└────────────────┘  └──────────────────┘  └──────────────────┘  └───────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Quick Links         │
                    │ Component           │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Local Storage API   │
                    │ (Browser)           │
                    └─────────────────────┘
```

### Component Responsibilities

1. **Greeting Component**: Manages time/date display, time-based greeting messages, and optional custom user name
2. **Focus Timer Component**: Handles countdown timer logic and UI updates
3. **Todo List Component**: Manages task CRUD operations, duplicate detection, and persistence
4. **Quick Links Component**: Manages link CRUD operations and persistence
5. **Theme Manager**: Handles light/dark mode switching and applies theme via CSS custom properties
6. **Storage Layer**: Abstracts Local Storage operations for data persistence

### Data Flow

- **Initialization**: On page load, each component initializes by reading from Local Storage and rendering initial state
- **User Interactions**: User actions trigger component methods that update internal state, modify the DOM, and persist changes to Local Storage
- **Time Updates**: Greeting component uses setInterval to update time display every second
- **Timer Updates**: Focus timer uses setInterval when active to decrement time every second

## Components and Interfaces

### 1. Greeting Component

**Purpose**: Display current time, date, time-based greeting, and optional custom user name

**DOM Structure**:
```html
<div id="greeting-section">
  <div id="time-display"></div>
  <div id="date-display"></div>
  <div id="greeting-message"></div>
  <div id="name-input-container">
    <input id="name-input" type="text" placeholder="Enter your name (optional)">
  </div>
</div>
```

**JavaScript Interface**:
```javascript
const GreetingComponent = {
  userName: string | null
  
  init(): void
  updateTime(): void
  getTimeOfDay(): string
  getGreeting(): string
  formatTime(date: Date): string
  formatDate(date: Date): string
  loadUserName(): void
  saveUserName(name: string): void
  clearUserName(): void
  updateGreetingMessage(): void
}
```

**Methods**:
- `init()`: Sets up interval to update time every second, loads saved user name, and attaches event listeners to name input
- `updateTime()`: Updates DOM with current time, date, and greeting
- `getTimeOfDay()`: Returns 'morning', 'afternoon', 'evening', or 'night' based on current hour
- `getGreeting()`: Returns appropriate greeting message based on time of day, appending user name if set
- `formatTime(date)`: Formats date as 12-hour time with AM/PM
- `formatDate(date)`: Formats date as "Day, Month Date" (e.g., "Monday, January 15")
- `loadUserName()`: Retrieves saved user name from Local Storage
- `saveUserName(name)`: Saves user name to Local Storage and updates greeting display
- `clearUserName()`: Removes user name from Local Storage and updates greeting display
- `updateGreetingMessage()`: Updates the greeting message DOM element with current greeting and optional name

### 2. Focus Timer Component

**Purpose**: Provide a 25-minute countdown timer for focus sessions

**DOM Structure**:
```html
<div id="timer-section">
  <div id="timer-display">25:00</div>
  <div id="timer-controls">
    <button id="timer-start">Start</button>
    <button id="timer-stop">Stop</button>
    <button id="timer-reset">Reset</button>
  </div>
</div>
```

**JavaScript Interface**:
```javascript
const FocusTimer = {
  timeRemaining: number  // seconds
  intervalId: number | null
  isRunning: boolean
  
  init(): void
  start(): void
  stop(): void
  reset(): void
  tick(): void
  updateDisplay(): void
  formatTime(seconds: number): string
}
```

**Methods**:
- `init()`: Initializes timer state and attaches event listeners
- `start()`: Begins countdown by setting interval to call tick() every second
- `stop()`: Pauses countdown by clearing interval
- `reset()`: Stops timer and resets to 25 minutes (1500 seconds)
- `tick()`: Decrements timeRemaining, updates display, stops at zero
- `updateDisplay()`: Updates DOM with formatted time
- `formatTime(seconds)`: Converts seconds to MM:SS format

### 3. Todo List Component

**Purpose**: Manage task creation, editing, completion, deletion, and duplicate prevention

**DOM Structure**:
```html
<div id="todo-section">
  <form id="todo-form">
    <input id="todo-input" type="text" placeholder="Add a new task...">
    <button type="submit">Add</button>
  </form>
  <div id="todo-feedback" class="feedback-message"></div>
  <ul id="todo-list"></ul>
</div>
```

**Task Item Structure**:
```html
<li class="todo-item" data-id="unique-id">
  <input type="checkbox" class="todo-checkbox">
  <span class="todo-text">Task description</span>
  <button class="todo-edit">Edit</button>
  <button class="todo-delete">Delete</button>
</li>
```

**JavaScript Interface**:
```javascript
const TodoList = {
  tasks: Array<Task>
  
  init(): void
  loadTasks(): void
  saveTasks(): void
  addTask(text: string): void
  toggleTask(id: string): void
  editTask(id: string, newText: string): void
  deleteTask(id: string): void
  renderTasks(): void
  createTaskElement(task: Task): HTMLElement
  generateId(): string
  isDuplicate(text: string): boolean
  showFeedback(message: string, type: string): void
  hideFeedback(): void
}
```

**Methods**:
- `init()`: Loads tasks from storage and sets up event listeners
- `loadTasks()`: Retrieves tasks array from Local Storage
- `saveTasks()`: Persists current tasks array to Local Storage
- `addTask(text)`: Creates new task if not duplicate, adds to array, saves, and re-renders
- `toggleTask(id)`: Toggles completion status, saves, and re-renders
- `editTask(id, newText)`: Updates task text if not duplicate, saves, and re-renders
- `deleteTask(id)`: Removes task from array, saves, and re-renders
- `renderTasks()`: Clears and rebuilds task list DOM
- `createTaskElement(task)`: Creates DOM element for a single task
- `generateId()`: Returns unique identifier (timestamp + random)
- `isDuplicate(text)`: Checks if task text already exists (case-insensitive comparison)
- `showFeedback(message, type)`: Displays feedback message to user (e.g., "Task already exists")
- `hideFeedback()`: Hides feedback message after timeout

### 4. Quick Links Component

**Purpose**: Manage quick access links to frequently visited websites

**DOM Structure**:
```html
<div id="links-section">
  <form id="link-form">
    <input id="link-url" type="url" placeholder="URL">
    <input id="link-name" type="text" placeholder="Display name">
    <button type="submit">Add Link</button>
  </form>
  <div id="links-container"></div>
</div>
```

**Link Item Structure**:
```html
<div class="link-item" data-id="unique-id">
  <a href="url" target="_blank" class="link-button">Display Name</a>
  <button class="link-delete">×</button>
</div>
```

**JavaScript Interface**:
```javascript
const QuickLinks = {
  links: Array<Link>
  
  init(): void
  loadLinks(): void
  saveLinks(): void
  addLink(url: string, name: string): void
  deleteLink(id: string): void
  renderLinks(): void
  createLinkElement(link: Link): HTMLElement
  generateId(): string
  validateUrl(url: string): boolean
}
```

**Methods**:
- `init()`: Loads links from storage and sets up event listeners
- `loadLinks()`: Retrieves links array from Local Storage
- `saveLinks()`: Persists current links array to Local Storage
- `addLink(url, name)`: Creates new link, adds to array, saves, and re-renders
- `deleteLink(id)`: Removes link from array, saves, and re-renders
- `renderLinks()`: Clears and rebuilds links container DOM
- `createLinkElement(link)`: Creates DOM element for a single link
- `generateId()`: Returns unique identifier (timestamp + random)
- `validateUrl(url)`: Ensures URL has proper format (adds https:// if missing)

### 5. Storage Utility

**Purpose**: Provide abstraction layer for Local Storage operations

**JavaScript Interface**:
```javascript
const Storage = {
  get(key: string): any | null
  set(key: string, value: any): void
  remove(key: string): void
  clear(): void
}
```

**Methods**:
- `get(key)`: Retrieves and parses JSON data from Local Storage
- `set(key, value)`: Stringifies and stores data in Local Storage
- `remove(key)`: Removes item from Local Storage
- `clear()`: Clears all Local Storage data

**Storage Keys**:
- `productivity-dashboard-tasks`: Array of task objects
- `productivity-dashboard-links`: Array of link objects
- `productivity-dashboard-theme`: String ('light' or 'dark')
- `productivity-dashboard-username`: String (user's custom name)

### 6. Theme Manager

**Purpose**: Handle light/dark mode switching and apply theme styling globally

**DOM Structure**:
```html
<div id="theme-toggle-container">
  <button id="theme-toggle" aria-label="Toggle theme">
    <span id="theme-icon">🌙</span>
  </button>
</div>
```

**JavaScript Interface**:
```javascript
const ThemeManager = {
  currentTheme: string  // 'light' or 'dark'
  
  init(): void
  loadTheme(): void
  saveTheme(theme: string): void
  toggleTheme(): void
  applyTheme(theme: string): void
  updateToggleIcon(): void
}
```

**Methods**:
- `init()`: Loads saved theme preference, applies it, and attaches event listener to toggle button
- `loadTheme()`: Retrieves saved theme from Local Storage (defaults to 'light' if not set)
- `saveTheme(theme)`: Persists theme preference to Local Storage
- `toggleTheme()`: Switches between light and dark themes
- `applyTheme(theme)`: Applies theme by setting data-theme attribute on document root element
- `updateToggleIcon()`: Updates toggle button icon based on current theme (🌙 for light mode, ☀️ for dark mode)

**CSS Implementation**:
The theme is applied using CSS custom properties (variables) defined at the `:root` level and overridden with `[data-theme="dark"]` selector:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #dddddd;
  --accent-color: #4a90e2;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #444444;
  --accent-color: #6ba3e8;
}
```

All component styles reference these CSS variables for colors, ensuring theme changes propagate throughout the application instantly.

## Data Models

### Task Model

```javascript
{
  id: string,           // Unique identifier (timestamp + random)
  text: string,         // Task description
  completed: boolean,   // Completion status
  createdAt: number     // Timestamp of creation
}
```

**Constraints**:
- `id`: Must be unique across all tasks
- `text`: Must be non-empty string (trimmed)
- `completed`: Boolean value (default: false)
- `createdAt`: Unix timestamp in milliseconds

### Link Model

```javascript
{
  id: string,      // Unique identifier (timestamp + random)
  url: string,     // Website URL
  name: string,    // Display name for the link
  createdAt: number // Timestamp of creation
}
```

**Constraints**:
- `id`: Must be unique across all links
- `url`: Must be non-empty string, should include protocol (https://)
- `name`: Must be non-empty string (trimmed)
- `createdAt`: Unix timestamp in milliseconds

### Timer State

```javascript
{
  timeRemaining: number,  // Seconds remaining (0-1500)
  isRunning: boolean,     // Whether timer is active
  intervalId: number | null // setInterval reference
}
```

**Constraints**:
- `timeRemaining`: Integer between 0 and 1500 (25 minutes)
- `isRunning`: Boolean indicating active countdown
- `intervalId`: null when stopped, number when running

### User Name Model

```javascript
{
  userName: string  // User's custom name for greeting
}
```

**Storage Format**: Stored as plain string in Local Storage

**Constraints**:
- `userName`: Non-empty string after trimming, or null if not set
- Maximum recommended length: 50 characters for UI display purposes
- When empty or whitespace-only, treated as null (no name set)

### Theme Preference Model

```javascript
{
  theme: string  // 'light' or 'dark'
}
```

**Storage Format**: Stored as plain string in Local Storage

**Constraints**:
- `theme`: Must be either 'light' or 'dark'
- Default value: 'light' when no preference is saved
- Invalid values default to 'light'

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: User Name Persistence Round-Trip

*For any* valid user name string, when saved to Local Storage and then retrieved on component initialization, the retrieved name should match the original name and appear in the greeting display after the time-based greeting.

**Validates: Requirements 17.1, 17.2**

### Property 2: User Name Clearing Removes from Storage

*For any* user name that has been set, when the user clears the name (sets it to empty or whitespace), the name should be removed from Local Storage and the greeting should display only the time-based greeting without a name.

**Validates: Requirements 17.5**

### Property 3: Duplicate Task Detection with Case-Insensitive Comparison

*For any* task text that already exists in the task list, attempting to add a task with the same text (regardless of case differences) should be rejected, and Local Storage should remain unchanged with the original task list intact.

**Validates: Requirements 18.1, 18.2, 18.4**

### Property 4: Duplicate Task Feedback Display

*For any* attempt to add a duplicate task (case-insensitive match), the Todo List component should display user feedback indicating that the task already exists.

**Validates: Requirements 18.3**

### Property 5: Theme Application Consistency

*For any* theme value ('light' or 'dark'), when applied, the document root should have the corresponding data-theme attribute set, and all CSS custom properties should reflect the appropriate color values (light text on dark backgrounds for dark theme, dark text on light backgrounds for light theme).

**Validates: Requirements 19.1, 19.5, 19.6**

### Property 6: Theme Preference Persistence Round-Trip

*For any* theme preference ('light' or 'dark'), when saved to Local Storage and then retrieved on dashboard load, the retrieved theme should match the saved preference and be applied to the interface.

**Validates: Requirements 19.2**

## Error Handling

### Input Validation

**Empty User Name**:
- When user enters only whitespace in name input, treat as clearing the name
- Remove from Local Storage and display greeting without name
- No error message needed (intentional clearing)

**Duplicate Task Detection**:
- When user attempts to add duplicate task (case-insensitive), prevent addition
- Display feedback message: "This task already exists"
- Clear feedback message after 3 seconds
- Do not modify task list or Local Storage

**Invalid Theme Value**:
- If Local Storage contains invalid theme value (not 'light' or 'dark'), default to 'light'
- Log warning to console for debugging
- Save corrected 'light' value back to Local Storage

### Local Storage Failures

**Storage Quota Exceeded**:
- Catch QuotaExceededError when saving data
- Display error message to user: "Unable to save data - storage full"
- Attempt to continue operation without persistence
- Log error to console

**Storage Access Denied**:
- Catch SecurityError when accessing Local Storage (private browsing mode)
- Display warning message: "Data will not be saved in private browsing mode"
- Allow application to function with in-memory state only
- Log warning to console

**Data Corruption**:
- When loading data from Local Storage, validate structure and types
- If task array is corrupted, initialize with empty array and log error
- If link array is corrupted, initialize with empty array and log error
- If theme value is corrupted, default to 'light' and log error
- If user name is corrupted (not a string), treat as null and log error

### DOM Manipulation Errors

**Missing DOM Elements**:
- Check for element existence before attaching event listeners
- Log error to console if required elements are missing
- Gracefully degrade functionality if optional elements are missing

**Event Listener Failures**:
- Wrap event handlers in try-catch blocks
- Log errors to console for debugging
- Prevent one component's error from breaking other components

## Testing Strategy

### Dual Testing Approach

The application will use both unit testing and property-based testing for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across many randomized inputs.

### Unit Testing Focus Areas

Unit tests should focus on:
- Specific examples that demonstrate correct behavior (e.g., greeting displays "Good Morning" at 10:00 AM)
- Edge cases (e.g., empty user name, no saved theme preference)
- Error conditions (e.g., Local Storage quota exceeded, invalid theme value)
- Integration points between components (e.g., theme changes affect all components)

Avoid writing too many unit tests for scenarios that property-based tests can cover through randomization.

### Property-Based Testing Configuration

Since this is a vanilla JavaScript application with no build system, property-based testing will be implemented manually during development or using a lightweight library like fast-check if testing is added in the future.

Each property test should:
- Run a minimum of 100 iterations with randomized inputs
- Reference the corresponding design document property in a comment
- Use tag format: `// Feature: productivity-dashboard, Property {number}: {property_text}`

### Property Test Specifications

**Property 1: User Name Persistence Round-Trip**
- Generate random user name strings (various lengths, characters, unicode)
- Save to Local Storage via GreetingComponent
- Simulate component reload
- Verify retrieved name matches original
- Verify greeting display includes the name after time-based greeting

**Property 2: User Name Clearing Removes from Storage**
- Generate random user name and save it
- Clear the name (set to empty string or whitespace)
- Verify Local Storage no longer contains the user name key
- Verify greeting displays only time-based greeting

**Property 3: Duplicate Task Detection with Case-Insensitive Comparison**
- Generate random task text
- Add task to list
- Generate case variations of same text (lowercase, uppercase, mixed case)
- Attempt to add each variation
- Verify all attempts are rejected
- Verify Local Storage contains only the original task

**Property 4: Duplicate Task Feedback Display**
- Generate random task text and add to list
- Attempt to add duplicate (case-insensitive variation)
- Verify feedback message is displayed
- Verify feedback contains text indicating duplicate/already exists

**Property 5: Theme Application Consistency**
- For each theme value ('light', 'dark'):
  - Apply theme via ThemeManager
  - Verify document root has correct data-theme attribute
  - Verify CSS custom properties have appropriate values
  - For dark theme: verify light text colors and dark background colors
  - For light theme: verify dark text colors and light background colors

**Property 6: Theme Preference Persistence Round-Trip**
- For each theme value ('light', 'dark'):
  - Save theme to Local Storage
  - Simulate dashboard reload
  - Verify retrieved theme matches saved value
  - Verify theme is applied to interface (data-theme attribute set)

### Manual Testing Checklist

Since automated testing is not currently configured, manual testing should verify:

**User Name Feature**:
- [ ] Entering a name displays it in the greeting
- [ ] Name persists after page reload
- [ ] Clearing name removes it from greeting
- [ ] Empty/whitespace name is treated as no name
- [ ] Long names display correctly without breaking layout

**Duplicate Task Prevention**:
- [ ] Adding duplicate task (exact match) is rejected
- [ ] Adding duplicate task (different case) is rejected
- [ ] Feedback message appears when duplicate detected
- [ ] Feedback message disappears after a few seconds
- [ ] Task list remains unchanged when duplicate rejected
- [ ] Can add task after fixing duplicate text

**Theme Toggle**:
- [ ] Theme toggle button is visible and accessible
- [ ] Clicking toggle switches between light and dark themes
- [ ] Dark theme uses light text on dark backgrounds
- [ ] Light theme uses dark text on light backgrounds
- [ ] Theme preference persists after page reload
- [ ] Default theme is light when no preference saved
- [ ] All components update colors when theme changes
- [ ] Toggle icon updates to reflect current theme

**Cross-Feature Integration**:
- [ ] Theme applies to greeting section (including name input)
- [ ] Theme applies to todo list (including feedback message)
- [ ] Theme applies to all existing components (timer, links)
- [ ] User name and theme work together without conflicts
- [ ] Duplicate prevention works with theme changes

**Performance**:
- [ ] Name saves to Local Storage within 100ms of input change
- [ ] Theme saves to Local Storage within 100ms of toggle
- [ ] Theme change updates all colors within 100ms
- [ ] Duplicate detection feedback appears within 100ms

**Browser Compatibility**:
- [ ] Test all features in Chrome 90+
- [ ] Test all features in Firefox 88+
- [ ] Test all features in Edge 90+
- [ ] Test all features in Safari 14+

### Test Data Generation

For property-based testing (if implemented), use these generators:

**User Name Generator**:
- Empty string
- Whitespace-only strings (spaces, tabs, newlines)
- Short names (1-5 characters)
- Medium names (6-20 characters)
- Long names (21-50 characters)
- Names with special characters (!@#$%^&*)
- Names with unicode characters (emoji, accented letters)
- Names with leading/trailing whitespace

**Task Text Generator** (for duplicate testing):
- Lowercase strings
- Uppercase strings
- Mixed case strings
- Strings with leading/trailing whitespace
- Strings with special characters
- Strings with numbers
- Very long task descriptions (100+ characters)

**Theme Value Generator**:
- Valid values: 'light', 'dark'
- Invalid values for error testing: '', null, undefined, 'invalid', 123, {}

### Performance Benchmarks

All user interactions should provide visual feedback within 100ms:
- Name input change → greeting update
- Theme toggle click → color change
- Duplicate task submission → feedback display
- Any data save → Local Storage write

Monitor performance using browser DevTools Performance tab during manual testing.
