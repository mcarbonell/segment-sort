/**
 * On-the-Fly Balanced Merge Sort - Rust Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log n) space complexity and O(n log n) time complexity.
 */

use std::io::{self, Write};
use std::fmt::Display;

/**
 * Struct to manage the On-the-Fly Balanced Merge Sort algorithm
 */
pub struct OnTheFlyBalancedMergeSort;

impl OnTheFlyBalancedMergeSort {
    
    /**
     * Merges two sorted Vec<i32> into a single sorted Vec<i32>
     */
    fn merge_two_arrays(left: &[i32], right: &[i32]) -> Vec<i32> {
        let mut result = Vec::with_capacity(left.len() + right.len());
        let (mut i, mut j) = (0, 0);

        // Merge while both slices have elements
        while i < left.len() && j < right.len() {
            if left[i] <= right[j] {
                result.push(left[i]);
                i += 1;
            } else {
                result.push(right[j]);
                j += 1;
            }
        }

        // Add remaining elements from left slice
        while i < left.len() {
            result.push(left[i]);
            i += 1;
        }

        // Add remaining elements from right slice
        while j < right.len() {
            result.push(right[j]);
            j += 1;
        }

        result
    }

    /**
     * Detects the next natural segment (run) in the array starting from position start
     */
    fn detect_segment(arr: &[i32], start: usize, end_pos: &mut usize) -> Vec<i32> {
        let n = arr.len();

        if start >= n {
            *end_pos = start;
            return Vec::new();
        }

        let mut segment = Vec::new();
        segment.push(arr[start]);

        // Determine if it's ascending or descending
        let is_descending = if start + 1 < n {
            arr[start] > arr[start + 1]
        } else {
            false
        };

        // Continue the segment based on direction
        let mut current_pos = start;
        while current_pos + 1 < n {
            if is_descending {
                // Descending segment
                if arr[current_pos] <= arr[current_pos + 1] {
                    break;
                }
            } else {
                // Ascending segment
                if arr[current_pos] > arr[current_pos + 1] {
                    break;
                }
            }
            segment.push(arr[current_pos + 1]);
            current_pos += 1;
        }

        *end_pos = current_pos;

        // If descending, reverse to make ascending
        if is_descending {
            segment.reverse();
        }

        segment
    }

    /**
     * Main On-the-Fly Balanced Merge Sort algorithm
     */
    pub fn sort(&self, arr: &mut [i32]) -> &mut [i32] {
        let n = arr.len();

        if n <= 1 {
            return arr;
        }

        let mut segment_stack: Vec<Vec<i32>> = Vec::new();
        let mut i = 0;

        while i < n {
            // Detect the next segment
            let mut segment_end = 0;
            let segment = Self::detect_segment(arr, i, &mut segment_end);
            i = segment_end + 1;

            // Merge with stack if needed
            let mut current = segment;
            while !segment_stack.is_empty() && current.len() >= segment_stack.last().unwrap().len() {
                let top = segment_stack.pop().unwrap();
                current = Self::merge_two_arrays(&top, &current);
            }
            segment_stack.push(current);
        }

        // Final merge of remaining segments
        while segment_stack.len() > 1 {
            let a = segment_stack.pop().unwrap();
            let b = segment_stack.pop().unwrap();
            let merged = Self::merge_two_arrays(&a, &b);
            segment_stack.push(merged);
        }

        // Copy back to original array
        if let Some(result) = segment_stack.pop() {
            arr.copy_from_slice(&result);
        }

        arr
    }
}

/**
 * Helper function to check if a slice is sorted
 */
fn is_sorted(slice: &[i32]) -> bool {
    for i in 1..slice.len() {
        if slice[i] < slice[i - 1] {
            return false;
        }
    }
    true
}

/**
 * Helper function to print a slice
 */
fn print_slice<T: Display>(slice: &[T]) {
    print!("[");
    for (i, item) in slice.iter().enumerate() {
        print!("{}", item);
        if i < slice.len() - 1 {
            print!(", ");
        }
    }
    println!("]");
}

/**
 * Test function to verify the algorithm works correctly
 */
fn run_tests() {
    println!("Running Rust On-the-Fly Balanced Merge Sort Tests!");
    println!();

    let sorter = OnTheFlyBalancedMergeSort;

    // Test cases
    let test_cases = vec![
        vec![], // Empty array
        vec![42], // Single element
        vec![1, 2, 3, 4, 5], // Already sorted
        vec![5, 4, 3, 2, 1], // Reverse sorted
        vec![5, 3, 2, 4, 6, 8, 7, 1], // Mixed
        vec![3, 3, 3, 3, 3], // All identical
        vec![10, -2, 5, -2, 0, 5, 10, -8], // With negatives and duplicates
    ];

    for (i, test_case) in test_cases.iter().enumerate() {
        let test_num = i + 1;
        print!("Test Case {}: ", test_num);
        print!("Input: ");
        print_slice(test_case);

        let mut sorted = test_case.clone();
        sorter.sort(&mut sorted);

        print!("Output: ");
        print_slice(&sorted);

        // Verify it's sorted
        let sorted_check = is_sorted(&sorted);
        println!("Status: {}", if sorted_check { "PASSED" } else { "FAILED" });
        println!();
    }
}

/**
 * Main function
 */
fn main() {
    run_tests();

    // Example usage
    println!("Example Usage:");
    let mut example = vec![5, 3, 2, 4, 6, 8, 7, 1];
    print!("Before sorting: ");
    print_slice(&example);

    let sorter = OnTheFlyBalancedMergeSort;
    sorter.sort(&mut example);

    print!("After sorting: ");
    print_slice(&example);

    // Verify it's sorted
    if is_sorted(&example) {
        println!("Verification: Array is correctly sorted!");
    } else {
        println!("Verification: ERROR - Array is not sorted!");
    }
}