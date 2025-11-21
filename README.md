# Segment Sort (On-the-Fly Balanced Merge) 🧮

[![GitHub Repository](https://img.shields.io/badge/GitHub-mcarbonell/segment--sort-blue?logo=github)](https://github.com/mcarbonell/segment-sort)

An innovative adaptive sorting algorithm that identifies sorted segments in an array and merges them **on-the-fly** using a stack-based balanced merge strategy. This repository now features the highly optimized **On-the-Fly Balanced Merge Sort** and its variants.

## 🎯 What is On-the-Fly Balanced Merge Sort?

**On-the-Fly Balanced Merge Sort** is an advanced sorting algorithm that processes segments immediately as they are detected, using a stack to maintain optimal merge balance. Unlike traditional approaches that first identify all segments then merge, this algorithm merges segments incrementally, ensuring O(log n) space complexity while maintaining O(n log n) time complexity. This makes it exceptionally fast and memory-efficient for partially sorted or structured data.

## 🌟 Independent Discovery

This algorithm was developed **completely independently** by Mario Raúl Carbonell Martínez without prior knowledge of TimSort or related academic work. Starting only from familiarity with classic sorting algorithms (quicksort, mergesort, heapsort, bubble sort, etc.), the concept of stack-based balanced merge sort was **rediscovered through original algorithmic reasoning**.

### 🔄 Algorithm Portfolio & Technical Trade-offs

The project has evolved into a portfolio of three distinct implementations, each optimized for specific constraints:

#### 1. **[SegmentSort Original](docs/segment_sort_original.md)** (C++ K-way Merge)
- **Approach**: Detect all segments upfront, K-way merge with Priority Queue.
- **Best Use Case**: General purpose when auxiliary memory is not a constraint.
- **Characteristics**: O(n) memory, O(n log K) time.

#### 2. **[On-the-fly Balanced Merge Sort](docs/on_the_fly_balanced_merge.md)** (JS, Python, C)
- **Approach**: Incremental stack-based merges with balance optimization and in-place rotation.
- **Best Use Case**: **Memory-constrained systems**, embedded devices, and data with existing structure.
- **Characteristics**: **O(log n) memory** (Optimal), O(n log n) time.
- **Highlight**: **110x Faster than QSort** on pre-sorted data (C implementation).

#### 3. **[SegmentSort Iterator](implementations/cpp/SegmentSortIterator.h)** (C++ Lazy Evaluator)
- **Approach**: Zero-copy lazy evaluation using a Min-Heap cursor over the immutable source.
- **Best Use Case**: **Top-K Queries**, Paging, Streaming, and Read-Only data sources.
- **Characteristics**: **Zero-Copy**, O(K) auxiliary memory, O(N) setup.
- **Highlight**: **22x Faster than `std::partial_sort`** on reverse data extraction.

---

## 📊 Benchmark Results

### 1. C Implementation (Performance & Embedded)

*Benchmark run on 1,000,000 elements (GCC -O3).*

The C implementation focuses on low-level optimization and memory efficiency. It uses **zero dynamic allocations** for the stack (static array) and performs merges using `symmerge` (in-place rotation).

| Data Type | Size | SegmentSort (C) | QSort (std) | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Sorted** | 1M | **0.22 ms** | 24.28 ms | 🚀 **x110 Faster** |
| **Reverse** | 1M | **0.46 ms** | 25.86 ms | 🚀 **x56 Faster** |
| **Nearly Sorted** | 1M | **3.00 ms** | 25.50 ms | 🔥 **x8.5 Faster** |
| **Random** | 1M | 142.40 ms | 64.20 ms | x2.2 Slower (Trade-off for O(log n) RAM) |
| **Duplicates** | 1M | 75.70 ms | 18.80 ms | Slower (Optimization opportunity) |

**Key Insight**: For any dataset with natural structure (even partial), SegmentSort C implementation is orders of magnitude faster than standard QuickSort, while using significantly less memory than TimSort/MergeSort.

### 2. C++ SegmentSort Iterator (Top-K Extraction)

*Benchmark: Extracting Top-K elements from an **immutable** 1,000,000 element array.*

| Data Type | Task | SegIt (Zero-Copy) | std::partial_sort (Copy) | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Reverse** | Top-1,000 | **1.31 ms** | 16.63 ms | 🚀 **x12.7 Faster** |
| **Reverse** | Top-10 | **0.91 ms** | 7.70 ms | 🚀 **x8.4 Faster** |
| **10-Segments** | Top-10,000 | **1.40 ms** | 1.62 ms | ✅ **x1.15 Faster** |
| **Random** | Top-1,000 | 9.17 ms | 0.83 ms | Slower (Overhead on chaos) |

**Key Insight**: The Iterator is the superior choice when you cannot afford to copy the source array (memory limits) or when the data has structure (e.g., time-series logs). 100% Zero-Copy/Memory-Safe

### 3. JavaScript Performance (Node.js V8)

*Benchmark run on 1,000,000 elements.*

| Algorithm | Global Avg | vs builtinSort | Note |
| :--- | :--- | :--- | :--- |
| **On-the-Fly Balanced** | **69.39 ms** | **27% faster** | **Best Overall** |
| builtinSort (V8) | 95.80 ms | Baseline | |
| SegmentSort Original | 292.76 ms | -67% slower | Legacy |

---

## 🛠️ Installation and Usage

### C Implementation (New!)
Pure C99, zero dependencies. Ideal for integration into existing C projects.
```bash
cd implementations/c
# Compile and run the benchmark
gcc -O3 benchmark.c -o benchmark
./benchmark
```

### C++ Iterator (Top-K / Streaming)
Header-only C++11 implementation.
```bash
cd implementations/cpp
# Compile and run the iterator benchmark
g++ -O3 benchmark_iterator.cpp -o benchmark_iterator
./benchmark_iterator
```

### Python Execution
```bash
cd implementations/python
python3 balanced_segment_merge_sort.py
```

### JavaScript Execution
```bash
cd implementations/javascript
node balanced_segment_merge_sort.js
```

### Run Tests
```bash
# Python tests
cd tests && python run_balanced_segment_merge_sort_tests.py
# JavaScript tests  
cd tests && node run_balanced_segment_merge_tests.js
```

## 📁 Repository Structure

```
segment-sort/
├── README.md                    # Main Documentation
├── implementations/             # Code by language
│   ├── c/                       # C Implementation (High Perf / Embedded)
│   │   ├── balanced_segment_merge_sort.c
│   │   ├── balanced_segment_merge_sort.h  # Header-only lib
│   │   └── benchmark.c
│   ├── cpp/                     # C++ Implementations
│   │   ├── SegmentSortIterator.h          # NEW: Lazy Iterator
│   │   ├── benchmark_iterator.cpp         # Iterator Benchmark
│   │   ├── balanced_segment_merge_sort.cpp
│   │   └── segmentsort.cpp                # Original K-way merge
│   ├── python/                  # Python Reference
│   └── javascript/              # JavaScript Reference
├── benchmarks/                  # Legacy Benchmarks (JS/Python)
├── tests/                       # Comprehensive test suite
└── docs/                        # Detailed Algorithm Docs
```

## 🔬 Theoretical Analysis

### Time Complexity
- **Best case**: O(n) - when the array is already sorted or reverse sorted (single segment)
- **Average case**: O(n log n) - with random distribution of segments
- **Worst case**: O(n log n) - with alternating single elements
- **Adaptive**: Performance improves with existing order

### Space Complexity
- **O(log n)** - Optimal space usage for the segment stack
- **No auxiliary arrays needed** - In-place processing except for final result

### Advantages
1. **Cross-Language Performance**: Exceptional in JavaScript (27% faster than V8 builtin), competitive in C/C++.
2. **Memory Efficient**: O(log n) space complexity - optimal auxiliary space usage.
3. **Adaptive Excellence**: Automatically optimizes for existing data structure and partial ordering.
4. **Stable**: Maintains relative order of equal elements.
5. **Robust**: Immune to worst-case scenarios that catastrophically affect quicksort and other algorithms.

### Limitations
1. **Slight Overhead**: Small performance penalty on completely random data compared to non-stable, O(n) memory sorts.

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Segment Sort Algorithm Project**
- Created by: Mario Raúl Carbonell Martínez
- Date: November 2025
- Version: 2.1 (Includes C & Iterator)

---

⭐ **If you like the project, don't forget to give it a star on GitHub!**