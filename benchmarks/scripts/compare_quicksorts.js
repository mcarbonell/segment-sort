#!/usr/bin/env node

/**
 * Comparison of QuickSort Implementations
 * Testing the hypothesis that the original QuickSort implementation was suboptimal
 */

const { optimizedQuickSort } = require('./optimized_quicksort.js');
const segmentSort = require('../implementations/javascript/segmentsort_corrected.js');
const balancedSegmentMergeSort = require('../implementations/javascript/balanced_segment_merge_sort.js');

// Simple LCG for reproducible results
let currentSeed = 12345;
function lcgRandom() {
    const a = 1103515245;
    const c = 12345;
    const m = 2 ** 31;
    currentSeed = (a * currentSeed + c) % m;
    return currentSeed / m;
}

function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(lcgRandom() * 1000));
    }
    return arr;
}

function generateSortedArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(i);
    }
    return arr;
}

function generateReverseArray(size) {
    const arr = [];
    for (let i = size - 1; i >= 0; i--) {
        arr.push(i);
    }
    return arr;
}

function generateDuplicatesArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(lcgRandom() * 10)); // Many duplicates
    }
    return arr;
}

// Original QuickSort from benchmarks (the "sospechoso")
function originalQuickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        originalQuickSort(arr, low, pi - 1);
        originalQuickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < arr[low]) [arr[mid], arr[low]] = [arr[low], arr[mid]];
    if (arr[high] < arr[low]) [arr[high], arr[low]] = [arr[low], arr[high]];
    if (arr[high] < arr[mid]) [arr[high], arr[mid]] = [arr[mid], arr[high]];
    [arr[mid], arr[high]] = [arr[high], arr[mid]];

    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Test functions
function timeFunction(fn, arr) {
    const start = process.hrtime.bigint();
    const result = fn([...arr]);
    const end = process.hrtime.bigint();
    return { time: Number(end - start) / 1e6, result };
}

function runComparison(size, dataType, originalData) {
    console.log(`\n📊 Testing ${dataType} arrays of size ${size}:`);

    const testData = originalData;
    const iterations = 3;

    const results = {
        'Original QuickSort': [],
        'Optimized QuickSort': [],
        'SegmentSort': [],
        'BalancedSegmentMergeSort': [],
        'Built-in Sort': []
    };

    for (let i = 0; i < iterations; i++) {
        // Original QuickSort
        let result = timeFunction((arr) => originalQuickSort(arr, 0, arr.length - 1), testData);
        results['Original QuickSort'].push(result.time);

        // Optimized QuickSort
        result = timeFunction(optimizedQuickSort, testData);
        results['Optimized QuickSort'].push(result.time);

        // SegmentSort
        result = timeFunction(segmentSort, testData);
        results['SegmentSort'].push(result.time);

        // BalancedSegmentMergeSort
        result = timeFunction(balancedSegmentMergeSort, testData);
        results['BalancedSegmentMergeSort'].push(result.time);

        // Built-in
        result = timeFunction((arr) => arr.sort((a, b) => a - b), testData);
        results['Built-in Sort'].push(result.time);
    }

    // Calculate averages
    const averages = {};
    for (const [name, times] of Object.entries(results)) {
        averages[name] = times.reduce((a, b) => a + b, 0) / times.length;
    }

    // Sort by performance
    const sorted = Object.entries(averages).sort((a, b) => a[1] - b[1]);

    console.log('   Performance Ranking:');
    sorted.forEach(([name, time], index) => {
        console.log(`     ${index + 1}. ${name}: ${time.toFixed(3)}ms`);
    });

    return sorted;
}

function main() {
    console.log('🔬 Comparing QuickSort Implementations');
    console.log('====================================');

    // Test different data types and sizes
    const testSizes = [10000, 50000];

    for (const size of testSizes) {
        console.log(`\n🎯 Testing with size: ${size}`);
        console.log('='.repeat(50));

        // Random data (QuickSort's strong suit)
        runComparison(size, 'Random', generateRandomArray(size));

        // Sorted data (QuickSort's weak spot)
        runComparison(size, 'Sorted', generateSortedArray(size));

        // Reverse sorted
        runComparison(size, 'Reverse', generateReverseArray(size));

        // Duplicates (where 3-way partition helps)
        runComparison(size, 'Duplicates', generateDuplicatesArray(size));
    }

    console.log('\n📈 Analysis Summary:');
    console.log('===================');
    console.log('If the optimized QuickSort shows significantly better performance');
    console.log('than the original, it confirms that the benchmark results were');
    console.log('skewed by a suboptimal QuickSort implementation.');
}

if (require.main === module) {
    main();
}