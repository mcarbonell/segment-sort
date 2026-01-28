#include "generators.h"
#include <stdio.h>

// --- LCG Random Number Generator ---
static unsigned long lcg_seed = 12345;

void set_seed(unsigned long seed) {
    lcg_seed = seed;
}

double lcg_random() {
    const unsigned long a = 1103515245;
    const unsigned long c = 12345;
    const unsigned long m = 2147483648UL; // 2^31
    lcg_seed = (a * lcg_seed + c) % m;
    return (double)lcg_seed / m;
}

// --- Dataset Loader ---
int load_dataset(const char* filename, int* arr, size_t n) {
    FILE* f = fopen(filename, "rb");
    if (!f) {
        printf("[ERROR] No se pudo abrir el archivo de dataset: %s\n", filename);
        // Fallback or error handling
        return 0; 
    }
    
    // Read directly into the array
    size_t elements_read = fread(arr, sizeof(int), n, f);
    fclose(f);
    
    if (elements_read != n) {
        printf("[WARNING] Dataset %s tiene %zu elementos, se esperaban %zu\n", filename, elements_read, n);
    }
    
    return 1; // Success
}

// --- Data Generators ---
void generate_random_array(int* arr, size_t n, int min, int max) {
    for (size_t i = 0; i < n; i++) {
        arr[i] = min + (int)(lcg_random() * (max - min + 1));
    }
}

void generate_sorted_array(int* arr, size_t n, int min, int max) {
    double step = (double)(max - min) / n;
    for (size_t i = 0; i < n; i++) {
        arr[i] = min + (int)(i * step);
    }
}

void generate_reverse_array(int* arr, size_t n, int min, int max) {
    double step = (double)(max - min) / n;
    for (size_t i = 0; i < n; i++) {
        arr[i] = max - (int)(i * step);
    }
}

void generate_k_sorted_array(int* arr, size_t n, int k, int min, int max) {
    // First create sorted array
    generate_sorted_array(arr, n, min, max);
    
    // Apply limited swaps
    for (size_t i = 0; i < n; i++) {
        size_t max_j = (i + k + 1 < n) ? i + k + 1 : n;
        size_t j = i + (size_t)(lcg_random() * (max_j - i));
        if (j < n) {
            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }
}

void generate_nearly_sorted_array(int* arr, size_t n, size_t num_swaps, int min, int max) {
    generate_sorted_array(arr, n, min, max);
    
    for (size_t s = 0; s < num_swaps; s++) {
        size_t i = (size_t)(lcg_random() * n);
        size_t j = (size_t)(lcg_random() * n);
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}

void generate_duplicates_array(int* arr, size_t n, int unique_values, int min, int max) {
    for (size_t i = 0; i < n; i++) {
        int value_index = (int)(lcg_random() * unique_values);
        arr[i] = min + (value_index * (max - min) / unique_values);
    }
}

void generate_plateau_array(int* arr, size_t n, size_t plateau_size, int min, int max) {
    size_t num_plateaus = (n + plateau_size - 1) / plateau_size;
    size_t idx = 0;
    
    for (size_t p = 0; p < num_plateaus && idx < n; p++) {
        int plateau_value = min + (int)(p * (max - min) / num_plateaus);
        size_t current_plateau_size = (idx + plateau_size <= n) ? plateau_size : n - idx;
        
        for (size_t i = 0; i < current_plateau_size; i++) {
            arr[idx++] = plateau_value;
        }
    }
}

void generate_segment_sorted_array(int* arr, size_t n, size_t segment_size, int min, int max) {
    size_t num_segments = (n + segment_size - 1) / segment_size;
    size_t idx = 0;
    
    for (size_t s = 0; s < num_segments && idx < n; s++) {
        size_t segment_start = idx;
        size_t segment_end = (idx + segment_size <= n) ? idx + segment_size : n;
        double segment_range = (double)(max - min) / num_segments;
        int segment_min = min + (int)(s * segment_range);
        int segment_max = segment_min + (int)segment_range;
        
        for (size_t i = segment_start; i < segment_end; i++) {
            double step = (double)(segment_max - segment_min) / (segment_end - segment_start);
            arr[i] = segment_min + (int)((i - segment_start) * step);
        }
        
        idx = segment_end;
    }
}
