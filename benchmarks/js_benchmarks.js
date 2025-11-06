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

// Quick Sort implementation
function quickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
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

// Data generators
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
        const result = [];
        const segmentSize = Math.max(10, Math.floor(size / 10));

        for (let i = 0; i < size; i += segmentSize) {
            const segment = Array.from(
                { length: Math.min(segmentSize, size - i) },
                (_, j) => i + j
            );

            // 80% chance to be in correct order, 20% random
            if (Math.random() > 0.2) {
                result.push(...segment);
            } else {
                result.push(...segment.reverse());
            }
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

// Benchmark function
function runBenchmark(algorithm, data, name) {
    console.log(`Running ${algorithm} on ${name} dataset (${data.length} elements)...`);

    const result = Algorithms[algorithm](data);
    const isSorted = isArraySorted(result.sorted);

    return {
        algorithm,
        dataset: name,
        size: data.length,
        time: result.time,
        correct: isSorted,
        speedup: null // Will be calculated later
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
                    const result = runBenchmark(algorithm, data, dataset);
                    datasetResults.push(result);
                    results.push(result);

                    console.log(`${result.algorithm.padEnd(12)}: ${result.time.toFixed(3)}ms ${result.correct ? '✅' : '❌'}`);
                } catch (error) {
                    console.error(`Error in ${algorithm}:`, error.message);
                }
            }

            // Calculate speedup for this dataset
            const baselineTime = datasetResults.find(r => r.algorithm === 'quickSort')?.time;
            if (baselineTime) {
                datasetResults.forEach(result => {
                    result.speedup = ((baselineTime - result.time) / baselineTime * 100).toFixed(1);
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
        avgByAlgorithm[result.algorithm].total += result.time;
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
            result.time < min.time ? result : min
        );
        console.log(`${dataset.padEnd(12)}: ${best.algorithm} (${best.time.toFixed(3)}ms)`);
    });

    // Segment Sort advantages
    console.log('\n🎯 Segment Sort Competitive Advantages:');
    const segmentSortResults = results.filter(r => r.algorithm === 'segmentSort');
    const semiOrderedWins = segmentSortResults.filter(r =>
        r.dataset === 'semiOrdered' && r.speedup && parseFloat(r.speedup) > 0
    ).length;

    console.log(`• Wins on semi-ordered data: ${semiOrderedWins}/${segmentSortResults.filter(r => r.dataset === 'semiOrdered').length} cases`);

    const avgSpeedup = segmentSortResults
        .filter(r => r.speedup)
        .map(r => parseFloat(r.speedup))
        .reduce((sum, speedup) => sum + speedup, 0) / segmentSortResults.filter(r => r.speedup).length;

    if (!isNaN(avgSpeedup)) {
        console.log(`• Average speedup over QuickSort: ${avgSpeedup.toFixed(1)}%`);
    }

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
        [1000, 5000, 10000];

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