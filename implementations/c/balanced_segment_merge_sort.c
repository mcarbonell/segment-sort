#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "balanced_segment_merge_sort.h"

// ==========================================
// Simple Test Suite
// ==========================================

void print_array(ElementType* arr, size_t n) {
    printf("[");
    for (size_t i = 0; i < n; ++i) {
        printf("%d%s", arr[i], (i < n - 1) ? ", " : "");
    }
    printf("]\n");
}

bool is_sorted(ElementType* arr, size_t n) {
    for (size_t i = 1; i < n; ++i) {
        if (arr[i - 1] > arr[i]) return false;
    }
    return true;
}

void run_test(const char* name, ElementType* arr, size_t n) {
    printf("Test: %s\n", name);
    printf("Input:  ");
    if (n <= 20) print_array(arr, n); else printf("(%zu elements)\n", n);

    on_the_fly_balanced_merge_sort(arr, n);

    printf("Output: ");
    if (n <= 20) print_array(arr, n); else printf("(%zu elements)\n", n);
    
    bool sorted = is_sorted(arr, n);
    printf("Status: %s\n\n", sorted ? "PASS" : "FAIL");
    if (!sorted) exit(1);
}

int main() {
    printf("Running C implementation of On-the-Fly Balanced Merge Sort\n");
    printf("==========================================================\n\n");

    // Test 1: Basic Random
    int t1[] = {5, 3, 2, 4, 6, 8, 7, 1};
    size_t n1 = sizeof(t1) / sizeof(t1[0]);
    run_test("Basic Random", t1, n1);

    // Test 2: Sorted
    int t2[] = {1, 2, 3, 4, 5};
    size_t n2 = sizeof(t2) / sizeof(t2[0]);
    run_test("Already Sorted", t2, n2);

    // Test 3: Reverse
    int t3[] = {5, 4, 3, 2, 1};
    size_t n3 = sizeof(t3) / sizeof(t3[0]);
    run_test("Reverse Sorted", t3, n3);

    // Test 4: Duplicates
    int t4[] = {5, 1, 5, 3, 3, 8, 1};
    size_t n4 = sizeof(t4) / sizeof(t4[0]);
    run_test("Duplicates", t4, n4);

    // Test 5: Empty
    run_test("Empty", NULL, 0);

    // Test 6: Single Element
    int t6[] = {42};
    run_test("Single Element", t6, 1);
    
    // Test 7: Large Random
    size_t n7 = 10000;
    int* t7 = (int*)malloc(n7 * sizeof(int));
    srand(123);
    for(size_t i = 0; i < n7; i++) t7[i] = rand() % 1000;
    run_test("Large Random (10k)", t7, n7);
    free(t7);

    printf("All tests passed successfully.\n");
    return 0;
}