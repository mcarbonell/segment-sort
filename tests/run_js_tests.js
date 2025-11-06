const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Import the SegmentSort class.
// The path is relative to the tests/ directory.
const SegmentSort = require('../implementations/javascript/segmentsort.js');

function runTests() {
    const testCasesPath = path.join(__dirname, 'test_cases.json');
    const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));
    
    const sorter = new SegmentSort();
    let passed = 0;
    let failed = 0;

    console.log('Running tests for SegmentSort in JavaScript...\n');

    testCases.forEach((testCase, index) => {
        // Create a copy of the input to be sorted, as the sort is in-place.
        let arrayToSort = [...testCase.input];
        
        try {
            sorter.sort(arrayToSort);
            // Use deepStrictEqual for a reliable array comparison.
            assert.deepStrictEqual(arrayToSort, testCase.expected);
            console.log(`✅ Test #${index + 1}: ${testCase.name} - PASSED`);
            passed++;
        } catch (error) {
            console.error(`❌ Test #${index + 1}: ${testCase.name} - FAILED`);
            console.error(`   Expected: ${JSON.stringify(testCase.expected)}`);
            console.error(`   Got:      ${JSON.stringify(arrayToSort)}`);
            failed++;
        }
    });

    console.log(`\n--------------------`);
    console.log(`Test Summary:`);
    console.log(`  ${passed} passed`);
    console.log(`  ${failed} failed`);
    console.log(`--------------------\n`);

    // Exit with a non-zero code if any test failed to make it CI-friendly.
    if (failed > 0) {
        process.exit(1);
    }
}

// Run the tests
runTests();