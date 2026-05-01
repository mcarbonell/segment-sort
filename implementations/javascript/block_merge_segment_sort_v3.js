/**
 * Block Merge Segment Sort V3 - JavaScript Implementation
 * Author: Mario Raúl Carbonell Martínez (Optimized by Gemini)
 * Date: April 2026
 * 
 * Version 3: Zero-Overhead adaptive logic. No random sampling.
 */

const BUFFER_SIZE = 65536;
const MIN_GALLOP = 7;

function blockMergeSegmentSortV3(arr) {
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
                // Pasamos la info de 'isFlat' para optimizar el merge
                bufferedMergeV3(arr, top[0], currentStart, currentEnd, buffer, bufferSize, top[2], currentIsFlat);
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
            bufferedMergeV3(arr, left[0], right[0], right[1], buffer, bufferSize, left[2], right[2]);
            segmentsStack.push([left[0], right[1], false, 0]);
        }
    }
    return arr;
}

function reverseSlice(arr, start, end) {
    let i = start, j = end - 1;
    while (i < j) {
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        i++; j--;
    }
}

function detectSegmentEnhanced(arr, start, n) {
    if (start >= n) return [start, start, false, 0];
    let end = start + 1;
    if (end >= n) return [start, end, true, arr[start]];

    const val = arr[start];
    if (val === arr[end]) {
        while (end < n && arr[end] === val) end++;
        return [start, end, true, val];
    }

    if (val > arr[end]) {
        while (end < n && arr[end - 1] > arr[end]) end++;
        reverseSlice(arr, start, end);
        return [start, end, false, 0];
    }

    while (end < n && arr[end - 1] <= arr[end]) end++;
    return [start, end, false, 0];
}

function bufferedMergeV3(arr, first, middle, last, buffer, bufferSize, leftIsFlat, rightIsFlat) {
    if (arr[middle - 1] <= arr[middle]) return;

    // OPTIMIZACIÓN DE DUPLICADOS: Si un lado es plano, podemos usar búsqueda binaria para saltar bloques
    if (leftIsFlat || rightIsFlat) {
        // Usamos una rotación para colocar el bloque plano en su sitio
        if (leftIsFlat) {
            const val = arr[first]; // Todos son iguales en la izquierda
            const pos = lowerBound(arr, middle, last, val);
            rotateRange(arr, first, middle, pos);
            const newMid = first + (pos - middle);
            // El bloque plano ahora está entre [newMid, pos]. Solo queda mergear el resto.
            bufferedMergeV3(arr, pos, pos, last, buffer, bufferSize, false, false);
            return;
        } else {
            const val = arr[middle]; // Todos son iguales en la derecha
            const pos = upperBound(arr, first, middle, val);
            rotateRange(arr, pos, middle, last);
            // El bloque plano ahora está entre [pos, pos + (last-middle)]
            return;
        }
    }

    const len1 = middle - first;
    const len2 = last - middle;

    // Merge con buffer + Galloping Reactivo
    if (len1 <= bufferSize) {
        mergeWithGallopV3Forward(arr, first, middle, last, buffer);
    } else if (len2 <= bufferSize) {
        mergeWithGallopV3Backward(arr, first, middle, last, buffer);
    } else {
        // SymMerge para bloques gigantes
        const mid1 = first + (len1 >> 1);
        const value = arr[mid1];
        const mid2 = lowerBound(arr, middle, last, value);
        const newMid = mid1 + (mid2 - middle);
        rotateRange(arr, mid1, middle, mid2);
        bufferedMergeV3(arr, first, mid1, newMid, buffer, bufferSize, false, false);
        bufferedMergeV3(arr, newMid + 1, mid2, last, buffer, bufferSize, false, false);
    }
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

function mergeWithGallopV3Forward(arr, first, middle, last, buffer) {
    const len1 = middle - first;
    for (let i = 0; i < len1; i++) buffer[i] = arr[first + i];

    let i = 0, j = middle, k = first;
    let count1 = 0, count2 = 0;

    while (i < len1 && j < last) {
        if (buffer[i] <= arr[j]) {
            arr[k++] = buffer[i++];
            count1++; count2 = 0;
            if (count1 >= MIN_GALLOP) {
                // Galloping reactivo: busca cuánto podemos saltar
                const pos = lowerBound(buffer, i, len1, arr[j]);
                while (i < pos) arr[k++] = buffer[i++];
                count1 = 0;
            }
        } else {
            arr[k++] = arr[j++];
            count2++; count1 = 0;
            if (count2 >= MIN_GALLOP) {
                const pos = lowerBound(arr, j, last, buffer[i]);
                while (j < pos) arr[k++] = arr[j++];
                count2 = 0;
            }
        }
    }
    while (i < len1) arr[k++] = buffer[i++];
}

function mergeWithGallopV3Backward(arr, first, middle, last, buffer) {
    const len2 = last - middle;
    for (let i = 0; i < len2; i++) buffer[i] = arr[middle + i];

    let i = middle - 1, j = len2 - 1, k = last - 1;
    let count1 = 0, count2 = 0;

    while (i >= first && j >= 0) {
        if (arr[i] > buffer[j]) {
            arr[k--] = arr[i--];
            count1++; count2 = 0;
            if (count1 >= MIN_GALLOP) {
                const pos = upperBound(arr, first, i + 1, buffer[j]);
                while (i >= pos) arr[k--] = arr[i--];
                count1 = 0;
            }
        } else {
            arr[k--] = buffer[j--];
            count2++; count1 = 0;
            if (count2 >= MIN_GALLOP) {
                const pos = upperBound(buffer, 0, j + 1, arr[i]);
                while (j >= pos) arr[k--] = buffer[j--];
                count2 = 0;
            }
        }
    }
    while (j >= 0) arr[k--] = buffer[j--];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = blockMergeSegmentSortV3;
}
