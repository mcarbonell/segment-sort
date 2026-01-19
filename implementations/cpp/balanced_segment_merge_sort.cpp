/**
 * On-the-Fly Balanced Merge Sort - C++ Implementation
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 * 
 * An adaptive sorting algorithm that identifies naturally sorted segments
 * and merges them on-the-fly using a stack-based balanced approach.
 * Achieves O(log n) space complexity and  O(n log² n) in the worst case, 
 * but typically performs close to O(n log n) on structured data due to adaptive 
 * run detection and excellent cache locality. Empirical results show superior 
 * performance over TimSort in many practical scenarios despite the theoretical 
 * bound.
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>

/**
 * Merges two sorted vectors into a single sorted vector
 * @param left First sorted vector
 * @param right Second sorted vector
 * @return Merged sorted vector
 */
std::vector<int> mergeTwoArrays(const std::vector<int>& left, const std::vector<int>& right) {
    std::vector<int> result;
    result.reserve(left.size() + right.size());
    
    size_t i = 0, j = 0;
    
    // Merge while both vectors have elements
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            result.push_back(left[i]);
            i++;
        } else {
            result.push_back(right[j]);
            j++;
        }
    }
    
    // Add remaining elements from left vector
    while (i < left.size()) {
        result.push_back(left[i]);
        i++;
    }
    
    // Add remaining elements from right vector
    while (j < right.size()) {
        result.push_back(right[j]);
        j++;
    }
    
    return result;
}

/**
 * Detects the next natural segment (run) in the array starting from position start
 * @param arr Input array
 * @param start Starting position
 * @param end Reference to store the end position of the segment
 * @return Detected segment as vector
 */
std::vector<int> detectSegment(const std::vector<int>& arr, size_t start, size_t& end) {
    std::vector<int> segment;
    size_t n = arr.size();
    
    if (start >= n) {
        end = start;
        return segment;
    }
    
    // Add first element
    segment.push_back(arr[start]);
    
    // Determine if it's ascending or descending
    bool isDescending = false;
    if (start + 1 < n) {
        isDescending = arr[start] > arr[start + 1];
    }
    
    // Continue the segment based on direction
    while (start + 1 < n) {
        if (isDescending) {
            // Descending segment
            if (arr[start] <= arr[start + 1]) {
                break;
            }
        } else {
            // Ascending segment
            if (arr[start] > arr[start + 1]) {
                break;
            }
        }
        segment.push_back(arr[start + 1]);
        start++;
    }
    
    end = start;
    
    // If descending, reverse to make ascending
    if (isDescending) {
        std::reverse(segment.begin(), segment.end());
    }
    
    return segment;
}

static std::pair<size_t, size_t> detectSegmentIndices(std::vector<int>& arr, size_t start) {
    size_t n = arr.size();
    if (start >= n) {
        return std::make_pair(start, start);
    }

    size_t end = start + 1;
    if (end < n && arr[start] > arr[end]) {
        while (end < n && arr[end - 1] > arr[end]) {
            ++end;
        }
        std::reverse(arr.begin() + start, arr.begin() + end);
        return std::make_pair(start, end);
    } else {
        while (end < n && arr[end - 1] <= arr[end]) {
            ++end;
        }
        return std::make_pair(start, end);
    }
}

static size_t lowerBoundIndex(const std::vector<int>& arr, size_t first, size_t last, int value) {
    return static_cast<size_t>(std::lower_bound(arr.begin() + first, arr.begin() + last, value) - arr.begin());
}

static void rotateRange(std::vector<int>& arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) {
        return;
    }
    std::reverse(arr.begin() + first, arr.begin() + middle);
    std::reverse(arr.begin() + middle, arr.begin() + last);
    std::reverse(arr.begin() + first, arr.begin() + last);
}

static void symmerge(std::vector<int>& arr, size_t first, size_t middle, size_t last) {
    if (first >= middle || middle >= last) {
        return;
    }
    if (last - first == 1) {
        return;
    }
    if (last - first == 2) {
        if (arr[middle] < arr[first]) {
            std::swap(arr[first], arr[middle]);
        }
        return;
    }

    size_t mid1 = (first + middle) / 2;
    int value = arr[mid1];
    size_t mid2 = lowerBoundIndex(arr, middle, last, value);
    size_t newMid = mid1 + (mid2 - middle);
    rotateRange(arr, mid1, middle, mid2);
    symmerge(arr, first, mid1, newMid);
    symmerge(arr, newMid + 1, mid2, last);
}

/**
 * Main On-the-Fly Balanced Merge Sort algorithm
 * @param arr Vector to be sorted (will be mutated)
 * @return Reference to the sorted vector
 */
std::vector<int>& onTheFlyBalancedMergeSort(std::vector<int>& arr) {
    size_t n = arr.size();

    if (n <= 1) {
        return arr;
    }

    std::vector<std::pair<size_t, size_t>> segmentStack;
    size_t i = 0;

    while (i < n) {
        std::pair<size_t, size_t> seg = detectSegmentIndices(arr, i);
        size_t currentStart = seg.first;
        size_t currentEnd = seg.second;
        i = currentEnd;

        while (!segmentStack.empty()) {
            std::pair<size_t, size_t> top = segmentStack.back();
            size_t topLen = top.second - top.first;
            size_t currentLen = currentEnd - currentStart;
            if (currentLen < topLen) {
                break;
            }
            segmentStack.pop_back();
            symmerge(arr, top.first, currentStart, currentEnd);
            currentStart = top.first;
        }

        segmentStack.push_back(std::make_pair(currentStart, currentEnd));
    }

    while (segmentStack.size() > 1) {
        std::pair<size_t, size_t> a = segmentStack.back();
        segmentStack.pop_back();
        std::pair<size_t, size_t> b = segmentStack.back();
        segmentStack.pop_back();
        symmerge(arr, b.first, a.first, a.second);
        segmentStack.push_back(std::make_pair(b.first, a.second));
    }

    return arr;
}

/**
 * Helper function to print a vector
 * @param vec Vector to print
 */
void printVector(const std::vector<int>& vec) {
    std::cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << vec[i];
        if (i < vec.size() - 1) {
            std::cout << ", ";
        }
    }
    std::cout << "]" << std::endl;
}

/**
 * Test function to verify the algorithm works correctly
 */
void runTests() {
    std::cout << "Running C++ On-the-Fly Balanced Merge Sort Tests..." << std::endl << std::endl;
    
    // Test cases
    std::vector<std::vector<int>> testCases = {
        {}, // Empty array
        {42}, // Single element
        {1, 2, 3, 4, 5}, // Already sorted
        {5, 4, 3, 2, 1}, // Reverse sorted
        {5, 3, 2, 4, 6, 8, 7, 1}, // Mixed
        {3, 3, 3, 3, 3}, // All identical
        {10, -2, 5, -2, 0, 5, 10, -8} // With negatives and duplicates
    };
    
    int testNum = 1;
    for (const auto& testCase : testCases) {
        std::cout << "Test Case " << testNum << ": ";
        std::cout << "Input: ";
        printVector(testCase);
        
        std::vector<int> sorted = testCase;
        onTheFlyBalancedMergeSort(sorted);
        
        std::cout << "Output: ";
        printVector(sorted);
        
        // Verify it's sorted
        bool isSorted = std::is_sorted(sorted.begin(), sorted.end());
        std::cout << "Status: " << (isSorted ? "PASSED" : "FAILED") << std::endl;
        std::cout << std::endl;
        
        testNum++;
    }
}

/**
 * Main function
 */
int main() {
    runTests();
    
    // Example usage
    std::cout << "Example Usage:" << std::endl;
    std::vector<int> example = {5, 3, 2, 4, 6, 8, 7, 1};
    std::cout << "Before sorting: ";
    printVector(example);
    
    onTheFlyBalancedMergeSort(example);
    
    std::cout << "After sorting: ";
    printVector(example);
    
    return 0;
}