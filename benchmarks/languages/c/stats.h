#ifndef STATS_H
#define STATS_H

typedef struct {
    double mean;
    double median;
    double std;
    double min;
    double max;
    double p5;
    double p95;
} Statistics;

Statistics calculate_stats(double* times, int count);

#endif // STATS_H
