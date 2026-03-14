# Implementation Plan: Productivity Dashboard

## Overview

This plan implements a single-page productivity dashboard with four main components: greeting display, focus timer, todo list, and quick links. The application uses vanilla HTML, CSS, and JavaScript with Local Storage for data persistence. Implementation follows a component-based architecture where each feature operates independently.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create directory structure (css/, js/)
  - Create index.html with semantic HTML structure for all four components
  - Include meta tags for viewport and charset
  - Link CSS and JavaScript files
  - _Requirements: 16.1, 16.2, 16.3_

- [x] 2. Implement Storage utility layer
  - [x] 2.1 Create Storage utility with get, set, remove, and clear methods
    - Implement JSON parsing and stringification
    - Handle Local Storage errors gracefully
    - _Requirements: 8.1, 8.3, 12.1, 12.3_

- [x] 3. Implement Greeting Component
  - [x] 3.1 Create GreetingComponent with time and date display logic
    - Implement init() to set up interval for time updates
    - Implement updateTime() to refresh display every second
    - Implement formatTime() for 12-hour format with AM/PM
    - Implement formatDate() for day, month, and date display
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Implement time-based greeting logic
    - Implement getTimeOfDay() to determine morning/afternoon/evening/night
    - Implement getGreeting() to return appropriate greeting message
    - Update greeting display based on current time
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.3 Implement custom name feature in greeting
    - Add name input field to greeting section HTML
    - Implement loadUserName() to retrieve saved name from Local Storage
    - Implement saveUserName() to persist name to Local Storage
    - Implement clearUserName() to remove name when input is empty/whitespace
    - Implement updateGreetingMessage() to append name to greeting if set
    - Attach event listener to name input for real-time updates
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [ ]* 3.4 Write property test for user name persistence
    - **Property 1: User Name Persistence Round-Trip**
    - **Validates: Requirements 17.1, 17.2**

  - [ ]* 3.5 Write property test for user name clearing
    - **Property 2: User Name Clearing Removes from Storage**
    - **Validates: Requirements 17.5**

- [x] 4. Implement Focus Timer Component
  - [x] 4.1 Create FocusTimer with state management
    - Initialize timer state (timeRemaining, isRunning, intervalId)
    - Implement init() to set up event listeners for start/stop/reset buttons
    - Implement formatTime() to convert seconds to MM:SS format
    - _Requirements: 3.1_

  - [x] 4.2 Implement timer control methods
    - Implement start() to begin countdown with setInterval
    - Implement stop() to pause countdown
    - Implement reset() to return to 25 minutes
    - Implement tick() to decrement time and stop at zero
    - Implement updateDisplay() to refresh timer display
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 5. Implement Todo List Component
  - [x] 5.1 Create TodoList with task data model and storage integration
    - Initialize tasks array
    - Implement init() to load tasks and set up event listeners
    - Implement loadTasks() to retrieve from Local Storage
    - Implement saveTasks() to persist to Local Storage
    - Implement generateId() for unique task identifiers
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 5.2 Implement task creation and rendering
    - Implement addTask() to create new tasks with validation
    - Implement renderTasks() to rebuild task list DOM
    - Implement createTaskElement() to generate task HTML
    - Reject empty task submissions
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 5.3 Implement task completion toggle
    - Implement toggleTask() to update completion status
    - Update visual appearance for completed tasks
    - Save changes to Local Storage
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 5.4 Implement task editing
    - Implement editTask() to update task text with validation
    - Display editable text field when editing
    - Reject empty text submissions
    - Save changes to Local Storage
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 5.5 Implement task deletion
    - Implement deleteTask() to remove tasks
    - Update display within 100ms
    - Remove from Local Storage
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 5.6 Implement duplicate task prevention
    - Implement isDuplicate() method with case-insensitive comparison
    - Modify addTask() to check for duplicates before adding
    - Modify editTask() to check for duplicates before updating
    - Implement showFeedback() to display user feedback messages
    - Implement hideFeedback() to clear feedback after timeout
    - Add feedback message DOM element to todo section
    - Display "This task already exists" message when duplicate detected
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ]* 5.7 Write property test for duplicate task detection
    - **Property 3: Duplicate Task Detection with Case-Insensitive Comparison**
    - **Validates: Requirements 18.1, 18.2, 18.4**

  - [ ]* 5.8 Write property test for duplicate task feedback
    - **Property 4: Duplicate Task Feedback Display**
    - **Validates: Requirements 18.3**

- [x] 6. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Quick Links Component
  - [x] 7.1 Create QuickLinks with link data model and storage integration
    - Initialize links array
    - Implement init() to load links and set up event listeners
    - Implement loadLinks() to retrieve from Local Storage
    - Implement saveLinks() to persist to Local Storage
    - Implement generateId() for unique link identifiers
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 7.2 Implement link creation and rendering
    - Implement addLink() to create new links with validation
    - Implement validateUrl() to ensure proper URL format
    - Implement renderLinks() to rebuild links container DOM
    - Implement createLinkElement() to generate link HTML
    - Reject empty URL or name submissions
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [-] 7.3 Implement link navigation
    - Configure links to open in new tab with target="_blank"
    - Ensure dashboard remains open in original tab
    - _Requirements: 10.1, 10.2_

  - [x] 7.4 Implement link deletion
    - Implement deleteLink() to remove links
    - Update display within 100ms
    - Remove from Local Storage
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 8. Implement CSS styling
  - [x] 8.1 Create base styles and layout
    - Define color scheme and CSS variables
    - Set up responsive grid or flexbox layout
    - Style body and container elements
    - _Requirements: 15.1, 15.3_

  - [x] 8.2 Implement CSS custom properties for theming
    - Define CSS custom properties (variables) at :root level for light theme
    - Define color variables: --bg-primary, --bg-secondary, --text-primary, --text-secondary, --border-color, --accent-color
    - Create [data-theme="dark"] selector with dark theme color overrides
    - Update all component styles to use CSS custom properties instead of hardcoded colors
    - _Requirements: 19.5, 19.6_

  - [x] 8.3 Style Greeting Component
    - Style time, date, and greeting displays
    - Ensure readable font sizes (minimum 14px)
    - _Requirements: 15.2_

  - [x] 8.4 Style name input field
    - Style name input field in greeting section
    - Ensure input field uses theme colors via CSS custom properties
    - Add appropriate padding, border, and focus states
    - _Requirements: 17.6, 19.6_

  - [x] 8.5 Style Focus Timer Component
    - Style timer display and control buttons
    - Provide visual feedback for button states
    - _Requirements: 15.2_

  - [x] 8.6 Style Todo List Component
    - Style task items, checkboxes, and buttons
    - Style completed tasks differently (strikethrough, opacity)
    - Style edit mode input fields
    - Ensure sufficient contrast ratios
    - _Requirements: 15.2, 15.4_

  - [x] 8.7 Style feedback message display
    - Style feedback message element for duplicate task notifications
    - Use appropriate colors for error/warning messages
    - Ensure visibility and readability
    - _Requirements: 18.3_

  - [x] 8.8 Style Quick Links Component
    - Style link buttons and delete controls
    - Ensure consistent spacing and alignment
    - _Requirements: 15.2, 15.4_

  - [x] 8.9 Style theme toggle button
    - Style theme toggle button with appropriate positioning
    - Add hover and focus states
    - Style theme icon (moon/sun emoji or SVG)
    - Ensure button is accessible and visible in both themes
    - _Requirements: 19.4, 19.6_

- [x] 9. Implement application initialization
  - [x] 9.1 Wire all components together in main script
    - Initialize all components on DOMContentLoaded
    - Ensure proper initialization order
    - _Requirements: 1.1, 3.1, 4.1, 9.1_

  - [x] 9.2 Add performance optimizations
    - Ensure initial load completes within 1 second
    - Ensure UI updates complete within 100ms
    - Debounce or throttle expensive operations if needed
    - _Requirements: 14.1, 14.2, 14.3_

- [x] 10. Implement Theme Manager Component
  - [x] 10.1 Create ThemeManager with theme state management
    - Initialize currentTheme property
    - Implement init() to load saved theme and set up event listeners
    - Implement loadTheme() to retrieve theme from Local Storage (default to 'light')
    - Implement saveTheme() to persist theme preference to Local Storage
    - _Requirements: 19.2_

  - [x] 10.2 Implement theme switching logic
    - Implement toggleTheme() to switch between light and dark themes
    - Implement applyTheme() to set data-theme attribute on document root
    - Implement updateToggleIcon() to change button icon based on current theme
    - Add theme toggle button to HTML with appropriate aria-label
    - Attach click event listener to toggle button
    - _Requirements: 19.1, 19.3, 19.4_

  - [x] 10.3 Integrate ThemeManager with application initialization
    - Initialize ThemeManager on DOMContentLoaded before other components
    - Ensure theme is applied before components render
    - Verify all components use CSS custom properties for colors
    - _Requirements: 19.1, 19.6_

  - [ ]* 10.4 Write property test for theme application consistency
    - **Property 5: Theme Application Consistency**
    - **Validates: Requirements 19.1, 19.5, 19.6**

  - [ ]* 10.5 Write property test for theme persistence
    - **Property 6: Theme Preference Persistence Round-Trip**
    - **Validates: Requirements 19.2**

- [x] 11. Final checkpoint - Verify all functionality
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks build incrementally on previous work
- Each component is independent and can be tested in isolation
- Local Storage operations are abstracted through Storage utility
- Performance requirements (100ms updates, 1s load time) should be validated during implementation
- Browser compatibility (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+) should be tested manually
- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- New features (custom name, duplicate prevention, theme toggle) integrate with existing components
- Theme implementation uses CSS custom properties for efficient global color updates
- Storage utility now handles four keys: tasks, links, theme, and username
