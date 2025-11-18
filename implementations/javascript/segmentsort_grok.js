// Implementation of SegmentSort algorithm in JavaScript, translated from C++

class SegmentSort {
    constructor() {
        this.copyarr = [];
    }

    sort(arr) {
        const n = arr.length;
        this.copyarr = arr.slice(); // Copy the array

        // Identify segments
        const segments = [];
        let start = 0;
        let direction = 0; // 0 unknown, > 0 increasing, < 0 decreasing

        for (let i = 1; i < n; ++i) {
            if (direction === 0) {
                direction = arr[i] - arr[i - 1];
                continue;
            }
            if ((direction > 0) && arr[i - 1] > arr[i]) { // Found a decreasing segment
                const length = i - start;
                segments.push({ start, length });
                start = i;
                direction = 0;
            } else if ((direction < 0) && arr[i - 1] < arr[i]) { // Found an increasing segment
                const length = start - i; // Negative length for decreasing
                segments.push({ start: i - 1, length });
                start = i;
                direction = 0;
            }
        }
        if (direction >= 0) {
            const length = n - start;
            segments.push({ start, length });
        } else {
            const length = start - n; // Negative
            segments.push({ start: n - 1, length });
        }

        // MinHeap implementation
        const compare = (a, b) => this.copyarr[a.start] < this.copyarr[b.start]; // Min-heap based on start value

        const minHeap = new MinHeap(compare);
        segments.forEach(segment => minHeap.push(segment));

        // Reconstruct the array
        for (let i = 0; i < n; ++i) {
            const current = minHeap.pop();

            arr[i] = this.copyarr[current.start];

            // If the segment still has elements, push it back to the heap
            if (current.length > 0) { // Positive segment (increasing)
                if (--current.length > 0) {
                    current.start++;
                    minHeap.push(current);
                }
            } else if (current.length < 0) { // Negative segment (decreasing)
                if (++current.length < 0) {
                    current.start--;
                    minHeap.push(current);
                }
            }
        }
    }
}

// MinHeap class for priority queue
class MinHeap {
    constructor(compare) {
        this.heap = [];
        this.compare = compare; // compare(a, b) returns true if a should come before b in the heap
    }

    size() {
        return this.heap.length;
    }

    push(element) {
        this.heap.push(element);
        this.bubbleUp();
    }

    pop() {
        if (this.size() === 1) return this.heap.pop();
        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return top;
    }

    peek() {
        return this.heap[0];
    }

    bubbleUp() {
        let index = this.size() - 1;
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parent])) {
                [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
                index = parent;
            } else {
                break;
            }
        }
    }

    bubbleDown() {
        let index = 0;
        while (index < this.size()) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < this.size() && this.compare(this.heap[left], this.heap[smallest])) {
                smallest = left;
            }
            if (right < this.size() && this.compare(this.heap[right], this.heap[smallest])) {
                smallest = right;
            }
            if (smallest !== index) {
                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            } else {
                break;
            }
        }
    }
}

// Example usage
function main() {
    // const v = [5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18];
    // const v = [5, 3, 8, 4, 2, 7, 1, 6];
    const v = [9, 2, 3, 4, 5, 6, 7, 8, 1];
    console.log("Vector original:", v.join(" "));
    const ss = new SegmentSort();
    ss.sort(v);
    console.log("Vector ordenado:", v.join(" "));
}

// Uncomment the following line to run the example in Node.js
// main();

function segmentSort(arr) {
    const sorter = new SegmentSort();
    sorter.sort(arr);
    return arr;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = segmentSort;
    module.exports.SegmentSort = SegmentSort;
}
