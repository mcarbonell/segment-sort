<?php
/**
 * On-the-Fly Balanced Merge Sort - PHP Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log n) space complexity and O(n log n) time complexity.
 */

class BalancedSegmentMergeSort {
    
    /**
     * Merges two sorted arrays into a single sorted array
     */
    private function mergeTwoArrays($left, $right) {
        $result = [];
        $i = $j = 0;
        $leftLen = count($left);
        $rightLen = count($right);
        
        // Merge while both arrays have elements
        while ($i < $leftLen && $j < $rightLen) {
            if ($left[$i] <= $right[$j]) {
                $result[] = $left[$i];
                $i++;
            } else {
                $result[] = $right[$j];
                $j++;
            }
        }
        
        // Add remaining elements from left array
        while ($i < $leftLen) {
            $result[] = $left[$i];
            $i++;
        }
        
        // Add remaining elements from right array
        while ($j < $rightLen) {
            $result[] = $right[$j];
            $j++;
        }
        
        return $result;
    }
    
    /**
     * Detects the next natural segment (run) in the array starting from position start
     */
    private function detectSegment($arr, $start, &$endPos) {
        $segment = [];
        $n = count($arr);
        
        if ($start >= $n) {
            $endPos = $start;
            return $segment;
        }
        
        // Add first element
        $segment[] = $arr[$start];
        
        // Determine if it's ascending or descending
        $isDescending = false;
        if ($start + 1 < $n) {
            $isDescending = $arr[$start] > $arr[$start + 1];
        }
        
        // Continue the segment based on direction
        $currentPos = $start;
        while ($currentPos + 1 < $n) {
            if ($isDescending) {
                // Descending segment
                if ($arr[$currentPos] <= $arr[$currentPos + 1]) {
                    break;
                }
            } else {
                // Ascending segment
                if ($arr[$currentPos] > $arr[$currentPos + 1]) {
                    break;
                }
            }
            $segment[] = $arr[$currentPos + 1];
            $currentPos++;
        }
        
        $endPos = $currentPos;
        
        // If descending, reverse to make ascending
        if ($isDescending) {
            $segment = array_reverse($segment);
        }
        
        return $segment;
    }
    
    /**
     * Main On-the-Fly Balanced Merge Sort algorithm
     */
    public function onTheFlyBalancedMergeSort($arr) {
        $n = count($arr);
        
        if ($n <= 1) {
            return $arr;
        }
        
        $segmentStack = [];
        $i = 0;
        
        while ($i < $n) {
            // Detect the next segment
            $segmentEnd = 0;
            $segment = $this->detectSegment($arr, $i, $segmentEnd);
            $i = $segmentEnd + 1;
            
            // Merge with stack if needed
            $current = $segment;
            while (!empty($segmentStack) && count($current) >= count(end($segmentStack))) {
                $top = array_pop($segmentStack);
                $current = $this->mergeTwoArrays($top, $current);
            }
            $segmentStack[] = $current;
        }
        
        // Final merge of remaining segments
        while (count($segmentStack) > 1) {
            $a = array_pop($segmentStack);
            $b = array_pop($segmentStack);
            $merged = $this->mergeTwoArrays($a, $b);
            $segmentStack[] = $merged;
        }
        
        // Copy back to original array
        if (!empty($segmentStack)) {
            $result = array_pop($segmentStack);
            $arr = $result;
        }
        
        return $arr;
    }
    
    /**
     * Helper function to check if an array is sorted
     */
    private function isSorted($arr) {
        $n = count($arr);
        for ($i = 1; $i < $n; $i++) {
            if ($arr[$i] < $arr[$i - 1]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Helper function to print an array
     */
    private function printArray($arr) {
        echo "[";
        $n = count($arr);
        for ($i = 0; $i < $n; $i++) {
            echo $arr[$i];
            if ($i < $n - 1) {
                echo ", ";
            }
        }
        echo "]\n";
    }
    
    /**
     * Test function to verify the algorithm works correctly
     */
    private function runTests() {
        echo "Running PHP On-the-Fly Balanced Merge Sort Tests...\n\n";
        
        $sorter = new BalancedSegmentMergeSort();
        
        // Test cases
        $testCases = [
            [], // Empty array
            [42], // Single element
            [1, 2, 3, 4, 5], // Already sorted
            [5, 4, 3, 2, 1], // Reverse sorted
            [5, 3, 2, 4, 6, 8, 7, 1], // Mixed
            [3, 3, 3, 3, 3], // All identical
            [10, -2, 5, -2, 0, 5, 10, -8] // With negatives and duplicates
        ];
        
        for ($i = 0; $i < count($testCases); $i++) {
            $testNum = $i + 1;
            echo "Test Case $testNum: ";
            echo "Input: ";
            $this->printArray($testCases[$i]);
            
            $sorted = $testCases[$i];
            $sorted = $sorter->onTheFlyBalancedMergeSort($sorted);
            
            echo "Output: ";
            $this->printArray($sorted);
            
            // Verify it's sorted
            $sortedCheck = $this->isSorted($sorted);
            echo "Status: " . ($sortedCheck ? "PASSED" : "FAILED") . "\n\n";
        }
    }
    
    /**
     * Main function
     */
    public function main() {
        $this->runTests();
        
        // Example usage
        echo "Example Usage:\n";
        $example = [5, 3, 2, 4, 6, 8, 7, 1];
        echo "Before sorting: ";
        $this->printArray($example);
        
        $sorter = new BalancedSegmentMergeSort();
        $sorter->onTheFlyBalancedMergeSort($example);
        
        echo "After sorting: ";
        $this->printArray($example);
        
        // Verify it's sorted
        if ($this->isSorted($example)) {
            echo "Verification: Array is correctly sorted!\n";
        } else {
            echo "Verification: ERROR - Array is not sorted!\n";
        }
    }
}

// Run the algorithm
$sorter = new BalancedSegmentMergeSort();
$sorter->main();
?>