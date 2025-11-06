#!/usr/bin/env node

/**
 * Segment Sort - JavaScript Benchmarks
 * Comprehensive performance testing for Segment Sort algorithm
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */

const fs = require('fs');
const path = require('path');

// Import Segment Sort implementation from the main implementation
const SegmentSort = require('../implementations/javascript/segmentsort.js');

// MinHeap implementation for heap operations (needed by benchmark algorithms)
class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].value <= this.heap[index].value) break;

            [this.heap[parentIndex], this.heap[index]] =
                [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length &&
                this.heap[leftChild].value < this.heap[smallest].value) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild].value < this.heap[smallest].value) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] =
                [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

// Comparison algorithms
const Algorithms = {
    segmentSort: (arr) => {
        const sorter = new SegmentSort();
        const copy = [...arr];
        const start = process.hrtime.bigint();
        sorter.sort(copy);
        const end = process.hrtime.bigint();
        return { sorted: copy, time: Number(end - start) / 1e6 }; // Convert to milliseconds
    },

    quickSort: (arr) => {
        const copy = [...arr];
        const start = process.hrtime.bigint();
        const sorted = quickSort(copy, 0, copy.length - 1);
        const end = process.hrtime.bigint();
        return { sorted, time: Number(end - start) / 1e6 };
    },

    mergeSort: (arr) => {
        const copy = [...arr];
        const start = process.hrtime.bigint();
        const sorted = mergeSort(copy);
        const end = process.hrtime.bigint();
        return { sorted, time: Number(end - start) / 1e6 };
    },

    heapSort: (arr) => {
        const copy = [...arr];
        const start = process.hrtime.bigint();
        heapSort(copy);
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

// Optimized Quick Sort implementation with median-of-three pivot selection
function quickSort(arr, low, high) {
    // Shuffle first to avoid worst-case behavior
    shuffleArray(arr);
    quickSortRecursive(arr, low, high);
    return arr;
}

function quickSortRecursive(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSortRecursive(arr, low, pi - 1);
        quickSortRecursive(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    // Median-of-three pivot selection to avoid worst case
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < arr[low]) [arr[mid], arr[low]] = [arr[low], arr[mid]];
    if (arr[high] < arr[low]) [arr[high], arr[low]] = [arr[low], arr[high]];
    if (arr[high] < arr[mid]) [arr[high], arr[mid]] = [arr[mid], arr[high]];

    // Place median at end for partition
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

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Merge Sort implementation
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i), right.slice(j));
}

// Heap Sort implementation
function heapSort(arr) {
    const n = arr.length;

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

// Data generators - improved to be more fair
const DataGenerators = {
    random: (size) => {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    },

    sorted: (size) => {
        return Array.from({ length: size }, (_, i) => i);
    },

    reversed: (size) => {
        return Array.from({ length: size }, (_, i) => size - i);
    },

    semiOrdered: (size) => {
        // 50% sorted data mixed with random data for fair comparison
        const half = Math.floor(size * 0.5);
        const sortedPart = Array.from({ length: half }, (_, i) => i);

        // Random part to make it challenging
        const randomPart = Array.from({ length: size - half }, () => Math.floor(Math.random() * 1000));

        // Merge and shuffle
        const result = [...sortedPart, ...randomPart];

        // Shuffle to avoid patterns
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    },

    duplicates: (size) => {
        const result = [];
        for (let i = 0; i < size; i++) {
            result.push(Math.floor(Math.random() * 10));
        }
        return result;
    }
};

// Benchmark function with multiple runs and warm-up
function runBenchmark(algorithm, data, name, iterations = 5) {
    console.log(`Running ${algorithm} on ${name} dataset (${data.length} elements, ${iterations} runs)...`);

    // Warm up the engine to avoid JIT compilation effects
    if (algorithm === 'quickSort' || algorithm === 'segmentSort') {
        const warmupData = Array.from({ length: Math.min(1000, data.length) }, (_, i) => i);
        for (let i = 0; i < 3; i++) {
            Algorithms[algorithm]([...warmupData]);
        }
    }

    // Run multiple times and take average
    const times = [];
    const results = [];

    for (let i = 0; i < iterations; i++) {
        const result = Algorithms[algorithm]([...data]);
        const isSorted = isArraySorted(result.sorted);

        if (!isSorted) {
            console.error(`❌ Sorting failed for ${algorithm} on iteration ${i + 1}`);
            continue;
        }

        times.push(result.time);
        results.push(result.sorted);
    }

    if (times.length === 0) {
        throw new Error(`All runs failed for ${algorithm}`);
    }

    // Calculate statistics
    const avgTime = times.reduce((a, b) => a + b) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const stdDev = Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / times.length);

    return {
        algorithm,
        dataset: name,
        size: data.length,
        avgTime: avgTime,
        minTime: minTime,
        maxTime: maxTime,
        stdDev: stdDev,
        correct: true,
        speedup: null, // Will be calculated later
        iterations: times.length
    };
}

// Utility function to verify sorting
function isArraySorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}

// Main benchmark function
function runFullBenchmark(sizes = [1000, 5000, 10000, 50000]) {
    console.log('🚀 Segment Sort - JavaScript Benchmarks');
    console.log('======================================\n');

    const algorithms = ['segmentSort', 'quickSort', 'mergeSort', 'heapSort', 'builtinSort'];
    const datasets = ['random', 'sorted', 'reversed', 'semiOrdered', 'duplicates'];
    const results = [];

    for (const size of sizes) {
        console.log(`\n📊 Testing with ${size.toLocaleString()} elements\n`);

        for (const dataset of datasets) {
            console.log(`\nDataset: ${dataset}`);
            console.log('─'.repeat(50));

            const data = DataGenerators[dataset](size);
            const datasetResults = [];

            for (const algorithm of algorithms) {
                try {
                    const result = runBenchmark(algorithm, data, dataset, 5);
                    datasetResults.push(result);
                    results.push(result);

                    console.log(`${result.algorithm.padEnd(12)}: ${result.avgTime.toFixed(3)}ms (${result.minTime.toFixed(3)}-${result.maxTime.toFixed(3)}ms, σ=${result.stdDev.toFixed(3)}) ${result.correct ? '✅' : '❌'}`);
                } catch (error) {
                    console.error(`Error in ${algorithm}:`, error.message);
                }
            }

            // Calculate speedup for this dataset
            const baselineTime = datasetResults.find(r => r.algorithm === 'quickSort')?.avgTime;
            if (baselineTime) {
                datasetResults.forEach(result => {
                    result.speedup = ((baselineTime - result.avgTime) / baselineTime * 100).toFixed(1);
                });
            }
        }
    }

    return results;
}

// Generate detailed report
function generateReport(results) {
    console.log('\n\n📈 BENCHMARK RESULTS SUMMARY');
    console.log('============================\n');

    // Overall performance
    console.log('🏆 Overall Performance (Average across all tests):');
    const avgByAlgorithm = {};
    results.forEach(result => {
        if (!avgByAlgorithm[result.algorithm]) {
            avgByAlgorithm[result.algorithm] = { total: 0, count: 0 };
        }
        avgByAlgorithm[result.algorithm].total += result.avgTime;
        avgByAlgorithm[result.algorithm].count++;
    });

    Object.entries(avgByAlgorithm)
        .sort((a, b) => a[1].total / a[1].count - b[1].total / b[1].count)
        .forEach(([algorithm, stats]) => {
            const avg = stats.total / stats.count;
            console.log(`${algorithm.padEnd(12)}: ${avg.toFixed(3)}ms average`);
        });

    // Best performance by dataset
    console.log('\n🥇 Best Performance by Dataset:');
    const byDataset = {};
    results.forEach(result => {
        if (!byDataset[result.dataset]) {
            byDataset[result.dataset] = [];
        }
        byDataset[result.dataset].push(result);
    });

    Object.entries(byDataset).forEach(([dataset, datasetResults]) => {
        const best = datasetResults.reduce((min, result) =>
            result.avgTime < min.avgTime ? result : min
        );
        console.log(`${dataset.padEnd(12)}: ${best.algorithm} (${best.avgTime.toFixed(3)}ms avg, ${best.minTime.toFixed(3)}-${best.maxTime.toFixed(3)}ms range)`);
    });

    // Segment Sort advantages
    console.log('\n🎯 Segment Sort Competitive Advantages:');
    const segmentSortResults = results.filter(r => r.algorithm === 'segmentSort');
    const quickSortResults = results.filter(r => r.algorithm === 'quickSort');

    // Find cases where Segment Sort beats QuickSort
    let wins = 0;
    let totalComparisons = 0;
    let totalSpeedup = 0;

    quickSortResults.forEach(qsResult => {
        const segmentResult = segmentSortResults.find(sr =>
            sr.dataset === qsResult.dataset && sr.size === qsResult.size
        );
        if (segmentResult) {
            totalComparisons++;
            const speedup = ((qsResult.avgTime - segmentResult.avgTime) / qsResult.avgTime * 100);
            if (speedup > 0) {
                wins++;
            }
            totalSpeedup += speedup;
        }
    });

    console.log(`• Wins against QuickSort: ${wins}/${totalComparisons} cases`);
    console.log(`• Average speedup: ${(totalSpeedup / totalComparisons).toFixed(1)}%`);

    // Show specific improvements
    console.log('\n📊 Performance by Dataset:');
    const datasetComparison = {};
    results.forEach(result => {
        if (!datasetComparison[result.dataset]) {
            datasetComparison[result.dataset] = [];
        }
        datasetComparison[result.dataset].push(result);
    });

    Object.entries(datasetComparison).forEach(([dataset, datasetResults]) => {
        const segmentResult = datasetResults.find(r => r.algorithm === 'segmentSort');
        const quickResult = datasetResults.find(r => r.algorithm === 'quickSort');
        if (segmentResult && quickResult) {
            const speedup = ((quickResult.avgTime - segmentResult.avgTime) / quickResult.avgTime * 100);
            const winner = speedup > 0 ? 'Segment Sort' : 'QuickSort';
            console.log(`• ${dataset.padEnd(12)}: ${winner} faster by ${Math.abs(speedup).toFixed(1)}%`);
        }
    });

    return results;
}

// Save results to JSON
function saveResults(results) {
    const timestamp = new Date().toISOString();
    const filename = `benchmark_results_${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(__dirname, '..', filename);

    const report = {
        timestamp,
        results,
        summary: {
            total_tests: results.length,
            algorithms_tested: [...new Set(results.map(r => r.algorithm))],
            datasets_tested: [...new Set(results.map(r => r.dataset))],
            sizes_tested: [...new Set(results.map(r => r.size))]
        }
    };

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Results saved to: ${filename}`);

    return filepath;
}

// CLI interface
function main() {
    const args = process.argv.slice(2);
    const sizes = args.length > 0 ?
        args.map(arg => parseInt(arg)).filter(n => !isNaN(n)) :
        [1000, 10000, 100000, 1000000];

    console.log(`Testing with sizes: ${sizes.join(', ')}`);

    const results = runFullBenchmark(sizes);
    const report = generateReport(results);
    saveResults(results);

    console.log('\n✨ Benchmark completed successfully!');
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { SegmentSort, Algorithms, DataGenerators, runFullBenchmark };