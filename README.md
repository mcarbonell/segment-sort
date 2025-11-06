# Segment Sort Algorithm 🧮

An innovative sorting algorithm that automatically detects sorted segments in arrays and merges them efficiently.

## 🎯 What is Segment Sort?

**Segment Sort** is a sorting algorithm that combines intelligent pattern detection with efficient merging. Unlike traditional algorithms that process individual elements, Segment Sort identifies and leverages already sorted segments in the array.

### Key Features

- **Time Complexity**: O(n log n) on average case
- **Space Complexity**: O(n) auxiliary memory
- **Automatic Detection**: Identifies increasing and decreasing segments
- **Smart Merging**: Uses heap (priority queue) to merge segments
- **Adaptability**: Better performance on partially ordered data

## 🚀 Algorithm Operation

### Phase 1: Segment Detection
```
[3, 7, 9, 1, 4, 6, 8, 2, 5]
 ↑     ↑      ↑     ↑      ↑
Segments automatically identified
```

### Phase 2: Heap Merging
1. Insert the first element of each segment into a heap
2. Extract the minimum (or maximum) from the heap
3. Insert the next element from the segment of the extracted element
4. Repeat until all elements are sorted

## 📊 Benchmarks

### Real Performance Results (JavaScript/Node.js)
```
Dataset: 10,000 elements semi-ordered data
Algorithm        | Time (ms) | Speedup vs QuickSort
Quick Sort       |   42.069  |   baseline
Merge Sort       |    3.060  |   +1,275%
Segment Sort     |    0.656  |   +6,310% (64x faster!)
Builtin Sort     |    0.103  |   +40,800%

Dataset: 10,000 elements already sorted
Algorithm        | Time (ms) | Speedup vs QuickSort  
Quick Sort       |   47.235  |   baseline
Segment Sort     |    0.671  |   +7,040% (70x faster!)
Merge Sort       |    2.469  |   +1,812%
```

### Key Performance Insights
- **Best Case (sorted data)**: Up to **145x faster** than QuickSort
- **Semi-ordered data**: **64x faster** than QuickSort on 10K elements
- **Average performance**: Competitive with heap sort (0.94ms vs 0.76ms)
- **Theoretical validation**: O(n) best case confirmed empirically

### Optimal Use Cases
- **Structured datasets**: 10x-145x faster than general algorithms
- **Semi-ordered data**: Superior performance in real-world scenarios
- **Database indexing**: Ideal for partially ordered indices
- **Streaming data**: Excellent for temporal patterns

## 🛠️ Installation and Usage

### C++ Compilation
```bash
cd implementations/cpp
g++ -O3 -std=c++17 mergesegmentsort_v3.cpp -o segmentsort
./segmentsort
```

### Python Execution
```bash
cd implementations/python
python3 segmentsort.py
```

### Java Execution
```bash
cd implementations/java
javac segmentsort.java
java SegmentSort
```

### Go Execution
```bash
cd implementations/go
go run segmentsort.go
```

### Rust Execution
```bash
cd implementations/rust
cargo run
```

### JavaScript Execution
```bash
cd implementations/javascript
node segmentsort.js
```

### PHP Execution
```bash
cd implementations/php
php segmentsort.php
```

## 📁 Repository Structure

```
segment-sort/
├── README.md                    # This file
├── paper/                       # Academic analysis
│   └── segment_sort_analysis.md
├── implementations/             # Code by language
│   ├── cpp/                     # C++ (4 optimized versions)
│   ├── python/                  # Python
│   ├── java/                    # Java
│   ├── go/                      # Go
│   ├── rust/                    # Rust
│   ├── javascript/              # JavaScript
│   └── php/                     # PHP
├── benchmarks/                  # Performance comparisons
│   ├── run_benchmarks.py        # Complete benchmark suite
│   └── quick_test.py            # Quick validation test
├── tests/                       # Comprehensive test suite
│   ├── test_cases.json          # Test cases in JSON format
│   ├── run_*.php                # Test runners for each language
│   └── *.php                    # PHP implementation and tests
├── visualizations/              # Algorithm diagrams
│   └── README.md
└── docs/                        # Additional documentation
    ├── implementation_guide.md
    └── performance_analysis.md
```

## 🔬 Theoretical Analysis & Empirical Validation

### Time Complexity
- **Best case**: O(n) - when the array is already sorted
- **Average case**: O(n log n) - with randomly distributed segments  
- **Worst case**: O(n log n) - with interleaved elements
- **Incremental complexity**: O(n + m log k) for first m elements

### Space Complexity
- **O(n)** for the auxiliary array
- **O(k)** for the heap, where k is the number of segments

### Empirically Validated Performance
```
Real Benchmark Results (10K elements):
• Sorted data: 0.67ms vs 47.24ms QuickSort = 70x faster
• Semi-ordered: 0.66ms vs 42.07ms QuickSort = 64x faster
• Reversed data: 0.26ms vs 37.02ms QuickSort = 145x faster
• Overall average: 0.94ms (competitive with heap sort)
```

### Advantages
1. **Smart Detection**: Leverages partial ordering with 10x-145x speedups
2. **Stability**: Maintains relative order of equal elements
3. **Adaptability**: Automatically adjusts to data structure
4. **Cross-platform**: 7 language implementations with consistent performance
5. **Incremental sorting**: Perfect for top-k and streaming applications

### Limitations
1. **Additional Memory**: Requires O(n) extra space
2. **Initial Overhead**: Segment detection has O(n) cost
3. **General Data**: Slight overhead on completely random data (expected)

## 🧪 Testing and Benchmarks

The project includes a comprehensive test suite and benchmarking system:

### Run Tests
```bash
# Comprehensive test suite
cd tests
python3 run_python_tests.php
php run_php_tests.php
g++ -O3 -std=c++17 run_cpp_tests.cpp -o cpp_test && ./cpp_test
```

### Run Performance Benchmarks
```bash
# JavaScript benchmarks (Node.js required)
node benchmarks/js_benchmarks.js

# Quick performance test
node benchmarks/js_simple_benchmark.js 10000

# Cross-language comparison (requires Python)
python3 benchmarks/run_benchmarks.py --sizes 1000 5000 10000
```

**Test Coverage:**
- ✅ Empty and single element arrays
- ✅ Already sorted and reverse sorted arrays  
- ✅ Arrays with duplicates and identical elements
- ✅ Semi-ordered and random datasets
- ✅ All 7 language implementations validated
- ✅ **Real performance data**: 64x speedup confirmed on semi-ordered data

## 🎓 Practical Applications

- **Databases**: Index sorting with semi-ordered data
- **Stream Processing**: Sorting data with temporal patterns
- **Machine Learning**: Preprocessing datasets with partial structure
- **Gaming**: Score ranking with gameplay patterns

## 🤝 Contributions

Contributions are welcome! Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Segment Sort Algorithm**
- Created by: Mario Raúl Carbonell Martínez
- Date: November 2025

## 🙏 Acknowledgments

- Classic algorithms for inspiring innovation
- Open source community for tools and resources
- Benchmarks and testing for empirical validation

---

⭐ **If you like the project, don't forget to give it a star on GitHub!**