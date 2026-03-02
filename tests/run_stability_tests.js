const blockMergeSegmentSort = require('../implementations/javascript/block_merge_segment_sort.js');
const onTheFlyBalancedMergeSort = require('../implementations/javascript/balanced_segment_merge_sort.js');

/**
 * Stability Test Suite for Segment Sort Algorithms
 *
 * A stable sort preserves the relative order of elements with equal keys.
 * Since our sorts operate on plain integer arrays, we encode (key, originalIndex)
 * pairs as: encoded = key * MULTIPLIER + originalIndex.
 * After sorting, we decode and verify that for elements sharing the same key,
 * their original indices appear in ascending order.
 */

// Keys must be non-negative for the encoding to work correctly,
// since JS % operator preserves sign for negative values.
const MULTIPLIER = 100000;

function encode(key, originalIndex) {
    return key * MULTIPLIER + originalIndex;
}

function decodeKey(val) {
    return Math.floor(val / MULTIPLIER);
}

function decodeIndex(val) {
    return val % MULTIPLIER;
}

/**
 * Builds an encoded array from an array of keys.
 * Each key is paired with its original position index.
 */
function buildEncoded(keys) {
    return keys.map((key, i) => encode(key, i));
}

/**
 * Checks if a sorted encoded array is stable.
 * Returns { sorted: boolean, stable: boolean, details: string }.
 */
function checkStability(sortedEncoded) {
    let isSorted = true;
    let isStable = true;
    let details = '';

    for (let i = 1; i < sortedEncoded.length; i++) {
        const prevKey = decodeKey(sortedEncoded[i - 1]);
        const currKey = decodeKey(sortedEncoded[i]);

        if (prevKey > currKey) {
            isSorted = false;
            details = `Not sorted: key ${prevKey} before key ${currKey} at position ${i}`;
            break;
        }

        if (prevKey === currKey) {
            const prevIdx = decodeIndex(sortedEncoded[i - 1]);
            const currIdx = decodeIndex(sortedEncoded[i]);
            if (prevIdx >= currIdx) {
                isStable = false;
                details = `Unstable: key=${prevKey}, original index ${prevIdx} appeared before ${currIdx} in input but after it in output (positions ${i - 1},${i})`;
                break;
            }
        }
    }

    return { sorted: isSorted, stable: isStable, details };
}

const stabilityTests = [
    {
        name: 'All equal keys (5 elements)',
        keys: [3, 3, 3, 3, 3]
    },
    {
        name: 'All equal keys (10 elements)',
        keys: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
    },
    {
        name: 'Two groups of equal keys',
        keys: [2, 1, 2, 1, 2, 1]
    },
    {
        name: 'Three groups interleaved',
        keys: [3, 1, 2, 3, 1, 2, 3, 1, 2]
    },
    {
        name: 'Duplicates at boundaries',
        keys: [1, 1, 2, 3, 3, 3, 4, 4, 5, 5]
    },
    {
        name: 'Reverse sorted with duplicates',
        keys: [5, 5, 4, 4, 3, 3, 2, 2, 1, 1]
    },
    {
        name: 'Already sorted with duplicates',
        keys: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
    },
    {
        name: 'Single unique value among many',
        keys: [5, 5, 5, 3, 5, 5, 5]
    },
    {
        name: 'Pipe organ with duplicates',
        keys: [1, 2, 3, 4, 4, 3, 2, 1]
    },
    {
        name: 'Many duplicates few uniques',
        keys: [2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2]
    },
    {
        name: 'Large array with duplicate blocks',
        keys: [3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4]
    },
    {
        name: 'Alternating two values (20 elements)',
        keys: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    },
    {
        name: 'Sawtooth with duplicates',
        keys: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]
    },
    {
        name: 'Random-like with many ties',
        keys: [4, 2, 3, 1, 4, 2, 3, 1, 4, 2, 3, 1, 4, 2, 3, 1]
    },
    {
        name: '50 elements with 5 unique keys',
        keys: (() => {
            const result = [];
            for (let i = 0; i < 50; i++) result.push((i * 7 + 3) % 5);
            return result;
        })()
    }
];

function runStabilityTests(sortFn, sortName) {
    console.log(`\nRunning stability tests for ${sortName}...\n`);
    let passed = 0;
    let failed = 0;

    stabilityTests.forEach((test, index) => {
        const encoded = buildEncoded(test.keys);
        const input = [...encoded];
        sortFn(input);

        const result = checkStability(input);

        console.log(`  Test ${index + 1}: ${test.name}`);

        if (!result.sorted) {
            console.log(`    Status: FAILED (not sorted) - ${result.details}\n`);
            failed++;
        } else if (!result.stable) {
            console.log(`    Status: FAILED (unstable) - ${result.details}\n`);
            failed++;
        } else {
            console.log(`    Status: PASSED\n`);
            passed++;
        }
    });

    console.log(`  ----------------------------------------`);
    console.log(`  ${sortName}: ${passed} passed, ${failed} failed.`);
    console.log(`  ----------------------------------------\n`);

    return failed;
}

console.log('=== Stability Test Suite ===');

let totalFailed = 0;
totalFailed += runStabilityTests(blockMergeSegmentSort, 'Block Merge Segment Sort');
totalFailed += runStabilityTests(onTheFlyBalancedMergeSort, 'On-the-Fly Balanced Merge Sort');

if (totalFailed > 0) {
    process.exit(1);
}
