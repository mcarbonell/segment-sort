#!/usr/bin/env node

/**
 * Segment Sort - JavaScript Benchmarks (Clean Version)
 * 
 * This version imports optimized reference implementations from the scripts directory
 * instead of embedding them directly. This ensures we're using the best possible
 * reference implementations for fair benchmarking.
 * 
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * Dependencies:
 * - benchmarks/scripts/optimized_quicksort.js
 * - benchmarks/scripts/merge_sort_reference.js
 * - benchmarks/scripts/heap_sort_reference.js
 * - benchmarks/scripts/builtin_sort_reference.js
 * - implementations/javascript/segmentsort_corrected.js
 * - implementations/javascript/balanced_segment_merge_sort.js
 */

(function () {
    'use strict';

    // Detectar entorno (Node.js vs navegador)
    const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

    // Import Segment Sort implementations
    let segmentSort = null;
    let balancedSegmentMergeSort = null;
    let blockMergeSegmentSort = null;

    if (isNode) {
        try {
            // Import hybrid SegmentSort implementation (detects when to use segment sort vs builtin)
            segmentSort = require('../implementations/javascript/segmentsort_grok.js');
            // Import balanced segment merge sort
            balancedSegmentMergeSort = require('../implementations/javascript/balanced_segment_merge_sort.js');
            // Import block merge segment sort
            blockMergeSegmentSort = require('../implementations/javascript/block_merge_segment_sort.js');
        } catch (error) {
            console.error('Error importing SegmentSort implementations:', error.message);
            process.exit(1);
        }
    }

    // Import optimized reference implementations
    let optimizedQuickSort = null;
    let mergeSort = null;
    let heapSort = null;
    let builtinSort = null;

    if (isNode) {
        try {
            const quickSortModule = require('./scripts/optimized_quicksort.js');
            optimizedQuickSort = quickSortModule.optimizedQuickSort;

            const mergeSortModule = require('./scripts/merge_sort_reference.js');
            mergeSort = mergeSortModule.mergeSort;

            const heapSortModule = require('./scripts/heap_sort_reference.js');
            heapSort = heapSortModule.heapSort;

            const builtinSortModule = require('./scripts/builtin_sort_reference.js');
            builtinSort = builtinSortModule.builtinSort;
        } catch (error) {
            console.error('Error importing reference implementations:', error.message);
            console.error('Make sure all reference scripts are available in benchmarks/scripts/');
            process.exit(1);
        }
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

    // Validation function
    function checkSorted(arr) {
        if (!Array.isArray(arr) || arr.length === 0) {
            return { isSorted: false, error: "Array is empty or not an array" };
        }

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return {
                    isSorted: false,
                    error: `Array not sorted at index ${i}: arr[${i - 1}]=${arr[i - 1]}, arr[${i}]=${arr[i]}`
                };
            }
        }

        return { isSorted: true };
    }

    // Compare two arrays element by element (used for validation against builtinSort)
    function compareArrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return {
                identical: false,
                error: `Different lengths: arr1.length=${arr1.length}, arr2.length=${arr2.length}`
            };
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return {
                    identical: false,
                    error: `Different values at index ${i}: arr1[${i}]=${arr1[i]}, arr2[${i}]=${arr2[i]}`
                };
            }
        }

        return { identical: true };
    }

    // Statistics calculation
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

    // Warm-up function for JIT optimization
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

    // Single benchmark run
    function runBenchmark(algorithm, array, name, repetitions = 10, validateResults = true, referenceResult = null) {
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
                const start = process.hrtime.bigint();
                const result = algorithm([...array]);
                const end = process.hrtime.bigint();

                times.push(Number(end - start) / 1e6); // Convert to milliseconds

                // Validate that result is correctly sorted (if validation is enabled)
                if (validateResults) {
                    const validation = checkSorted(result);
                    if (!validation.isSorted) {
                        success = false;
                        error = `Validation failed: ${validation.error}`;
                        break;
                    }

                    // Additional validation: compare with builtinSort reference result
                    if (referenceResult && name !== 'builtinSort') {
                        const comparison = compareArrays(result, referenceResult);
                        if (!comparison.identical) {
                            success = false;
                            error = `Reference comparison failed: ${comparison.error}`;
                            break;
                        }
                    }
                }

                if (rep === 0) sorted = result; // Store first valid result
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

    // Data generators
    function generateRandomArray(size, min = 0, max = 1000) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            const value = Math.floor(lcgRandom() * (max - min + 1)) + min;
            arr.push(value);
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

    function generateKSortedArray(size, k, min = 0, max = 1000) {
        const arr = [];
        const step = (max - min) / size;

        // Create base sorted array
        for (let i = 0; i < size; i++) {
            arr.push(min + i * step);
        }

        // Apply limited swaps
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
        const step = (max - min) / size;

        // Create sorted array
        for (let i = 0; i < size; i++) {
            arr.push(min + i * step);
        }

        // Apply random swaps
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

    // Algorithm definitions
    const sorters = {
        segmentSort: (arr) => {
            const copy = [...arr];
            const result = segmentSort(copy);
            return result;
        },

        balancedSegmentMergeSort: (arr) => {
            const copy = [...arr];
            const result = balancedSegmentMergeSort(copy);
            return result;
        },

        blockMergeSegmentSort: (arr) => {
            const copy = [...arr];
            const result = blockMergeSegmentSort(copy);
            return result;
        },

        optimizedQuickSort: (arr) => {
            const copy = [...arr];
            const result = optimizedQuickSort(copy);
            return result;
        },

        mergeSort: (arr) => {
            const copy = [...arr];
            const result = mergeSort(copy);
            return result;
        },

        heapSort: (arr) => {
            const copy = [...arr];
            const result = heapSort(copy);
            return result;
        },

        builtinSort: (arr) => {
            const copy = [...arr];
            const result = builtinSort(copy);
            return result;
        }
    };

    // Main benchmark execution
    function runBenchmarks(sizes = [100000], repetitions = 10, validateResults = true) {
        console.log('🚀 Iniciando benchmarks JAVASCRIPT de Segment Sort (Clean Version)');
        console.log('📊 Usando implementaciones de referencia optimizadas');
        console.log('');

        console.log(`📋 Configuración: ${repetitions} repeticiones, análisis estadístico completo`);
        console.log('='.repeat(100));
        console.log('| Algoritmo                   | Tamaño | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |');
        console.log('='.repeat(100));

        const allResults = [];

        for (const size of sizes) {
            console.log(`\n📊 Probando con arrays de tamaño: ${size}`);
            console.log('-'.repeat(60));

            // Generate test data
            const randomArray = generateRandomArray(size);
            const sortedArray = generateSortedArray(size);
            const reverseArray = generateReverseArray(size);
            const kSortedArray = generateKSortedArray(size, Math.floor(size * 0.1));
            const nearlySortedArray = generateNearlySortedArray(size, Math.floor(size * 0.05));
            const duplicatesArray = generateDuplicatesArray(size, 20);
            const plateauArray = generatePlateauArray(size, Math.floor(size / 10));
            const segmentSortedArray = generateSegmentSortedArray(size, Math.floor(size / 5));

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

                // First, get the reference result from builtinSort (only if validation is enabled)
                let referenceResult = null;
                if (validateResults) {
                    const builtinResult = runBenchmark(sorters.builtinSort, testCase.data, 'builtinSort', repetitions, false);
                    if (builtinResult.success) {
                        referenceResult = builtinResult.sorted;
                    } else {
                        console.log(`   ⚠️  Warning: builtinSort failed for ${testCase.name} - reference validation will be skipped`);
                    }
                }

                // Test each algorithm
                for (const [name, algorithm] of Object.entries(sorters)) {
                    const result = runBenchmark(algorithm, testCase.data, name, repetitions, validateResults, referenceResult);
                    const status = result.success ? '✅' : '❌';

                    if (result.success) {
                        const timeStr = `${result.statistics.mean.toFixed(3)}`;
                        const medianStr = `${result.statistics.median.toFixed(3)}`;
                        const stdStr = `${result.statistics.std.toFixed(3)}`;
                        const validationInfo = referenceResult && name !== 'builtinSort' ? ' (vs builtin)' : '';
                        console.log(`   ${name.padEnd(25)} | ${size.toString().padStart(6)} | ${testCase.shortName.padEnd(18)} | ${timeStr.padStart(9)} | ${medianStr.padStart(11)} | ${stdStr.padStart(8)} | ${status}${validationInfo}`);

                        // Store result for JSON export
                        allResults.push({
                            algorithm: name,
                            size: size,
                            dataType: testCase.shortName,
                            repetitions: repetitions,
                            statistics: result.statistics,
                            allTimes: result.times,
                            success: true,
                            referenceValidated: !!referenceResult
                        });
                    } else {
                        console.log(`   ${name.padEnd(25)} | ${size.toString().padStart(6)} | ${testCase.shortName.padEnd(18)} | ${'ERROR'.padStart(9)} | ${'ERROR'.padStart(11)} | ${'ERROR'.padStart(8)} | ${status}`);
                        console.log(`   Error: ${result.error}`);

                        allResults.push({
                            algorithm: name,
                            size: size,
                            dataType: testCase.shortName,
                            repetitions: 0,
                            statistics: {},
                            allTimes: [],
                            success: false,
                            error: result.error,
                            referenceValidated: false
                        });
                    }
                }
            }
        }

        console.log('\n' + '='.repeat(100));
        console.log('🎉 Benchmarks completados!');

        // Analysis
        analyzeResults(allResults);

        // Export results
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `benchmark_results_clean_${timestamp}_seed${currentSeed}.json`;
        const results = {
            metadata: {
                timestamp: new Date().toISOString(),
                seed: currentSeed,
                node_version: process.version,
                platform: process.platform,
                arch: process.arch,
                repetitions: repetitions,
                methodology: 'Clean Benchmark with Optimized References v1.0',
                dependencies: {
                    optimized_quicksort: './scripts/optimized_quicksort.js',
                    merge_sort_reference: './scripts/merge_sort_reference.js',
                    heap_sort_reference: './scripts/heap_sort_reference.js',
                    builtin_sort_reference: './scripts/builtin_sort_reference.js',
                    segmentsort_corrected: '../implementations/javascript/segmentsort_corrected.js',
                    balanced_segment_merge_sort: '../implementations/javascript/balanced_segment_merge_sort.js'
                }
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
    }

    function analyzeResults(allResults) {
        if (!allResults || allResults.length === 0) {
            console.log('No hay resultados para analizar.');
            return;
        }

        console.log('\n📈 Análisis comparativo resumido (media de tiempos por algoritmo y tipo de datos):');

        const byType = new Map();
        const globalAgg = new Map();

        for (const res of allResults) {
            if (!res.success || !res.statistics || typeof res.statistics.mean !== 'number') continue;
            const { algorithm, dataType } = res;
            const mean = res.statistics.mean;

            if (!byType.has(dataType)) {
                byType.set(dataType, new Map());
            }
            const typeMap = byType.get(dataType);
            const prev = typeMap.get(algorithm) || { sum: 0, count: 0 };
            typeMap.set(algorithm, { sum: prev.sum + mean, count: prev.count + 1 });

            const gPrev = globalAgg.get(algorithm) || { sum: 0, count: 0 };
            globalAgg.set(algorithm, { sum: gPrev.sum + mean, count: gPrev.count + 1 });
        }

        for (const [dataType, algMap] of byType.entries()) {
            const averages = [];
            for (const [alg, agg] of algMap.entries()) {
                averages.push({ algorithm: alg, mean: agg.sum / agg.count });
            }
            averages.sort((a, b) => a.mean - b.mean);
            if (averages.length === 0) continue;

            const best = averages[0];
            console.log(`\n   ▸ Tipo de datos: ${dataType}`);
            console.log(`     - Más rápido: ${best.algorithm} (~${best.mean.toFixed(3)} ms)`);
            const rankingStr = averages
                .map((x, idx) => `${idx + 1}. ${x.algorithm} (${x.mean.toFixed(3)} ms)`)
                .join('  |  ');
            console.log(`     - Ranking: ${rankingStr}`);
        }

        const globalArr = [];
        for (const [alg, agg] of globalAgg.entries()) {
            globalArr.push({ algorithm: alg, mean: agg.sum / agg.count });
        }
        globalArr.sort((a, b) => a.mean - b.mean);
        if (globalArr.length > 0) {
            console.log('\n📊 Ranking global (promedio sobre todos los tamaños y tipos):');
            const globalStr = globalArr
                .map((x, idx) => `${idx + 1}. ${x.algorithm} (${x.mean.toFixed(3)} ms)`)
                .join('  |  ');
            console.log(`     ${globalStr}`);
        }
    }

    // Command line argument parsing
    if (require.main === module) {
        const args = process.argv.slice(2);
        let sizes, repetitions, validateResults = true;

        // Parse command line arguments
        if (args.includes('--help') || args.includes('-h')) {
            console.log('Uso: node js_benchmarks.js [sizes...] [--reps repetitions] [--no-validate]');
            console.log('\nEjemplos:');
            console.log('  node js_benchmarks.js                # Ejecuta con tamaño por defecto 100000, 10 repeticiones');
            console.log('  node js_benchmarks.js 50000          # Ejecuta solo para tamaño 50000');
            console.log('  node js_benchmarks.js 10000 50000    # Ejecuta para varios tamaños');
            console.log('  node js_benchmarks.js 100000 --reps 30  # Ejecuta tamaño 100000 con 30 repeticiones');
            console.log('  node js_benchmarks.js 10000 --no-validate  # Ejecuta sin validación de resultados');
            console.log('\nFlags:');
            console.log('  --reps, -r   Número de repeticiones por configuración (por defecto 10)');
            console.log('  --no-validate   Deshabilita validación de que los resultados estén ordenados');
            console.log('\nNota: Este benchmark utiliza implementaciones de referencia optimizadas');
            console.log('para asegurar comparaciones justas y realistas.');
            process.exit(0);
        } else if (args.length === 0) {
            sizes = [100000];
            repetitions = 10;
        } else if (args.length === 1) {
            if (args[0] === '--reps' || args[0] === '-r' || args[0] === '--no-validate') {
                console.log('Uso: node js_benchmarks.js [sizes...] [--reps repetitions] [--no-validate]');
                process.exit(1);
            } else if (isNaN(args[0])) {
                console.log('Error: Argumentos deben ser números');
                process.exit(1);
            } else {
                sizes = [parseInt(args[0])];
                repetitions = 10;
            }
        } else {
            // Check for flags
            let repsIndex = args.indexOf('--reps');
            if (repsIndex === -1) {
                repsIndex = args.indexOf('-r');
            }
            const noValidateIndex = args.indexOf('--no-validate');

            if (noValidateIndex !== -1) {
                validateResults = false;
                args.splice(noValidateIndex, 1);
            }

            if (repsIndex !== -1 && repsIndex < args.length) {
                repetitions = parseInt(args[repsIndex + 1]);
                sizes = args.slice(0, repsIndex).filter(arg => !isNaN(arg)).map(Number);
                if (sizes.length === 0) sizes = [100000];
            } else {
                sizes = args.map(Number).filter(n => !isNaN(n));
                repetitions = 10;
            }
        }

        console.log(`🔧 Configuración:`);
        console.log(`   - Tamaños: [${sizes.join(', ')}]`);
        console.log(`   - Repeticiones: ${repetitions}`);
        console.log(`   - Seed: ${currentSeed}`);
        console.log(`   - Validación: ${validateResults ? 'Habilitada' : 'Deshabilitada'}`);
        console.log(`   - Versión: Clean Benchmark con Referencias Optimizadas`);
        console.log('');

        runBenchmarks(sizes, repetitions, validateResults);
    }
})();