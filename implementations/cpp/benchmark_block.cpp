#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <random>
#include <iomanip>
#include <string>

#include "block_merge_segment_sort.h"

using namespace std;
using namespace std::chrono;

// --- Helpers ---

void fill_random(vector<int>& arr) {
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> dis(1, 1000000);
    for (auto& x : arr) x = dis(gen);
}

void fill_sorted(vector<int>& arr) {
    iota(arr.begin(), arr.end(), 0);
}

void fill_reverse(vector<int>& arr) {
    iota(arr.rbegin(), arr.rend(), 0);
}

void fill_nearly_sorted(vector<int>& arr) {
    fill_sorted(arr);
    size_t n = arr.size();
    size_t swaps = n / 100;
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<size_t> dis(0, n - 1);
    for (size_t i = 0; i < swaps; ++i) {
        swap(arr[dis(gen)], arr[dis(gen)]);
    }
}

bool check_sorted(const vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); ++i) {
        if (arr[i-1] > arr[i]) return false;
    }
    return true;
}

// --- Benchmark Runner ---

void run_benchmark(const string& name, void (*fill_func)(vector<int>&), size_t n) {
    vector<int> arr(n);
    vector<int> copy;
    fill_func(arr);

    int reps = 5;
    if (name == "Sorted" || name == "Reverse") reps = 20;

    cout << left << setw(15) << name << " | " << setw(8) << n << " | ";

    // Block Merge
    double total_block = 0;
    for (int i = 0; i < reps; ++i) {
        copy = arr;
        auto start = high_resolution_clock::now();
        segment_sort::block_merge_segment_sort(copy);
        auto end = high_resolution_clock::now();
        total_block += duration_cast<duration<double, milli>>(end - start).count();
        if (i == 0 && !check_sorted(copy)) {
            cerr << "Block Merge Failed!" << endl;
            exit(1);
        }
    }
    double avg_block = total_block / reps;

    // std::sort
    double total_std = 0;
    for (int i = 0; i < reps; ++i) {
        copy = arr;
        auto start = high_resolution_clock::now();
        sort(copy.begin(), copy.end());
        auto end = high_resolution_clock::now();
        total_std += duration_cast<duration<double, milli>>(end - start).count();
    }
    double avg_std = total_std / reps;

    // std::stable_sort
    double total_stable = 0;
    for (int i = 0; i < reps; ++i) {
        copy = arr;
        auto start = high_resolution_clock::now();
        stable_sort(copy.begin(), copy.end());
        auto end = high_resolution_clock::now();
        total_stable += duration_cast<duration<double, milli>>(end - start).count();
    }
    double avg_stable = total_stable / reps;

    cout << fixed << setprecision(2) 
         << setw(10) << avg_block << " ms | "
         << setw(10) << avg_std << " ms | "
         << setw(10) << avg_stable << " ms | ";

    if (avg_block < avg_std) {
        cout << "\033[1;32mx" << avg_std / avg_block << " Faster\033[0m" << endl;
    } else {
        cout << "\033[1;31mx" << avg_block / avg_std << " Slower\033[0m" << endl;
    }
}

int main(int argc, char* argv[]) {
    size_t size = 1000000;
    if (argc > 1) {
        try {
            size = std::stoull(argv[1]);
        } catch (...) {
            std::cerr << "Invalid size argument. Using default: " << size << std::endl;
        }
    }

    cout << "\n==========================================================================================" << endl;
    cout << "   C++ Benchmark: Block Merge Segment Sort vs std::sort vs std::stable_sort" << endl;
    cout << "==========================================================================================" << endl;
    cout << left << setw(15) << "Data Type" << " | " << setw(8) << "Size" << " | "
         << setw(10) << "BlockMerge" << " | "
         << setw(10) << "std::sort" << " | "
         << setw(10) << "std::stable" << " | "
         << "Verdict (vs std::sort)" << endl;
    cout << "------------------------------------------------------------------------------------------" << endl;

    run_benchmark("Random", fill_random, size);
    run_benchmark("Sorted", fill_sorted, size);
    run_benchmark("Reverse", fill_reverse, size);
    run_benchmark("Nearly Sorted", fill_nearly_sorted, size);

    cout << "==========================================================================================" << endl;
    return 0;
}
