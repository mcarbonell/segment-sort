package main

import (
	"fmt"
	"sort"
)

/**
 * On-the-Fly Balanced Merge Sort - Go Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log n) space complexity and O(n log n) time complexity.
 */

/**
 * Merges two sorted slices into a single sorted slice
 */
func mergeTwoArrays(left, right []int) []int {
	result := make([]int, 0, len(left)+len(right))
	i, j := 0, 0

	// Merge while both slices have elements
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			result = append(result, left[i])
			i++
		} else {
			result = append(result, right[j])
			j++
		}
	}

	// Add remaining elements from left slice
	for i < len(left) {
		result = append(result, left[i])
		i++
	}

	// Add remaining elements from right slice
	for j < len(right) {
		result = append(result, right[j])
		j++
	}

	return result
}

/**
 * Detects the next natural segment (run) in the array starting from position start
 */
func detectSegment(arr []int, start int) ([]int, int) {
	var segment []int
	n := len(arr)

	if start >= n {
		return segment, start
	}

	// Add first element
	segment = append(segment, arr[start])

	// Determine if it's ascending or descending
	isDescending := false
	if start+1 < n {
		isDescending = arr[start] > arr[start+1]
	}

	// Continue the segment based on direction
	for start+1 < n {
		if isDescending {
			// Descending segment
			if arr[start] <= arr[start+1] {
				break
			}
		} else {
			// Ascending segment
			if arr[start] > arr[start+1] {
				break
			}
		}
		segment = append(segment, arr[start+1])
		start++
	}

	// If descending, reverse to make ascending
	if isDescending {
		reverseSlice(segment)
	}

	return segment, start
}

/**
 * Helper function to reverse a slice in-place
 */
func reverseSlice(slice []int) {
	for i, j := 0, len(slice)-1; i < j; i, j = i+1, j-1 {
		slice[i], slice[j] = slice[j], slice[i]
	}
}

/**
 * Main On-the-Fly Balanced Merge Sort algorithm
 */
func OnTheFlyBalancedMergeSort(arr []int) []int {
	n := len(arr)

	if n <= 1 {
		return arr
	}

	var segmentStack [][]int
	i := 0

	for i < n {
		// Detect the next segment
		segment, segmentEnd := detectSegment(arr, i)
		i = segmentEnd + 1

		// Merge with stack if needed
		current := segment
		for len(segmentStack) > 0 && len(current) >= len(segmentStack[len(segmentStack)-1]) {
			top := segmentStack[len(segmentStack)-1]
			segmentStack = segmentStack[:len(segmentStack)-1]
			current = mergeTwoArrays(top, current)
		}
		segmentStack = append(segmentStack, current)
	}

	// Final merge of remaining segments
	for len(segmentStack) > 1 {
		a := segmentStack[len(segmentStack)-1]
		segmentStack = segmentStack[:len(segmentStack)-1]
		b := segmentStack[len(segmentStack)-1]
		segmentStack = segmentStack[:len(segmentStack)-1]
		merged := mergeTwoArrays(a, b)
		segmentStack = append(segmentStack, merged)
	}

	// Copy back to original array
	if len(segmentStack) > 0 {
		copy(arr, segmentStack[0])
	}

	return arr
}

/**
 * Helper function to print a slice
 */
func printSlice(slice []int) {
	fmt.Print("[")
	for i, v := range slice {
		fmt.Print(v)
		if i < len(slice)-1 {
			fmt.Print(", ")
		}
	}
	fmt.Println("]")
}

/**
 * Check if a slice is sorted
 */
func isSorted(slice []int) bool {
	for i := 1; i < len(slice); i++ {
		if slice[i] < slice[i-1] {
			return false
		}
	}
	return true
}

/**
 * Test function to verify the algorithm works correctly
 */
func runTests() {
	fmt.Println("Running Go On-the-Fly Balanced Merge Sort Tests...")
	fmt.Println()

	testCases := [][][]int{
		{},                                        // Empty array
		{{42}},                                    // Single element
		{{1, 2, 3, 4, 5}},                        // Already sorted
		{{5, 4, 3, 2, 1}},                        // Reverse sorted
		{{5, 3, 2, 4, 6, 8, 7, 1}},              // Mixed
		{{3, 3, 3, 3, 3}},                        // All identical
		{{10, -2, 5, -2, 0, 5, 10, -8}},         // With negatives and duplicates
	}

	for i, testCase := range testCases {
		testNum := i + 1
		fmt.Printf("Test Case %d: ", testNum)
		fmt.Print("Input: ")
		printSlice(testCase[0])

		sorted := make([]int, len(testCase[0]))
		copy(sorted, testCase[0])
		sorted = OnTheFlyBalancedMergeSort(sorted)

		fmt.Print("Output: ")
		printSlice(sorted)

		// Verify it's sorted
		isSorted := isSorted(sorted)
		status := "PASSED"
		if !isSorted {
			status = "FAILED"
		}
		fmt.Printf("Status: %s\n", status)
		fmt.Println()
	}
}

func main() {
	runTests()

	// Example usage
	fmt.Println("Example Usage:")
	example := []int{5, 3, 2, 4, 6, 8, 7, 1}
	fmt.Print("Before sorting: ")
	printSlice(example)

	OnTheFlyBalancedMergeSort(example)

	fmt.Print("After sorting: ")
	printSlice(example)

	// Verify it's sorted
	if isSorted(example) {
		fmt.Println("Verification: Array is correctly sorted!")
	} else {
		fmt.Println("Verification: ERROR - Array is not sorted!")
	}
}