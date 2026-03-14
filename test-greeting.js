// Unit tests for GreetingComponent time-based greeting logic
// Run with: node test-greeting.js

// Mock the GreetingComponent logic
function getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
    } else if (hour >= 17 && hour < 21) {
        return 'evening';
    } else {
        return 'night';
    }
}

function getGreeting(timeOfDay) {
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

// Test cases based on requirements
const testCases = [
    // Morning: 5:00-11:59 → "Good Morning"
    { hour: 5, expectedTimeOfDay: 'morning', expectedGreeting: 'Good Morning', description: 'Morning start (5:00)' },
    { hour: 8, expectedTimeOfDay: 'morning', expectedGreeting: 'Good Morning', description: 'Morning middle (8:00)' },
    { hour: 11, expectedTimeOfDay: 'morning', expectedGreeting: 'Good Morning', description: 'Morning end (11:59)' },

    // Afternoon: 12:00-16:59 → "Good Afternoon"
    { hour: 12, expectedTimeOfDay: 'afternoon', expectedGreeting: 'Good Afternoon', description: 'Afternoon start (12:00)' },
    { hour: 14, expectedTimeOfDay: 'afternoon', expectedGreeting: 'Good Afternoon', description: 'Afternoon middle (14:00)' },
    { hour: 16, expectedTimeOfDay: 'afternoon', expectedGreeting: 'Good Afternoon', description: 'Afternoon end (16:59)' },

    // Evening: 17:00-20:59 → "Good Evening"
    { hour: 17, expectedTimeOfDay: 'evening', expectedGreeting: 'Good Evening', description: 'Evening start (17:00)' },
    { hour: 19, expectedTimeOfDay: 'evening', expectedGreeting: 'Good Evening', description: 'Evening middle (19:00)' },
    { hour: 20, expectedTimeOfDay: 'evening', expectedGreeting: 'Good Evening', description: 'Evening end (20:59)' },

    // Night: 21:00-4:59 → "Good Night"
    { hour: 21, expectedTimeOfDay: 'night', expectedGreeting: 'Good Night', description: 'Night start (21:00)' },
    { hour: 23, expectedTimeOfDay: 'night', expectedGreeting: 'Good Night', description: 'Night late (23:00)' },
    { hour: 0, expectedTimeOfDay: 'night', expectedGreeting: 'Good Night', description: 'Midnight (0:00)' },
    { hour: 2, expectedTimeOfDay: 'night', expectedGreeting: 'Good Night', description: 'Night early morning (2:00)' },
    { hour: 4, expectedTimeOfDay: 'night', expectedGreeting: 'Good Night', description: 'Night end (4:59)' },
];

// Run tests
let passed = 0;
let failed = 0;
const failures = [];

console.log('Running Greeting Component Tests...\n');

testCases.forEach((test, index) => {
    const actualTimeOfDay = getTimeOfDay(test.hour);
    const actualGreeting = getGreeting(actualTimeOfDay);

    const timeOfDayMatch = actualTimeOfDay === test.expectedTimeOfDay;
    const greetingMatch = actualGreeting === test.expectedGreeting;
    const testPassed = timeOfDayMatch && greetingMatch;

    if (testPassed) {
        passed++;
        console.log(`✓ Test ${index + 1}: ${test.description}`);
    } else {
        failed++;
        console.log(`✗ Test ${index + 1}: ${test.description}`);
        console.log(`  Expected: ${test.expectedTimeOfDay} / "${test.expectedGreeting}"`);
        console.log(`  Actual: ${actualTimeOfDay} / "${actualGreeting}"`);
        failures.push(test);
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('Test Summary:');
console.log(`Total: ${testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('='.repeat(50));

if (failed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
} else {
    console.log('\n✗ Some tests failed.');
    process.exit(1);
}
