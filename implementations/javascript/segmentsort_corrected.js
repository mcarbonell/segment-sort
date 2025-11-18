/**
 * Segment Sort - JavaScript Implementation
 * Original K-Way Merge Algorithm with Priority Queue
 * 
 * This is a faithful port of the C++ implementation to JavaScript.
 * Author: Mario Raúl Carbonell Martínez
 * Ported to JavaScript by AI analysis
 */

class Segment {
    constructor(start, length) {
        this.start = start;
        this.length = length;
    }
}

class CompareSegments {
    constructor(copyArr) {
        this.copyArr = copyArr;
    }

    compare(a, b) {
        return this.copyArr[a.start] - this.copyArr[b.start];
    }
}

class MinHeap {
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator;
    }

    push(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    size() {
        return this.heap.length;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator.compare(this.heap[parentIndex], this.heap[index]) <= 0) break;

            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length &&
                this.comparator.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.comparator.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

/**
 * SegmentSort - Original K-Way Merge Implementation
 * 
 * @param {number[]} arr - The array to sort (will be modified in-place)
 * @returns {number[]} - The sorted array
 */
function segmentSort(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    const n = arr.length;
    const copyArr = [...arr]; // Create a copy for reference
    const segments = [];

    // Phase 1: Identify segments (same logic as C++)
    let start = 0;
    let direction = 0; // 0 unknown, > 0 increasing, < 0 decreasing

    for (let i = 1; i < n; ++i) {
        if (direction === 0) {
            direction = copyArr[i] - copyArr[i - 1];
            continue;
        }

        if (direction > 0 && copyArr[i - 1] > copyArr[i]) {
            // Found a decreasing segment
            const length = i - start;
            segments.push(new Segment(start, length));
            start = i;
            direction = 0;
        } else if (direction < 0 && copyArr[i - 1] < copyArr[i]) {
            // Found an increasing segment
            const length = start - i;
            segments.push(new Segment(i - 1, length));
            start = i;
            direction = 0;
        }
    }

    // Handle the last segment
    if (direction >= 0) {
        const length = n - start;
        segments.push(new Segment(start, length));
    } else {
        const length = start - n;
        segments.push(new Segment(n - 1, length));
    }

    // Debug: Log segments for verification
    if (segments.length > 10) {
        // console.log(`Created ${segments.length} segments for array of size ${n}`);
    }

    // Phase 2: Use min-heap to extract elements in sorted order
    const comparator = new CompareSegments(copyArr);
    const minHeap = new MinHeap(comparator);

    // Push all segments to heap
    for (const segment of segments) {
        minHeap.push(segment);
    }

    // Reconstruct the array
    for (let i = 0; i < n; ++i) {
        const current = minHeap.pop();
        arr[i] = copyArr[current.start];

        // If the segment still has elements, push it back to the heap
        if (current.length > 0) {
            // Positive segment (ascending)
            if (--current.length > 0) {
                current.start++;
                minHeap.push(current);
            }
        } else if (current.length < 0) {
            // Negative segment (descending, already reversed)
            if (++current.length < 0) {
                current.start--;
                minHeap.push(current);
            }
        }
    }

    return arr;
}

/**
 * Alternative implementation using built-in sort for the heap operations
 * This might be more efficient in JavaScript due to optimized built-in sort
 */
function segmentSortOptimized(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    const n = arr.length;
    const copyArr = [...arr];
    const segments = [];

    // Phase 1: Identify segments (same as above)
    let start = 0;
    let direction = 0;

    for (let i = 1; i < n; ++i) {
        if (direction === 0) {
            direction = copyArr[i] - copyArr[i - 1];
            continue;
        }

        if (direction > 0 && copyArr[i - 1] > copyArr[i]) {
            const length = i - start;
            segments.push(new Segment(start, length));
            start = i;
            direction = 0;
        } else if (direction < 0 && copyArr[i - 1] < copyArr[i]) {
            const length = start - i;
            segments.push(new Segment(i - 1, length));
            start = i;
            direction = 0;
        }
    }

    if (direction >= 0) {
        const length = n - start;
        segments.push(new Segment(start, length));
    } else {
        const length = start - n;
        segments.push(new Segment(n - 1, length));
    }

    // Phase 2: Use array with sort instead of custom heap
    // This maintains the same algorithmic complexity but may be faster in JS
    const heap = [];

    // Add all segments to heap
    for (const segment of segments) {
        heap.push(segment);
    }

    // Sort by current element value
    heap.sort((a, b) => copyArr[a.start] - copyArr[b.start]);

    // Reconstruct array
    for (let i = 0; i < n; ++i) {
        const current = heap[0];
        arr[i] = copyArr[current.start];

        // Remove the top element
        heap.shift();

        // Update and reinsert if segment has more elements
        if (current.length > 0) {
            if (--current.length > 0) {
                current.start++;
                // Insert in sorted position (binary search for efficiency)
                let left = 0, right = heap.length;
                while (left < right) {
                    const mid = Math.floor((left + right) / 2);
                    if (copyArr[heap[mid].start] <= copyArr[current.start]) {
                        left = mid + 1;
                    } else {
                        right = mid;
                    }
                }
                heap.splice(left, 0, current);
            }
        } else if (current.length < 0) {
            if (++current.length < 0) {
                current.start--;
                // Insert in sorted position
                let left = 0, right = heap.length;
                while (left < right) {
                    const mid = Math.floor((left + right) / 2);
                    if (copyArr[heap[mid].start] <= copyArr[current.start]) {
                        left = mid + 1;
                    } else {
                        right = mid;
                    }
                }
                heap.splice(left, 0, current);
            }
        }
    }

    return arr;
}

// Export both implementations
module.exports = segmentSort;
module.exports.optimized = segmentSortOptimized;
module.exports.Segment = Segment;