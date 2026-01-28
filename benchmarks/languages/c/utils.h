#ifndef UTILS_H
#define UTILS_H

#include <stdbool.h>
#include <stddef.h>

// --- High-Resolution Timer ---
double get_time_ms();

// --- Validation ---
bool check_sorted(int* arr, size_t n);
bool compare_arrays(int* arr1, int* arr2, size_t n);

// --- QSort Comparator ---
int qsort_cmp(const void *a, const void *b);

#endif // UTILS_H
