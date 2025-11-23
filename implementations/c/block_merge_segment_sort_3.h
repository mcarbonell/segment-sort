/**
 * Block Merge Segment Sort - Optimized C Implementation v3
 * Author: Mario Raúl Carbonell Martínez
 * Optimizations: Adjustments for duplicate handling, cache locality and merge efficiency
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log N) space complexity and O(N log N) time complexity.
 */

#ifndef BLOCK_MERGE_SEGMENT_SORT_H
#define BLOCK_MERGE_SEGMENT_SORT_H

#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <math.h>

// Fixed buffer size for optimal performance (fits in L2 cache).
// 64K elements = 256KB for int arrays
#define BLOCK_MERGE_DEFAULT_BUFFER_SIZE 65536

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
// Optimized: Groups consecutive duplicates first to reduce merge overhead
static size_t bm_detect_segment(int* arr, size_t start, size_t n) {
    if (start >= n) return start;
    
    size_t end = start + 1;
    if (end >= n) return end;

    // First group all consecutive duplicates to avoid small runs
    const int current_val = arr[start];
    while (end < n && arr[end] == current_val) {
        end++;
    }
    if (end >= n) return end;

    // Detect run direction and expand
    if (arr[end - 1] > arr[end]) {
        // Descending run: reverse to make it ascending
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

// Helper: Find lower and upper bound for a value in a sorted range
// lower = first element >= value
// upper = first element > value
static void bm_bound_range(int* arr, size_t first, size_t last, int value, size_t* out_lower, size_t* out_upper) {
    size_t low = first;
    size_t high = last;

    // Find lower bound
    while (low < high) {
        const size_t mid = low + (high - low) / 2;
        if (arr[mid] < value) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    *out_lower = low;

    // Find upper bound from lower bound
    high = last;
    while (low < high) {
        const size_t mid = low + (high - low) / 2;
        if (arr[mid] <= value) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    *out_upper = low;
}

// Helper: Rotate range [first, middle, last)
static void bm_rotate_range(int* arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) return;
    bm_reverse_slice(arr, first, middle);
    bm_reverse_slice(arr, middle, last);
    bm_reverse_slice(arr, first, last);
}

// Helper: Merge using buffer for left part
// FIXED: Corrected duplicate handling logic
static void bm_merge_with_buffer_left(int* arr, size_t first, size_t middle, size_t last, int* buffer) {
    const size_t len1 = middle - first;
    memcpy(buffer, arr + first, len1 * sizeof(int));

    size_t i = 0;      // Buffer index
    size_t j = middle; // Right part index
    size_t k = first;  // Destination index

    while (i < len1 && j < last) {
        if (buffer[i] <= arr[j]) {
            // Copy from buffer
            const int current_val = buffer[i];
            
            // Find end of duplicate range in buffer
            size_t i_end = i;
            while (i_end < len1 && buffer[i_end] == current_val) {
                i_end++;
            }
            
            // Copy all duplicates from buffer
            const size_t copy_count = i_end - i;
            memcpy(arr + k, buffer + i, copy_count * sizeof(int));
            k += copy_count;
            i = i_end;
        } else {
            // Copy from right part
            const int current_val = arr[j];
            
            // Find end of duplicate range in right part
            size_t j_end = j;
            while (j_end < last && arr[j_end] == current_val) {
                j_end++;
            }
            
            // Copy all duplicates from right part
            const size_t copy_count = j_end - j;
            memmove(arr + k, arr + j, copy_count * sizeof(int));
            k += copy_count;
            j = j_end;
        }
    }

    // Copy remaining elements from buffer
    if (i < len1) {
        memcpy(arr + k, buffer + i, (len1 - i) * sizeof(int));
    }
}

// Helper: Merge using buffer for right part
// FIXED: Corrected duplicate handling logic
static void bm_merge_with_buffer_right(int* arr, size_t first, size_t middle, size_t last, int* buffer) {
    const size_t len2 = last - middle;
    memcpy(buffer, arr + middle, len2 * sizeof(int));

    long i = (long)middle - 1; // Left part end index
    long j = (long)len2 - 1;   // Buffer end index
    long k = (long)last - 1;   // Destination end index

    while (i >= (long)first && j >= 0) {
        if (arr[i] > buffer[j]) {
            // Copy from left part
            const int current_val = arr[i];
            
            // Find start of duplicate range in left part
            long i_start = i;
            while (i_start >= (long)first && arr[i_start] == current_val) {
                i_start--;
            }
            
            // Copy all duplicates from left part
            const size_t copy_count = i - i_start;
            memcpy(arr + k - copy_count + 1, arr + i_start + 1, copy_count * sizeof(int));
            k -= copy_count;
            i = i_start;
        } else {
            // Copy from buffer
            const int current_val = buffer[j];
            
            // Find start of duplicate range in buffer
            long j_start = j;
            while (j_start >= 0 && buffer[j_start] == current_val) {
                j_start--;
            }
            
            // Copy all duplicates from buffer
            const size_t copy_count = j - j_start;
            memcpy(arr + k - copy_count + 1, buffer + j_start + 1, copy_count * sizeof(int));
            k -= copy_count;
            j = j_start;
        }
    }

    // Copy remaining elements from buffer
    while (j >= 0) {
        arr[k--] = buffer[j--];
    }
}

// Core: Buffered Merge (Hybrid)
// Optimized: Uses bound ranges for SymMerge to handle duplicates in bulk
static void bm_buffered_merge(int* arr, size_t first, size_t middle, size_t last, int* buffer, size_t buffer_size) {
    if (first >= middle || middle >= last) return;
    
    const size_t len1 = middle - first;
    const size_t len2 = last - middle;

    // Early exit: already sorted
    if (arr[middle - 1] <= arr[middle]) return;

    // Strategy 1: Use buffer if segment fits
    if (len1 <= buffer_size) {
        bm_merge_with_buffer_left(arr, first, middle, last, buffer);
        return;
    }
    if (len2 <= buffer_size) {
        bm_merge_with_buffer_right(arr, first, middle, last, buffer);
        return;
    }

    // Strategy 2: SymMerge optimized for duplicate ranges
    const size_t mid1 = first + (middle - first) / 2;
    const int value = arr[mid1];
    size_t lower, upper;
    bm_bound_range(arr, middle, last, value, &lower, &upper);
    
    const size_t newMid = mid1 + (lower - middle);
    
    // Rotate entire duplicate range in one step
    bm_rotate_range(arr, mid1, middle, upper);
    
    bm_buffered_merge(arr, first, mid1, newMid, buffer, buffer_size);
    bm_buffered_merge(arr, newMid + 1, upper, last, buffer, buffer_size);
}

/**
 * @brief Block Merge Segment Sort (Optimized C Implementation v3)
 * 
 * A hybrid adaptive sorting algorithm that combines:
 * 1. "On-the-Fly" Segment Detection (O(N) for sorted data)
 * 2. Block Merge Strategy (Linear time merge using small buffer)
 * 
 * @details
 * This algorithm detects sorted segments and merges them using a stack-based
 * approach to maintain balance. It uses a fixed 64K element buffer (256KB)
 * to perform fast linear-time merges. If segments are too large for the buffer,
 * it falls back to a rotation-based in-place merge (SymMerge) to split them.
 * 
 * Optimizations in this version:
 * - Early grouping of consecutive duplicates to reduce small runs
 * - Bulk duplicate handling in merges to minimize comparisons (FIXED)
 * - Faster memory copies with memcpy
 * - Early merge of tiny runs (<=256 elements) to avoid stack bloat
 * - Optimized SymMerge for duplicate ranges
 * 
 * Complexity:
 * - Time: O(N log N) worst case, O(N) best case (sorted/reverse/duplicates).
 * - Space: O(1) - fixed 256KB buffer + O(log N) stack.
 * 
 * @param arr Pointer to the array to sort.
 * @param n Number of elements in the array.
 */
void block_merge_segment_sort(int* arr, size_t n) {
    if (n <= 1) return;

    const size_t buffer_size = BLOCK_MERGE_DEFAULT_BUFFER_SIZE;
    
    // Allocate dynamic buffer
    int* buffer = (int*)malloc(buffer_size * sizeof(int));
    if (!buffer) {
        // Fallback to smaller buffer if allocation fails
        const size_t fallback_buffer_size = 256;
        buffer = (int*)malloc(fallback_buffer_size * sizeof(int));
        if (!buffer) return; // Cannot sort without buffer
    }
    
    // Segment Stack: max depth is log2(N) < 128 for any practical N
    struct { size_t start; size_t end; } stack[128];
    int stack_top = 0;

    size_t i = 0;
    while (i < n) {
        // 1. Detect next sorted run
        const size_t end = bm_detect_segment(arr, i, n);
        
        size_t current_start = i;
        size_t current_end = end;
        i = end;

        // 2. Balance the stack: merge if current run is large enough, or both are tiny
        while (stack_top > 0) {
            const size_t top_idx = stack_top - 1;
            const size_t top_len = stack[top_idx].end - stack[top_idx].start;
            const size_t current_len = current_end - current_start;

            // Exit if no merge condition is met
            if (current_len < top_len && !(current_len <= 256 && top_len <= 256)) {
                break;
            }

            // Merge top of stack with current run
            bm_buffered_merge(arr, stack[top_idx].start, current_start, current_end, buffer, buffer_size);
            
            // Update current run to include merged segment
            current_start = stack[top_idx].start;
            stack_top--;
        }

        // 3. Push current run to stack
        stack[stack_top].start = current_start;
        stack[stack_top].end = current_end;
        stack_top++;
    }

    // 4. Merge all remaining segments in the stack
    while (stack_top > 1) {
        const size_t b_idx = stack_top - 1;
        const size_t a_idx = stack_top - 2;
        
        bm_buffered_merge(arr, stack[a_idx].start, stack[b_idx].start, stack[b_idx].end, buffer, buffer_size);
        
        stack[a_idx].end = stack[b_idx].end;
        stack_top--;
    }
    
    // Free the dynamic buffer
    free(buffer);
}

#endif // BLOCK_MERGE_SEGMENT_SORT_H