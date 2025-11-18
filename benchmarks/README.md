# Benchmarks Directory - Segment Sort

This directory contains the comprehensive benchmarking suite for the Segment Sort algorithms. The structure has been reorganized for better maintainability and clarity.

## Directory Structure

```
benchmarks/
├── README.md                          # This file
├── results/                           # Benchmark results (auto-generated)
│   └── archive/                       # Historical results
├── scripts/                           # Analysis and comparison scripts
│   ├── compare_quicksorts.js         # QuickSort implementation comparison
│   └── optimized_quicksort.js        # Optimized reference implementations
├── tools/                            # Development and debugging tools
│   ├── benchmark_core.js             # Reusable benchmark framework
│   ├── debug_segments.py             # Segment debugging utilities
│   └── test_comparison.py            # Cross-implementation testing
├── languages/                        # Language-specific benchmarks
│   ├── javascript/                   # JavaScript benchmarks
│   │   └── js_benchmarks.js          # Main JavaScript benchmark
│   ├── cpp/                          # C++ benchmarks
│   │   ├── cpp_benchmarks.cpp        # Main C++ benchmark
│   │   ├── cpp_benchmarks.h          # Header file
│   │   └── compile.bat               # Compilation script
│   ├── python/                       # Python benchmarks
│   │   └── python_benchmarks.py      # Main Python benchmark
│   └── multi-language/               # Cross-language comparisons
├── datasets/                         # Test data generators
└── web/                             # Web-based visualization tools
    ├── benchmark_web.html            # Web interface
    └── benchmark_web.js              # JavaScript logic
```

## Quick Start

### Run JavaScript Benchmarks
```bash
cd benchmarks/languages/javascript
node js_benchmarks.js 100000 --reps 10
```

### Run C++ Benchmarks
```bash
cd benchmarks/languages/cpp
./compile.bat
cpp_benchmarks.exe 100000
```

### Run Python Benchmarks
```bash
cd benchmarks/languages/python
python python_benchmarks.py 100000
```

## Analysis Scripts

### QuickSort Implementation Comparison
```bash
cd benchmarks/scripts
node compare_quicksorts.js
```

This script compares different QuickSort implementations to validate benchmark fairness.

## Results

Benchmark results are automatically saved to `benchmarks/results/` with timestamped filenames. Historical results are archived in the `archive/` subdirectory.

## Contributing

When adding new benchmarks or analysis tools:

1. Place language-specific benchmarks in `languages/{language}/`
2. Add analysis scripts to `scripts/`
3. Put debugging/development tools in `tools/`
4. Update this README with new functionality

## Legacy Files

Legacy files have been moved to `legacy/` for reference but are no longer actively maintained.

---

For more information about the algorithms being benchmarked, see the main [README.md](../README.md) and [documentation](../docs/).