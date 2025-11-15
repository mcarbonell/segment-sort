#!/usr/bin/env node

/**
 * Segment Sort - JavaScript Benchmarks
 * Comprehensive performance testing for Segment Sort algorithm
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */

(function () {
    'use strict';

    // Detectar entorno (Node.js vs navegador)
    const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

    // Import Segment Sort implementation (solo en Node.js)
    let segmentSort = null;
    let balancedSegmentMergeSort = null;
    if (isNode) {
        const fs = require('fs');
        const path = require('path');
        segmentSort = require('../implementations/javascript/segmentsort.js');
        balancedSegmentMergeSort = require('../implementations/javascript/balanced_segment_merge_sort.js');
    } else {
        // En navegador, SegmentSort se cargará dinámicamente
        segmentSort = null;
    }

    // --- Deterministic Random Number Generator (LCG) ---
    // This ensures reproducibility of benchmarks.
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

    // Optimized Quick Sort implementation with median-of-three pivot selection
    function quickSort(arr, low, high) {
        // No initial shuffle here; data generation should provide desired distribution
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
            const j = Math.floor(lcgRandom() * (i + 1));
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

    // Helper function for heap sort
    function heapify(arr, n, i) {
        let largest = i; // Initialize largest as root
        const left = 2 * i + 1; // left child
        const right = 2 * i + 2; // right child

        // If left child exists and is greater than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child exists and is greater than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest); // Recursively heapify the affected sub-tree
        }
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

    const sorters = {
        segmentSort: (arr) => {
            const copy = [...arr];
            const start = process.hrtime.bigint();
            const sorted = segmentSort(copy);
            const end = process.hrtime.bigint();
            return { sorted, time: Number(end - start) / 1e6 };
        },

        quickSort: (arr) => {
            const copy = [...arr];
            const start = process.hrtime.bigint();
            const sorted = quickSort(copy, 0, copy.length - 1);
            const end = process.hrtime.bigint();
            return { sorted, time: Number(end - start) / 1e6 };
        },

        balancedSegmentMergeSort: (arr) => {
            const copy = [...arr];
            const start = process.hrtime.bigint();
            const sorted = balancedSegmentMergeSort(copy);
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

    module.exports = sorters;

    // Data generators - improved to be more fair and comprehensive
    function generateRandomArray(size, min = 0, max = 1000) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            const value = Math.floor(lcgRandom() * (max - min + 1)) + min;
            arr.push(value);
        }
        return arr;
    }

    // K-sorted: elementos que están a lo sumo k posiciones de su posición final
    function generateKSortedArray(size, k, min = 0, max = 1000) {
        const arr = [];
        const step = (max - min) / size;

        // Crear array ordenado base
        for (let i = 0; i < size; i++) {
            arr.push(min + i * step);
        }

        // Aplicar swaps limitados por k
        for (let i = 0; i < size; i++) {
            const maxJ = Math.min(i + k + 1, size);
            const j = i + Math.floor(lcgRandom() * (maxJ - i));
            if (j < size) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        return arr;
    }

    // Nearly sorted: datos ordenados con perturbaciones aleatorias
    function generateNearlySortedArray(size, numSwaps, min = 0, max = 1000) {
        const arr = [];
        const step = (max - min) / size;

        // Crear array ordenado
        for (let i = 0; i < size; i++) {
            arr.push(min + i * step);
        }

        // Aplicar swaps aleatorios
        for (let s = 0; s < numSwaps; s++) {
            const i = Math.floor(lcgRandom() * size);
            const j = Math.floor(lcgRandom() * size);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    // Array con alta concentración de duplicados
    function generateDuplicatesArray(size, uniqueValues = 10, min = 0, max = 100) {
        const arr = [];

        for (let i = 0; i < size; i++) {
            const valueIndex = Math.floor(lcgRandom() * uniqueValues);
            const value = min + (valueIndex * (max - min) / uniqueValues);
            arr.push(value);
        }

        return arr;
    }

    // Plateau: grandes secciones de valores idénticos
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

    // Segment sorted: segmentos internos ya ordenados
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

        // 70% sorted
        const step = (max - min) / sortedPortion;
        for (let i = 0; i < sortedPortion; i++) {
            arr.push(min + i * step);
        }

        // 30% random
        for (let i = 0; i < randomPortion; i++) {
            const value = Math.floor(lcgRandom() * (max - min + 1)) + min;
            arr.push(value);
        }

        return arr;
    }

    // Función para calcular estadísticas
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

    // Warm-up function para optimizar JIT
    function warmUp(algorithm, array) {
        const warmupRuns = 3;
        for (let i = 0; i < warmupRuns; i++) {
            try {
                algorithm([...array]);
            } catch (error) {
                // Silently ignore warm-up errors
                break;
            }
        }
    }

    function runBenchmark(algorithm, array, name, repetitions = 10) {
        const times = [];
        let sorted = null;
        let success = true;
        let error = null;

        // Warm-up run
        try {
            warmUp(algorithm, array);
        } catch (e) {
            // Continue anyway
        }

        // Multiple runs for statistical analysis
        for (let rep = 0; rep < repetitions; rep++) {
            try {
                const result = algorithm([...array]);
                times.push(result.time);
                if (rep === 0) sorted = result.sorted; // Store first result for validation
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

    function runBenchmarks(sizes = [100, 500, 1000, 2000], repetitions = 10) {
        console.log('🚀 Iniciando benchmarks de Segment Sort (Metodología Académica)...\n');
        console.log(`📋 Configuración: ${repetitions} repeticiones, análisis estadístico completo\n`);
        console.log('='.repeat(100));
        console.log('| Algoritmo           | Tamaño | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |');
        console.log('='.repeat(100));

        const allResults = [];

        for (const size of sizes) {
            console.log(`\n📊 Probando con arrays de tamaño: ${size}`);
            console.log('-'.repeat(60));

            // Generar datos de prueba con más variedad
            const randomArray = generateRandomArray(size);
            const sortedArray = generateSortedArray(size);
            const reverseArray = generateReverseArray(size);
            const kSortedArray = generateKSortedArray(size, Math.floor(size * 0.1)); // 10% desalineado
            const nearlySortedArray = generateNearlySortedArray(size, Math.floor(size * 0.05)); // 5% swaps
            const duplicatesArray = generateDuplicatesArray(size, 20); // 20 valores únicos
            const plateauArray = generatePlateauArray(size, Math.floor(size / 10)); // 10 segmentos
            const segmentSortedArray = generateSegmentSortedArray(size, Math.floor(size / 5)); // 5 segmentos

            const testCases = [
                { name: 'Aleatorio', data: randomArray, shortName: 'Aleatorio' },
                { name: 'Ordenado', data: sortedArray, shortName: 'Ordenado' },
                { name: 'Inverso', data: reverseArray, shortName: 'Inverso' },
                { name: 'K-sorted (k=10%)', data: kSortedArray, shortName: 'K-sorted' },
                { name: 'Nearly Sorted (5% swaps)', data: nearlySortedArray, shortName: 'NearlySorted' },
                { name: 'Con Duplicados (20 únicos)', data: duplicatesArray, shortName: 'Duplicados' },
                { name: 'Plateau (10 segmentos)', data: plateauArray, shortName: 'Plateau' },
                { name: 'Segment Sorted (5 segmentos)', data: segmentSortedArray, shortName: 'SegmentSorted' }
            ];

            for (const testCase of testCases) {
                console.log(`\n🧪 ${testCase.name}:`);

                // Probar cada algoritmo
                for (const [name, algorithm] of Object.entries(sorters)) {
                    const result = runBenchmark(algorithm, testCase.data, name, repetitions);
                    const status = result.success ? '✅' : '❌';

                    if (result.success) {
                        const timeStr = `${result.statistics.mean.toFixed(3)}`;
                        const medianStr = `${result.statistics.median.toFixed(3)}`;
                        const stdStr = `${result.statistics.std.toFixed(3)}`;
                        console.log(`   ${name.padEnd(18)} | ${size.toString().padStart(6)} | ${testCase.shortName.padEnd(18)} | ${timeStr.padStart(9)} | ${medianStr.padStart(11)} | ${stdStr.padStart(8)} | ${status}`);

                        // Store result for JSON export
                        allResults.push({
                            algorithm: name,
                            size: size,
                            dataType: testCase.shortName,
                            repetitions: repetitions,
                            statistics: result.statistics,
                            allTimes: result.times,
                            success: true
                        });
                    } else {
                        console.log(`   ${name.padEnd(18)} | ${size.toString().padStart(6)} | ${testCase.shortName.padEnd(18)} | ${'ERROR'.padStart(9)} | ${'ERROR'.padStart(11)} | ${'ERROR'.padStart(8)} | ${status}`);
                        console.log(`   Error: ${result.error}`);

                        allResults.push({
                            algorithm: name,
                            size: size,
                            dataType: testCase.shortName,
                            repetitions: 0,
                            statistics: {},
                            allTimes: [],
                            success: false,
                            error: result.error
                        });
                    }
                }
            }
        }

        console.log('\n' + '='.repeat(100));
        console.log('🎉 Benchmarks completados!');

        // Exportar resultados a JSON
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `benchmark_results_${timestamp}_seed${currentSeed}.json`;
        const results = {
            metadata: {
                timestamp: new Date().toISOString(),
                seed: currentSeed,
                node_version: process.version,
                platform: process.platform,
                arch: process.arch,
                repetitions: repetitions,
                methodology: 'Academic Rigor Benchmarking v1.0'
            },
            results: allResults
        };

        try {
            require('fs').writeFileSync(filename, JSON.stringify(results, null, 2));
            console.log(`💾 Resultados exportados a: ${filename}`);
        } catch (error) {
            console.log(`❌ Error exportando resultados: ${error.message}`);
        }

        return results;
    }// Ejecutar benchmarks si el archivo se ejecuta directamente
    if (require.main === module) {
        const args = process.argv.slice(2);
        let sizes, repetitions;

        // Parse command line arguments
        if (args.length === 0) {
            sizes = [100, 500, 1000, 2000];
            repetitions = 10;
        } else if (args.length === 1) {
            // If only one argument, it could be a size or repetitions flag
            if (args[0] === '--reps' || args[0] === '-r') {
                console.log('Uso: node js_benchmarks.js [sizes...] [--reps repetitions]');
                process.exit(1);
            } else if (isNaN(args[0])) {
                console.log('Error: Argumentos deben ser números');
                process.exit(1);
            } else {
                sizes = [parseInt(args[0])];
                repetitions = 10;
            }
        } else {
            // Check for --reps flag
            const repsIndex = args.indexOf('--reps') || args.indexOf('-r');
            if (repsIndex !== -1 && repsIndex < args.length - 1) {
                repetitions = parseInt(args[repsIndex + 1]);
                sizes = args.slice(0, repsIndex).filter(arg => !isNaN(arg)).map(Number);
                if (sizes.length === 0) sizes = [100, 500, 1000, 2000];
            } else {
                // All arguments are sizes
                sizes = args.map(Number).filter(n => !isNaN(n));
                repetitions = 10;
            }
        }

        console.log(`🔧 Configuración:`);
        console.log(`   - Tamaños: [${sizes.join(', ')}]`);
        console.log(`   - Repeticiones: ${repetitions}`);
        console.log(`   - Seed: ${currentSeed}\n`);

        runBenchmarks(sizes, repetitions);
    }
})();
