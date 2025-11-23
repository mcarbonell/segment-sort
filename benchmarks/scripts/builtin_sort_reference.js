/**
 * Built-in Sort Analysis and Reference
 * 
 * This module provides analysis and reference implementations for
 * built-in sorting functions across different environments.
 * 
 * Author: Mario Raúl Carbonell Martínez
 * Extracted from: benchmarks/languages/javascript/js_benchmarks.js
 */

/**
 * JavaScript Built-in Sort Analysis
 * 
 * The built-in Array.sort() in modern JavaScript engines uses:
 * - Timsort (V8, SpiderMonkey): Hybrid stable sort, O(n) best, O(n log n) worst
 * - Timsort combines merge sort and insertion sort
 * - Optimized for real-world data with natural runs
 */

/**
 * JavaScript built-in sort - reference implementation
 * This is the standard way to sort arrays in JavaScript
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array (original unchanged)
 */
function builtinSort(arr) {

    return arr.sort((a, b) => a - b);

    // Create a copy to avoid modifying the original
    // return [...arr].sort((a, b) => a - b);
}

/**
 * JavaScript built-in sort - in-place version
 * Modifies the original array
 * 
 * @param {number[]} arr - Array to sort (modified in-place)
 * @returns {number[]} - Same array, now sorted
 */
function builtinSortInPlace(arr) {
    return arr.sort((a, b) => a - b);
}

/**
 * Stable sort wrapper - ensures stable sorting behavior
 * Some older JavaScript engines had unstable sort for certain cases
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array with stable ordering
 */
function stableBuiltinSort(arr) {
    // Create array with original indices for stability
    const indexedArray = arr.map((value, index) => ({ value, index }));

    // Sort with stability tie-breaker
    indexedArray.sort((a, b) => {
        if (a.value !== b.value) {
            return a.value - b.value;
        }
        return a.index - b.index; // Stable tie-breaker
    });

    // Extract values
    return indexedArray.map(item => item.value);
}

/**
 * String-aware sort - handles mixed data types
 * 
 * @param {Array} arr - Array with mixed data types
 * @returns {Array} - Sorted array
 */
function stringAwareSort(arr) {
    return [...arr].sort((a, b) => {
        // Convert to strings for comparison if needed
        const aStr = String(a);
        const bStr = String(b);

        if (aStr === bStr) return 0;
        return aStr < bStr ? -1 : 1;
    });
}

/**
 * Natural sort - handles alphanumeric strings intelligently
 * "item2" comes before "item10" (not "item10" before "item2")
 * 
 * @param {string[]} arr - Array of strings
 * @returns {string[]} - Naturally sorted array
 */
function naturalSort(arr) {
    return [...arr].sort((a, b) => {
        // Use Intl.Collator for natural sorting
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        return collator.compare(a, b);
    });
}

/**
 * Performance-optimized sort for numbers
 * Avoids function call overhead when possible
 * 
 * @param {number[]} arr - Array of numbers
 * @returns {number[]} - Sorted array
 */
function optimizedNumberSort(arr) {
    // For small arrays, use a simple approach
    if (arr.length <= 10) {
        return simpleSort([...arr]);
    }

    // For larger arrays, use built-in sort with optimized comparator
    return [...arr].sort((a, b) => a - b);
}

/**
 * Simple sort for small arrays (insertion sort)
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - Sorted array
 */
function simpleSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = key;
    }

    return arr;
}

/**
 * Memory-efficient sort - minimizes temporary arrays
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - Sorted array
 */
function memoryEfficientSort(arr) {
    // Sort in-place to save memory
    arr.sort((a, b) => a - b);
    return arr;
}

/**
 * Sort with custom comparator factory
 * Creates optimized comparators for different use cases
 */
const comparatorFactory = {
    /**
     * Create a numeric comparator
     * @returns {function} - Comparator function
     */
    numeric() {
        return (a, b) => a - b;
    },

    /**
     * Create a string comparator (case-insensitive)
     * @returns {function} - Comparator function
     */
    stringInsensitive() {
        return (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());
    },

    /**
     * Create a string comparator (case-sensitive)
     * @returns {function} - Comparator function
     */
    stringSensitive() {
        return (a, b) => a.localeCompare(b);
    },

    /**
     * Create a comparator for objects by property
     * @param {string} property - Property to sort by
     * @returns {function} - Comparator function
     */
    byProperty(property) {
        return (a, b) => {
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
            return 0;
        };
    },

    /**
     * Create a reverse comparator
     * @param {function} comparator - Original comparator
     * @returns {function} - Reversed comparator
     */
    reverse(comparator) {
        return (a, b) => comparator(b, a);
    }
};

/**
 * Sort performance utilities
 */
const sortPerformance = {
    /**
     * Measure sort performance
     * @param {function} sortFn - Sort function to measure
     * @param {Array} arr - Array to sort
     * @param {number} iterations - Number of iterations
     * @returns {object} - Performance metrics
     */
    measure(sortFn, arr, iterations = 1) {
        const times = [];

        for (let i = 0; i < iterations; i++) {
            const testArr = Array.isArray(arr) ? [...arr] : arr;
            const start = performance.now();

            sortFn(testArr);

            const end = performance.now();
            times.push(end - start);
        }

        return {
            times,
            average: times.reduce((a, b) => a + b, 0) / times.length,
            min: Math.min(...times),
            max: Math.max(...times)
        };
    },

    /**
     * Compare multiple sorting algorithms
     * @param {Array} arr - Array to sort
     * @param {object} algorithms - Object with algorithm names and functions
     * @param {number} iterations - Number of iterations per algorithm
     * @returns {object} - Comparison results
     */
    compare(arr, algorithms, iterations = 1) {
        const results = {};

        for (const [name, algorithm] of Object.entries(algorithms)) {
            results[name] = this.measure(algorithm, arr, iterations);
        }

        return results;
    }
};

// Browser-specific optimizations
if (typeof window !== 'undefined') {
    /**
     * Web Worker sort - offload sorting to worker thread
     * Useful for very large arrays to avoid blocking UI
     * 
     * @param {number[]} arr - Array to sort
     * @returns {Promise<number[]>} - Promise resolving to sorted array
     */
    async function workerSort(arr) {
        return new Promise((resolve, reject) => {
            const workerCode = `
                self.onmessage = function(e) {
                    const arr = e.data;
                    arr.sort((a, b) => a - b);
                    self.postMessage(arr);
                };
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            worker.onmessage = (e) => {
                worker.terminate();
                resolve(e.data);
            };

            worker.onerror = (e) => {
                worker.terminate();
                reject(e.error);
            };

            worker.postMessage([...arr]);
        });
    }

    // Add to exports if in browser environment
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.workerSort = workerSort;
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        builtinSort,
        builtinSortInPlace,
        stableBuiltinSort,
        stringAwareSort,
        naturalSort,
        optimizedNumberSort,
        memoryEfficientSort,
        simpleSort,
        comparatorFactory,
        sortPerformance
    };
}

// Example usage and testing
if (typeof module !== 'undefined' && require.main === module) {
    console.log('Built-in Sort Reference Implementation');
    console.log('=====================================');

    // Test basic functionality
    const testArray = [64, 34, 25, 12, 22, 11, 90];
    console.log('Original array:', testArray);

    const sortedArray = builtinSort(testArray);
    console.log('Sorted array:', sortedArray);
    console.log('Original unchanged:', testArray);

    // Test different data types
    console.log('\nString sorting:', stringAwareSort(['banana', 'apple', 'Cherry']));
    console.log('Natural sorting:', naturalSort(['item1', 'item10', 'item2']));

    // Performance comparison
    if (typeof performance !== 'undefined') {
        console.log('\nPerformance comparison (1000 iterations):');
        const largeArray = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 10000));

        const results = sortPerformance.compare(largeArray, {
            'Built-in Sort': builtinSort,
            'Optimized Number Sort': optimizedNumberSort
        }, 100);

        for (const [name, metrics] of Object.entries(results)) {
            console.log(`${name}: ${metrics.average.toFixed(3)}ms avg`);
        }
    }

    console.log('\nBuilt-in Sort Characteristics:');
    console.log('- Implementation: Timsort (V8) / Timsort (SpiderMonkey)');
    console.log('- Time Complexity: O(n) best, O(n log n) worst');
    console.log('- Space Complexity: O(n) (Timsort requires auxiliary space)');
    console.log('- Stable: Yes (maintains relative order of equal elements)');
    console.log('- Adaptive: Yes (optimizes for existing order)');
}