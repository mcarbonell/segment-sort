#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>
#include <iomanip>
#include <cstring>
#include <locale> // For std::locale, std::numpunct

#include "SegmentSortIterator.h"

using namespace std;

// Custom numpunct facet to add thousands separators
struct comma_numpunct : public std::numpunct<char> {
    char do_thousands_sep() const override { return ','; }
    std::string do_grouping() const override { return "\3"; } // Group digits by 3
};

// --- Utils ---
void fill_random(vector<int>& arr) {
    mt19937 rng(42);
    uniform_int_distribution<int> dist(0, 1000000);
    for (auto &x : arr) x = dist(rng);
}

void fill_sorted(vector<int>& arr) {
    for (size_t i = 0; i < arr.size(); i++) arr[i] = i;
}

void fill_structured_segments(vector<int>& arr) {
    // Create data with roughly 10 large segments
    int segment_size = arr.size() / 10;
    int val = 0;
    for (size_t i = 0; i < arr.size(); i++) {
        if (i % segment_size == 0) val = rand() % 10000; // New start
        arr[i] = val++;
    }
}

void fill_reverse(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) arr[i] = n - i;
}

// --- Benchmark Runner ---

void run_benchmark(string name, vector<int>& original_data, int k) {
    cout << left << setw(20) << name << " | Top-" << setw(6) << k << " | ";

    // 1. SegmentSortIterator (Non-destructive)
    auto start_seg = chrono::high_resolution_clock::now();
    
    // Setup + Extract
    SegmentSort::Iterator iter(original_data);
    vector<int> result_seg = iter.nextBatch(k);

    auto end_seg = chrono::high_resolution_clock::now();
    double time_seg = chrono::duration<double, milli>(end_seg - start_seg).count();

    // 2. std::partial_sort (Destructive - requires copy)
    // We verify "Top-K from immutable source" scenario, so we must include copy time
    auto start_std = chrono::high_resolution_clock::now();
    
    vector<int> copy_data = original_data; // Copy overhead
    std::partial_sort(copy_data.begin(), copy_data.begin() + k, copy_data.end());
    // Result is in copy_data[0...k-1]

    auto end_std = chrono::high_resolution_clock::now();
    double time_std = chrono::duration<double, milli>(end_std - start_std).count();

    // Output
    cout << fixed << setprecision(3) 
         << "SegIt: " << setw(8) << time_seg << " ms | "
         << "StdPartial: " << setw(8) << time_std << " ms | ";

    if (time_seg < time_std) {
        cout << "\033[1;32mx" << time_std / time_seg << " Faster\033[0m";
    } else {
        cout << "\033[1;31mx" << time_seg / time_std << " Slower\033[0m";
    }
    cout << endl;

    // Verify correctness (sanity check)
    // Sort both results to compare (partial_sort result is sorted, nextBatch is sorted)
    bool correct = true;
    for(int i=0; i<k; i++) {
        if (result_seg[i] != copy_data[i]) {
            correct = false; 
            // cout << "Mismatch at " << i << ": " << result_seg[i] << " vs " << copy_data[i] << endl;
            break;
        }
    }
    if (!correct) cout << "       WARNING: Result mismatch!" << endl;
}

int main() {
    // Imbue cout with a locale that uses our custom thousands separator
    std::cout.imbue(std::locale(std::cout.getloc(), new comma_numpunct));

    const int N = 1000000; // 1 Million elements
    vector<int> data(N);

    cout << "\nBenchmark: Top-K Extraction (Immutable Source)" << endl;
    cout << "Size: " << N << " elements" << endl;
    cout << "Comparison: SegmentSort::Iterator (Zero-Copy) vs std::partial_sort (Copy required)" << endl;
    cout << "--------------------------------------------------------------------------------" << endl;

    // 1. Random Data
    fill_random(data);
    run_benchmark("Random", data, 10);
    run_benchmark("Random", data, 100);
    run_benchmark("Random", data, 1000);
    cout << "--------------------------------------------------------------------------------" << endl;

    // 2. Sorted Data
    fill_sorted(data);
    run_benchmark("Sorted", data, 10);
    run_benchmark("Sorted", data, 1000);
    cout << "--------------------------------------------------------------------------------" << endl;

    // 3. Reverse Data
    fill_reverse(data);
    run_benchmark("Reverse", data, 10);
    run_benchmark("Reverse", data, 1000);
    cout << "--------------------------------------------------------------------------------" << endl;

    // 4. Structured (10 large segments)
    fill_structured_segments(data);
    run_benchmark("10-Segments", data, 10);
    run_benchmark("10-Segments", data, 1000);
    run_benchmark("10-Segments", data, 10000);
    
    cout << "--------------------------------------------------------------------------------" << endl;

    return 0;
}