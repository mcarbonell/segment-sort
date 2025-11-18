#ifndef SEGMENT_SORT_ITERATOR_H
#define SEGMENT_SORT_ITERATOR_H

#include <vector>
#include <queue>
#include <stdexcept>
#include <algorithm>

// Define namespace to avoid collisions
namespace SegmentSort {

/**
 * SegmentSortIterator
 * 
 * A "Lazy" sorting iterator designed for Top-K queries and streaming.
 * 
 * Advantages:
 * 1. Zero-copy (Const reference to source).
 * 2. Low auxiliary memory O(K) where K is number of segments.
 * 3. O(N) initialization cost.
 * 4. O(log K) cost per element extracted.
 */
class Iterator
{
private:
    // Reference to original vector
    const std::vector<int>& sourceRef;

    // Internal cursor for Heap
    struct RunCursor {
        int currentIdx; 
        int remaining;  
        int step;       // +1 for ascending, -1 for descending
        int value;      
        int id;         // For stability/debugging
    };

    // Min-Heap Comparator (inverted logic for priority_queue)
    struct CompareRunCursor {
        bool operator()(const RunCursor &a, const RunCursor &b) {
            return a.value > b.value;
        }
    };

    std::priority_queue<RunCursor, std::vector<RunCursor>, CompareRunCursor> minHeap;
    int totalSegments = 0;

    void initialize() {
        int n = sourceRef.size();
        if (n == 0) return;

        int runStart = 0;
        int direction = 0; // 0: unknown, 1: asc, -1: desc

        for (int i = 1; i < n; ++i) {
            long long diff = (long long)sourceRef[i] - sourceRef[i-1];
            
            if (diff == 0) continue; 

            int currentDir = (diff > 0) ? 1 : -1;

            if (direction == 0) {
                direction = currentDir;
                continue;
            }

            if (currentDir != direction) {
                addSegmentToHeap(runStart, i - 1, direction);
                runStart = i;
                direction = 0; 
            }
        }
        // Add last segment
        addSegmentToHeap(runStart, n - 1, (direction == 0 ? 1 : direction));
    }

    void addSegmentToHeap(int startIdx, int endIdx, int direction) {
        if (startIdx > endIdx) return;
        
        RunCursor cursor;
        cursor.remaining = (endIdx - startIdx) + 1;
        cursor.id = totalSegments++;

        if (direction >= 0) {
            cursor.currentIdx = startIdx;
            cursor.step = 1;
        } else {
            cursor.currentIdx = endIdx;
            cursor.step = -1;
        }

        cursor.value = sourceRef[cursor.currentIdx];
        minHeap.push(cursor);
    }

public:
    Iterator(const std::vector<int>& input) : sourceRef(input) {
        initialize();
    }

    bool hasNext() const {
        return !minHeap.empty();
    }

    int next() {
        if (minHeap.empty()) {
            throw std::out_of_range("No more elements");
        }

        RunCursor current = minHeap.top();
        minHeap.pop();

        int retValue = current.value;

        current.remaining--;

        if (current.remaining > 0) {
            current.currentIdx += current.step;
            current.value = sourceRef[current.currentIdx];
            minHeap.push(current);
        }

        return retValue;
    }

    std::vector<int> nextBatch(int k) {
        std::vector<int> batch;
        batch.reserve(k);
        for (int i = 0; i < k && hasNext(); i++) {
            batch.push_back(next());
        }
        return batch;
    }

    int getSegmentCount() const {
        return totalSegments;
    }
};

} // namespace
#endif
