#ifndef BLOCK_MERGE_V1_WRAPPER_H
#define BLOCK_MERGE_V1_WRAPPER_H

#include <stddef.h>

// Include the original implementation
#include "block_merge_segment_sort_1.h"

// Create a wrapper with a unique name
static inline void block_merge_segment_sort_v1(int* arr, size_t n) {
    block_merge_segment_sort(arr, n);
}

#endif // BLOCK_MERGE_V1_WRAPPER_H
