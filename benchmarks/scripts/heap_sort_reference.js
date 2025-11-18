/**
 * Heap Sort - Reference Implementation for Benchmarks
 * 
 * This is a clean, optimized implementation of Heap Sort for use as a
 * reference algorithm in performance comparisons.
 * 
 * Author: Mario Raúl Carbonell Martínez
 * Extracted from: benchmarks/languages/javascript/js_benchmarks.js
 */

/**
 * Heap Sort implementation - comparison-based sorting algorithm
 * Time Complexity: O(n log n) - guaranteed
 * Space Complexity: O(1) - sorts in-place
 * 
 * @param {number[]} arr - Array to sort (modified in-place)
 * @returns {number[]} - Same array, now sorted
 */
function heapSort(arr) {
    const n = arr.length;

    // Build a max heap from the array
    buildMaxHeap(arr);

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end (it's the largest element)
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Call heapify on the reduced heap
        heapify(arr, i, 0);
    }

    return arr;
}

/**
 * Build a max heap from an unsorted array
 * 
 * @param {number[]} arr - Array to heapify
 */
function buildMaxHeap(arr) {
    const n = arr.length;

    // Start from the last non-leaf node and heapify each node
    // The last non-leaf node is at index Math.floor(n/2) - 1
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

/**
 * Heapify a subtree rooted at given index
 * This is the core operation of heap sort
 * 
 * @param {number[]} arr - Array representing the heap
 * @param {number} heapSize - Size of the heap
 * @param {number} rootIndex - Index of the root of the subtree
 */
function heapify(arr, heapSize, rootIndex) {
    let largest = rootIndex; // Initialize largest as root
    const leftChild = 2 * rootIndex + 1; // Left child index
    const rightChild = 2 * rootIndex + 2; // Right child index

    // Check if left child exists and is greater than root
    if (leftChild < heapSize && arr[leftChild] > arr[largest]) {
        largest = leftChild;
    }

    // Check if right child exists and is greater than current largest
    if (rightChild < heapSize && arr[rightChild] > arr[largest]) {
        largest = rightChild;
    }

    // If largest is not root, swap and continue heapifying
    if (largest !== rootIndex) {
        // Swap
        [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];

        // Recursively heapify the affected sub-tree
        heapify(arr, heapSize, largest);
    }
}

/**
 * Min-Heap implementation (alternative)
 * Useful for certain applications requiring ascending order
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    /**
     * Insert element into heap
     * @param {number} value - Value to insert
     */
    insert(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }

    /**
     * Extract minimum element from heap
     * @returns {number|null} - Minimum value or null if empty
     */
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);

        return min;
    }

    /**
     * Get minimum element without extracting
     * @returns {number|null} - Minimum value or null if empty
     */
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    /**
     * Check if heap is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Get heap size
     * @returns {number}
     */
    size() {
        return this.heap.length;
    }

    /**
     * Bubble up operation to maintain heap property
     * @param {number} index - Index to bubble up
     */
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] <= this.heap[index]) break;

            [this.heap[parentIndex], this.heap[index]] =
                [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    /**
     * Bubble down operation to maintain heap property
     * @param {number} index - Index to bubble down
     */
    bubbleDown(index) {
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.heap[leftChild] < this.heap[smallest]) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild] < this.heap[smallest]) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] =
                [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

/**
 * Max-Heap implementation (alternative)
 */
class MaxHeap {
    constructor() {
        this.heap = [];
    }

    insert(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMax() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);

        return max;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
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
            if (this.heap[parentIndex] >= this.heap[index]) break;

            [this.heap[parentIndex], this.heap[index]] =
                [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            let largest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.heap[leftChild] > this.heap[largest]) {
                largest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild] > this.heap[largest]) {
                largest = rightChild;
            }

            if (largest === index) break;

            [this.heap[index], this.heap[largest]] =
                [this.heap[largest], this.heap[index]];
            index = largest;
        }
    }
}

/**
 * Heap Sort using MinHeap class (alternative implementation)
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array
 */
function heapSortWithMinHeap(arr) {
    const minHeap = new MinHeap();
    const result = [];

    // Build heap
    for (const element of arr) {
        minHeap.insert(element);
    }

    // Extract elements in sorted order
    while (!minHeap.isEmpty()) {
        result.push(minHeap.extractMin());
    }

    return result;
}

/**
 * Heap Sort using MaxHeap class (alternative implementation)
 * 
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - New sorted array
 */
function heapSortWithMaxHeap(arr) {
    const maxHeap = new MaxHeap();
    const result = [];

    // Build heap
    for (const element of arr) {
        maxHeap.insert(element);
    }

    // Extract elements in sorted order
    while (!maxHeap.isEmpty()) {
        result.unshift(maxHeap.extractMax()); // Insert at beginning for ascending order
    }

    return result;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        heapSort,
        buildMaxHeap,
        heapify,
        MinHeap,
        MaxHeap,
        heapSortWithMinHeap,
        heapSortWithMaxHeap
    };
}

// Example usage and testing
if (typeof module !== 'undefined' && require.main === module) {
    // Test the implementation
    const testArray = [64, 34, 25, 12, 22, 11, 90];
    console.log('Original array:', testArray);

    const sortedArray = heapSort([...testArray]);
    console.log('Sorted array:', sortedArray);

    // Verify correctness
    const isSorted = sortedArray.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    console.log('Is correctly sorted:', isSorted);

    console.log('\nHeap Sort - Reference Implementation');
    console.log('====================================');
    console.log('- Time Complexity: O(n log n) guaranteed');
    console.log('- Space Complexity: O(1) - sorts in-place');
    console.log('- Stable: No (relative order not preserved)');
    console.log('- In-place: Yes');
    console.log('- Adaptive: No (always O(n log n))');

    // Test heap data structures
    console.log('\nTesting MinHeap:');
    const minHeap = new MinHeap();
    [5, 3, 8, 1, 9, 2].forEach(val => minHeap.insert(val));
    while (!minHeap.isEmpty()) {
        console.log('Extracted:', minHeap.extractMin());
    }
}