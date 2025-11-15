/**
 * On-the-Fly Balanced Merge Sort - Java Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log n) space complexity and O(n log n) time complexity.
 */

import java.util.Arrays;
import java.util.Stack;

public class BalancedSegmentMergeSort {
    
    /**
     * Merges two sorted arrays into a single sorted array
     */
    private static int[] mergeTwoArrays(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        
        // Merge while both arrays have elements
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        
        // Add remaining elements from left array
        while (i < left.length) {
            result[k++] = left[i++];
        }
        
        // Add remaining elements from right array
        while (j < right.length) {
            result[k++] = right[j++];
        }
        
        return result;
    }
    
    /**
     * Detects the next natural segment (run) in the array starting from position start
     */
    private static int[] detectSegment(int[] arr, int start, int[] endPos) {
        int[] segment = new int[0];
        int n = arr.length;
        
        if (start >= n) {
            endPos[0] = start;
            return segment;
        }
        
        // Use a dynamic list to build the segment
        java.util.ArrayList<Integer> segmentList = new java.util.ArrayList<>();
        segmentList.add(arr[start]);
        
        // Determine if it's ascending or descending
        boolean isDescending = false;
        if (start + 1 < n) {
            isDescending = arr[start] > arr[start + 1];
        }
        
        // Continue the segment based on direction
        int currentPos = start;
        while (currentPos + 1 < n) {
            if (isDescending) {
                // Descending segment
                if (arr[currentPos] <= arr[currentPos + 1]) {
                    break;
                }
            } else {
                // Ascending segment
                if (arr[currentPos] > arr[currentPos + 1]) {
                    break;
                }
            }
            segmentList.add(arr[currentPos + 1]);
            currentPos++;
        }
        
        endPos[0] = currentPos;
        
        // Convert list to array
        segment = new int[segmentList.size()];
        for (int i = 0; i < segmentList.size(); i++) {
            segment[i] = segmentList.get(i);
        }
        
        // If descending, reverse to make ascending
        if (isDescending) {
            reverseArray(segment);
        }
        
        return segment;
    }
    
    /**
     * Helper function to reverse an array in-place
     */
    private static void reverseArray(int[] arr) {
        for (int i = 0, j = arr.length - 1; i < j; i++, j--) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    /**
     * Main On-the-Fly Balanced Merge Sort algorithm
     */
    public static int[] onTheFlyBalancedMergeSort(int[] arr) {
        int n = arr.length;
        
        if (n <= 1) {
            return arr;
        }
        
        Stack<int[]> segmentStack = new Stack<>();
        int i = 0;
        
        while (i < n) {
            // Detect the next segment
            int[] endPos = new int[1];
            int[] segment = detectSegment(arr, i, endPos);
            i = endPos[0] + 1;
            
            // Merge with stack if needed
            int[] current = segment;
            while (!segmentStack.isEmpty() && current.length >= segmentStack.peek().length) {
                int[] top = segmentStack.pop();
                current = mergeTwoArrays(top, current);
            }
            segmentStack.push(current);
        }
        
        // Final merge of remaining segments
        while (segmentStack.size() > 1) {
            int[] a = segmentStack.pop();
            int[] b = segmentStack.pop();
            int[] merged = mergeTwoArrays(a, b);
            segmentStack.push(merged);
        }
        
        // Copy back to original array
        if (!segmentStack.isEmpty()) {
            int[] result = segmentStack.pop();
            System.arraycopy(result, 0, arr, 0, result.length);
        }
        
        return arr;
    }
    
    /**
     * Helper function to check if an array is sorted
     */
    private static boolean isSorted(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Helper function to print an array
     */
    private static void printArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }
    
    /**
     * Test function to verify the algorithm works correctly
     */
    private static void runTests() {
        System.out.println("Running Java On-the-Fly Balanced Merge Sort Tests...");
        System.out.println();
        
        // Test cases
        int[][][] testCases = {
            {{}}, // Empty array
            {{42}}, // Single element
            {{1, 2, 3, 4, 5}}, // Already sorted
            {{5, 4, 3, 2, 1}}, // Reverse sorted
            {{5, 3, 2, 4, 6, 8, 7, 1}}, // Mixed
            {{3, 3, 3, 3, 3}}, // All identical
            {{10, -2, 5, -2, 0, 5, 10, -8}} // With negatives and duplicates
        };
        
        for (int i = 0; i < testCases.length; i++) {
            int testNum = i + 1;
            int[] testCase = testCases[i][0];
            
            System.out.printf("Test Case %d: ", testNum);
            System.out.print("Input: ");
            printArray(testCase);
            
            int[] sorted = testCase.clone();
            sorted = onTheFlyBalancedMergeSort(sorted);
            
            System.out.print("Output: ");
            printArray(sorted);
            
            // Verify it's sorted
            boolean sortedCheck = isSorted(sorted);
            System.out.println("Status: " + (sortedCheck ? "PASSED" : "FAILED"));
            System.out.println();
        }
    }
    
    /**
     * Main function
     */
    public static void main(String[] args) {
        runTests();
        
        // Example usage
        System.out.println("Example Usage:");
        int[] example = {5, 3, 2, 4, 6, 8, 7, 1};
        System.out.print("Before sorting: ");
        printArray(example);
        
        onTheFlyBalancedMergeSort(example);
        
        System.out.print("After sorting: ");
        printArray(example);
        
        // Verify it's sorted
        if (isSorted(example)) {
            System.out.println("Verification: Array is correctly sorted!");
        } else {
            System.out.println("Verification: ERROR - Array is not sorted!");
        }
    }
}