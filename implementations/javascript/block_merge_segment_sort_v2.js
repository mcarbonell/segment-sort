/**
 * Block Merge Segment Sort V2 - JavaScript Implementation
 * Author: Mario Raúl Carbonell Martínez (Optimized by Gemini)
 * Date: April 2026
 * 
 * Version 2: Enabled and fixed Galloping Mode and 3-Way Merge.
 */

const BUFFER_SIZE = 65536;
const DUPLICATE_RATIO_THRESHOLD = 0.5;
const MIN_GALLOP = 7;

function blockMergeSegmentSortV2(arr) {
    if (!arr || arr.length <= 1) return arr;

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

            if (currentLen < topLen) break;

            segmentsStack.pop();

            if (top[2] && currentIsFlat && top[3] === currentFlatVal) {
                currentStart = top[0];
                currentIsFlat = true;
            } else {
                bufferedMergeV2(arr, top[0], currentStart, currentEnd, buffer, bufferSize);
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
            bufferedMergeV2(arr, left[0], right[0], right[1], buffer, bufferSize);
            segmentsStack.push([left[0], right[1], false, 0]);
        }
    }
    return arr;
}

function reverseSlice(arr, start, end) {
    let i = start, j = end - 1;
    while (i < j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        i++; j--;
    }
}

function detectSegmentEnhanced(arr, start, n) {
    if (start >= n) return [start, start, false, 0];
    let end = start + 1;
    if (end >= n) return [start, end, true, arr[start]];

    if (arr[start] === arr[end]) {
        while (end < n && arr[end] === arr[start]) end++;
        return [start, end, true, arr[start]];
    }

    if (arr[start] > arr[end]) {
        while (end < n && arr[end - 1] > arr[end]) end++;
        reverseSlice(arr, start, end);
        return [start, end, false, 0];
    }

    while (end < n && arr[end - 1] <= arr[end]) end++;
    return [start, end, false, 0];
}

function lowerBound(arr, first, last, value) {
    let left = first, right = last;
    while (left < right) {
        const mid = (left + right) >>> 1;
        if (arr[mid] < value) left = mid + 1;
        else right = mid;
    }
    return left;
}

function upperBound(arr, first, last, value) {
    let left = first, right = last;
    while (left < right) {
        const mid = (left + right) >>> 1;
        if (arr[mid] <= value) left = mid + 1;
        else right = mid;
    }
    return left;
}

function rotateRange(arr, first, middle, last) {
    if (first >= middle || middle >= last) return;
    reverseSlice(arr, first, middle);
    reverseSlice(arr, middle, last);
    reverseSlice(arr, first, last);
}

function bufferedMergeV2(arr, first, middle, last, buffer, bufferSize) {
    if (first >= middle || middle >= last || arr[middle - 1] <= arr[middle]) return;

    const len1 = middle - first;
    const len2 = last - middle;

    // 1. Detección de duplicados masivos (3-Way Strategy)
    if (len1 > 128 && len2 > 128) {
        const dupRatio = estimateDuplicateRatio(arr, first, last);
        if (dupRatio > DUPLICATE_RATIO_THRESHOLD) {
            merge3WayFixed(arr, first, middle, last, buffer, bufferSize);
            return;
        }
    }

    // 2. Galloping para desequilibrios masivos
    const imbalance = Math.max(len1, len2) / Math.min(len1, len2);
    if (imbalance > 10 && (len1 <= bufferSize || len2 <= bufferSize)) {
        mergeWithGallopFixed(arr, first, middle, last, buffer, bufferSize);
        return;
    }

    // 3. Merge estándar con buffer
    if (len1 <= bufferSize) {
        mergeWithBufferLeft(arr, first, middle, last, buffer);
    } else if (len2 <= bufferSize) {
        mergeWithBufferRight(arr, first, middle, last, buffer);
    } else {
        // SymMerge para bloques gigantes
        const mid1 = first + Math.floor(len1 / 2);
        const value = arr[mid1];
        const mid2 = lowerBound(arr, middle, last, value);
        const newMid = mid1 + (mid2 - middle);
        rotateRange(arr, mid1, middle, mid2);
        bufferedMergeV2(arr, first, mid1, newMid, buffer, bufferSize);
        bufferedMergeV2(arr, newMid + 1, mid2, last, buffer, bufferSize);
    }
}

function mergeWithBufferLeft(arr, first, middle, last, buffer) {
    const len1 = middle - first;
    for (let i = 0; i < len1; i++) buffer[i] = arr[first + i];
    let i = 0, j = middle, k = first;
    while (i < len1 && j < last) {
        if (buffer[i] <= arr[j]) arr[k++] = buffer[i++];
        else arr[k++] = arr[j++];
    }
    while (i < len1) arr[k++] = buffer[i++];
}

function mergeWithBufferRight(arr, first, middle, last, buffer) {
    const len2 = last - middle;
    for (let i = 0; i < len2; i++) buffer[i] = arr[middle + i];
    let i = middle - 1, j = len2 - 1, k = last - 1;
    while (i >= first && j >= 0) {
        if (arr[i] > buffer[j]) arr[k--] = arr[i--];
        else arr[k--] = buffer[j--];
    }
    while (j >= 0) arr[k--] = buffer[j--];
}

function mergeWithGallopFixed(arr, first, middle, last, buffer, bufferSize) {
    const len1 = middle - first;
    const len2 = last - middle;

    if (len1 <= bufferSize) {
        // Copy left to buffer and merge forward
        for (let i = 0; i < len1; i++) buffer[i] = arr[first + i];
        let i = 0, j = middle, k = first;
        let count1 = 0, count2 = 0;

        while (i < len1 && j < last) {
            if (buffer[i] <= arr[j]) {
                arr[k++] = buffer[i++];
                count1++; count2 = 0;
                if (count1 >= MIN_GALLOP && i < len1) {
                    const pos = lowerBound(buffer, i, len1, arr[j]);
                    while (i < pos) arr[k++] = buffer[i++];
                    count1 = 0;
                }
            } else {
                arr[k++] = arr[j++];
                count2++; count1 = 0;
                if (count2 >= MIN_GALLOP && j < last) {
                    const pos = lowerBound(arr, j, last, buffer[i]);
                    while (j < pos) arr[k++] = arr[j++];
                    count2 = 0;
                }
            }
        }
        while (i < len1) arr[k++] = buffer[i++];
    } else {
        // Copy right to buffer and merge backward
        for (let i = 0; i < len2; i++) buffer[i] = arr[middle + i];
        let i = middle - 1, j = len2 - 1, k = last - 1;
        let count1 = 0, count2 = 0;

        while (i >= first && j >= 0) {
            if (arr[i] > buffer[j]) {
                arr[k--] = arr[i--];
                count1++; count2 = 0;
                if (count1 >= MIN_GALLOP && i >= first) {
                    const pos = upperBound(arr, first, i + 1, buffer[j]);
                    while (i >= pos) arr[k--] = arr[i--];
                    count1 = 0;
                }
            } else {
                arr[k--] = buffer[j--];
                count2++; count1 = 0;
                if (count2 >= MIN_GALLOP && j >= 0) {
                    const pos = upperBound(buffer, 0, j + 1, arr[i]);
                    while (j >= pos) arr[k--] = buffer[j--];
                    count2 = 0;
                }
            }
        }
        while (j >= 0) arr[k--] = buffer[j--];
    }
}

function merge3WayFixed(arr, first, middle, last, buffer, bufferSize) {
    const pivot = arr[middle - 1];
    if (pivot !== arr[middle]) {
        // No hay un pivote común masivo en la frontera, procedemos normal
        const m1 = lowerBound(arr, first, middle, pivot);
        const m2 = upperBound(arr, middle, last, pivot);
        rotateRange(arr, m1, middle, m2);
        const newMid = m1 + (m2 - middle);
        bufferedMergeV2(arr, first, m1, newMid, buffer, bufferSize);
        bufferedMergeV2(arr, newMid, m2, last, buffer, bufferSize); // El rango [m1, newMid] ya está ordenado (son duplicados)
        return;
    }
    // Si el pivote es igual en ambos lados, simplemente usamos SymMerge normal
    const len1 = middle - first;
    const mid1 = first + Math.floor(len1 / 2);
    const val = arr[mid1];
    const mid2 = lowerBound(arr, middle, last, val);
    const newMid = mid1 + (mid2 - middle);
    rotateRange(arr, mid1, middle, mid2);
    bufferedMergeV2(arr, first, mid1, newMid, buffer, bufferSize);
    bufferedMergeV2(arr, newMid + 1, mid2, last, buffer, bufferSize);
}

function estimateDuplicateRatio(arr, start, end) {
    const sampleSize = Math.min(64, end - start);
    const unique = new Set();
    for (let i = 0; i < sampleSize; i++) {
        unique.add(arr[start + Math.floor(Math.random() * (end - start))]);
    }
    return 1 - (unique.size / sampleSize);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = blockMergeSegmentSortV2;
}
