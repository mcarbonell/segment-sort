/**
 * Segment Sort - Optimized Implementation
 * 
 * This version addresses the performance issues of the original implementation:
 * 1. Better segment detection threshold
 * 2. Optimized heap operations
 * 3. Reduced memory allocations
 * 4. Better cache locality
 * 
 * @param {number[]} arr - The array to sort (will be modified in-place)
 * @returns {number[]} - The sorted array
 */
function segmentSortOptimized(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    const n = arr.length;
    const copyArr = [...arr]; // Create a copy for reference

    // Phase 1: Improved segment detection with minimum length threshold
    const segments = [];
    const MIN_SEGMENT_LENGTH = 4; // Avoid segments that are too small

    let start = 0;
    let direction = 0; // 0 unknown, > 0 increasing, < 0 decreasing
    let segmentLength = 1;

    for (let i = 1; i < n; ++i) {
        const currentDirection = copyArr[i] - copyArr[i - 1];

        if (direction === 0) {
            direction = currentDirection;
            segmentLength = 2;
            continue;
        }

        const isChanging = (direction > 0 && currentDirection < 0) ||
            (direction < 0 && currentDirection > 0);

        if (isChanging && segmentLength >= MIN_SEGMENT_LENGTH) {
            // Found a significant segment change
            segments.push([start, segmentLength, direction]);
            start = i;
            direction = currentDirection;
            segmentLength = 1;
        } else {
            segmentLength++;
            // Update direction for monotonic segments
            if (direction > 0 && currentDirection < 0) {
                direction = -1;
            } else if (direction < 0 && currentDirection > 0) {
                direction = 1;
            }
        }
    }

    // Handle the last segment
    if (segmentLength >= 1) {
        segments.push([start, segmentLength, direction]);
    }

    // If we only have one segment (array was already structured), sort it simply
    if (segments.length <= 1) {
        return arr.sort((a, b) => a - b);
    }

    // Phase 2: Optimized k-way merge
    // Convert segments to heap items with pre-computed indices
    const heapItems = segments.map((seg, index) => ({
        segmentIndex: index,
        position: seg[0],
        length: seg[1],
        direction: seg[2],
        currentIndex: seg[0]
    }));

    // Custom binary heap for better performance
    function heapPush(item) {
        heapItems.push(item);
        bubbleUp(heapItems.length - 1);
    }

    function heapPop() {
        if (heapItems.length === 0) return null;
        if (heapItems.length === 1) return heapItems.pop();

        const min = heapItems[0];
        heapItems[0] = heapItems.pop();
        bubbleDown(0);
        return min;
    }

    function bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (getValue(heapItems[parentIndex]) <= getValue(heapItems[index])) break;

            [heapItems[parentIndex], heapItems[index]] = [heapItems[index], heapItems[parentIndex]];
            index = parentIndex;
        }
    }

    function bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < heapItems.length &&
                getValue(heapItems[leftChild]) < getValue(heapItems[smallest])) {
                smallest = leftChild;
            }

            if (rightChild < heapItems.length &&
                getValue(heapItems[rightChild]) < getValue(heapItems[smallest])) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [heapItems[index], heapItems[smallest]] = [heapItems[smallest], heapItems[index]];
            index = smallest;
        }
    }

    function getValue(item) {
        return copyArr[item.currentIndex];
    }

    // Initialize heap
    for (let i = Math.floor(heapItems.length / 2) - 1; i >= 0; i--) {
        bubbleDown(i);
    }

    // Extract elements in sorted order
    let outputIndex = 0;
    while (heapItems.length > 0) {
        const current = heapPop();
        arr[outputIndex++] = copyArr[current.currentIndex];

        // Move to next position in segment
        if (current.direction > 0) {
            // Ascending segment
            current.currentIndex++;
            current.length--;
        } else {
            // Descending segment (we'll reverse it)
            current.currentIndex--;
            current.length++;
        }

        // Add back to heap if segment still has elements
        if (current.length > 0) {
            heapPush(current);
        }
    }

    return arr;
}

// Alternative: Simpler approach for arrays that are mostly random
function segmentSortHybrid(arr) {
    if (!arr || arr.length <= 1) {
        return arr;
    }

    // Check if array has natural segments (more efficient detection)
    let directionChanges = 0;
    let consecutiveDirectionChanges = 0;
    let maxConsecutiveChanges = 0;

    for (let i = 1; i < Math.min(arr.length, 100); i++) {
        const currentDirection = arr[i] - arr[i - 1];
        const prevDirection = arr[i - 1] - arr[i - 2];

        if (i > 1 &&
            ((currentDirection > 0 && prevDirection < 0) ||
                (currentDirection < 0 && prevDirection > 0))) {
            consecutiveDirectionChanges++;
            maxConsecutiveChanges = Math.max(maxConsecutiveChanges, consecutiveDirectionChanges);
        } else {
            consecutiveDirectionChanges = 0;
        }
    }

    // If changes are too frequent, fall back to a more efficient sort
    if (maxConsecutiveChanges > 10) {
        return arr.sort((a, b) => a - b);
    }

    // Otherwise use optimized segment sort
    return segmentSortOptimized(arr);
}

// Export functions
module.exports = segmentSortOptimized;
module.exports.hybrid = segmentSortHybrid;