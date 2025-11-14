/**
 * Segment Sort - Benchmark Core
 * Core benchmark functions compatible with both Node.js and Browser
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */

// Detectar entorno
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Segment Sort class (simplified version for browser)
if (isBrowser) {
    class SegmentSort {
        sort(arr) {
            // Simple bubble sort as placeholder for browser
            // In real implementation, this would be the actual segment sort
            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    }
                }
            }
            return arr;
        }
    }
    window.SegmentSort = SegmentSort;
}

// --- Deterministic Random Number Generator (LCG) ---
let currentSeed = 12345; // Default seed

function setSeed(seed) {
    currentSeed = seed;
}

function lcgRandom() {
    const a = 1103515245;
    const c = 12345;
    const m = 2 ** 31; // Modulus
    currentSeed = (a * currentSeed + c) % m;
    return currentSeed / m; // Normalize to [0, 1)
}

// MinHeap implementation for heap operations
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

// Optimized Quick Sort implementation with median-of-three pivot selection
function quickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    // Median-of-three pivot selection to avoid worst case
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

// Helper function for heap sort
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

// Heap Sort implementation
function heapSort(arr) {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }

    return arr;
}

// Sorting algorithms registry
const sorters = {
    segmentSort: (arr) => {
        const sorter = new SegmentSort();
        const copy = [...arr];
        const start = isNode ? process.hrtime.bigint() : performance.now();
        sorter.sort(copy);
        const end = isNode ? process.hrtime.bigint() : performance.now();
        const time = isNode ? Number(end - start) / 1e6 : end - start;
        return { sorted: copy, time: time };
    },

    quickSort: (arr) => {
        const copy = [...arr];
        const start = isNode ? process.hrtime.bigint() : performance.now();
        const sorted = quickSort(copy, 0, copy.length - 1);
        const end = isNode ? process.hrtime.bigint() : performance.now();
        const time = isNode ? Number(end - start) / 1e6 : end - start;
        return { sorted, time: time };
    },

    mergeSort: (arr) => {
        const copy = [...arr];
        const start = isNode ? process.hrtime.bigint() : performance.now();
        const sorted = mergeSort(copy);
        const end = isNode ? process.hrtime.bigint() : performance.now();
        const time = isNode ? Number(end - start) / 1e6 : end - start;
        return { sorted, time: time };
    },

    heapSort: (arr) => {
        const copy = [...arr];
        const start = isNode ? process.hrtime.bigint() : performance.now();
        heapSort(copy);
        const end = isNode ? process.hrtime.bigint() : performance.now();
        const time = isNode ? Number(end - start) / 1e6 : end - start;
        return { sorted: copy, time: time };
    },

    builtinSort: (arr) => {
        const copy = [...arr];
        const start = isNode ? process.hrtime.bigint() : performance.now();
        copy.sort((a, b) => a - b);
        const end = isNode ? process.hrtime.bigint() : performance.now();
        const time = isNode ? Number(end - start) / 1e6 : end - start;
        return { sorted: copy, time: time };
    }
};

// Data generators
function generateRandomArray(size, min = 0, max = 1000) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        const value = Math.floor(lcgRandom() * (max - min + 1)) + min;
        arr.push(value);
    }
    return arr;
}

function generateKSortedArray(size, k, min = 0, max = 1000) {
    const arr = [];

    for (let i = 0; i < size; i++) {
        arr.push(min + i * (max - min) / size);
    }

    for (let i = 0; i < size; i++) {
        const maxJ = Math.min(i + k + 1, size);
        const j = i + Math.floor(lcgRandom() * (maxJ - i));
        if (j < size) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    return arr;
}

function generateNearlySortedArray(size, numSwaps, min = 0, max = 1000) {
    const arr = [];

    for (let i = 0; i < size; i++) {
        arr.push(min + i * (max - min) / size);
    }

    for (let s = 0; s < numSwaps; s++) {
        const i = Math.floor(lcgRandom() * size);
        const j = Math.floor(lcgRandom() * size);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function generateDuplicatesArray(size, uniqueValues = 10, min = 0, max = 100) {
    const arr = [];

    for (let i = 0; i < size; i++) {
        const valueIndex = Math.floor(lcgRandom() * uniqueValues);
        const value = min + (valueIndex * (max - min) / uniqueValues);
        arr.push(value);
    }

    return arr;
}

function generatePlateauArray(size, plateauSize, min = 0, max = 1000) {
    const arr = [];
    const numPlateaus = Math.ceil(size / plateauSize);

    for (let p = 0; p < numPlateaus; p++) {
        const plateauValue = min + (p * (max - min) / numPlateaus);
        const currentPlateauSize = Math.min(plateauSize, size - arr.length);

        for (let i = 0; i < currentPlateauSize; i++) {
            arr.push(plateauValue);
        }
    }

    return arr;
}

function generateSegmentSortedArray(size, segmentSize, min = 0, max = 1000) {
    const arr = [];
    const numSegments = Math.ceil(size / segmentSize);

    for (let s = 0; s < numSegments; s++) {
        const segmentStart = s * segmentSize;
        const segmentEnd = Math.min(segmentStart + segmentSize, size);
        const segmentRange = (max - min) / numSegments;
        const segmentMin = min + s * segmentRange;
        const segmentMax = segmentMin + segmentRange;

        for (let i = segmentStart; i < segmentEnd; i++) {
            const value = segmentMin + (i - segmentStart) * (segmentMax - segmentMin) / (segmentEnd - segmentStart);
            arr.push(value);
        }
    }

    return arr;
}

function generateSortedArray(size, min = 0, max = 1000) {
    const arr = [];
    const step = (max - min) / size;
    for (let i = 0; i < size; i++) {
        arr.push(min + i * step);
    }
    return arr;
}

function generateReverseArray(size, min = 0, max = 1000) {
    const arr = [];
    const step = (max - min) / size;
    for (let i = 0; i < size; i++) {
        arr.push(max - i * step);
    }
    return arr;
}

function generatePartiallySortedArray(size, min = 0, max = 1000) {
    const arr = [];
    const sortedPortion = Math.floor(size * 0.7);
    const randomPortion = size - sortedPortion;

    const step = (max - min) / sortedPortion;
    for (let i = 0; i < sortedPortion; i++) {
        arr.push(min + i * step);
    }

    for (let i = 0; i < randomPortion; i++) {
        const value = Math.floor(lcgRandom() * (max - min + 1)) + min;
        arr.push(value);
    }

    return arr;
}

// Statistics functions
function calculateStats(times) {
    if (times.length === 0) {
        return { mean: 0, median: 0, std: 0, p5: 0, p95: 0, min: 0, max: 0 };
    }

    const sorted = [...times].sort((a, b) => a - b);
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length;
    const std = Math.sqrt(variance);

    const p5Index = Math.floor(sorted.length * 0.05);
    const p95Index = Math.floor(sorted.length * 0.95);

    return {
        mean: mean,
        median: median,
        std: std,
        p5: sorted[p5Index] || sorted[0],
        p95: sorted[p95Index] || sorted[sorted.length - 1],
        min: sorted[0],
        max: sorted[sorted.length - 1]
    };
}

// Warm-up function
function warmUp(algorithm, array) {
    const warmupRuns = 3;
    for (let i = 0; i < warmupRuns; i++) {
        try {
            algorithm([...array]);
        } catch (error) {
            break;
        }
    }
}

function runBenchmark(algorithm, array, name, repetitions = 10) {
    const times = [];
    let sorted = null;
    let success = true;
    let error = null;

    try {
        warmUp(algorithm, array);
    } catch (e) {
        // Continue anyway
    }

    for (let rep = 0; rep < repetitions; rep++) {
        try {
            const result = algorithm([...array]);
            times.push(result.time);
            if (rep === 0) sorted = result.sorted;
        } catch (err) {
            success = false;
            error = err.message;
            break;
        }
    }

    if (success) {
        const stats = calculateStats(times);
        return {
            algorithm: name,
            size: array.length,
            repetitions: repetitions,
            times: times,
            statistics: stats,
            sorted: sorted,
            success: true
        };
    } else {
        return {
            algorithm: name,
            size: array.length,
            repetitions: 0,
            times: [],
            statistics: {},
            sorted: [],
            success: false,
            error: error
        };
    }
}

// Main benchmark function
function runBenchmarks(sizes = [100, 500, 1000, 2000], repetitions = 10, dataType = 'all', algorithms = Object.keys(sorters)) {
    const allResults = [];
    const timestamp = new Date().toISOString();

    const dataGenerators = {
        'Aleatorio': generateRandomArray,
        'Ordenado': generateSortedArray,
        'Inverso': generateReverseArray,
        'K-sorted': generateKSortedArray,
        'NearlySorted': generateNearlySortedArray,
        'Duplicados': generateDuplicatesArray,
        'Plateau': generatePlateauArray,
        'SegmentSorted': generateSegmentSortedArray
    };

    for (const size of sizes) {
        const testCases = [];

        if (dataType === 'all') {
            testCases.push(
                { name: 'Aleatorio', data: generateRandomArray(size), shortName: 'Aleatorio' },
                { name: 'Ordenado', data: generateSortedArray(size), shortName: 'Ordenado' },
                { name: 'Inverso', data: generateReverseArray(size), shortName: 'Inverso' },
                { name: 'K-sorted', data: generateKSortedArray(size, Math.floor(size * 0.1)), shortName: 'K-sorted' },
                { name: 'NearlySorted', data: generateNearlySortedArray(size, Math.floor(size * 0.05)), shortName: 'NearlySorted' },
                { name: 'Duplicados', data: generateDuplicatesArray(size, 20), shortName: 'Duplicados' },
                { name: 'Plateau', data: generatePlateauArray(size, Math.floor(size / 10)), shortName: 'Plateau' },
                { name: 'SegmentSorted', data: generateSegmentSortedArray(size, Math.floor(size / 5)), shortName: 'SegmentSorted' }
            );
        } else {
            const generator = dataGenerators[dataType];
            if (generator) {
                const specialParams = {
                    'K-sorted': [size, Math.floor(size * 0.1)],
                    'NearlySorted': [size, Math.floor(size * 0.05)],
                    'Duplicados': [size, 20],
                    'Plateau': [size, Math.floor(size / 10)],
                    'SegmentSorted': [size, Math.floor(size / 5)]
                };

                const params = specialParams[dataType] || [size];
                testCases.push({
                    name: dataType,
                    data: generator(...params),
                    shortName: dataType
                });
            }
        }

        for (const testCase of testCases) {
            for (const name of algorithms) {
                if (sorters[name]) {
                    const result = runBenchmark(sorters[name], testCase.data, name, repetitions);
                    allResults.push(result);
                }
            }
        }
    }

    return {
        metadata: {
            timestamp: timestamp,
            seed: currentSeed,
            node_version: isNode ? process.version : 'browser',
            platform: isNode ? process.platform : navigator.platform,
            arch: isNode ? process.arch : 'x64',
            repetitions: repetitions,
            methodology: 'Academic Rigor Benchmarking v1.0'
        },
        results: allResults
    };
}

// Export for both environments
if (isNode) {
    module.exports = {
        sorters,
        runBenchmarks,
        generateRandomArray,
        generateSortedArray,
        generateReverseArray,
        generateKSortedArray,
        generateNearlySortedArray,
        generateDuplicatesArray,
        generatePlateauArray,
        generateSegmentSortedArray,
        setSeed
    };
} else {
    // Browser export
    window.BenchmarkCore = {
        sorters,
        runBenchmarks,
        runBenchmark,
        generateRandomArray,
        generateSortedArray,
        generateReverseArray,
        generateKSortedArray,
        generateNearlySortedArray,
        generateDuplicatesArray,
        generatePlateauArray,
        generateSegmentSortedArray,
        setSeed
    };
}