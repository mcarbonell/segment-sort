/**
 * Sorts an array using the On-the-Fly Balanced Merge Strategy.
 * This algorithm identifies naturally sorted segments and merges them on-the-fly
 * using a stack to maintain balanced sizes, achieving O(log n) space complexity.
 *
 * @param {Array<number>} arr The array to sort (will be mutated).
 * @returns {Array<number>} The mutated sorted array.
 */
function onTheFlyBalancedMergeSort(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    const segmentsStack = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
        // Detect the next segment
        const start = i;
        const segment = [];

        // Add the first element
        segment.push(arr[i]);
        i++;

        // Detect if it's ascending or descending
        let isDescending = false;
        if (i < n) {
            isDescending = arr[start] > arr[i];
        }

        // Continue the segment based on direction
        while (i < n) {
            if (isDescending) {
                // Descending segment
                if (arr[i - 1] <= arr[i]) {
                    break;
                }
            } else {
                // Ascending segment
                if (arr[i - 1] > arr[i]) {
                    break;
                }
            }
            segment.push(arr[i]);
            i++;
        }

        // If descending, reverse it to make it ascending
        if (isDescending) {
            segment.reverse();
        }

        // Merge with stack if needed
        let current = segment;
        while (segmentsStack.length > 0 && current.length >= segmentsStack[segmentsStack.length - 1].length) {
            const top = segmentsStack.pop();
            current = mergeTwoArrays(top, current);
        }
        segmentsStack.push(current);
    }

    // Final merge of remaining segments
    while (segmentsStack.length > 1) {
        const a = segmentsStack.pop();
        const b = segmentsStack.pop();
        const merged = mergeTwoArrays(a, b);
        segmentsStack.push(merged);
    }

    // Copy back to original array
    if (segmentsStack.length > 0) {
        arr.splice(0, arr.length, ...segmentsStack[0]);
    } else {
        arr.length = 0;
    }
    return arr;
}

/**
 * Merges two sorted arrays into a single sorted array.
 *
 * @param {Array<number>} left The first sorted array.
 * @param {Array<number>} right The second sorted array.
 * @returns {Array<number>} The merged and sorted array.
 */
function mergeTwoArrays(left, right) {
    if (!left || left.length === 0) {
        return [...right];
    }
    if (!right || right.length === 0) {
        return [...left];
    }

    const result = [];
    let i = 0;
    let j = 0;

    // Merge while both arrays have elements
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Add remaining elements from left array
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    // Add remaining elements from right array
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}

// Export the function for use in other modules (e.g., tests or benchmarks)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = onTheFlyBalancedMergeSort;
}
