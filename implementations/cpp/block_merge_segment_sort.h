#ifndef BLOCK_MERGE_SEGMENT_SORT_HPP
#define BLOCK_MERGE_SEGMENT_SORT_HPP

#include <vector>
#include <algorithm>
#include <cmath>
#include <iterator>

// Buffer size for linear merge.
// 512 elements fits easily in L1/L2 cache.
const size_t BLOCK_MERGE_BUFFER_SIZE = 512;

namespace segment_sort {

    // Helper: Reverse a slice of the vector
    template<typename T>
    void reverse_slice(std::vector<T>& arr, size_t start, size_t end) {
        std::reverse(arr.begin() + start, arr.begin() + end);
    }

    // Helper: Detect a sorted segment (run)
    template<typename T>
    size_t detect_segment(std::vector<T>& arr, size_t start) {
        size_t n = arr.size();
        if (start >= n) return start;

        size_t end = start + 1;
        if (end >= n) return end;

        if (arr[start] > arr[end]) {
            // Descending run
            while (end < n && arr[end - 1] > arr[end]) {
                end++;
            }
            reverse_slice(arr, start, end);
        } else {
            // Ascending run
            while (end < n && arr[end - 1] <= arr[end]) {
                end++;
            }
        }
        return end;
    }

    // Helper: Rotate range [first, middle, last)
    template<typename T>
    void rotate_range(std::vector<T>& arr, size_t first, size_t middle, size_t last) {
        std::rotate(arr.begin() + first, arr.begin() + middle, arr.begin() + last);
    }

    // Helper: Merge using buffer for left part
    template<typename T>
    void merge_with_buffer_left(std::vector<T>& arr, size_t first, size_t middle, size_t last, std::vector<T>& buffer) {
        size_t len1 = middle - first;
        
        // Copy left to buffer
        // Ensure buffer is large enough (though caller checks this)
        if (buffer.size() < len1) buffer.resize(len1);
        std::copy(arr.begin() + first, arr.begin() + middle, buffer.begin());

        size_t i = 0;      // buffer index
        size_t j = middle; // right part index
        size_t k = first;  // dest index

        while (i < len1 && j < last) {
            if (buffer[i] <= arr[j]) {
                arr[k++] = buffer[i++];
            } else {
                arr[k++] = arr[j++];
            }
        }
        while (i < len1) {
            arr[k++] = buffer[i++];
        }
    }

    // Helper: Merge using buffer for right part
    template<typename T>
    void merge_with_buffer_right(std::vector<T>& arr, size_t first, size_t middle, size_t last, std::vector<T>& buffer) {
        size_t len2 = last - middle;
        
        // Copy right to buffer
        if (buffer.size() < len2) buffer.resize(len2);
        std::copy(arr.begin() + middle, arr.begin() + last, buffer.begin());

        long i = (long)middle - 1; // left part index
        long j = (long)len2 - 1;   // buffer index
        long k = (long)last - 1;   // dest index

        while (i >= (long)first && j >= 0) {
            if (arr[i] > buffer[j]) {
                arr[k--] = arr[i--];
            } else {
                arr[k--] = buffer[j--];
            }
        }
        while (j >= 0) {
            arr[k--] = buffer[j--];
        }
    }

    // Core: Buffered Merge (Hybrid)
    template<typename T>
    void buffered_merge(std::vector<T>& arr, size_t first, size_t middle, size_t last, std::vector<T>& buffer) {
        if (first >= middle || middle >= last) return;

        size_t len1 = middle - first;
        size_t len2 = last - middle;

        // Optimization: Already sorted?
        if (arr[middle - 1] <= arr[middle]) return;

        // Strategy 1: Use buffer if small enough
        if (len1 <= BLOCK_MERGE_BUFFER_SIZE) {
            merge_with_buffer_left(arr, first, middle, last, buffer);
            return;
        }
        if (len2 <= BLOCK_MERGE_BUFFER_SIZE) {
            merge_with_buffer_right(arr, first, middle, last, buffer);
            return;
        }

        // Strategy 2: SymMerge (Divide and Conquer)
        size_t mid1 = first + (middle - first) / 2;
        const T& value = arr[mid1];
        
        auto it = std::lower_bound(arr.begin() + middle, arr.begin() + last, value);
        size_t mid2 = std::distance(arr.begin(), it);

        size_t newMid = mid1 + (mid2 - middle);

        rotate_range(arr, mid1, middle, mid2);

        buffered_merge(arr, first, mid1, newMid, buffer);
        buffered_merge(arr, newMid + 1, mid2, last, buffer);
    }

    /**
     * @brief Block Merge Segment Sort (C++ Implementation)
     * 
     * A hybrid adaptive sorting algorithm that combines:
     * 1. "On-the-Fly" Segment Detection (O(N) for sorted data)
     * 2. Block Merge Strategy (Linear time merge using small buffer)
     * 
     * @details
     * This algorithm detects sorted segments and merges them using a stack-based
     * approach to maintain balance. It uses a small fixed-size buffer (512 elements)
     * to perform fast linear-time merges. If segments are too large for the buffer,
     * it falls back to a rotation-based in-place merge (SymMerge) to split them.
     * 
     * Complexity:
     * - Time: O(N log N) worst case, O(N) best case (sorted/reverse).
     * - Space: O(log N) stack + O(1) buffer (2KB).
     * 
     * @tparam T Type of elements to sort (must be comparable).
     * @param arr Vector to sort.
     */
    template<typename T>
    void block_merge_segment_sort(std::vector<T>& arr) {
        size_t n = arr.size();
        if (n <= 1) return;

        // Reusable buffer
        // 512 elements fits easily in L1/L2 cache.
        std::vector<T> buffer;
        buffer.reserve(BLOCK_MERGE_BUFFER_SIZE);

        struct Segment { size_t start; size_t end; };
        std::vector<Segment> stack;
        stack.reserve(64); // Log N depth

        size_t i = 0;
        while (i < n) {
            // 1. Detect next run (ascending or descending)
            size_t end = detect_segment(arr, i);
            
            size_t current_start = i;
            size_t current_end = end;
            i = end;

            // 2. Balance the stack (maintain invariant)
            while (!stack.empty()) {
                Segment top = stack.back();
                size_t top_len = top.end - top.start;
                size_t current_len = current_end - current_start;

                // Invariant: Merge if current segment is larger or equal to top
                if (current_len < top_len) {
                    break;
                }

                // Merge top and current
                stack.pop_back();
                buffered_merge(arr, top.start, current_start, current_end, buffer);
                
                current_start = top.start;
            }

            // 3. Push new segment
            stack.push_back({current_start, current_end});
        }

        // 4. Force merge remaining segments
        while (stack.size() > 1) {
            Segment b = stack.back(); stack.pop_back();
            Segment a = stack.back(); stack.pop_back();

            buffered_merge(arr, a.start, b.start, b.end, buffer);
            stack.push_back({a.start, b.end});
        }
    }
}

#endif // BLOCK_MERGE_SEGMENT_SORT_HPP
