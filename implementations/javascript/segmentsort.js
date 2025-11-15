/**
 * Sorts an array using the Balanced Segment Merge algorithm.
 * This algorithm identifies naturally sorted segments (runs) and merges them
 * in a balanced way, similar to a classic merge sort.
 *
 * @param {number[]} arr The array to sort (will be mutated).
 * @returns {number[]} The mutated sorted array.
 */
function segmentSort(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    // 1. Identify all ascending segments (runs)
    let segments = _identifySegments(arr);

    if (segments.length <= 1) {
        const result = segments.length === 1 ? segments[0] : [];
        // Copy result back to original array if it's different
        if (arr !== result) {
            arr.length = 0;
            arr.push(...result);
        }
        return arr;
    }

    // 2. Merge segments in balanced rounds until only one remains
    while (segments.length > 1) {
        const newSegments = [];
        for (let i = 0; i < segments.length; i += 2) {
            if (i + 1 < segments.length) {
                // Merge a pair of segments
                newSegments.push(_merge(segments[i], segments[i + 1]));
            } else {
                // If there's an odd one out, carry it to the next round
                newSegments.push(segments[i]);
            }
        }
        segments = newSegments;
    }

    // 3. Copy the final sorted segment back into the original array
    const finalResult = segments[0];
    arr.length = 0;
    arr.push(...finalResult);
    return arr;
}

/**
 * Identifies naturally sorted segments (ascending or descending) in an array.
 * Descending segments are reversed to become ascending.
 * @param {number[]} arr The input array.
 * @returns {Array<number[]>} An array of segments (which are also arrays).
 * @private
 */
function _identifySegments(arr) {
    const segments = [];
    const n = arr.length;
    if (n === 0) {
        return segments;
    }

    let start = 0;
    while (start < n) {
        let end = start;
        // Check for a descending segment
        if (end + 1 < n && arr[end] > arr[end + 1]) {
            while (end + 1 < n && arr[end] > arr[end + 1]) {
                end++;
            }
            // Extract the descending segment and reverse it
            const segment = arr.slice(start, end + 1);
            segment.reverse();
            segments.push(segment);
        } else {
            // It's an ascending segment
            while (end + 1 < n && arr[end] <= arr[end + 1]) {
                end++;
            }
            // Extract the ascending segment
            segments.push(arr.slice(start, end + 1));
        }
        start = end + 1;
    }
    return segments;
}

/**
 * Merges two sorted arrays into a single sorted array.
 * @param {number[]} left The first sorted array.
 * @param {number[]} right The second sorted array.
 * @returns {number[]} The merged and sorted array.
 * @private
 */
function _merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Add remaining elements from left array, if any
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    // Add remaining elements from right array, if any
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}

module.exports = segmentSort;