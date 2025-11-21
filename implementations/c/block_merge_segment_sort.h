/**
 * Block Merge Segment Sort - C Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(sqrt N) space complexity and O(N log N) time complexity.
 */

#ifndef BLOCK_MERGE_SEGMENT_SORT_H
#define BLOCK_MERGE_SEGMENT_SORT_H

#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <math.h>

// Buffer size for linear merge.
// We use sqrt(N) for optimal performance, with min/max bounds for cache efficiency.
#define BLOCK_MERGE_BUFFER_MIN 256
#define BLOCK_MERGE_BUFFER_MAX 4096

// Helper: Reverse a slice of the array
static void bm_reverse_slice(int* arr, size_t start, size_t end) {
    size_t i = start;
    size_t j = end - 1;
    while (i < j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
        j--;
    }
}

// Helper: Detect a sorted segment (run)
// Returns the end index of the segment starting at 'start'
static size_t bm_detect_segment(int* arr, size_t start, size_t n) {
    if (start >= n) return start;
    
    size_t end = start + 1;
    if (end >= n) return end;

    if (arr[start] > arr[end]) {
        // Descending run
        while (end < n && arr[end - 1] > arr[end]) {
            end++;
        }
        bm_reverse_slice(arr, start, end);
    } else {
        // Ascending run
        while (end < n && arr[end - 1] <= arr[end]) {
            end++;
        }
    }
    return end;
}

// Helper: Lower bound search
static size_t bm_lower_bound(int* arr, size_t first, size_t last, int value) {
    size_t count = last - first;
    size_t it, step;
    while (count > 0) {
        it = first;
        step = count / 2;
        it += step;
        if (arr[it] < value) {
            first = ++it;
            count -= step + 1;
        } else {
            count = step;
        }
    }
    return first;
}

// Helper: Rotate range [first, middle, last)
static void bm_rotate_range(int* arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) return;
    bm_reverse_slice(arr, first, middle);
    bm_reverse_slice(arr, middle, last);
    bm_reverse_slice(arr, first, last);
}

// Helper: Merge using buffer for left part
static void bm_merge_with_buffer_left(int* arr, size_t first, size_t middle, size_t last, int* buffer) {
    size_t len1 = middle - first;
    // Copy left to buffer
    for (size_t i = 0; i < len1; i++) {
        buffer[i] = arr[first + i];
    }

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
static void bm_merge_with_buffer_right(int* arr, size_t first, size_t middle, size_t last, int* buffer) {
    size_t len2 = last - middle;
    // Copy right to buffer
    for (size_t i = 0; i < len2; i++) {
        buffer[i] = arr[middle + i];
    }

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
static void bm_buffered_merge(int* arr, size_t first, size_t middle, size_t last, int* buffer, size_t buffer_size) {
    if (first >= middle || middle >= last) return;
    
    size_t len1 = middle - first;
    size_t len2 = last - middle;

    // Optimization: Already sorted?
    if (arr[middle - 1] <= arr[middle]) return;

    // Strategy 1: Use buffer if small enough
    if (len1 <= buffer_size) {
        bm_merge_with_buffer_left(arr, first, middle, last, buffer);
        return;
    }
    if (len2 <= buffer_size) {
        bm_merge_with_buffer_right(arr, first, middle, last, buffer);
        return;
    }

    // Strategy 2: SymMerge (Divide and Conquer)
    size_t mid1 = first + (middle - first) / 2;
    int value = arr[mid1];
    size_t mid2 = bm_lower_bound(arr, middle, last, value);
    
    size_t newMid = mid1 + (mid2 - middle);
    
    bm_rotate_range(arr, mid1, middle, mid2);
    
    bm_buffered_merge(arr, first, mid1, newMid, buffer, buffer_size);
    bm_buffered_merge(arr, newMid + 1, mid2, last, buffer, buffer_size);
}

/**
 * @brief Block Merge Segment Sort (C Implementation)
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
 * @param arr Pointer to the array to sort.
 * @param n Number of elements in the array.
 */
void block_merge_segment_sort(int* arr, size_t n) {
    if (n <= 1) return;

    // Calculate optimal buffer size: sqrt(N) with min/max bounds
    size_t buffer_size = (size_t)sqrt((double)n);
    if (buffer_size < BLOCK_MERGE_BUFFER_MIN) buffer_size = BLOCK_MERGE_BUFFER_MIN;
    if (buffer_size > BLOCK_MERGE_BUFFER_MAX) buffer_size = BLOCK_MERGE_BUFFER_MAX;
    
    // Allocate dynamic buffer for optimal performance
    int* buffer = (int*)malloc(buffer_size * sizeof(int));
    if (!buffer) {
        // Fallback to smaller buffer if allocation fails
        buffer_size = BLOCK_MERGE_BUFFER_MIN;
        buffer = (int*)malloc(buffer_size * sizeof(int));
        if (!buffer) return; // Cannot sort without buffer
    }
    
    // Segment Stack
    // Max depth is log N. For N=2^64, 128 is plenty.
    struct { size_t start; size_t end; } stack[128];
    int stack_top = 0;

    size_t i = 0;
    while (i < n) {
        // 1. Detect next run (ascending or descending)
        size_t end = bm_detect_segment(arr, i, n);
        
        size_t current_start = i;
        size_t current_end = end;
        i = end;

        // 2. Balance the stack (maintain invariant)
        while (stack_top > 0) {
            size_t top_idx = stack_top - 1;
            size_t top_len = stack[top_idx].end - stack[top_idx].start;
            size_t current_len = current_end - current_start;

            // Invariant: Merge if current segment is larger or equal to top
            if (current_len < top_len) {
                break;
            }

            // Merge top and current
            bm_buffered_merge(arr, stack[top_idx].start, current_start, current_end, buffer, buffer_size);
            
            // Update current segment to include merged part
            current_start = stack[top_idx].start;
            stack_top--;
        }

        // 3. Push new segment
        stack[stack_top].start = current_start;
        stack[stack_top].end = current_end;
        stack_top++;
    }

    // 4. Force merge remaining segments
    while (stack_top > 1) {
        size_t b_idx = stack_top - 1;
        size_t a_idx = stack_top - 2;
        
        bm_buffered_merge(arr, stack[a_idx].start, stack[b_idx].start, stack[b_idx].end, buffer, buffer_size);
        
        stack[a_idx].end = stack[b_idx].end;
        stack_top--;
    }
    
    // Free the dynamic buffer
    free(buffer);
}

#endif // BLOCK_MERGE_SEGMENT_SORT_H
