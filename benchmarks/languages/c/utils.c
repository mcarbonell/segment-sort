#include "utils.h"
#include <stdio.h>

#ifdef _WIN32
#include <windows.h>
double get_time_ms() {
    LARGE_INTEGER frequency, counter;
    QueryPerformanceFrequency(&frequency);
    QueryPerformanceCounter(&counter);
    return (double)(counter.QuadPart * 1000.0) / frequency.QuadPart;
}
#else
#include <sys/time.h>
double get_time_ms() {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000.0 + tv.tv_usec / 1000.0;
}
#endif

bool check_sorted(int* arr, size_t n) {
    for (size_t i = 1; i < n; i++) {
        if (arr[i-1] > arr[i]) {
            printf("   [ERROR] Array not sorted at index %zu: arr[%zu]=%d, arr[%zu]=%d\n", 
                   i, i-1, arr[i-1], i, arr[i]);
            return false;
        }
    }
    return true;
}

bool compare_arrays(int* arr1, int* arr2, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (arr1[i] != arr2[i]) {
            printf("   [ERROR] Arrays differ at index %zu: %d vs %d\n", i, arr1[i], arr2[i]);
            return false;
        }
    }
    return true;
}

int qsort_cmp(const void *a, const void *b) {
    int arg1 = *(const int *)a;
    int arg2 = *(const int *)b;
    if (arg1 < arg2) return -1;
    if (arg1 > arg2) return 1;
    return 0;
}
