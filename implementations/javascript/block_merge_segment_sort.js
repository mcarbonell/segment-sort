/**
 * Block Merge Segment Sort - JavaScript Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * 
 * Complexity:
 * - Time: O(N log N) (approaches this as buffer usage increases)
 * - Space: O(sqrt N) or O(1) depending on configuration
 */

const BUFFER_SIZE = 512; // Small fixed buffer to keep memory O(1) effectively

function blockMergeSegmentSort(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    const n = arr.length;
    // Create a single reusable buffer
    // We use a fixed size or sqrt(N), whichever is smaller/appropriate. 
    // For 1M elements, sqrt(N) = 1000. 512 is a good sweet spot for cache.
    const buffer = new Array(BUFFER_SIZE);

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
            bufferedMerge(arr, top[0], currentStart, currentEnd, buffer);
            currentStart = top[0];
        }

        segmentsStack.push([currentStart, currentEnd]);
    }

    while (segmentsStack.length > 1) {
        const a = segmentsStack.pop();
        const b = segmentsStack.pop();
        bufferedMerge(arr, b[0], a[0], a[1], buffer);
        segmentsStack.push([b[0], a[1]]);
    }

    return arr;
}

// --- Helpers ---

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
    if (start >= n) return [start, start];

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

function lowerBound(arr, first, last, value) {
    let left = first;
    let right = last;
    while (left < right) {
        const mid = (left + right) >>> 1;
        if (arr[mid] < value) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

function rotateRange(arr, first, middle, last) {
    if (first >= middle || middle >= last) return;
    reverseSlice(arr, first, middle);
    reverseSlice(arr, middle, last);
    reverseSlice(arr, first, last);
}

/**
 * Hybrid Merge:
 * 1. If min(lenA, lenB) <= buffer.length, use buffer for O(N) merge.
 * 2. Else, use SymMerge (split and recurse).
 */
function bufferedMerge(arr, first, middle, last, buffer) {
    if (first >= middle || middle >= last) return;

    const len1 = middle - first;
    const len2 = last - middle;

    // Optimization: Check if already sorted
    if (arr[middle - 1] <= arr[middle]) return;

    // Strategy 1: Merge with buffer if segments are small enough
    if (len1 <= buffer.length) {
        mergeWithBufferLeft(arr, first, middle, last, buffer);
        return;
    }
    if (len2 <= buffer.length) {
        mergeWithBufferRight(arr, first, middle, last, buffer);
        return;
    }

    // Strategy 2: SymMerge (Divide and Conquer)
    // Split the larger segment
    const mid1 = Math.floor((first + middle) / 2);
    const value = arr[mid1];
    const mid2 = lowerBound(arr, middle, last, value);

    const newMid = mid1 + (mid2 - middle);

    rotateRange(arr, mid1, middle, mid2);

    // Recurse - eventually segments become small enough for buffer
    bufferedMerge(arr, first, mid1, newMid, buffer);
    bufferedMerge(arr, newMid + 1, mid2, last, buffer);
}

// Merge [first, middle) and [middle, last) using buffer for the left part
function mergeWithBufferLeft(arr, first, middle, last, buffer) {
    const len1 = middle - first;

    // Copy left part to buffer
    for (let i = 0; i < len1; i++) {
        buffer[i] = arr[first + i];
    }

    let i = 0; // buffer index
    let j = middle; // right part index
    let k = first; // dest index

    while (i < len1 && j < last) {
        if (buffer[i] <= arr[j]) {
            arr[k++] = buffer[i++];
        } else {
            arr[k++] = arr[j++];
        }
    }

    // Copy remaining buffer elements
    while (i < len1) {
        arr[k++] = buffer[i++];
    }
    // Remaining elements of right part are already in place
}

// Merge [first, middle) and [middle, last) using buffer for the right part
function mergeWithBufferRight(arr, first, middle, last, buffer) {
    const len2 = last - middle;

    // Copy right part to buffer
    for (let i = 0; i < len2; i++) {
        buffer[i] = arr[middle + i];
    }

    let i = middle - 1; // left part index (going backwards)
    let j = len2 - 1; // buffer index
    let k = last - 1; // dest index

    while (i >= first && j >= 0) {
        if (arr[i] > buffer[j]) {
            arr[k--] = arr[i--];
        } else {
            arr[k--] = buffer[j--];
        }
    }

    // Copy remaining buffer elements
    while (j >= 0) {
        arr[k--] = buffer[j--];
    }
    // Remaining elements of left part are already in place
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = blockMergeSegmentSort;
}
