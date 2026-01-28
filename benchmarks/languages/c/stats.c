#include "stats.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>

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
