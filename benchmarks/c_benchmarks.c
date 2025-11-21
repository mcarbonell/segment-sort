/**
 * Segment Sort - C Benchmarks (Clean Version)
 * 
 * This benchmark suite mirrors the JavaScript benchmarks to ensure
 * fair cross-language comparisons. It includes:
 * - Same data generators (Random, Sorted, Reverse, K-sorted, etc.)
 * - Statistical analysis (mean, median, std deviation)
 * - JSON export for visualization
 * - Multiple repetitions for accuracy
 * 
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdbool.h>
#include <math.h>

// Include algorithm implementations
#include "../implementations/c/balanced_segment_merge_sort.h"
#include "../implementations/c/block_merge_segment_sort.h"

// --- Configuration ---
#define MAX_REPETITIONS 100
#define MAX_SIZES 10
#define MAX_ALGORITHMS 3

// --- LCG Random Number Generator (same as JS) ---
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

// --- QSort Comparator ---
int qsort_cmp(const void *a, const void *b) {
    int arg1 = *(const int *)a;
    int arg2 = *(const int *)b;
    if (arg1 < arg2) return -1;
    if (arg1 > arg2) return 1;
    return 0;
}

// --- Statistics ---
typedef struct {
    double mean;
    double median;
    double std;
    double min;
    double max;
    double p5;
    double p95;
} Statistics;

int compare_doubles(const void *a, const void *b) {
    double diff = (*(double*)a - *(double*)b);
    return (diff > 0) - (diff < 0);
}

Statistics calculate_stats(double* times, int count) {
    Statistics stats = {0};
    if (count == 0) return stats;
    
    // Sort times for percentiles
    double* sorted = (double*)malloc(count * sizeof(double));
    memcpy(sorted, times, count * sizeof(double));
    qsort(sorted, count, sizeof(double), compare_doubles);
    
    // Mean
    double sum = 0;
    for (int i = 0; i < count; i++) {
        sum += times[i];
    }
    stats.mean = sum / count;
    
    // Median
    if (count % 2 == 0) {
        stats.median = (sorted[count/2 - 1] + sorted[count/2]) / 2.0;
    } else {
        stats.median = sorted[count/2];
    }
    
    // Standard deviation
    double variance = 0;
    for (int i = 0; i < count; i++) {
        variance += pow(times[i] - stats.mean, 2);
    }
    stats.std = sqrt(variance / count);
    
    // Min/Max
    stats.min = sorted[0];
    stats.max = sorted[count - 1];
    
    // Percentiles
    int p5_idx = (int)(count * 0.05);
    int p95_idx = (int)(count * 0.95);
    stats.p5 = sorted[p5_idx];
    stats.p95 = sorted[p95_idx < count ? p95_idx : count - 1];
    
    free(sorted);
    return stats;
}

// --- Validation ---
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

// --- High-Resolution Timer ---
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

// --- Benchmark Result Structure ---
typedef struct {
    char algorithm[50];
    char data_type[50];
    size_t size;
    int repetitions;
    double times[MAX_REPETITIONS];
    Statistics stats;
    bool success;
    char error[256];
} BenchmarkResult;

// --- Single Benchmark Run ---
BenchmarkResult run_benchmark(
    const char* alg_name,
    void (*sort_func)(int*, size_t),
    int* original_data,
    size_t n,
    const char* data_type,
    int repetitions,
    bool validate,
    int* reference_result
) {
    BenchmarkResult result = {0};
    strncpy(result.algorithm, alg_name, sizeof(result.algorithm) - 1);
    strncpy(result.data_type, data_type, sizeof(result.data_type) - 1);
    result.size = n;
    result.repetitions = repetitions;
    result.success = true;
    
    int* arr = (int*)malloc(n * sizeof(int));
    if (!arr) {
        result.success = false;
        strncpy(result.error, "Memory allocation failed", sizeof(result.error) - 1);
        return result;
    }
    
    // Warm-up runs
    for (int w = 0; w < 3; w++) {
        memcpy(arr, original_data, n * sizeof(int));
        sort_func(arr, n);
    }
    
    // Actual benchmark runs
    for (int rep = 0; rep < repetitions; rep++) {
        memcpy(arr, original_data, n * sizeof(int));
        
        double start = get_time_ms();
        sort_func(arr, n);
        double end = get_time_ms();
        
        result.times[rep] = end - start;
        
        // Validate on first run
        if (rep == 0 && validate) {
            if (!check_sorted(arr, n)) {
                result.success = false;
                snprintf(result.error, sizeof(result.error), "Validation failed: array not sorted");
                free(arr);
                return result;
            }
            
            if (reference_result && strcmp(alg_name, "qsort") != 0) {
                if (!compare_arrays(arr, reference_result, n)) {
                    result.success = false;
                    snprintf(result.error, sizeof(result.error), "Reference comparison failed");
                    free(arr);
                    return result;
                }
            }
        }
    }
    
    result.stats = calculate_stats(result.times, repetitions);
    free(arr);
    return result;
}

// --- JSON Export ---
void export_results_to_json(BenchmarkResult* results, int result_count, const char* filename) {
    FILE* f = fopen(filename, "w");
    if (!f) {
        printf("[ERROR] Could not open file %s for writing\n", filename);
        return;
    }
    
    fprintf(f, "{\n");
    fprintf(f, "  \"metadata\": {\n");
    fprintf(f, "    \"timestamp\": \"%ld\",\n", (long)time(NULL));
    fprintf(f, "    \"seed\": %lu,\n", lcg_seed);
    fprintf(f, "    \"platform\": \"C\",\n");
    fprintf(f, "    \"methodology\": \"Clean Benchmark with Optimized References v1.0\"\n");
    fprintf(f, "  },\n");
    fprintf(f, "  \"results\": [\n");
    
    for (int i = 0; i < result_count; i++) {
        BenchmarkResult* r = &results[i];
        fprintf(f, "    {\n");
        fprintf(f, "      \"algorithm\": \"%s\",\n", r->algorithm);
        fprintf(f, "      \"size\": %zu,\n", r->size);
        fprintf(f, "      \"dataType\": \"%s\",\n", r->data_type);
        fprintf(f, "      \"repetitions\": %d,\n", r->repetitions);
        fprintf(f, "      \"success\": %s,\n", r->success ? "true" : "false");
        
        if (r->success) {
            fprintf(f, "      \"statistics\": {\n");
            fprintf(f, "        \"mean\": %.3f,\n", r->stats.mean);
            fprintf(f, "        \"median\": %.3f,\n", r->stats.median);
            fprintf(f, "        \"std\": %.3f,\n", r->stats.std);
            fprintf(f, "        \"min\": %.3f,\n", r->stats.min);
            fprintf(f, "        \"max\": %.3f,\n", r->stats.max);
            fprintf(f, "        \"p5\": %.3f,\n", r->stats.p5);
            fprintf(f, "        \"p95\": %.3f\n", r->stats.p95);
            fprintf(f, "      },\n");
            fprintf(f, "      \"allTimes\": [");
            for (int t = 0; t < r->repetitions; t++) {
                fprintf(f, "%.3f%s", r->times[t], (t < r->repetitions - 1) ? ", " : "");
            }
            fprintf(f, "]\n");
        } else {
            fprintf(f, "      \"error\": \"%s\"\n", r->error);
        }
        
        fprintf(f, "    }%s\n", (i < result_count - 1) ? "," : "");
    }
    
    fprintf(f, "  ]\n");
    fprintf(f, "}\n");
    
    fclose(f);
    printf("[*] Resultados exportados a: %s\n", filename);
}

// --- Results Analysis ---
typedef struct {
    char algorithm[50];
    double mean;
} AlgorithmAverage;

typedef struct {
    char data_type[50];
    AlgorithmAverage* averages;
    int count;
} DataTypeAnalysis;

int compare_averages(const void* a, const void* b) {
    AlgorithmAverage* aa = (AlgorithmAverage*)a;
    AlgorithmAverage* bb = (AlgorithmAverage*)b;
    if (aa->mean < bb->mean) return -1;
    if (aa->mean > bb->mean) return 1;
    return 0;
}

void analyze_results(BenchmarkResult* results, int result_count) {
    if (!results || result_count == 0) {
        printf("No hay resultados para analizar.\n");
        return;
    }
    
    printf("\n[*] Analisis comparativo resumido (media de tiempos por algoritmo y tipo de datos):\n");
    
    // Collect unique data types
    char data_types[50][50];
    int num_data_types = 0;
    
    for (int i = 0; i < result_count; i++) {
        if (!results[i].success) continue;
        
        bool found = false;
        for (int j = 0; j < num_data_types; j++) {
            if (strcmp(data_types[j], results[i].data_type) == 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            strncpy(data_types[num_data_types], results[i].data_type, sizeof(data_types[0]) - 1);
            num_data_types++;
        }
    }
    
    // Analyze by data type
    for (int dt = 0; dt < num_data_types; dt++) {
        const char* data_type = data_types[dt];
        
        // Collect algorithm averages for this data type
        typedef struct {
            char algorithm[50];
            double sum;
            int count;
        } AlgAgg;
        
        AlgAgg aggregates[10] = {0};
        int num_algs = 0;
        
        for (int i = 0; i < result_count; i++) {
            if (!results[i].success) continue;
            if (strcmp(results[i].data_type, data_type) != 0) continue;
            
            // Find or create aggregate for this algorithm
            int alg_idx = -1;
            for (int j = 0; j < num_algs; j++) {
                if (strcmp(aggregates[j].algorithm, results[i].algorithm) == 0) {
                    alg_idx = j;
                    break;
                }
            }
            
            if (alg_idx == -1) {
                alg_idx = num_algs++;
                strncpy(aggregates[alg_idx].algorithm, results[i].algorithm, sizeof(aggregates[0].algorithm) - 1);
            }
            
            aggregates[alg_idx].sum += results[i].stats.mean;
            aggregates[alg_idx].count++;
        }
        
        // Calculate averages and sort
        AlgorithmAverage averages[10];
        for (int i = 0; i < num_algs; i++) {
            strncpy(averages[i].algorithm, aggregates[i].algorithm, sizeof(averages[0].algorithm) - 1);
            averages[i].mean = aggregates[i].sum / aggregates[i].count;
        }
        
        qsort(averages, num_algs, sizeof(AlgorithmAverage), compare_averages);
        
        if (num_algs > 0) {
            printf("\n   > Tipo de datos: %s\n", data_type);
            printf("     - Mas rapido: %s (~%.3f ms)\n", averages[0].algorithm, averages[0].mean);
            printf("     - Ranking: ");
            for (int i = 0; i < num_algs; i++) {
                printf("%d. %s (%.3f ms)", i + 1, averages[i].algorithm, averages[i].mean);
                if (i < num_algs - 1) printf("  |  ");
            }
            printf("\n");
        }
    }
    
    // Global ranking
    typedef struct {
        char algorithm[50];
        double sum;
        int count;
    } GlobalAgg;
    
    GlobalAgg global_agg[10] = {0};
    int num_global_algs = 0;
    
    for (int i = 0; i < result_count; i++) {
        if (!results[i].success) continue;
        
        int alg_idx = -1;
        for (int j = 0; j < num_global_algs; j++) {
            if (strcmp(global_agg[j].algorithm, results[i].algorithm) == 0) {
                alg_idx = j;
                break;
            }
        }
        
        if (alg_idx == -1) {
            alg_idx = num_global_algs++;
            strncpy(global_agg[alg_idx].algorithm, results[i].algorithm, sizeof(global_agg[0].algorithm) - 1);
        }
        
        global_agg[alg_idx].sum += results[i].stats.mean;
        global_agg[alg_idx].count++;
    }
    
    // Calculate global averages and sort
    AlgorithmAverage global_averages[10];
    for (int i = 0; i < num_global_algs; i++) {
        strncpy(global_averages[i].algorithm, global_agg[i].algorithm, sizeof(global_averages[0].algorithm) - 1);
        global_averages[i].mean = global_agg[i].sum / global_agg[i].count;
    }
    
    qsort(global_averages, num_global_algs, sizeof(AlgorithmAverage), compare_averages);
    
    if (num_global_algs > 0) {
        printf("\n[*] Ranking global (promedio sobre todos los tamanos y tipos):\n");
        printf("     ");
        for (int i = 0; i < num_global_algs; i++) {
            printf("%d. %s (%.3f ms)", i + 1, global_averages[i].algorithm, global_averages[i].mean);
            if (i < num_global_algs - 1) printf("  |  ");
        }
        printf("\n");
    }
}

// --- Main Benchmark Suite ---
int main(int argc, char* argv[]) {
    // Parse command line arguments
    size_t sizes[MAX_SIZES];
    int num_sizes = 0;
    int repetitions = 10;
    bool validate = true;
    
    if (argc > 1) {
        for (int i = 1; i < argc; i++) {
            if (strcmp(argv[i], "--reps") == 0 || strcmp(argv[i], "-r") == 0) {
                if (i + 1 < argc) {
                    repetitions = atoi(argv[++i]);
                }
            } else if (strcmp(argv[i], "--no-validate") == 0) {
                validate = false;
            } else if (strcmp(argv[i], "--help") == 0 || strcmp(argv[i], "-h") == 0) {
                printf("Uso: c_benchmarks [sizes...] [--reps repetitions] [--no-validate]\n");
                printf("\nEjemplos:\n");
                printf("  c_benchmarks                # Ejecuta con tamaño por defecto 100000\n");
                printf("  c_benchmarks 50000          # Ejecuta solo para tamaño 50000\n");
                printf("  c_benchmarks 10000 50000    # Ejecuta para varios tamaños\n");
                printf("  c_benchmarks 100000 --reps 30  # 30 repeticiones\n");
                return 0;
            } else {
                sizes[num_sizes++] = atoi(argv[i]);
            }
        }
    }
    
    if (num_sizes == 0) {
        sizes[0] = 100000;
        num_sizes = 1;
    }
    
    printf("[*] Configuracion:\n");
    printf("   - Tamanos: [");
    for (int i = 0; i < num_sizes; i++) {
        printf("%zu%s", sizes[i], (i < num_sizes - 1) ? ", " : "");
    }
    printf("]\n");
    printf("   - Repeticiones: %d\n", repetitions);
    printf("   - Seed: %lu\n", lcg_seed);
    printf("   - Validacion: %s\n", validate ? "Habilitada" : "Deshabilitada");
    printf("   - Version: Clean Benchmark con Referencias Optimizadas\n\n");
    
    printf("[*] Iniciando benchmarks C de Segment Sort (Clean Version)\n");
    printf("[*] Usando implementaciones de referencia optimizadas\n\n");
    
    printf("[*] Configuracion: %d repeticiones, analisis estadistico completo\n", repetitions);
    printf("====================================================================================================\n");
    printf("| Algoritmo                   | Tamano | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |\n");
    printf("====================================================================================================\n");
    
    // Store all results for JSON export
    BenchmarkResult* all_results = (BenchmarkResult*)malloc(1000 * sizeof(BenchmarkResult));
    int result_count = 0;
    
    for (int size_idx = 0; size_idx < num_sizes; size_idx++) {
        size_t n = sizes[size_idx];
        
        printf("\n[*] Probando con arrays de tamano: %zu\n", n);
        printf("------------------------------------------------------------\n");
        
        // Allocate arrays
        int* arr = (int*)malloc(n * sizeof(int));
        int* reference = (int*)malloc(n * sizeof(int));
        
        if (!arr || !reference) {
            printf("❌ Error: Memory allocation failed\n");
            return 1;
        }
        
        // Test cases (same as JS)
        typedef struct {
            const char* name;
            const char* short_name;
            void (*generator)(int*, size_t, int, int);
            size_t param1;
            size_t param2;
        } TestCase;
        
        TestCase test_cases[] = {
            {"Aleatorio", "Aleatorio", (void*)generate_random_array, 0, 1000},
            {"Ordenado", "Ordenado", (void*)generate_sorted_array, 0, 1000},
            {"Inverso", "Inverso", (void*)generate_reverse_array, 0, 1000},
            {"K-sorted (k=10%)", "K-sorted", NULL, n/10, 0},
            {"Nearly Sorted (5% swaps)", "NearlySorted", NULL, n/20, 0},
            {"Con Duplicados (20 únicos)", "Duplicados", NULL, 20, 0},
            {"Plateau (10 segmentos)", "Plateau", NULL, n/10, 0},
            {"Segment Sorted (5 segmentos)", "SegmentSorted", NULL, n/5, 0}
        };
        
        int num_test_cases = sizeof(test_cases) / sizeof(test_cases[0]);
        
        for (int tc = 0; tc < num_test_cases; tc++) {
            printf("\n[TEST] %s:\n", test_cases[tc].name);
            
            // Generate test data
            if (tc == 0) generate_random_array(arr, n, 0, 1000);
            else if (tc == 1) generate_sorted_array(arr, n, 0, 1000);
            else if (tc == 2) generate_reverse_array(arr, n, 0, 1000);
            else if (tc == 3) generate_k_sorted_array(arr, n, test_cases[tc].param1, 0, 1000);
            else if (tc == 4) generate_nearly_sorted_array(arr, n, test_cases[tc].param1, 0, 1000);
            else if (tc == 5) generate_duplicates_array(arr, n, test_cases[tc].param1, 0, 100);
            else if (tc == 6) generate_plateau_array(arr, n, test_cases[tc].param1, 0, 1000);
            else if (tc == 7) generate_segment_sorted_array(arr, n, test_cases[tc].param1, 0, 1000);
            
            // Generate reference result with qsort
            if (validate) {
                memcpy(reference, arr, n * sizeof(int));
                qsort(reference, n, sizeof(int), qsort_cmp);
            }
            
            // Test each algorithm
            const char* alg_names[] = {"balancedSegmentMergeSort", "blockMergeSegmentSort", "qsort"};
            void (*alg_funcs[])(int*, size_t) = {
                on_the_fly_balanced_merge_sort,
                block_merge_segment_sort,
                NULL  // qsort handled specially
            };
            
            for (int alg = 0; alg < 3; alg++) {
                BenchmarkResult result = {0};
                strncpy(result.algorithm, alg_names[alg], sizeof(result.algorithm) - 1);
                strncpy(result.data_type, test_cases[tc].short_name, sizeof(result.data_type) - 1);
                result.size = n;
                result.repetitions = repetitions;
                result.success = true;
                
                if (alg == 2) {
                    // Manual qsort benchmark
                    for (int rep = 0; rep < repetitions; rep++) {
                        int* temp = (int*)malloc(n * sizeof(int));
                        memcpy(temp, arr, n * sizeof(int));
                        
                        double start = get_time_ms();
                        qsort(temp, n, sizeof(int), qsort_cmp);
                        double end = get_time_ms();
                        
                        result.times[rep] = end - start;
                        
                        // Validate on first run
                        if (rep == 0 && validate) {
                            if (!check_sorted(temp, n)) {
                                result.success = false;
                                snprintf(result.error, sizeof(result.error), "Validation failed: array not sorted");
                                free(temp);
                                break;
                            }
                        }
                        
                        free(temp);
                    }
                    if (result.success) {
                        result.stats = calculate_stats(result.times, repetitions);
                    }
                } else {
                    result = run_benchmark(alg_names[alg], alg_funcs[alg], arr, n, 
                        test_cases[tc].short_name, repetitions, validate, 
                        validate ? reference : NULL);
                }
                
                const char* status = result.success ? "[OK]" : "[FAIL]";
                
                if (result.success) {
                    const char* validation_info = (validate && alg != 2) ? " (vs qsort)" : "";
                    printf("   %-25s | %6zu | %-18s | %9.3f | %11.3f | %8.3f | %s%s\n",
                        alg_names[alg], n, test_cases[tc].short_name,
                        result.stats.mean, result.stats.median, result.stats.std,
                        status, validation_info);
                } else {
                    printf("   %-25s | %6zu | %-18s | %9s | %11s | %8s | %s\n",
                        alg_names[alg], n, test_cases[tc].short_name,
                        "ERROR", "ERROR", "ERROR", status);
                    printf("   Error: %s\n", result.error);
                }
                
                all_results[result_count++] = result;
            }
        }
        
        free(arr);
        free(reference);
    }
    
    printf("\n====================================================================================================\n");
    printf("[*] Benchmarks completados!\n\n");
    
    // Analysis
    analyze_results(all_results, result_count);
    
    // Export to JSON
    char filename[256];
    snprintf(filename, sizeof(filename), "benchmark_results_c_%ld_seed%lu.json", 
        (long)time(NULL), lcg_seed);
    export_results_to_json(all_results, result_count, filename);
    
    free(all_results);
    return 0;
}
