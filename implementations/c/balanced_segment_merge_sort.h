/**
 * On-the-Fly Balanced Merge Sort - C Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log n) space complexity and O(n log n) time complexity.
 */
 
#ifndef SEGMENT_SORT_H
#define SEGMENT_SORT_H

#include <stddef.h>
#include <stdbool.h>

// Define the data type for sorting.
typedef int ElementType;

// Comparison function macros
#define LEQ(a, b) ((a) <= (b))
#define LT(a, b)  ((a) < (b))
#define GT(a, b)  ((a) > (b))

// Structure to represent a segment [start, end)
typedef struct {
    size_t start;
    size_t end;
} Segment;

// Maximum stack depth. 64 is sufficient for any array size on 64-bit systems.
#define MAX_STACK_SIZE 64

// Helper: Reverse array range [start, end)
static void reverse_slice(ElementType* arr, size_t start, size_t end) {
    if (start >= end) return;
    size_t i = start;
    size_t j = end - 1;
    while (i < j) {
        ElementType tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        i++;
        j--;
    }
}

// Helper: Rotates [first, last) so that 'middle' becomes the new 'first'.
static void rotate_range(ElementType* arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) return;
    reverse_slice(arr, first, middle);
    reverse_slice(arr, middle, last);
    reverse_slice(arr, first, last);
}

// Helper: Lower bound binary search.
static size_t lower_bound(ElementType* arr, size_t first, size_t last, ElementType value) {
    size_t len = last - first;
    while (len > 0) {
        size_t half = len / 2;
        size_t mid = first + half;
        if (LT(arr[mid], value)) {
            first = mid + 1;
            len = len - half - 1;
        } else {
            len = half;
        }
    }
    return first;
}

// Core: In-place stable merge using block rotations (Symmerge).
static void symmerge(ElementType* arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) return;
    
    size_t len1 = middle - first;
    size_t len2 = last - middle;

    if (len1 == 0 || len2 == 0) return;

    if (len1 + len2 == 2) {
        if (LT(arr[middle], arr[first])) {
            ElementType tmp = arr[first];
            arr[first] = arr[middle];
            arr[middle] = tmp;
        }
        return;
    }

    size_t mid1 = first + len1 / 2;
    ElementType value = arr[mid1];
    size_t mid2 = lower_bound(arr, middle, last, value);
    
    size_t new_mid = mid1 + (mid2 - middle);
    
    rotate_range(arr, mid1, middle, mid2);
    
    symmerge(arr, first, mid1, new_mid);
    symmerge(arr, new_mid + 1, mid2, last);
}

// Helper: Detects a natural run starting at 'start'.
static size_t detect_segment_indices(ElementType* arr, size_t start, size_t n) {
    if (start >= n) return start;
    if (start == n - 1) return n;

    size_t end = start + 1;
    if (GT(arr[start], arr[end])) {
        // Descending run
        while (end < n && GT(arr[end - 1], arr[end])) {
            end++;
        }
        reverse_slice(arr, start, end);
    } else {
        // Ascending run
        while (end < n && LEQ(arr[end - 1], arr[end])) {
            end++;
        }
    }
    return end;
}

// Main Algorithm Function
static void on_the_fly_balanced_merge_sort(ElementType* arr, size_t n) {
    if (!arr || n <= 1) return;

    Segment stack[MAX_STACK_SIZE];
    int stack_top = -1; 

    size_t i = 0;
    while (i < n) {
        size_t start = i;
        size_t end = detect_segment_indices(arr, start, n);
        i = end;

        size_t current_start = start;
        size_t current_end = end;

        while (stack_top >= 0) {
            Segment top = stack[stack_top];
            size_t top_len = top.end - top.start;
            size_t current_len = current_end - current_start;

            if (current_len < top_len) {
                break;
            }

            stack_top--;
            symmerge(arr, top.start, current_start, current_end);
            current_start = top.start;
        }

        stack_top++;
        stack[stack_top].start = current_start;
        stack[stack_top].end = current_end;
    }

    while (stack_top > 0) {
        Segment right = stack[stack_top];
        stack_top--;
        Segment left = stack[stack_top];
        stack_top--;

        symmerge(arr, left.start, right.start, right.end);
        
        stack_top++;
        stack[stack_top].start = left.start;
        stack[stack_top].end = right.end;
    }
}

#endif // SEGMENT_SORT_H
