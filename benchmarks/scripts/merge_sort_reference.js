/**
 * Merge Sort - Reference Implementation for Benchmarks
 * 
 * This is a clean, optimized implementation of Merge Sort for use as a
 * reference algorithm in performance comparisons.
 * 
 * Author: Mario Raúl Carbonell Martínez
 * Extracted from: benchmarks/languages/javascript/js_benchmarks.js
 */

/**
 * Merge Sort implementation - divide and conquer algorithm
 * Time Complexity: O(n log n) - guaranteed
 * Space Complexity: O(n) - requires auxiliary arrays
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array
 */
function mergeSort(arr) {
    // Base case: arrays with 0 or 1 elements are already sorted
    if (arr.length <= 1) {
        return arr;
    }

    // Divide: split array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    // Conquer: recursively sort both halves
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);

    // Combine: merge the two sorted halves
    return merge(sortedLeft, sortedRight);
}

/**
 * Merge two sorted arrays into a single sorted array
 * 
 * @param {number[]} left - Left sorted array
 * @param {number[]} right - Right sorted array
 * @returns {number[]} - Merged sorted array
 */
function merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // Compare elements from both arrays and merge in sorted order
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    // Add remaining elements from left array (if any)
    while (leftIndex < left.length) {
        result.push(left[leftIndex]);
        leftIndex++;
    }

    // Add remaining elements from right array (if any)
    while (rightIndex < right.length) {
        result.push(right[rightIndex]);
        rightIndex++;
    }

    return result;
}

/**
 * In-place Merge Sort (alternative implementation)
 * This version sorts the array in-place to reduce space usage
 * 
 * @param {number[]} arr - Array to sort (modified in-place)
 * @param {number} left - Left boundary index
 * @param {number} right - Right boundary index
 */
function mergeSortInPlace(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);

        // Recursively sort both halves
        mergeSortInPlace(arr, left, mid);
        mergeSortInPlace(arr, mid + 1, right);

        // Merge the sorted halves
        mergeInPlace(arr, left, mid, right);
    }
}

/**
 * In-place merge function
 * 
 * @param {number[]} arr - Array containing the segments to merge
 * @param {number} left - Left boundary
 * @param {number} mid - Middle point
 * @param {number} right - Right boundary
 */
function mergeInPlace(arr, left, mid, right) {
    // Create temporary arrays for left and right segments
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    let i = 0; // Index for leftArray
    let j = 0; // Index for rightArray
    let k = left; // Index for original array

    // Merge the temporary arrays back into the original array
    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            i++;
        } else {
            arr[k] = rightArray[j];
            j++;
        }
        k++;
    }

    // Copy remaining elements from leftArray
    while (i < leftArray.length) {
        arr[k] = leftArray[i];
        i++;
        k++;
    }

    // Copy remaining elements from rightArray
    while (j < rightArray.length) {
        arr[k] = rightArray[j];
        j++;
        k++;
    }
}

/**
 * Iterative (bottom-up) Merge Sort
 * Non-recursive implementation that avoids recursion overhead
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array
 */
function mergeSortIterative(arr) {
    const n = arr.length;
    const result = [...arr]; // Create a copy

    // Start with subarrays of size 1, then double the size
    for (let size = 1; size < n; size *= 2) {
        // Merge subarrays of current size
        for (let left = 0; left < n - size; left += 2 * size) {
            const mid = left + size - 1;
            const right = Math.min(left + 2 * size - 1, n - 1);

            mergeInPlace(result, left, mid, right);
        }
    }

    return result;
}

/**
 * Optimized Merge Sort with insertion sort for small arrays
 * Hybrid approach that improves performance for small subarrays
 * 
 * @param {number[]} arr - Array to sort
 * @param {number} threshold - Size threshold for switching to insertion sort
 * @returns {number[]} - New sorted array
 */
function mergeSortOptimized(arr, threshold = 10) {
    return mergeSortWithThreshold(arr, threshold);
}

function mergeSortWithThreshold(arr, threshold) {
    if (arr.length <= 1) {
        return arr;
    }

    // Use insertion sort for small arrays
    if (arr.length <= threshold) {
        return insertionSort(arr);
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSortWithThreshold(arr.slice(0, mid), threshold);
    const right = mergeSortWithThreshold(arr.slice(mid), threshold);

    return merge(left, right);
}

/**
 * Insertion sort for small arrays (helper for optimized merge sort)
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array
 */
function insertionSort(arr) {
    const result = [...arr];

    for (let i = 1; i < result.length; i++) {
        const key = result[i];
        let j = i - 1;

        // Move elements that are greater than key one position ahead
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j];
            j--;
        }

        result[j + 1] = key;
    }

    return result;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mergeSort,
        mergeSortInPlace,
        mergeSortIterative,
        mergeSortOptimized,
        merge
    };
}

// Example usage and testing
if (typeof module !== 'undefined' && require.main === module) {
    // Test the implementation
    const testArray = [64, 34, 25, 12, 22, 11, 90];
    console.log('Original array:', testArray);

    const sortedArray = mergeSort(testArray);
    console.log('Sorted array:', sortedArray);

    // Verify correctness
    const isSorted = sortedArray.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    console.log('Is correctly sorted:', isSorted);

    console.log('\nMerge Sort - Reference Implementation');
    console.log('=====================================');
    console.log('- Time Complexity: O(n log n) guaranteed');
    console.log('- Space Complexity: O(n)');
    console.log('- Stable: Yes');
    console.log('- Adaptive: No (always O(n log n))');
}