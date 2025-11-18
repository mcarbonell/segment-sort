#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdbool.h>
#include <limits.h>

#include "balanced_segment_merge_sort.h"

// --- Configuration ---
#define ARRAY_SIZE_LARGE 100000
#define ARRAY_SIZE_HUGE  1000000
#define REPETITIONS 10  // For standard runs
#define REPETITIONS_FAST 50 // For very fast cases (sorted, reverse) to get measurable time

// --- QSort Comparator ---
int qsort_cmp(const void *a, const void *b) {
    int arg1 = *(const int *)a;
    int arg2 = *(const int *)b;
    if (arg1 < arg2) return -1;
    if (arg1 > arg2) return 1;
    return 0;
}

// --- Helpers ---

// Cross-platform high-res timing wrapper
// On Windows/MinGW, clock() is okay for rough estimates but has low resolution (10-15ms).
// We use accumulated time over many reps to mitigate this.
double get_time_sec() {
    return (double)clock() / CLOCKS_PER_SEC;
}

void fill_random(int* arr, size_t n) {
    for (size_t i = 0; i < n; i++) arr[i] = rand();
}

void fill_sorted(int* arr, size_t n) {
    for (size_t i = 0; i < n; i++) arr[i] = i;
}

void fill_reverse(int* arr, size_t n) {
    for (size_t i = 0; i < n; i++) arr[i] = n - i;
}

void fill_nearly_sorted(int* arr, size_t n) {
    fill_sorted(arr, n);
    // Swap 1% of elements
    size_t swaps = n / 100; 
    for (size_t i = 0; i < swaps; i++) {
        size_t idx1 = rand() % n;
        size_t idx2 = rand() % n;
        int tmp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = tmp;
    }
}

void fill_duplicates(int* arr, size_t n) {
    for (size_t i = 0; i < n; i++) arr[i] = rand() % 20; // Only 20 unique values
}

void check_sorted(int* arr, size_t n, const char* alg_name) {
    for (size_t i = 1; i < n; i++) {
        if (arr[i-1] > arr[i]) {
            printf("ERROR: %s failed to sort! At index %zu: %d > %d\n", alg_name, i, arr[i-1], arr[i]);
            exit(1);
        }
    }
}

// --- Benchmark Runner ---

void run_single_benchmark(const char* type_name, void (*fill_func)(int*, size_t), size_t n) {
    int *arr_orig = (int*)malloc(n * sizeof(int));
    int *arr_copy = (int*)malloc(n * sizeof(int));
    
    if (!arr_orig || !arr_copy) {
        printf("Memory allocation failed!\n");
        exit(1);
    }

    // Use a consistent seed for fairness between algorithms
    srand(42); 
    fill_func(arr_orig, n);

    // Determine repetitions based on expected speed
    int reps = REPETITIONS;
    // Heuristic: if it's "Sorted" or "Reverse", use more reps
    if (strcmp(type_name, "Sorted") == 0 || strcmp(type_name, "Reverse") == 0) {
        reps = REPETITIONS_FAST;
    }

    printf("%-15s | %8zu | ", type_name, n);

    // --- Benchmark Segment Sort ---
    double total_time_seg = 0;
    for (int r = 0; r < reps; r++) {
        memcpy(arr_copy, arr_orig, n * sizeof(int));
        
        double start = get_time_sec();
        on_the_fly_balanced_merge_sort(arr_copy, n);
        double end = get_time_sec();
        total_time_seg += (end - start);
        
        // Validate once
        if (r == 0) check_sorted(arr_copy, n, "SegmentSort");
    }
    double avg_seg = (total_time_seg / reps) * 1000.0; // ms

    // --- Benchmark QSort ---
    double total_time_q = 0;
    for (int r = 0; r < reps; r++) {
        memcpy(arr_copy, arr_orig, n * sizeof(int));
        
        double start = get_time_sec();
        qsort(arr_copy, n, sizeof(int), qsort_cmp);
        double end = get_time_sec();
        total_time_q += (end - start);

         if (r == 0) check_sorted(arr_copy, n, "QSort");
    }
    double avg_q = (total_time_q / reps) * 1000.0; // ms

    // Print results
    printf("%10.3f ms | %10.3f ms | ", avg_seg, avg_q);

    if (avg_seg < avg_q) {
        printf("\033[1;32mx%.2f Faster\033[0m\n", avg_q / avg_seg);
    } else {
        printf("\033[1;31mx%.2f Slower\033[0m\n", avg_seg / avg_q);
    }

    free(arr_orig);
    free(arr_copy);
}

int main() {
    printf("\n");
    printf("==================================================================================\n");
    printf("   C Benchmark: On-the-Fly Balanced Merge Sort vs std::qsort\n");
    printf("==================================================================================\n");
    printf("%c-15s | %8s | %10s    | %10s    | %s\n", "Data Type", "Size", "SegmentSort", "QSort", "Verdict");
    printf("----------------------------------------------------------------------------------\n");

    // 100k Elements
    run_single_benchmark("Random", fill_random, ARRAY_SIZE_LARGE);
    run_single_benchmark("Sorted", fill_sorted, ARRAY_SIZE_LARGE);
    run_single_benchmark("Reverse", fill_reverse, ARRAY_SIZE_LARGE);
    run_single_benchmark("Nearly Sorted", fill_nearly_sorted, ARRAY_SIZE_LARGE);
    run_single_benchmark("Duplicates", fill_duplicates, ARRAY_SIZE_LARGE);

    printf("----------------------------------------------------------------------------------\n");
    
    // 1M Elements
    run_single_benchmark("Random", fill_random, ARRAY_SIZE_HUGE);
    run_single_benchmark("Sorted", fill_sorted, ARRAY_SIZE_HUGE);
    run_single_benchmark("Reverse", fill_reverse, ARRAY_SIZE_HUGE);
    run_single_benchmark("Nearly Sorted", fill_nearly_sorted, ARRAY_SIZE_HUGE);
    run_single_benchmark("Duplicates", fill_duplicates, ARRAY_SIZE_HUGE);

    printf("==================================================================================\n\n");
    
    return 0;
}