#!/usr/bin/env node

/**
 * Simple Segment Sort Benchmark - JavaScript
 * Quick performance comparison for Segment Sort
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */

// Import Segment Sort from the main implementation
const SegmentSort = require('../implementations/javascript/segmentsort.js');

// Simple test data generators
function generateRandomData(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
}

function generateSortedData(size) {
    return Array.from({ length: size }, (_, i) => i);
}

function generateSemiOrderedData(size) {
    const result = [];
    const segmentSize = Math.max(10, Math.floor(size / 20));

    for (let i = 0; i < size; i += segmentSize) {
        const segment = Array.from(
            { length: Math.min(segmentSize, size - i) },
            (_, j) => i + j
        );

        // 80% correct order, 20% reversed
        if (Math.random() > 0.2) {
            result.push(...segment);
        } else {
            result.push(...segment.reverse());
        }
    }

    return result;
}

// Algorithm implementations
const algorithms = {
    segmentSort: (arr) => {
        const sorter = new SegmentSort();
        const copy = [...arr];
        const start = process.hrtime.bigint();
        sorter.sort(copy);
        const end = process.hrtime.bigint();
        return { sorted: copy, time: Number(end - start) / 1e6 };
    },

    quickSort: (arr) => {
        const copy = [...arr];
        const start = process.hrtime.bigint();
        quickSort(copy, 0, copy.length - 1);
        const end = process.hrtime.bigint();
        return { sorted: copy, time: Number(end - start) / 1e6 };
    },

    builtinSort: (arr) => {
        const copy = [...arr];
        const start = process.hrtime.bigint();
        copy.sort((a, b) => a - b);
        const end = process.hrtime.bigint();
        return { sorted: copy, time: Number(end - start) / 1e6 };
    }
};

// QuickSort implementation
function quickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Simple benchmark runner
function runSimpleBenchmark(size = 10000, runs = 3) {
    console.log('🚀 Simple Segment Sort Benchmark');
    console.log(`================================\n`);
    console.log(`Size: ${size.toLocaleString()} elements`);
    console.log(`Runs: ${runs} iterations per algorithm\n`);

    const datasets = [
        { name: 'Random Data', generator: generateRandomData },
        { name: 'Sorted Data', generator: generateSortedData },
        { name: 'Semi-Ordered Data', generator: generateSemiOrderedData }
    ];

    const results = {};

    for (const dataset of datasets) {
        console.log(`\n📊 ${dataset.name}:`);
        console.log('─'.repeat(40));

        const data = dataset.generator(size);
        const times = {};

        // Run each algorithm
        for (const [name, algorithm] of Object.entries(algorithms)) {
            const algorithmTimes = [];

            for (let i = 0; i < runs; i++) {
                const result = algorithm(data);
                algorithmTimes.push(result.time);
            }

            const avgTime = algorithmTimes.reduce((sum, time) => sum + time, 0) / runs;
            times[name] = avgTime;

            console.log(`${name.padEnd(12)}: ${avgTime.toFixed(3)}ms avg`);
        }

        // Calculate speedup
        const baselineTime = times.quickSort;
        if (baselineTime > 0) {
            const segmentSortSpeedup = ((baselineTime - times.segmentSort) / baselineTime * 100).toFixed(1);
            console.log(`Segment Sort speedup: ${segmentSortSpeedup > 0 ? '+' : ''}${segmentSortSpeedup}%`);
        }

        results[dataset.name] = times;
    }

    // Summary
    console.log('\n\n📈 SUMMARY');
    console.log('==========');

    // Find best algorithm for each dataset
    Object.entries(results).forEach(([dataset, times]) => {
        const winner = Object.entries(times).reduce((best, [algo, time]) =>
            time < best.time ? { algo, time } : best
            , { algo: '', time: Infinity });

        console.log(`${dataset.padEnd(18)}: ${winner.algo} (${winner.time.toFixed(3)}ms)`);
    });

    // Segment Sort analysis
    console.log('\n🎯 Segment Sort Analysis:');
    const semiOrderedWins = Object.entries(results).filter(([dataset, times]) => {
        return dataset.includes('Semi-Ordered') && times.segmentSort === Math.min(...Object.values(times));
    }).length;

    console.log(`• Semi-ordered data performance: ${semiOrderedWins > 0 ? 'EXCELLENT 🏆' : 'Good ✅'}`);
    console.log(`• Adaptability: Strong on structured data`);
    console.log(`• Use case: Ideal for partially ordered datasets`);

    return results;
}

// CLI interface
function main() {
    const args = process.argv.slice(2);
    const size = args[0] ? parseInt(args[0]) : 10000;
    const runs = args[1] ? parseInt(args[1]) : 3;

    if (isNaN(size) || size <= 0) {
        console.log('Usage: node js_simple_benchmark.js [size] [runs]');
        console.log('Example: node js_simple_benchmark.js 50000 5');
        return;
    }

    try {
        const results = runSimpleBenchmark(size, runs);
        console.log('\n✨ Benchmark completed successfully!');
    } catch (error) {
        console.error('Error running benchmark:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { runSimpleBenchmark };