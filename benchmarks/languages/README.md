# Language-Specific Benchmarks

This directory contains benchmark implementations for different programming languages.

## Available Languages

### JavaScript (`javascript/`)
- **Main Benchmark**: `js_benchmarks.js`
- **Features**: Comprehensive testing with statistical analysis
- **Usage**: `node js_benchmarks.js [sizes...] [--reps N] [--no-validate]`

### C++ (`cpp/`)
- **Main Benchmark**: `cpp_benchmarks.cpp`
- **Features**: High-performance implementation with detailed timing
- **Compilation**: `g++ -O3 -std=c++17 cpp_benchmarks.cpp -o cpp_benchmarks`
- **Usage**: `./cpp_benchmarks.exe [size] [repetitions]`

### Python (`python/`)
- **Main Benchmark**: `python_benchmarks.py`
- **Features**: Easy-to-modify implementation for experimentation
- **Usage**: `python python_benchmarks.py [size] [--repetitions N]`

## Cross-Language Comparisons

For comparing performance across languages, see the `multi-language/` directory (to be implemented).

## Adding a New Language

To add benchmarks for a new language:

1. Create a new directory: `benchmarks/languages/{language}/`
2. Implement the benchmark following the pattern of existing languages
3. Ensure all algorithms are tested consistently
4. Add usage documentation to this README
5. Update the main `benchmarks/README.md`

## Consistency Guidelines

All language implementations should:
- Test the same algorithms (BalancedSegmentMergeSort, SegmentSort, QuickSort, etc.)
- Use the same test data generation methods
- Provide comparable output formats
- Include validation of sorted results
- Support configurable array sizes and repetition counts