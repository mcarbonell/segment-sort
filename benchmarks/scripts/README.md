# Analysis Scripts

This directory contains scripts for analyzing benchmark results and comparing implementations.

## Available Scripts

### `compare_quicksorts.js`
Compares different QuickSort implementations to validate benchmark fairness.

**Purpose**: Ensures that benchmark results aren't skewed by suboptimal reference implementations.

**Usage**:
```bash
cd benchmarks/scripts
node compare_quicksorts.js
```

**Output**: Performance comparison of:
- Original QuickSort (from main benchmarks)
- Optimized QuickSort (with all standard optimizations)
- SegmentSort implementations
- Built-in sort functions

### `optimized_quicksort.js`
Contains optimized reference implementations of QuickSort and related algorithms.

**Features**:
- Median-of-three pivot selection
- Insertion sort for small arrays
- 3-way partition for handling duplicates
- Tail recursion elimination
- Hybrid approaches (Introsort)

**Usage**: Import functions for use in other benchmarks or analysis.

### `merge_sort_reference.js`
Reference implementation of Merge Sort algorithms.

**Implementations**:
- Standard recursive MergeSort
- In-place MergeSort
- Iterative (bottom-up) MergeSort
- Optimized MergeSort with insertion sort threshold

**Features**:
- Multiple algorithmic approaches
- Performance optimizations
- Educational implementations with detailed comments

### `heap_sort_reference.js`
Reference implementation of Heap Sort algorithms.

**Implementations**:
- Standard HeapSort with array-based heap
- MinHeap and MaxHeap classes
- Alternative heap sort implementations

**Features**:
- Complete heap data structure implementations
- Multiple heap sort variants
- Educational examples

### `builtin_sort_reference.js`
Analysis and reference implementations for built-in sorting functions.

**Features**:
- JavaScript built-in sort analysis
- Performance measurement utilities
- Custom comparator factory
- Browser-specific optimizations (Web Workers)

**Purpose**: Understanding and benchmarking the performance characteristics of native sorting functions.

## Adding New Analysis Scripts

When creating new analysis scripts:

1. Place in this directory (`benchmarks/scripts/`)
2. Follow naming convention: `{purpose}_analyzer.js` or `{tool}_tools.js`
3. Include usage examples in comments
4. Ensure output is machine-readable (JSON) when possible
5. Add documentation to this README

## Script Guidelines

- Use consistent output formatting
- Include error handling and validation
- Support command-line arguments for flexibility
- Document any external dependencies
- Include comprehensive test cases and examples

## Performance Analysis

The scripts in this directory are designed to:
- Provide fair and optimized reference implementations
- Enable detailed performance analysis
- Support algorithm comparison and validation
- Serve as educational resources for sorting algorithms

All reference implementations include:
- Time and space complexity analysis
- Performance characteristics
- Stability and adaptivity information
- Usage examples and testing