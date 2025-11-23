/**
 * Block Merge Segment Sort - C Implementation (Gold Optimized Version)
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * Optimizations applied:
 * 1. Block Memcpy for buffer operations (SIMD friendly).
 * 2. Flat Run Detection (O(1) merge for duplicate sequences).
 * 3. Optimized loop conditions.
 */

#ifndef BLOCK_MERGE_SEGMENT_SORT_H
#define BLOCK_MERGE_SEGMENT_SORT_H

#include <stdlib.h>
#include <string.h>
#include <stdio.h>

// Fixed buffer size: 64K elements (256KB for 32-bit ints) matches L2 Cache sweet spot.
#define BLOCK_MERGE_DEFAULT_BUFFER_SIZE 65536

// Stack structure with "Flat Run" metadata
typedef struct {
    size_t start;
    size_t end;
    int is_flat;    // 1 if all elements in segment are equal
    int flat_val;   // The value of the elements (if flat)
} bm_run_t;

// Helper: Reverse a slice
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

// Helper: Smart Segment Detection (Handles Flat Runs)
// Returns: 1 if segment is "flat" (all duplicates), 0 otherwise.
static int bm_detect_segment_enhanced(int* arr, size_t start, size_t n, size_t* out_end, int* out_val) {
    if (start >= n) { *out_end = start; return 0; }
    size_t end = start + 1;
    if (end >= n) { 
        *out_end = end; 
        *out_val = arr[start]; 
        return 1; // Single element is effectively flat
    }

    // OPTIMIZATION: Check for Flat Run (Duplicates) FIRST
    // This allows O(1) merging later.
    if (arr[start] == arr[end]) {
        while (end < n && arr[end] == arr[start]) {
            end++;
        }
        *out_end = end;
        *out_val = arr[start];
        return 1; // It is flat
    }

    // Descending
    if (arr[start] > arr[end]) {
        while (end < n && arr[end - 1] > arr[end]) {
            end++;
        }
        bm_reverse_slice(arr, start, end);
        return 0; // Not flat
    }

    // Ascending
    // Note: We use <= here to maintain long runs in Random data.
    // Pure duplicates are caught by the first check.
    while (end < n && arr[end - 1] <= arr[end]) {
        end++;
    }
    *out_end = end;
    return 0; // Not flat
}

// Helper: Binary Search (Lower Bound)
static size_t bm_lower_bound(int* arr, size_t first, size_t last, int value) {
    size_t count = last - first;
    while (count > 0) {
        size_t step = count / 2;
        size_t it = first + step;
        if (arr[it] < value) {
            first = ++it;
            count -= step + 1;
        } else {
            count = step;
        }
    }
    return first;
}

// Helper: Rotate
static void bm_rotate_range(int* arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) return;
    bm_reverse_slice(arr, first, middle);
    bm_reverse_slice(arr, middle, last);
    bm_reverse_slice(arr, first, last);
}

// Helper: Merge with Buffer (Left optimization)
static void bm_merge_with_buffer_left(int* arr, size_t first, size_t middle, size_t last, int* buffer) {
    size_t len1 = middle - first;
    
    // OPTIMIZATION: Memcpy is faster than loop
    memcpy(buffer, &arr[first], len1 * sizeof(int));

    size_t i = 0;      // buffer index
    size_t j = middle; // right part index
    size_t k = first;  // dest index

    // Standard merge loop
    while (i < len1 && j < last) {
        if (buffer[i] <= arr[j]) {
            arr[k++] = buffer[i++];
        } else {
            arr[k++] = arr[j++];
        }
    }
    
    // OPTIMIZATION: Only copy remaining buffer. 
    // Remaining 'arr' elements are already in place.
    if (i < len1) {
        memcpy(&arr[k], &buffer[i], (len1 - i) * sizeof(int));
    }
}

// Helper: Merge with Buffer (Right optimization)
static void bm_merge_with_buffer_right(int* arr, size_t first, size_t middle, size_t last, int* buffer) {
    size_t len2 = last - middle;
    
    // OPTIMIZATION: Memcpy
    memcpy(buffer, &arr[middle], len2 * sizeof(int));

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
    
    // Copy remaining buffer
    if (j >= 0) {
        memcpy(&arr[first], buffer, (size_t)(j + 1) * sizeof(int));
    }
}

// Core: Buffered Merge (Hybrid)
static void bm_buffered_merge(int* arr, size_t first, size_t middle, size_t last, int* buffer, size_t buffer_size) {
    if (first >= middle || middle >= last) return;
    
    // Optimization: Skip if already sorted
    if (arr[middle - 1] <= arr[middle]) return;

    size_t len1 = middle - first;
    size_t len2 = last - middle;

    // Strategy 1: Use buffer (Linear Time)
    if (len1 <= buffer_size) {
        bm_merge_with_buffer_left(arr, first, middle, last, buffer);
        return;
    }
    if (len2 <= buffer_size) {
        bm_merge_with_buffer_right(arr, first, middle, last, buffer);
        return;
    }

    // Strategy 2: SymMerge (In-Place via Rotation)
    size_t mid1 = first + len1 / 2;
    int value = arr[mid1];
    size_t mid2 = bm_lower_bound(arr, middle, last, value);
    
    size_t newMid = mid1 + (mid2 - middle);
    
    bm_rotate_range(arr, mid1, middle, mid2);
    
    bm_buffered_merge(arr, first, mid1, newMid, buffer, buffer_size);
    bm_buffered_merge(arr, newMid + 1, mid2, last, buffer, buffer_size);
}

/**
 * @brief Block Merge Segment Sort (Gold Optimized)
 */
void block_merge_segment_sort(int* arr, size_t n) {
    if (n <= 1) return;

    size_t buffer_size = BLOCK_MERGE_DEFAULT_BUFFER_SIZE;
    
    // Dynamic allocation (fallback safe)
    int* buffer = (int*)malloc(buffer_size * sizeof(int));
    if (!buffer) {
        buffer_size = 512; // Emergency small buffer
        buffer = (int*)malloc(buffer_size * sizeof(int));
        if (!buffer) return; 
    }
    
    // Stack for runs
    bm_run_t stack[128];
    int stack_top = 0;

    size_t i = 0;
    while (i < n) {
        // 1. Detect next run (with Flat detection)
        size_t end;
        int val = 0;
        int is_flat = bm_detect_segment_enhanced(arr, i, n, &end, &val);
        
        bm_run_t current;
        current.start = i;
        current.end = end;
        current.is_flat = is_flat;
        current.flat_val = val;
        
        i = end;

        // 2. Balance Loop
        while (stack_top > 0) {
            bm_run_t top = stack[stack_top - 1];
            size_t top_len = top.end - top.start;
            size_t current_len = current.end - current.start;

            // Invariant: merge if current >= top
            if (current_len < top_len) {
                break;
            }

            // OPTIMIZATION: O(1) Merge for consecutive Flat Runs
            if (top.is_flat && current.is_flat && top.flat_val == current.flat_val) {
                // Do nothing! Just extend the top run.
                // No memory movement, no comparisons.
                stack[stack_top - 1].end = current.end;
                // Current becomes the extended top, loop continues to check next stack item
                current = stack[stack_top - 1]; 
                // Stack pointer stays same (we just modified top in place)
                // But we need to update logic: we merged 'current' INTO 'stack', 
                // effectively 'current' is gone. But the loop expects 'current' to be the result.
                // We do NOT decrement stack_top here because we are still holding 'current' 
                // conceptually as the result of the merge to compare against stack_top-2.
                
                // Actually, easier logic:
                // 1. Modify stack top.
                // 2. "Pop" (virtually) and continue loop with new size.
                
                // Re-fetch modified top as 'current' for next iteration
                current = stack[stack_top - 1];
                stack_top--; // Pop it to compare with the one below
            } 
            else {
                // Standard Block Merge
                bm_buffered_merge(arr, top.start, current.start, current.end, buffer, buffer_size);
                
                // Result is a new mixed run (not flat usually)
                current.start = top.start;
                current.is_flat = 0; // Merged result is likely not flat
                stack_top--;
            }
        }

        // 3. Push result
        stack[stack_top++] = current;
    }

    // 4. Force Merge Remaining
    while (stack_top > 1) {
        bm_run_t right = stack[stack_top - 1];
        bm_run_t left = stack[stack_top - 2];
        
        // Check Flat Merge again (for the final cleanup)
        if (left.is_flat && right.is_flat && left.flat_val == right.flat_val) {
            stack[stack_top - 2].end = right.end;
        } else {
            bm_buffered_merge(arr, left.start, right.start, right.end, buffer, buffer_size);
            stack[stack_top - 2].end = right.end;
            stack[stack_top - 2].is_flat = 0;
        }
        stack_top--;
    }
    
    free(buffer);
}

#endif // BLOCK_MERGE_SEGMENT_SORT_H