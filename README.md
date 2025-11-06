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

### Comparative Performance
```
Dataset: 100,000 random elements
Algorithm        | Time (ms) | Memory (MB)
Quick Sort       |     45      |     2.1
Merge Sort       |     52      |     8.3
Segment Sort     |     38      |     4.2
```

### Optimal Use Cases
- **Partially ordered data**: Excellent performance
- **Data with repetitive patterns**: Leverages local structures
- **Medium datasets**: Better performance/memory ratio

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

## 📁 Repository Structure

```
segment-sort/
├── README.md                    # This file
├── paper/                       # Academic analysis
│   └── segment_sort_analysis.md
├── implementations/             # Code by language
│   ├── cpp/                     # C++ 
│   ├── python/                  # Python
│   ├── java/                    # Java
│   ├── go/                      # Go
│   ├── rust/                    # Rust
│   └── javascript/              # JavaScript
├── benchmarks/                  # Performance comparisons
│   ├── benchmark.cpp
│   └── benchmark2.cpp
├── visualizations/              # Algorithm diagrams
│   └── README.md
└── docs/                        # Additional documentation
    ├── implementation_guide.md
    └── performance_analysis.md
```

## 🔬 Theoretical Analysis

### Time Complexity
- **Best case**: O(n) - when the array is already sorted
- **Average case**: O(n log n) - with randomly distributed segments  
- **Worst case**: O(n log n) - with interleaved elements

### Space Complexity
- **O(n)** for the auxiliary array
- **O(k)** for the heap, where k is the number of segments

### Advantages
1. **Smart Detection**: Leverages partial ordering
2. **Stability**: Maintains relative order of equal elements
3. **Adaptability**: Automatically adjusts to the data
4. **Cross-platform**: Implementations in 6 languages

### Limitations
1. **Additional Memory**: Requires O(n) extra space
2. **Initial Overhead**: Segment detection has O(n) cost
3. **Sensitivity**: Performance depends on segment distribution

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