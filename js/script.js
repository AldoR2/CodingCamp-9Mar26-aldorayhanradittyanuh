// Productivity Dashboard Application

// Storage Utility - Abstracts Local Storage operations
const Storage = {
    /**
     * Retrieves and parses JSON data from Local Storage
     * @param {string} key - The storage key (will be prefixed with 'productivity-dashboard-')
     * @returns {any|null} Parsed data or null if not found or error occurs
     */
    get(key) {
        try {
            const fullKey = `productivity-dashboard-${key}`;
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from Local Storage (key: ${key}):`, error);
            return null;
        }
    },

    /**
     * Stringifies and stores data in Local Storage
     * @param {string} key - The storage key (will be prefixed with 'productivity-dashboard-')
     * @param {any} value - The data to store
     */
    set(key, value) {
        try {
            const fullKey = `productivity-dashboard-${key}`;
            const serialized = JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
        } catch (error) {
            console.error(`Error writing to Local Storage (key: ${key}):`, error);
            // Handle quota exceeded or other storage errors
            if (error.name === 'QuotaExceededError') {
                console.error('Local Storage quota exceeded. Consider clearing old data.');
            }
        }
    },

    /**
     * Removes an item from Local Storage
     * @param {string} key - The storage key (will be prefixed with 'productivity-dashboard-')
     */
    remove(key) {
        try {
            const fullKey = `productivity-dashboard-${key}`;
            localStorage.removeItem(fullKey);
        } catch (error) {
            console.error(`Error removing from Local Storage (key: ${key}):`, error);
        }
    },

    /**
     * Clears all productivity dashboard data from Local Storage
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('productivity-dashboard-')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing Local Storage:', error);
        }
    }
};

// Components will be implemented in subsequent tasks

// Greeting Component - Displays current time, date, and time-based greeting
const GreetingComponent = {
    intervalId: null,
    userName: '',

    /**
     * Initializes the greeting component and starts the time update interval
     */
    init() {
        // Load user name from Local Storage
        this.loadUserName();

        // Update immediately on load
        this.updateTime();

        // Set up interval to update every second
        this.intervalId = setInterval(() => {
            this.updateTime();
        }, 1000);

        // Set up event listener for name input
        const nameInput = document.getElementById('name-input');
        if (nameInput) {
            // Set initial value from loaded name
            nameInput.value = this.userName;

            // Listen for input changes
            nameInput.addEventListener('input', (e) => {
                const name = e.target.value;

                // If input is empty or only whitespace, clear the name
                if (!name.trim()) {
                    this.clearUserName();
                } else {
                    this.saveUserName(name);
                }

                // Update greeting message immediately
                this.updateGreetingMessage();
            });
        }
    },

    /**
     * Updates the time, date, and greeting displays with current values
     */
    updateTime() {
        const now = new Date();

        // Update time display
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(now);
        }

        // Update date display
        const dateDisplay = document.getElementById('date-display');
        if (dateDisplay) {
            dateDisplay.textContent = this.formatDate(now);
        }

        // Update greeting message
        this.updateGreetingMessage();
    },

    /**
     * Formats a date object as 12-hour time with AM/PM
     * @param {Date} date - The date to format
     * @returns {string} Formatted time string (e.g., "3:45 PM")
     */
    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12

        // Pad minutes with leading zero if needed
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutesStr} ${ampm}`;
    },

    /**
     * Formats a date object as day of week, month, and day number
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string (e.g., "Monday, January 15")
     */
    formatDate(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const dayNumber = date.getDate();

        return `${dayName}, ${monthName} ${dayNumber}`;
    },

    /**
     * Determines the time of day based on current hour
     * @returns {string} 'morning', 'afternoon', 'evening', or 'night'
     */
    getTimeOfDay() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 17) {
            return 'afternoon';
        } else if (hour >= 17 && hour < 21) {
            return 'evening';
        } else {
            return 'night';
        }
    },

    /**
     * Returns the appropriate greeting message based on time of day
     * @returns {string} Greeting message
     */
    getGreeting() {
        const timeOfDay = this.getTimeOfDay();

        switch (timeOfDay) {
            case 'morning':
                return 'Good Morning';
            case 'afternoon':
                return 'Good Afternoon';
            case 'evening':
                return 'Good Evening';
            case 'night':
                return 'Good Night';
            default:
                return 'Hello';
        }
    },

    /**
     * Loads the user name from Local Storage
     */
    loadUserName() {
        const savedName = Storage.get('username');
        if (savedName && typeof savedName === 'string') {
            this.userName = savedName;
        } else {
            this.userName = '';
        }
    },

    /**
     * Saves the user name to Local Storage
     * @param {string} name - The user's name to save
     */
    saveUserName(name) {
        this.userName = name;
        Storage.set('username', name);
    },

    /**
     * Clears the user name from Local Storage and component state
     */
    clearUserName() {
        this.userName = '';
        Storage.remove('username');
    },

    /**
     * Updates the greeting message display with time-based greeting and optional name
     */
    updateGreetingMessage() {
        const greetingMessage = document.getElementById('greeting-message');
        if (!greetingMessage) {
            return;
        }

        // Get base greeting
        let greeting = this.getGreeting();

        // Append name if set
        if (this.userName.trim()) {
            greeting += `, ${this.userName}`;
        }

        greetingMessage.textContent = greeting;
    }
};

// Focus Timer Component - Provides a 25-minute countdown timer
const FocusTimer = {
    timeRemaining: 1500, // 25 minutes in seconds (25 * 60)
    isRunning: false,
    intervalId: null,

    /**
     * Initializes the focus timer component and sets up event listeners
     */
    init() {
        // Set up event listeners for control buttons
        const startButton = document.getElementById('timer-start');
        const stopButton = document.getElementById('timer-stop');
        const resetButton = document.getElementById('timer-reset');

        if (startButton) {
            startButton.addEventListener('click', () => this.start());
        }

        if (stopButton) {
            stopButton.addEventListener('click', () => this.stop());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.reset());
        }

        // Update display with initial time
        this.updateDisplay();
    },

    /**
     * Converts seconds to MM:SS format
     * @param {number} seconds - The number of seconds to format
     * @returns {string} Formatted time string (e.g., "25:00", "03:45")
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Pad with leading zeros
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const secondsStr = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

        return `${minutesStr}:${secondsStr}`;
    },

    /**
     * Updates the timer display with the current time remaining
     */
    updateDisplay() {
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = this.formatTime(this.timeRemaining);
        }
    },

    /**
     * Begins the countdown timer
     */
    start() {
        // Don't start if already running
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        // Set up interval to call tick() every second
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    },

    /**
     * Pauses the countdown timer
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;

        // Clear the interval
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    /**
     * Resets the timer to 25 minutes and stops countdown
     */
    reset() {
        // Stop the timer if running
        this.stop();

        // Reset to 25 minutes (1500 seconds)
        this.timeRemaining = 1500;

        // Update the display
        this.updateDisplay();
    },

    /**
     * Decrements the time remaining by one second and stops at zero
     */
    tick() {
        // Decrement time
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
        }

        // Update the display
        this.updateDisplay();

        // Stop when reaching zero
        if (this.timeRemaining === 0) {
            this.stop();
        }
    }
};

// Todo List Component - Manages task creation, editing, completion, and deletion
const TodoList = {
    tasks: [],
    feedbackTimeoutId: null,

    /**
     * Initializes the todo list component, loads tasks, and sets up event listeners
     */
    init() {
        // Load tasks from Local Storage
        this.loadTasks();

        // Render initial tasks
        this.renderTasks();

        // Set up event listener for form submission
        const todoForm = document.getElementById('todo-form');
        if (todoForm) {
            todoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('todo-input');
                if (input) {
                    this.addTask(input.value);
                    input.value = ''; // Clear input after adding
                }
            });
        }
    },

    /**
     * Loads tasks from Local Storage
     */
    loadTasks() {
        const savedTasks = Storage.get('tasks');
        if (savedTasks && Array.isArray(savedTasks)) {
            this.tasks = savedTasks;
        } else {
            this.tasks = [];
        }
    },

    /**
     * Saves the current tasks array to Local Storage
     */
    saveTasks() {
        Storage.set('tasks', this.tasks);
    },

    /**
     * Generates a unique identifier for tasks
     * @returns {string} Unique ID combining timestamp and random number
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    },

    /**
     * Checks if a task with the given text already exists (case-insensitive)
     * @param {string} text - The task text to check
     * @param {string} excludeId - Optional task ID to exclude from the check (for editing)
     * @returns {boolean} True if a duplicate exists, false otherwise
     */
    isDuplicate(text, excludeId = null) {
        const normalizedText = text.trim().toLowerCase();

        return this.tasks.some(task => {
            // Skip the task being edited
            if (excludeId && task.id === excludeId) {
                return false;
            }

            // Compare normalized text
            return task.text.toLowerCase() === normalizedText;
        });
    },

    /**
     * Displays a feedback message to the user
     * @param {string} message - The message to display
     * @param {string} type - The message type ('error', 'success', etc.)
     */
    showFeedback(message, type = 'error') {
        const feedbackElement = document.getElementById('todo-feedback');
        if (!feedbackElement) {
            return;
        }

        // Clear any existing timeout
        if (this.feedbackTimeoutId) {
            clearTimeout(this.feedbackTimeoutId);
        }

        // Set message and type
        feedbackElement.textContent = message;
        feedbackElement.className = `todo-feedback show ${type}`;

        // Auto-hide after 3 seconds
        this.feedbackTimeoutId = setTimeout(() => {
            this.hideFeedback();
        }, 3000);
    },

    /**
     * Hides the feedback message
     */
    hideFeedback() {
        const feedbackElement = document.getElementById('todo-feedback');
        if (!feedbackElement) {
            return;
        }

        feedbackElement.classList.remove('show');

        // Clear timeout reference
        if (this.feedbackTimeoutId) {
            clearTimeout(this.feedbackTimeoutId);
            this.feedbackTimeoutId = null;
        }
    },

    /**
     * Creates a new task and adds it to the list
     * @param {string} text - The task description
     */
    addTask(text) {
        // Trim whitespace and validate
        const trimmedText = text.trim();

        // Reject empty submissions
        if (!trimmedText) {
            return;
        }

        // Check for duplicates
        if (this.isDuplicate(trimmedText)) {
            this.showFeedback('This task already exists', 'error');
            return;
        }

        // Create new task object
        const task = {
            id: this.generateId(),
            text: trimmedText,
            completed: false,
            createdAt: Date.now()
        };

        // Add to tasks array
        this.tasks.push(task);

        // Save to Local Storage
        this.saveTasks();

        // Re-render the task list
        this.renderTasks();
    },

    /**
     * Toggles the completion status of a task
     * @param {string} id - The task ID to toggle
     */
    toggleTask(id) {
        // Find the task by ID
        const task = this.tasks.find(t => t.id === id);

        if (!task) {
            return;
        }

        // Toggle the completed status
        task.completed = !task.completed;

        // Save to Local Storage
        this.saveTasks();

        // Re-render the task list
        this.renderTasks();
    },

    /**
     * Updates the text of an existing task
     * @param {string} id - The task ID to edit
     * @param {string} newText - The new task text
     */
    editTask(id, newText) {
        // Trim whitespace and validate
        const trimmedText = newText.trim();

        // Reject empty submissions
        if (!trimmedText) {
            return;
        }

        // Find the task by ID
        const task = this.tasks.find(t => t.id === id);

        if (!task) {
            return;
        }

        // Check for duplicates (excluding the current task)
        if (this.isDuplicate(trimmedText, id)) {
            this.showFeedback('This task already exists', 'error');
            // Re-render to restore original state
            this.renderTasks();
            return;
        }

        // Update the task text
        task.text = trimmedText;

        // Save to Local Storage
        this.saveTasks();

        // Re-render the task list
        this.renderTasks();
    },

    /**
     * Removes a task from the list
     * @param {string} id - The task ID to delete
     */
    deleteTask(id) {
        // Find the index of the task
        const taskIndex = this.tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return;
        }

        // Remove the task from the array
        this.tasks.splice(taskIndex, 1);

        // Save to Local Storage
        this.saveTasks();

        // Re-render the task list
        this.renderTasks();
    },

    /**
     * Clears and rebuilds the task list DOM
     */
    renderTasks() {
        const todoList = document.getElementById('todo-list');
        if (!todoList) {
            return;
        }

        // Clear existing tasks
        todoList.innerHTML = '';

        // Create and append each task element
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            todoList.appendChild(taskElement);
        });
    },

    /**
     * Creates a DOM element for a single task
     * @param {Object} task - The task object with id, text, completed, and createdAt properties
     * @returns {HTMLElement} The task list item element
     */
    createTaskElement(task) {
        // Create list item
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-id', task.id);

        // Add completed class if task is completed
        if (task.completed) {
            li.classList.add('completed');
        }

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = task.completed;

        // Add event listener to checkbox for toggling completion
        checkbox.addEventListener('change', () => {
            this.toggleTask(task.id);
        });

        // Create text span
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = task.text;

        // Create edit button
        const editButton = document.createElement('button');
        editButton.className = 'todo-edit';
        editButton.textContent = 'Edit';

        // Add event listener to edit button for inline editing
        editButton.addEventListener('click', () => {
            // Replace text span with input field
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'todo-edit-input';
            input.value = task.text;

            // Function to save the edit
            const saveEdit = () => {
                const newText = input.value;
                this.editTask(task.id, newText);
            };

            // Function to cancel the edit
            const cancelEdit = () => {
                // Re-render to restore original state
                this.renderTasks();
            };

            // Save on Enter key
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit();
                }
            });

            // Save on blur (when input loses focus)
            input.addEventListener('blur', () => {
                saveEdit();
            });

            // Replace text span with input
            textSpan.replaceWith(input);

            // Focus the input and select all text
            input.focus();
            input.select();
        });

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'todo-delete';
        deleteButton.textContent = 'Delete';

        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            this.deleteTask(task.id);
        });

        // Append all elements to list item
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        return li;
    }
};

// Quick Links Component - Manages quick access links to frequently visited websites
const QuickLinks = {
    links: [],

    /**
     * Initializes the quick links component, loads links, and sets up event listeners
     */
    init() {
        // Load links from Local Storage
        this.loadLinks();

        // Render initial links
        this.renderLinks();

        // Set up event listener for form submission
        const linkForm = document.getElementById('link-form');
        if (linkForm) {
            linkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const urlInput = document.getElementById('link-url');
                const nameInput = document.getElementById('link-name');
                if (urlInput && nameInput) {
                    this.addLink(urlInput.value, nameInput.value);
                    urlInput.value = ''; // Clear inputs after adding
                    nameInput.value = '';
                }
            });
        }
    },

    /**
     * Loads links from Local Storage
     */
    loadLinks() {
        const savedLinks = Storage.get('links');
        if (savedLinks && Array.isArray(savedLinks)) {
            this.links = savedLinks;
        } else {
            this.links = [];
        }
    },

    /**
     * Saves the current links array to Local Storage
     */
    saveLinks() {
        Storage.set('links', this.links);
    },

    /**
     * Generates a unique identifier for links
     * @returns {string} Unique ID combining timestamp and random number
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    },

    /**
     * Validates and formats a URL to ensure it has a proper protocol
     * @param {string} url - The URL to validate
     * @returns {string} The validated URL with protocol
     */
    validateUrl(url) {
        const trimmedUrl = url.trim();

        // Check if URL already has a protocol
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            return trimmedUrl;
        }

        // Add https:// if no protocol is present
        return `https://${trimmedUrl}`;
    },

    /**
     * Creates a new link and adds it to the list
     * @param {string} url - The link URL
     * @param {string} name - The display name for the link
     */
    addLink(url, name) {
        // Trim whitespace and validate
        const trimmedUrl = url.trim();
        const trimmedName = name.trim();

        // Reject empty submissions
        if (!trimmedUrl || !trimmedName) {
            return;
        }

        // Validate and format URL
        const validatedUrl = this.validateUrl(trimmedUrl);

        // Create new link object
        const link = {
            id: this.generateId(),
            url: validatedUrl,
            name: trimmedName,
            createdAt: Date.now()
        };

        // Add to links array
        this.links.push(link);

        // Save to Local Storage
        this.saveLinks();

        // Re-render the links
        this.renderLinks();
    },

    /**
     * Removes a link from the list
     * @param {string} id - The link ID to delete
     */
    deleteLink(id) {
        // Find the index of the link
        const linkIndex = this.links.findIndex(l => l.id === id);

        if (linkIndex === -1) {
            return;
        }

        // Remove the link from the array
        this.links.splice(linkIndex, 1);

        // Save to Local Storage
        this.saveLinks();

        // Re-render the links
        this.renderLinks();
    },

    /**
     * Clears and rebuilds the links container DOM
     */
    renderLinks() {
        const linksContainer = document.getElementById('links-container');
        if (!linksContainer) {
            return;
        }

        // Clear existing links
        linksContainer.innerHTML = '';

        // Create and append each link element
        this.links.forEach(link => {
            const linkElement = this.createLinkElement(link);
            linksContainer.appendChild(linkElement);
        });
    },

    /**
     * Creates a DOM element for a single link
     * @param {Object} link - The link object with id, url, name, and createdAt properties
     * @returns {HTMLElement} The link container element
     */
    createLinkElement(link) {
        // Create container div
        const div = document.createElement('div');
        div.className = 'link-item';
        div.setAttribute('data-id', link.id);

        // Create anchor element
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.className = 'link-button';
        anchor.textContent = link.name;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'link-delete';
        deleteButton.textContent = '×';

        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            this.deleteLink(link.id);
        });

        // Append elements to container
        div.appendChild(anchor);
        div.appendChild(deleteButton);

        return div;
    }
};

// Theme Manager Component - Handles light/dark mode switching
const ThemeManager = {
    currentTheme: 'light',

    /**
     * Initializes the theme manager, loads saved theme, and sets up event listeners
     */
    init() {
        // Load saved theme preference
        this.loadTheme();

        // Apply the loaded theme
        this.applyTheme(this.currentTheme);

        // Update toggle icon to match current theme
        this.updateToggleIcon();

        // Set up event listener for theme toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    /**
     * Loads the saved theme preference from Local Storage
     */
    loadTheme() {
        const savedTheme = Storage.get('theme');

        // Validate the saved theme value
        if (savedTheme === 'light' || savedTheme === 'dark') {
            this.currentTheme = savedTheme;
        } else {
            // Default to light theme if no valid preference is saved
            this.currentTheme = 'light';

            // Log warning if invalid value was found
            if (savedTheme !== null) {
                console.warn(`Invalid theme value "${savedTheme}" found in storage. Defaulting to light theme.`);
                // Save the corrected value
                this.saveTheme('light');
            }
        }
    },

    /**
     * Saves the theme preference to Local Storage
     * @param {string} theme - The theme to save ('light' or 'dark')
     */
    saveTheme(theme) {
        Storage.set('theme', theme);
    },

    /**
     * Toggles between light and dark themes
     */
    toggleTheme() {
        // Switch to the opposite theme
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';

        // Update current theme
        this.currentTheme = newTheme;

        // Apply the new theme
        this.applyTheme(newTheme);

        // Save the preference
        this.saveTheme(newTheme);

        // Update the toggle icon
        this.updateToggleIcon();
    },

    /**
     * Applies the specified theme by setting the data-theme attribute on document root
     * @param {string} theme - The theme to apply ('light' or 'dark')
     */
    applyTheme(theme) {
        // Set the data-theme attribute on the document root element
        document.documentElement.setAttribute('data-theme', theme);
    },

    /**
     * Updates the theme toggle button icon based on the current theme
     * Shows 🌙 (moon) for light mode and ☀️ (sun) for dark mode
     */
    updateToggleIcon() {
        const themeIcon = document.getElementById('theme-icon');
        if (!themeIcon) {
            return;
        }

        // Update icon based on current theme
        // Moon icon for light mode (click to go dark)
        // Sun icon for dark mode (click to go light)
        if (this.currentTheme === 'light') {
            themeIcon.textContent = '🌙';
        } else {
            themeIcon.textContent = '☀️';
        }
    }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ThemeManager first to apply theme before other components render
    ThemeManager.init();

    // Initialize Greeting Component
    GreetingComponent.init();

    // Initialize Focus Timer Component
    FocusTimer.init();

    // Initialize Todo List Component
    TodoList.init();

    // Initialize Quick Links Component
    QuickLinks.init();
});
