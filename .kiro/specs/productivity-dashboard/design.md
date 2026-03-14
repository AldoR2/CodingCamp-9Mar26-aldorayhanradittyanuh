# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript that provides users with essential productivity tools in a clean, distraction-free interface. The application consists of four main components: a greeting display with current time/date, a 25-minute focus timer, a to-do list manager, and a quick links panel for frequently visited websites.

All data persistence is handled client-side using the browser's Local Storage API, eliminating the need for backend infrastructure. The application follows a component-based architecture where each feature (greeting, timer, todos, links) operates independently with its own state management and DOM manipulation logic.

The design prioritizes simplicity, performance, and maintainability. The entire application loads from three files (index.html, style.css, script.js) and provides immediate visual feedback for all user interactions within 100ms.

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
│  (Styling)     │    │  (Application)  │
└────────────────┘    └────────┬────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│ Greeting       │  │ Focus Timer      │  │ Todo List        │
│ Component      │  │ Component        │  │ Component        │
└────────────────┘  └──────────────────┘  └──────────────────┘
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

1. **Greeting Component**: Manages time/date display and time-based greeting messages
2. **Focus Timer Component**: Handles countdown timer logic and UI updates
3. **Todo List Component**: Manages task CRUD operations and persistence
4. **Quick Links Component**: Manages link CRUD operations and persistence
5. **Storage Layer**: Abstracts Local Storage operations for data persistence

### Data Flow

- **Initialization**: On page load, each component initializes by reading from Local Storage and rendering initial state
- **User Interactions**: User actions trigger component methods that update internal state, modify the DOM, and persist changes to Local Storage
- **Time Updates**: Greeting component uses setInterval to update time display every second
- **Timer Updates**: Focus timer uses setInterval when active to decrement time every second

## Components and Interfaces

### 1. Greeting Component

**Purpose**: Display current time, date, and time-based greeting

**DOM Structure**:
```html
<div id="greeting-section">
  <div id="time-display"></div>
  <div id="date-display"></div>
  <div id="greeting-message"></div>
</div>
```

**JavaScript Interface**:
```javascript
const GreetingComponent = {
  init(): void
  updateTime(): void
  getTimeOfDay(): string
  getGreeting(): string
  formatTime(date: Date): string
  formatDate(date: Date): string
}
```

**Methods**:
- `init()`: Sets up interval to update time every second
- `updateTime()`: Updates DOM with current time, date, and greeting
- `getTimeOfDay()`: Returns 'morning', 'afternoon', 'evening', or 'night' based on current hour
- `getGreeting()`: Returns appropriate greeting message based on time of day
- `formatTime(date)`: Formats date as 12-hour time with AM/PM
- `formatDate(date)`: Formats date as "Day, Month Date" (e.g., "Monday, January 15")

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

**Purpose**: Manage task creation, editing, completion, and deletion

**DOM Structure**:
```html
<div id="todo-section">
  <form id="todo-form">
    <input id="todo-input" type="text" placeholder="Add a new task...">
    <button type="submit">Add</button>
  </form>
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
}
```

**Methods**:
- `init()`: Loads tasks from storage and sets up event listeners
- `loadTasks()`: Retrieves tasks array from Local Storage
- `saveTasks()`: Persists current tasks array to Local Storage
- `addTask(text)`: Creates new task, adds to array, saves, and re-renders
- `toggleTask(id)`: Toggles completion status, saves, and re-renders
- `editTask(id, newText)`: Updates task text, saves, and re-renders
- `deleteTask(id)`: Removes task from array, saves, and re-renders
- `renderTasks()`: Clears and rebuilds task list DOM
- `createTaskElement(task)`: Creates DOM element for a single task
- `generateId()`: Returns unique identifier (timestamp + random)

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

