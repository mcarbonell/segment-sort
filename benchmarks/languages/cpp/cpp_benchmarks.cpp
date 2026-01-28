/**
 * C++ Benchmarks for Segment Sort Algorithm
 * Comprehensive performance testing for Segment Sort algorithm
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <random>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <numeric>
#include <cmath>
#include <cstring>
#include <string>
#include <functional>
#include <queue>
#include <map>
#include <unordered_map>

// Import Segment Sort implementation
#include "cpp_benchmarks.h"
#include "../../../implementations/cpp/block_merge_segment_sort.h"

// On-the-Fly Balanced Merge Sort Implementation
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

// Global RNG for deterministic results
class LCG {
private:
    uint64_t current_seed;
    const uint64_t a = 1103515245;
    const uint64_t c = 12345;
    const uint64_t m = 2ULL << 31;

public:
    LCG(uint64_t seed = 12345) : current_seed(seed) {}
    
    void setSeed(uint64_t seed) {
        current_seed = seed;
    }
    
    double random() {
        current_seed = (a * current_seed + c) % m;
        return static_cast<double>(current_seed) / static_cast<double>(m);
    }
    
    uint32_t getSeed() const { return current_seed; }
};

static LCG rng;

// Validation function
bool isSorted(const std::vector<int>& arr) {
    if (arr.empty()) return true;
    for (size_t i = 1; i < arr.size(); ++i) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

// Statistics calculation
struct Statistics {
    double mean = 0;
    double median = 0;
    double std = 0;
    double p5 = 0;
    double p95 = 0;
    double min = 0;
    double max = 0;
};

// Benchmark result structure
struct BenchmarkResult {
    std::string algorithm;
    size_t size;
    std::string dataType;
    int repetitions;
    std::vector<double> times;
    Statistics statistics;
    std::vector<int> sorted_result;
    bool success;
    std::string error;
};

// Forward declarations for sorting algorithms


// Forward declarations for benchmark functions
std::vector<int> mergeVectors(const std::vector<int>& left, const std::vector<int>& right);
void exportResults(const std::vector<BenchmarkResult>& results, const std::vector<size_t>& sizes, int repetitions);

// Data generators with deterministic randomness
std::vector<int> generateRandomArray(size_t size, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    for (size_t i = 0; i < size; ++i) {
        int value = static_cast<int>(rng.random() * (max_val - min_val + 1)) + min_val;
        arr.push_back(value);
    }
    return arr;
}

std::vector<int> generateKSortedArray(size_t size, size_t k, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    double step = static_cast<double>(max_val - min_val) / size;
    
    // Create sorted base array
    for (size_t i = 0; i < size; ++i) {
        arr.push_back(static_cast<int>(min_val + i * step));
    }
    
    // Apply limited swaps within k
    for (size_t i = 0; i < size; ++i) {
        size_t max_j = std::min(i + k + 1, size);
        size_t j = i + static_cast<size_t>(rng.random() * (max_j - i));
        if (j < size) {
            std::swap(arr[i], arr[j]);
        }
    }
    
    return arr;
}

std::vector<int> generateNearlySortedArray(size_t size, size_t num_swaps, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    double step = static_cast<double>(max_val - min_val) / size;
    
    // Create sorted array
    for (size_t i = 0; i < size; ++i) {
        arr.push_back(static_cast<int>(min_val + i * step));
    }
    
    // Apply random swaps
    for (size_t s = 0; s < num_swaps; ++s) {
        size_t i = static_cast<size_t>(rng.random() * size);
        size_t j = static_cast<size_t>(rng.random() * size);
        std::swap(arr[i], arr[j]);
    }
    
    return arr;
}

std::vector<int> generateDuplicatesArray(size_t size, size_t unique_values = 10, int min_val = 0, int max_val = 100) {
    std::vector<int> arr;
    arr.reserve(size);
    
    for (size_t i = 0; i < size; ++i) {
        size_t value_index = static_cast<size_t>(rng.random() * unique_values);
        int value = static_cast<int>(min_val + (value_index * (max_val - min_val) / unique_values));
        arr.push_back(value);
    }
    
    return arr;
}

std::vector<int> generatePlateauArray(size_t size, size_t plateau_size, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    size_t num_plateaus = (size + plateau_size - 1) / plateau_size;
    
    for (size_t p = 0; p < num_plateaus; ++p) {
        int plateau_value = static_cast<int>(min_val + (p * (max_val - min_val) / num_plateaus));
        size_t current_plateau_size = std::min(plateau_size, size - arr.size());
        
        for (size_t i = 0; i < current_plateau_size; ++i) {
            arr.push_back(plateau_value);
        }
    }
    
    return arr;
}

std::vector<int> generateSegmentSortedArray(size_t size, size_t segment_size, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    size_t num_segments = (size + segment_size - 1) / segment_size;
    
    for (size_t s = 0; s < num_segments; ++s) {
        size_t segment_start = s * segment_size;
        size_t segment_end = std::min(segment_start + segment_size, size);
        double segment_range = static_cast<double>(max_val - min_val) / num_segments;
        int segment_min = min_val + static_cast<int>(s * segment_range);
        int segment_max = segment_min + static_cast<int>(segment_range);
        
        for (size_t i = segment_start; i < segment_end; ++i) {
            int value = static_cast<int>(segment_min + (i - segment_start) * (segment_max - segment_min) / (segment_end - segment_start));
            arr.push_back(value);
        }
    }
    
    return arr;
}

std::vector<int> generateSortedArray(size_t size, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    double step = static_cast<double>(max_val - min_val) / size;
    for (size_t i = 0; i < size; ++i) {
        arr.push_back(static_cast<int>(min_val + i * step));
    }
    return arr;
}

std::vector<int> generateReverseArray(size_t size, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);
    
    double step = static_cast<double>(max_val - min_val) / size;
    for (size_t i = 0; i < size; ++i) {
        arr.push_back(static_cast<int>(max_val - i * step));
    }
    return arr;
}

// Sorting algorithms implementations

std::vector<int> mergeSort(const std::vector<int>& arr) {
    if (arr.size() <= 1) return arr;

    size_t mid = arr.size() / 2;
    std::vector<int> left(arr.begin(), arr.begin() + mid);
    std::vector<int> right(arr.begin() + mid, arr.end());

    left = mergeSort(left);
    right = mergeSort(right);

    return mergeVectors(left, right);
}

std::vector<int> mergeVectors(const std::vector<int>& left, const std::vector<int>& right) {
    std::vector<int> result;
    result.reserve(left.size() + right.size());
    
    size_t i = 0, j = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            result.push_back(left[i]);
            ++i;
        } else {
            result.push_back(right[j]);
            ++j;
        }
    }
    
    while (i < left.size()) {
        result.push_back(left[i]);
        ++i;
    }
    
    while (j < right.size()) {
        result.push_back(right[j]);
        ++j;
    }
    
    return result;
}

void heapify(std::vector<int>& arr, size_t n, size_t i) {
    size_t largest = i;
    size_t left = 2 * i + 1;
    size_t right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

std::vector<int> heapSort(const std::vector<int>& arr) {
    std::vector<int> copy = arr;
    size_t n = copy.size();

    // Build heap
    for (int i = static_cast<int>(n / 2) - 1; i >= 0; --i)
        heapify(copy, n, static_cast<size_t>(i));

    // Extract elements
    for (int i = static_cast<int>(n) - 1; i > 0; --i) {
        std::swap(copy[0], copy[i]);
        heapify(copy, static_cast<size_t>(i), 0);
    }

    return copy;
}

std::vector<int> builtinSort(const std::vector<int>& arr) {
    std::vector<int> copy = arr;
    std::sort(copy.begin(), copy.end());
    return copy;
}

std::vector<int> stableSort(const std::vector<int>& arr) {
    std::vector<int> copy = arr;
    std::stable_sort(copy.begin(), copy.end());
    return copy;
}

// Original SegmentSort implementation using priority queue for k-way merge
std::vector<int> segmentSortOriginal(const std::vector<int>& arr) {
    int n = arr.size();
    std::vector<int> copyarr = arr;

    struct Segment {
        int start;
        int length;
    };

    // Identify segments (runs)
    std::vector<Segment> segments;
    int start_pos = 0;
    int direction = 0; // 0 unknown, > 0 increasing, < 0 decreasing

    for (int i = 1; i < n; ++i) {
        if (direction == 0) {
            direction = copyarr[i] - copyarr[i - 1];
            continue;
        }
        if ((direction > 0) && copyarr[i - 1] > copyarr[i]) { // Found a decreasing segment
            int length = i - start_pos;
            segments.push_back({start_pos, length});
            start_pos = i;
            direction = 0;
        } else if ((direction < 0) && copyarr[i - 1] < copyarr[i]) { // Found an increasing segment
            int length = start_pos - i;
            segments.push_back({i-1, length});
            start_pos = i;
            direction = 0;
        }
    }
    if (direction >= 0) {
        int length = n - start_pos;
        segments.push_back({start_pos, length});
    } else {
        int length = start_pos - n;
        segments.push_back({n-1, length});
    }

    // Min-heap comparator for segments
    struct CompareSegments {
        const std::vector<int>& arr;
        CompareSegments(const std::vector<int>& a) : arr(a) {}
        bool operator()(const Segment& a, const Segment& b) const {
            return arr[a.start] > arr[b.start];
        }
    };

    // Priority queue for k-way merge
    CompareSegments comparator(copyarr);
    std::priority_queue<Segment, std::vector<Segment>, CompareSegments> minHeap(comparator);

    for (const auto& segment : segments) {
        minHeap.push(segment);
    }

    // Extract minimum elements using k-way merge
    std::vector<int> result;
    result.reserve(n);

    while (!minHeap.empty()) {
        Segment current = minHeap.top();
        minHeap.pop();

        result.push_back(copyarr[current.start]);

        // If the segment still has elements, push it back to the heap
        if (current.length > 0) {       // Positive segment (increasing)
            if (--current.length > 0) {
                current.start++;
                minHeap.push(current);
            }
        } else if (current.length < 0) { // Negative segment (decreasing)
            if (++current.length < 0) {
                current.start--;
                minHeap.push(current);
            }
        }
    }

    return result;
}


Statistics calculateStats(const std::vector<double>& times) {
    Statistics stats;
    if (times.empty()) return stats;
    
    std::vector<double> sorted_times = times;
    std::sort(sorted_times.begin(), sorted_times.end());
    size_t n = times.size();
    
    // Mean
    stats.mean = std::accumulate(times.begin(), times.end(), 0.0) / n;
    
    // Median
    if (n % 2 == 1) {
        stats.median = sorted_times[n / 2];
    } else {
        stats.median = (sorted_times[n / 2 - 1] + sorted_times[n / 2]) / 2.0;
    }
    
    // Standard deviation
    double variance = std::accumulate(times.begin(), times.end(), 0.0, 
        [&stats](double acc, double val) {
            return acc + (val - stats.mean) * (val - stats.mean);
        }) / n;
    stats.std = std::sqrt(variance);
    
    // Percentiles
    size_t p5_idx = std::max<size_t>(0, static_cast<size_t>(n * 0.05) - 1);
    size_t p95_idx = std::min(n - 1, static_cast<size_t>(n * 0.95) - 1);
    
    stats.p5 = sorted_times[p5_idx];
    stats.p95 = sorted_times[p95_idx];
    stats.min = sorted_times[0];
    stats.max = sorted_times[n - 1];
    
    return stats;
}


void warmUp(const std::function<std::vector<int>(const std::vector<int>&)>& algorithm, 
           const std::vector<int>& array, int warmup_runs = 3) {
    try {
        for (int i = 0; i < warmup_runs; ++i) {
            algorithm(array);
        }
    } catch (...) {
        // Silently ignore warm-up errors
    }
}

BenchmarkResult runBenchmark(const std::function<std::vector<int>(const std::vector<int>&)>& algorithm,
                            const std::vector<int>& array, const std::string& name, const std::string& dataType, int repetitions = 10, bool validate_results = true) {
    std::vector<double> times;
    std::vector<int> sorted_result;
    bool success = true;
    std::string error;
    
    // Warm-up run
    warmUp(algorithm, array);
    
    // Multiple runs for statistical analysis
    for (int rep = 0; rep < repetitions; ++rep) {
        try {
            auto start = std::chrono::high_resolution_clock::now();
            std::vector<int> result = algorithm(array);
            auto end = std::chrono::high_resolution_clock::now();

            // Validate that result is correctly sorted (if validation is enabled)
            if (validate_results && !isSorted(result)) {
                success = false;
                error = "Validation failed: Array is not properly sorted";
                break;
            }

            auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start);
            times.push_back(duration.count() / 1e6); // Convert to milliseconds

            if (rep == 0) {
                sorted_result = result;
            }
        } catch (const std::exception& err) {
            success = false;
            error = err.what();
            break;
        } catch (...) {
            success = false;
            error = "Unknown error";
            break;
        }
    }
    
    BenchmarkResult result;
    result.algorithm = name;
    result.size = array.size();
    result.dataType = dataType;
    result.repetitions = repetitions;
    result.times = times;
    result.sorted_result = sorted_result;
    result.success = success;
    result.error = error;
    
    if (success) {
        result.statistics = calculateStats(times);
    }
    
    return result;
}

// Sorters dictionary
struct Sorter {
    std::string name;
    std::function<std::vector<int>(const std::vector<int>&)> func;
};

std::vector<Sorter> getSorters() {
    return {
        {"balancedSegmentMergeSort", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            return onTheFlyBalancedMergeSort(copy);
        }},
        {"blockMergeSegmentSort DEF", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy);
            return copy;
        }},
        {"blockMergeSegmentSort_512", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 512);
            return copy;
        }},
        {"blockMergeSegmentSort_1k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 1024);
            return copy;
        }},
        {"blockMergeSegmentSort_2k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 2048);
            return copy;
        }},
        {"blockMergeSegmentSort_4k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 4096);
            return copy;
        }},
        {"blockMergeSegmentSort_8k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 8192);
            return copy;
        }},
        {"blockMergeSegmentSort_16k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 16384);
            return copy;
        }},
        {"blockMergeSegmentSort_32k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 32768);
            return copy;
        }},
        {"blockMergeSegmentSort_64k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 65536);
            return copy;
        }},
        {"blockMergeSegmentSort_128k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 131072);
            return copy;
        }},        
         {"blockMergeSegmentSort_256k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 262144);
            return copy;
        }},        
         {"blockMergeSegmentSort_512k", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 524288);
            return copy;
        }},        
         {"blockMergeSegmentSort_1M", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 1048576);
            return copy;
        }},             
         {"blockMergeSegmentSort_2M", [](const std::vector<int>& arr) {
            std::vector<int> copy = arr;
            segment_sort::block_merge_segment_sort(copy, 2097152);
            return copy;
        }},             
        {"segmentSortOriginal", segmentSortOriginal},

        {"mergeSort", mergeSort},
        {"heapSort", heapSort},
        {"std::sort", builtinSort},
        {"std::stable_sort", stableSort}
    };
}

// Data types for testing
struct TestCase {
    std::string name;
    std::string shortName;
    std::vector<int> data;
};

// Structure for algorithm aggregation
struct AlgorithmStats {
    double sum = 0.0;
    int count = 0;
};

std::vector<TestCase> generateTestCases(size_t size) {
    std::vector<TestCase> testCases;
    
    // Generate test data
    auto random_array = generateRandomArray(size);
    auto sorted_array = generateSortedArray(size);
    auto reverse_array = generateReverseArray(size);
    auto k_sorted_array = generateKSortedArray(size, size / 10);
    auto nearly_sorted_array = generateNearlySortedArray(size, size / 20);
    auto duplicates_array = generateDuplicatesArray(size, 20);
    auto plateau_array = generatePlateauArray(size, size / 10);
    auto segment_sorted_array = generateSegmentSortedArray(size, size / 5);
    
    testCases = {
        {"Aleatorio", "Aleatorio", random_array},
        {"Ordenado", "Ordenado", sorted_array},
        {"Inverso", "Inverso", reverse_array},
        {"K-sorted (k=10%)", "K-sorted", k_sorted_array},
        {"Nearly Sorted (5% swaps)", "NearlySorted", nearly_sorted_array},
        {"Con Duplicados (20 unicos)", "Duplicados", duplicates_array},
        {"Plateau (10 segmentos)", "Plateau", plateau_array},
        {"Segment Sorted (5 segmentos)", "SegmentSorted", segment_sorted_array}
    };
    
    return testCases;
}


void analyzeResults(const std::vector<BenchmarkResult>& allResults) {
    if (allResults.empty()) {
        std::cout << "No hay resultados para analizar." << std::endl;
        return;
    }

    std::cout << "\n[ANALYSIS] Analisis comparativo resumido (media de tiempos por algoritmo y tipo de datos):" << std::endl;

    // Mapas para agrupar datos: dataType -> algorithm -> stats
    std::map<std::string, std::map<std::string, AlgorithmStats>> byType;
    std::map<std::string, AlgorithmStats> globalAgg;

    // Agrupar resultados
    for (const auto& res : allResults) {
        if (!res.success) continue;

        const std::string& algorithm = res.algorithm;
        const std::string& dataType = res.dataType;
        const double mean = res.statistics.mean;

        // Por tipo de datos
        byType[dataType][algorithm].sum += mean;
        byType[dataType][algorithm].count++;

        // Global
        globalAgg[algorithm].sum += mean;
        globalAgg[algorithm].count++;
    }

    // Mostrar análisis por tipo de datos
    for (const auto& [dataType, algMap] : byType) {
        std::vector<std::pair<std::string, double>> averages;
        for (const auto& [alg, stats] : algMap) {
            if (stats.count > 0) {
                averages.emplace_back(alg, stats.sum / stats.count);
            }
        }

        if (averages.empty()) continue;

        // Ordenar por tiempo (más rápido primero)
        std::sort(averages.begin(), averages.end(),
                 [](const auto& a, const auto& b) { return a.second < b.second; });

        const auto& best = averages[0];
        std::cout << "\n   >> Tipo de datos: " << dataType << std::endl;
        std::cout << "     - Mas rapido: " << best.first << " (~" << std::fixed << std::setprecision(3) << best.second << " ms)" << std::endl;

        // Ranking completo
        std::cout << "     - Ranking: ";
        for (size_t i = 0; i < averages.size(); ++i) {
            if (i > 0) std::cout << "  |  ";
            std::cout << (i + 1) << ". " << averages[i].first << " ("
                     << std::fixed << std::setprecision(3) << averages[i].second << " ms)";
        }
        std::cout << std::endl;
    }

    // Ranking global
    std::vector<std::pair<std::string, double>> globalArr;
    for (const auto& [alg, stats] : globalAgg) {
        if (stats.count > 0) {
            globalArr.emplace_back(alg, stats.sum / stats.count);
        }
    }

    if (!globalArr.empty()) {
        std::sort(globalArr.begin(), globalArr.end(),
                 [](const auto& a, const auto& b) { return a.second < b.second; });

        std::cout << "\n[RANKING] Ranking global (promedio sobre todos los tamanos y tipos):" << std::endl;
        std::cout << "     ";
        for (size_t i = 0; i < globalArr.size(); ++i) {
            if (i > 0) std::cout << "  |  ";
            std::cout << (i + 1) << ". " << globalArr[i].first << " ("
                     << std::fixed << std::setprecision(3) << globalArr[i].second << " ms)";
        }
        std::cout << std::endl;
    }
}

void runBenchmarks(const std::vector<size_t>& sizes, int repetitions = 10, bool validate_results = true) {
    std::cout << "[INFO] Iniciando benchmarks de Segment Sort (Metodologia Academica)...\n\n";
    std::cout << "[CONFIG] " << repetitions << " repeticiones, analisis estadistico completo\n\n";
    std::cout << std::string(100, '=') << "\n";
    std::cout << "| Algoritmo                   | Tamano | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |\n";
    std::cout << std::string(100, '=') << "\n";

    auto sorters = getSorters();
    std::vector<BenchmarkResult> all_results;

    for (size_t size : sizes) {
        std::cout << "\n[SIZE] Probando con arrays de tamano: " << size << "\n";
        std::cout << std::string(60, '-') << "\n";

        auto testCases = generateTestCases(size);

        for (const auto& testCase : testCases) {
            std::cout << "\n[TEST] " << testCase.name << ":\n";

            for (const auto& sorter : sorters) {
                auto result = runBenchmark(sorter.func, testCase.data, sorter.name, testCase.shortName, repetitions, validate_results);
                std::string status = result.success ? "[OK]" : "[ERROR]";

                if (result.success) {
                    std::cout << "   " << std::left << std::setw(26) << sorter.name
                              << " | " << std::right << std::setw(6) << size
                              << " | " << std::left << std::setw(18) << testCase.shortName
                              << " | " << std::right << std::setw(9) << std::fixed << std::setprecision(3) << result.statistics.mean
                              << " | " << std::setw(11) << result.statistics.median
                              << " | " << std::setw(8) << result.statistics.std
                              << " | " << status << "\n";

                    all_results.push_back(result);
                } else {
                    std::cout << "   " << std::left << std::setw(25) << sorter.name
                              << " | " << std::right << std::setw(6) << size
                              << " | " << std::left << std::setw(18) << testCase.shortName
                              << " | " << std::right << std::setw(9) << "ERROR"
                              << " | " << std::setw(11) << "ERROR"
                              << " | " << std::setw(8) << "ERROR"
                              << " | " << status << "\n";
                    std::cout << "   Error: " << result.error << "\n";

                    all_results.push_back(result);
                }
            }
        }
    }

    std::cout << "\n" << std::string(100, '=') << "\n";
    std::cout << "[SUCCESS] Benchmarks completados!\n";

    // Export results to JSON
    exportResults(all_results, sizes, repetitions);

    // Análisis comparativo resumido
    analyzeResults(all_results);
}

void exportResults(const std::vector<BenchmarkResult>& results, const std::vector<size_t>& sizes, int repetitions) {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    auto tm = *std::localtime(&time_t);
    
    std::string filename = "results.json";
    std::ofstream file(filename);
    if (!file.is_open()) {
        std::cerr << "[ERROR] No se pudo crear el archivo de resultados: " << filename << " Error: " << strerror(errno) << "\n";
        return;
    }
    
    file << "{\n";
    file << "  \"metadata\": {\n";
    file << "    \"timestamp\": \"" << std::put_time(&tm, "%Y-%m-%d %H:%M:%S") << "\",\n";
    file << "    \"seed\": " << rng.getSeed() << ",\n";
    file << "    \"repetitions\": " << repetitions << ",\n";
    file << "    \"methodology\": \"Academic Rigor Benchmarking v1.0\"\n";
    file << "  },\n";
    file << "  \"results\": [\n";
    
    for (size_t i = 0; i < results.size(); ++i) {
        const auto& result = results[i];
        file << "    {\n";
        file << "      \"algorithm\": \"" << result.algorithm << "\",\n";
        file << "      \"size\": " << result.size << ",\n";
        file << "      \"dataType\": \"" << result.dataType << "\",\n";
        file << "      \"repetitions\": " << result.repetitions << ",\n";
        file << "      \"success\": " << (result.success ? "true" : "false") << ",\n";
        
        if (result.success) {
            file << "      \"statistics\": {\n";
            file << "        \"mean\": " << result.statistics.mean << ",\n";
            file << "        \"median\": " << result.statistics.median << ",\n";
            file << "        \"std\": " << result.statistics.std << ",\n";
            file << "        \"p5\": " << result.statistics.p5 << ",\n";
            file << "        \"p95\": " << result.statistics.p95 << ",\n";
            file << "        \"min\": " << result.statistics.min << ",\n";
            file << "        \"max\": " << result.statistics.max << "\n";
            file << "      },\n";
            
            file << "      \"allTimes\": [";
            for (size_t j = 0; j < result.times.size(); ++j) {
                file << result.times[j];
                if (j < result.times.size() - 1) file << ", ";
            }
            file << "]\n";
        } else {
            file << "      \"error\": \"" << result.error << "\"\n";
        }
        
        file << "    }";
        if (i < results.size() - 1) file << ",";
        file << "\n";
    }
    
    file << "  ]\n";
    file << "}\n";
    file.close();
    
    std::cout << "[EXPORT] Resultados exportados a: " << filename << "\n";
}

// Command line argument parsing
void printHelp() {
    std::cout << "Uso: cpp_benchmarks [sizes...] [--reps repetitions] [--seed seed]\n\n";
    std::cout << "Ejemplos:\n";
    std::cout << "  cpp_benchmarks                # Ejecuta con tamano 100000, 10 repeticiones\n";
    std::cout << "  cpp_benchmarks 50000          # Ejecuta solo para tamano 50000\n";
    std::cout << "  cpp_benchmarks 10000 50000    # Ejecuta para varios tamanos\n";
    std::cout << "  cpp_benchmarks 100000 --reps 30  # Ejecuta tamano 100000 con 30 repeticiones\n";
    std::cout << "  cpp_benchmarks --seed 42 50000 --reps 5  # Con seed específico\n\n";
    std::cout << "Argumentos:\n";
    std::cout << "  sizes...              Tamanos de arrays a probar (por defecto: 100000)\n";
    std::cout << "  --reps, -r N         NNumero de repeticiones por configuracion (por defecto: 10)\n";
    std::cout << "  --seed S             Seed para generacion deterministica (por defecto: 12345)\n";
}

int main(int argc, char* argv[]) {
    std::vector<size_t> sizes;
    int repetitions = 10;
    uint64_t seed = 12345;
    bool validate_results = true;
    
    // Parse command line arguments
    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        
        if (arg == "--help" || arg == "-h") {
            printHelp();
            return 0;
        } else if (arg == "--reps" || arg == "-r") {
            if (i + 1 < argc) {
                repetitions = std::atoi(argv[++i]);
            }
        } else if (arg == "--seed") {
            if (i + 1 < argc) {
                seed = std::stoull(argv[++i]);
            }
        } else if (arg == "--no-validate") {
            validate_results = false;
        } else {
            // Try to parse as size
            try {
                size_t size = std::stoull(arg);
                sizes.push_back(size);
            } catch (...) {
                std::cerr << "Argumento invalido: " << arg << "\n";
                printHelp();
                return 1;
            }
        }
    }
    
    if (sizes.empty()) {
        sizes.push_back(100000);
    }
    
    // Set seed for deterministic results
    rng.setSeed(seed);
    
    std::cout << "[CONFIG] Configuracion:\n";
    std::cout << "   - Tamanos: ";
    for (size_t i = 0; i < sizes.size(); ++i) {
        std::cout << sizes[i];
        if (i < sizes.size() - 1) std::cout << ", ";
    }
    std::cout << "\n";
    std::cout << "   - Repeticiones: " << repetitions << "\n";
    std::cout << "   - Seed: " << seed << "\n";
    std::cout << "   - Validacion: " << (validate_results ? "Habilitada" : "Deshabilitada") << "\n\n";
    
    // Run benchmarks
    runBenchmarks(sizes, repetitions, validate_results);
    
    return 0;
}