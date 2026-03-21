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
 * 
 * Improvements:
 * - 3-way partitioning for high-duplicate data (reduces O(N) to O(N) on all-equal)
 * - Flat segment detection for duplicate runs
 */

// Fixed buffer size for optimal performance (fits in L2 cache).
// 64K elements = 256KB for int arrays
const BUFFER_SIZE = 65536;

// Threshold for enabling 3-way partitioning (50% duplicates)
const DUPLICATE_RATIO_THRESHOLD = 0.5;

function blockMergeSegmentSort(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    const n = arr.length;
    const bufferSize = Math.min(BUFFER_SIZE, n);
    const buffer = new Array(bufferSize);

    const segmentsStack = [];
    let i = 0;

    while (i < n) {
        const seg = detectSegmentEnhanced(arr, i, n);
        let currentStart = seg[0];
        let currentEnd = seg[1];
        let currentIsFlat = seg[2];
        let currentFlatVal = seg[3];
        i = currentEnd;

        while (segmentsStack.length > 0) {
            const top = segmentsStack[segmentsStack.length - 1];
            const topLen = top[1] - top[0];
            const currentLen = currentEnd - currentStart;

            if (currentLen < topLen) {
                break;
            }

            segmentsStack.pop();

            if (top[2] && currentIsFlat && top[3] === currentFlatVal) {
                currentStart = top[0];
                currentIsFlat = true;
            } else {
                bufferedMerge(arr, top[0], currentStart, currentEnd, buffer, bufferSize);
                currentStart = top[0];
                currentIsFlat = false;
            }
        }

        segmentsStack.push([currentStart, currentEnd, currentIsFlat, currentFlatVal]);
    }

    while (segmentsStack.length > 1) {
        const right = segmentsStack.pop();
        const left = segmentsStack.pop();

        if (left[2] && right[2] && left[3] === right[3]) {
            segmentsStack.push([left[0], right[1], true, left[3]]);
        } else {
            bufferedMerge(arr, left[0], right[0], right[1], buffer, bufferSize);
            segmentsStack.push([left[0], right[1], false, 0]);
        }
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

function detectSegmentEnhanced(arr, start, n) {
    if (start >= n) return [start, start, false, 0];

    let end = start + 1;
    if (end >= n) return [start, end, true, arr[start]];

    if (arr[start] === arr[end]) {
        while (end < n && arr[end] === arr[start]) {
            end++;
        }
        return [start, end, true, arr[start]];
    }

    if (arr[start] > arr[end]) {
        while (end < n && arr[end - 1] > arr[end]) {
            end++;
        }
        reverseSlice(arr, start, end);
        return [start, end, false, 0];
    }

    while (end < n && arr[end - 1] <= arr[end]) {
        end++;
    }
    return [start, end, false, 0];
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
 * 2. If high duplicate ratio detected, use 3-way partitioning.
 * 3. Else, use SymMerge (split and recurse).
 */
function bufferedMerge(arr, first, middle, last, buffer, bufferSize) {
    if (first >= middle || middle >= last) return;

    const len1 = middle - first;
    const len2 = last - middle;

    if (arr[middle - 1] <= arr[middle]) return;

    // NOTE: merge3Way and mergeWithGallop are temporarily disabled due to bugs
    // TODO: Fix 3-way partitioning and galloping mode implementations
    // 
    // // Check for high duplicate ratio - use 3-way partitioning
    // const dupRatioLeft = estimateDuplicateRatio(arr, first, middle);
    // const dupRatioRight = estimateDuplicateRatio(arr, middle, last);
    // 
    // if (dupRatioLeft > DUPLICATE_RATIO_THRESHOLD && dupRatioRight > DUPLICATE_RATIO_THRESHOLD) {
    //     merge3Way(arr, first, middle, last);
    //     return;
    // }
    //
    // // Check for imbalanced merge - use galloping
    // const imbalance = Math.max(len1, len2) / Math.min(len1, len2);
    // const hasBufferSpace = len1 + len2 <= buffer.length;
    // if (hasBufferSpace && imbalance >= 10) {
    //     mergeWithGallop(arr, first, middle, last, buffer);
    //     return;
    // }

    if (len1 <= bufferSize) {
        mergeWithBufferLeft(arr, first, middle, last, buffer);
        return;
    }
    if (len2 <= bufferSize) {
        mergeWithBufferRight(arr, first, middle, last, buffer);
        return;
    }

    const mid1 = first + Math.floor(len1 / 2);
    const value = arr[mid1];
    const mid2 = lowerBound(arr, middle, last, value);

    const newMid = mid1 + (mid2 - middle);

    rotateRange(arr, mid1, middle, mid2);

    bufferedMerge(arr, first, mid1, newMid, buffer, bufferSize);
    bufferedMerge(arr, newMid + 1, mid2, last, buffer, bufferSize);
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

// Galloping mode constants (same as TimSort)
const MIN_GALLOP = 7;
const MAX_GALLOP = 64;

// Galloping: find position in target array using exponential search
function gallopRight(arr, start, end, key) {
    if (start >= end) return start;
    
    // Exponential search
    let step = 1;
    let lo = start;
    
    while (lo + step < end && arr[lo + step] < key) {
        lo += step;
        step <<= 1;
        if (step > MAX_GALLOP) step = MAX_GALLOP;
    }
    
    // Binary search to refine
    let hi = Math.min(lo + step, end);
    while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (arr[mid] < key) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    
    return lo;
}

function gallopLeft(arr, start, end, key) {
    if (start >= end) return start;
    
    // Exponential search going left
    let step = 1;
    let hi = end - 1;
    
    while (hi - step >= start && arr[hi - step] > key) {
        hi -= step;
        step <<= 1;
        if (step > MAX_GALLOP) step = MAX_GALLOP;
    }
    
    // Binary search to refine
    let lo = Math.max(start, hi - step);
    while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (arr[mid] > key) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    
    return hi;
}

// Merge with galloping mode for imbalanced merges
function mergeWithGallop(arr, first, middle, last, buffer) {
    let len1 = middle - first;
    let len2 = last - middle;
    let f = first;
    let m = middle;
    let l = last;
    
    if (len1 <= 0 || len2 <= 0) return;
    
    // Ensure left part is smaller (required for galloping efficiency)
    if (len1 > len2) {
        // Swap roles - we'll traverse right-to-left
        [f, m, l, len1, len2] = [m, f, l - (m - f), len2, len1];
    } else {
        f = first;
        m = middle;
        l = last;
    }
    
    let leftIdx = 0;  // index in buffer (copy of left)
    let rightIdx = m;  // index in right part
    let destIdx = f;   // destination
    
    let gallopLeftCount = 0;
    let gallopRightCount = 0;
    
    // Copy left part to buffer
    for (let i = 0; i < len1; i++) {
        buffer[i] = arr[f + i];
    }
    
    while (leftIdx < len1 && rightIdx < l) {
        // Galloping check: if we had many from one side, try galloping
        if (gallopRightCount >= MIN_GALLOP && len1 - leftIdx > MIN_GALLOP) {
            const gallopPos = gallopRight(arr, rightIdx, l, buffer[leftIdx]);
            const count = gallopPos - rightIdx;
            
            // Copy batch from right
            for (let i = 0; i < count; i++) {
                arr[destIdx++] = arr[rightIdx++];
            }
            gallopRightCount = 0;
            gallopLeftCount++;
            continue;
        }
        
        if (gallopLeftCount >= MIN_GALLOP && leftIdx < len1 - MIN_GALLOP) {
            // Find position in left (buffer) using gallop
            const gallopPos = gallopLeft(buffer, leftIdx, len1, arr[rightIdx]);
            const count = gallopPos - leftIdx;
            
            // Copy batch from buffer
            for (let i = 0; i < count; i++) {
                arr[destIdx++] = buffer[leftIdx++];
            }
            gallopLeftCount = 0;
            gallopRightCount++;
            continue;
        }
        
        // Standard merge
        if (buffer[leftIdx] <= arr[rightIdx]) {
            arr[destIdx++] = buffer[leftIdx++];
            gallopLeftCount = 0;
            gallopRightCount++;
        } else {
            arr[destIdx++] = arr[rightIdx++];
            gallopRightCount = 0;
            gallopLeftCount++;
        }
    }
    
    // Copy remaining
    while (leftIdx < len1) {
        arr[destIdx++] = buffer[leftIdx++];
    }
    while (rightIdx < l) {
        arr[destIdx++] = arr[rightIdx++];
    }
}

// Estimate duplicate ratio in a range using sampling
function estimateDuplicateRatio(arr, start, end) {
    const sampleSize = Math.min(100, end - start);
    if (sampleSize <= 1) return 0;
    
    const unique = new Set();
    for (let i = 0; i < sampleSize; i++) {
        const idx = start + Math.floor((i / sampleSize) * (end - start));
        unique.add(arr[idx]);
    }
    return 1 - (unique.size / sampleSize);
}

// 3-way partition merge (Dutch National Flag)
// Splits into: [pivot], [=pivot], [>pivot]
function merge3Way(arr, first, middle, last) {
    if (first >= middle || middle >= last) return;
    if (arr[middle - 1] <= arr[middle]) return;

    // Find pivot (middle element of left half)
    const pivot = arr[middle - 1];
    
    // Three pointers: lt (< pivot), gt (> pivot), i (scanning)
    let lt = first;      // last element < pivot
    let gt = last - 1;   // first element > pivot
    let i = first;       // current scanning position
    
    // Pass 1: Partition into three regions
    while (i <= gt) {
        if (arr[i] < pivot) {
            // Move to left region
            if (i !== lt) {
                [arr[i], arr[lt]] = [arr[lt], arr[i]];
            }
            lt++;
            i++;
        } else if (arr[i] > pivot) {
            // Move to right region
            if (i !== gt) {
                [arr[i], arr[gt]] = [arr[gt], arr[i]];
            }
            gt--;
            // Don't increment i - need to check swapped element
        } else {
            // Equal to pivot - stays in middle
            i++;
        }
    }
    
    // Result: [first..lt-1] < pivot, [lt..gt] = pivot, [gt+1..last-1] > pivot
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = blockMergeSegmentSort;
}
