class SegmentSort {
    /**
     * Implements the Segment Sort algorithm in JavaScript.
     */

    /**
     * Sorts an array in-place using the Segment Sort algorithm.
     * @param {number[]} arr The array of numbers to sort.
     */
    sort(arr) {
        const n = arr.length;
        if (n <= 1) {
            return;
        }

        // Phase 1: Segment Detection
        const segments = this._detectSegments(arr);

        // Phase 2: Heap Merging
        if (segments.length === 0) {
            return;
        }

        this._mergeSegments(arr, segments);
    }

    /**
     * Detects sorted (increasing or decreasing) segments in the array.
     * @param {number[]} arr The input array.
     * @returns {Array<[number, number]>} A list of segments, where each segment is a tuple [start_index, end_index].
     */
    _detectSegments(arr) {
        const segments = [];
        const n = arr.length;
        if (n === 0) {
            return segments;
        }

        let start = 0;
        while (start < n) {
            let end = start;
            if (end + 1 < n && arr[end] > arr[end + 1]) {
                // Decreasing segment
                while (end + 1 < n && arr[end] > arr[end + 1]) {
                    end++;
                }
                segments.push([end, start]); // Store as [end, start] for backward iteration
            } else {
                // Increasing or single-element segment
                while (end + 1 < n && arr[end] <= arr[end + 1]) {
                    end++;
                }
                segments.push([start, end]);
            }
            start = end + 1;
        }
        return segments;
    }

    /**
     * Merges the detected segments using a min-heap.
     * @param {number[]} arr The list to be sorted (will be modified in-place).
     * @param {Array<[number, number]>} segments The list of detected segments.
     */
    _mergeSegments(arr, segments) {
        const minHeap = new MinHeap();

        for (let i = 0; i < segments.length; i++) {
            const [start, _] = segments[i];
            const value = arr[start];
            minHeap.push({ value, segIndex: i, currentPos: start });
        }

        const sortedArr = [];
        while (!minHeap.isEmpty()) {
            const { value, segIndex, currentPos } = minHeap.pop();
            sortedArr.push(value);

            const [start, end] = segments[segIndex];
            const direction = start <= end ? 1 : -1;

            const nextPos = currentPos + direction;

            if ((direction === 1 && nextPos <= end) || (direction === -1 && nextPos >= end)) {
                const nextValue = arr[nextPos];
                minHeap.push({ value: nextValue, segIndex, currentPos: nextPos });
            }
        }

        for (let i = 0; i < arr.length; i++) {
            arr[i] = sortedArr[i];
        }
    }
}

/**
 * A simple MinHeap implementation for the merge phase.
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node) {
        this.heap.push(node);
        this._heapifyUp();
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }
        this._swap(0, this.heap.length - 1);
        const popped = this.heap.pop();
        this._heapifyDown();
        return popped;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].value > this.heap[index].value) {
                this._swap(parentIndex, index);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    _heapifyDown() {
        let index = 0;
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (leftChildIndex < length && this.heap[leftChildIndex].value < this.heap[smallest].value) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].value < this.heap[smallest].value) {
                smallest = rightChildIndex;
            }
            if (smallest !== index) {
                this._swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}

// Example of usage
if (typeof module !== 'undefined' && !module.parent) {
    const sorter = new SegmentSort();
    
    const v = [5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18];
    console.log("Original vector:", v.join(' '));
    sorter.sort(v);
    console.log("Sorted vector:  ", v.join(' '));

    const v2 = [9, 2, 3, 4, 5, 6, 7, 8, 1];
    console.log("\nOriginal vector:", v2.join(' '));
    sorter.sort(v2);
    console.log("Sorted vector:  ", v2.join(' '));

    const v3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    console.log("\nOriginal vector:", v3.join(' '));
    sorter.sort(v3);
    console.log("Sorted vector:  ", v3.join(' '));

    const v4 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    console.log("\nOriginal vector:", v4.join(' '));
    sorter.sort(v4);
    console.log("Sorted vector:  ", v4.join(' '));
}

module.exports = SegmentSort;
