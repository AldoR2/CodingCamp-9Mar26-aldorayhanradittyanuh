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

    /**
     * Initializes the greeting component and starts the time update interval
     */
    init() {
        // Update immediately on load
        this.updateTime();

        // Set up interval to update every second
        this.intervalId = setInterval(() => {
            this.updateTime();
        }, 1000);
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
        const greetingMessage = document.getElementById('greeting-message');
        if (greetingMessage) {
            greetingMessage.textContent = this.getGreeting();
        }
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
    }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Greeting Component
    GreetingComponent.init();
});
