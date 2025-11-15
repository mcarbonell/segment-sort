const onTheFlyBalancedMergeSort = require('../implementations/javascript/balanced_segment_merge_sort.js');
const testCases = require('./test_cases.json');
const fs = require('fs');

/**
 * Compares two arrays for equality.
 * @param {any[]} a The first array.
 * @param {any[]} b The second array.
 * @returns {boolean} True if the arrays are equal, false otherwise.
 */
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * Runs all test cases against the balancedSegmentMergeSort function.
 */
function runTests() {
    console.log('Running tests for On-the-Fly Balanced Merge Sort...\n');
    let passed = 0;
    let failed = 0;

    testCases.forEach((test, index) => {
        const input = [...test.input]; // Create a copy to avoid modifying the original test case
        const result = onTheFlyBalancedMergeSort(input);
        const expected = test.expected;

        console.log(`Test Case ${index + 1}: ${test.name}`);
        console.log(`  Input:    [${test.input.join(', ')}]`);

        if (arraysEqual(result, expected)) {
            console.log(`  Result:   [${result.join(', ')}]`);
            console.log('  Status:   ✅ PASSED\n');
            passed++;
        } else {
            console.log(`  Expected: [${expected.join(', ')}]`);
            console.log(`  Actual:   [${result.join(', ')}]`);
            console.log('  Status:   ❌ FAILED\n');
            failed++;
        }
    });

    console.log('----------------------------------------');
    console.log(`Test Summary: ${passed} passed, ${failed} failed.`);
    console.log('----------------------------------------');

    // Exit with a non-zero code if any tests failed
    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
