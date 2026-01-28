#ifndef GENERATORS_H
#define GENERATORS_H

#include <stddef.h>

// --- LCG Random Number Generator ---
void set_seed(unsigned long seed);
double lcg_random();

// --- Dataset Loader ---
int load_dataset(const char* filename, int* arr, size_t n);

// --- Data Generators ---
void generate_random_array(int* arr, size_t n, int min, int max);
void generate_sorted_array(int* arr, size_t n, int min, int max);
void generate_reverse_array(int* arr, size_t n, int min, int max);
void generate_k_sorted_array(int* arr, size_t n, int k, int min, int max);
void generate_nearly_sorted_array(int* arr, size_t n, size_t num_swaps, int min, int max);
void generate_duplicates_array(int* arr, size_t n, int unique_values, int min, int max);
void generate_plateau_array(int* arr, size_t n, size_t plateau_size, int min, int max);
void generate_segment_sorted_array(int* arr, size_t n, size_t segment_size, int min, int max);

#endif // GENERATORS_H
