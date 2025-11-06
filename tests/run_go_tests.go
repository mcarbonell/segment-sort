// To run this test:
// go run run_go_tests.go ../implementations/go/segmentsort.go

package main

import (
	"fmt"
	"reflect"
)

type TestCase struct {
	name     string
	input    []int
	expected []int
}

func runTests() {
	testCases := []TestCase{
		{"Empty array", []int{}, []int{}},
		{"Single element array", []int{42}, []int{42}},
		{"Already sorted array", []int{1, 2, 3, 4, 5, 6, 7, 8, 9}, []int{1, 2, 3, 4, 5, 6, 7, 8, 9}},
		{"Reverse sorted array", []int{9, 8, 7, 6, 5, 4, 3, 2, 1}, []int{1, 2, 3, 4, 5, 6, 7, 8, 9}},
		{"Array with all identical elements", []int{5, 5, 5, 5, 5}, []int{5, 5, 5, 5, 5}},
		{"Array with duplicate elements", []int{5, 3, 8, 3, 5, 1, 8}, []int{1, 3, 3, 5, 5, 8, 8}},
		{"Typical unsorted array", []int{5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18}, []int{2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 17, 18, 19}},
		{"Array with negative numbers", []int{-5, 3, -8, 0, -1, 10}, []int{-8, -5, -1, 0, 3, 10}},
		{"Mixed positive and negative with duplicates", []int{10, -2, 5, -2, 0, 5, 10, -8}, []int{-8, -2, -2, 0, 5, 5, 10, 10}},
		{"Longer random-like array", []int{31, 41, 59, 26, 53, 58, 97, 93, 23, 84}, []int{23, 26, 31, 41, 53, 58, 59, 84, 93, 97}},
	}

	sorٹر := &SegmentSort{}
	passed := 0
	failed := 0

	fmt.Println("Running tests for SegmentSort in Go...\n")

	for i, tc := range testCases {
		// Create a copy to avoid modifying the original test case data
		arrayToSort := make([]int, len(tc.input))
		copy(arrayToSort, tc.input)

		sorter.Sort(arrayToSort)

		if reflect.DeepEqual(arrayToSort, tc.expected) {
			fmt.Printf("✅ Test #%d: %s - PASSED\n", i+1, tc.name)
			passed++
		} else {
			fmt.Printf("❌ Test #%d: %s - FAILED\n", i+1, tc.name)
			fmt.Printf("   Expected: %v\n", tc.expected)
			fmt.Printf("   Got:      %v\n", arrayToSort)
			failed++
		}
	}

	fmt.Println("\n--------------------")
	fmt.Println("Test Summary:")
	fmt.Printf("  %d passed\n", passed)
	fmt.Printf("  %d failed\n", failed)
	fmt.Println("--------------------\n")

	if failed > 0 {
		// os.Exit(1)
	}
}

func main() {
	runTests()
}
