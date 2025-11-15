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

    const n = arr.length;
    const segmentsStack = [];
    let i = 0;

    while (i < n) {
        const seg = detectSegmentIndices(arr, i, n);
        let currentStart = seg[0];
        let currentEnd = seg[1];
        i = currentEnd;

        while (segmentsStack.length > 0) {
            const top = segmentsStack[segmentsStack.length - 1];
            const topLen = top[1] - top[0];
            const currentLen = currentEnd - currentStart;
            if (currentLen < topLen) {
                break;
            }
            segmentsStack.pop();
            symmerge(arr, top[0], currentStart, currentEnd);
            currentStart = top[0];
        }

        segmentsStack.push([currentStart, currentEnd]);
    }

    while (segmentsStack.length > 1) {
        const a = segmentsStack.pop();
        const b = segmentsStack.pop();
        symmerge(arr, b[0], a[0], a[1]);
        segmentsStack.push([b[0], a[1]]);
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

function reverseSlice(arr, start, end) {
    let i = start;
    let j = end - 1;
    while (i < j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        i++;
        j--;
    }
}

function detectSegmentIndices(arr, start, n) {
    if (start >= n) {
        return [start, start];
    }

    let end = start + 1;
    if (end < n && arr[start] > arr[end]) {
        while (end < n && arr[end - 1] > arr[end]) {
            end++;
        }
        reverseSlice(arr, start, end);
        return [start, end];
    } else {
        while (end < n && arr[end - 1] <= arr[end]) {
            end++;
        }
        return [start, end];
    }
}

function rotateRange(arr, first, middle, last) {
    if (first >= middle || middle >= last) {
        return;
    }
    reverseSlice(arr, first, middle);
    reverseSlice(arr, middle, last);
    reverseSlice(arr, first, last);
}

function lowerBound(arr, first, last, value) {
    let left = first;
    let right = last;
    while (left < right) {
        const mid = (left + right) >> 1;
        if (arr[mid] < value) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

function symmerge(arr, first, middle, last) {
    if (first >= middle || middle >= last) {
        return;
    }
    if (last - first === 1) {
        return;
    }
    if (last - first === 2) {
        if (arr[middle] < arr[first]) {
            const tmp = arr[first];
            arr[first] = arr[middle];
            arr[middle] = tmp;
        }
        return;
    }

    const mid1 = Math.floor((first + middle) / 2);
    const value = arr[mid1];
    const mid2 = lowerBound(arr, middle, last, value);
    const newMid = mid1 + (mid2 - middle);
    rotateRange(arr, mid1, middle, mid2);
    symmerge(arr, first, mid1, newMid);
    symmerge(arr, newMid + 1, mid2, last);
}

// Export the function for use in other modules (e.g., tests or benchmarks)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = onTheFlyBalancedMergeSort;
}
