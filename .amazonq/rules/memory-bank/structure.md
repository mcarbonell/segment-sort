# Project Structure

## Directory Organization

```
segment-sort/
├── implementations/     # Core algorithm implementations
├── benchmarks/         # Performance testing framework
├── tests/             # Test suites for all implementations
├── docs/              # Technical documentation and papers
├── original_code/     # Historical development and prototypes
├── visualizations/    # Interactive algorithm visualizers
└── .amazonq/          # Amazon Q configuration and rules
```

## Core Components

### 1. implementations/

Algorithm implementations in multiple languages, organized by language:

**implementations/c/**
- `block_merge_segment_sort.h` - Main algorithm with fixed 64K buffer (RECOMMENDED)
- `balanced_segment_merge_sort.h` - Memory-efficient O(log N) space variant
- `balanced_segment_merge_sort.c` - Test suite for balanced variant
- `benchmark.c` - Legacy benchmark runner
- Multiple benchmark executables and result files

**implementations/cpp/**
- `block_merge_segment_sort.h` - C++ version of main algorithm
- `SegmentSortIterator.h` - Zero-copy lazy evaluation iterator
- `SegmentSortIterator.cpp` - Iterator implementation
- `segmentsort.cpp` - Original K-way merge reference
- `benchmark_block.cpp` - C++ benchmarking suite
- `benchmark_iterator.cpp` - Iterator-specific benchmarks

**implementations/javascript/**
- `block_merge_segment_sort.js` - JavaScript implementation
- `balanced_segment_merge_sort.js` - Memory-efficient JS variant
- `segmentsort.js` - Original K-way merge version

**implementations/python/**
- `balanced_segment_merge_sort.py` - Python implementation
- `segmentsort.py` - Original Python version

### 2. benchmarks/

Comprehensive benchmarking framework with multi-language support:

**benchmarks/languages/**
- `cpp/` - C++ benchmarks including TimSort comparison
- `javascript/` - JavaScript benchmarking suite
- `python/` - Python performance tests
- `multi-language/` - Cross-language comparison tools

**benchmarks/datasets/**
- Dataset generation and management
- Test data patterns (sorted, reverse, random, nearly-sorted, duplicates)

**benchmarks/results/**
- JSON benchmark results with timestamps and seeds
- Historical performance data for regression tracking
- Organized by date in subdirectories

**benchmarks/scripts/**
- `builtin_sort_reference.js` - Standard library baseline
- `compare_quicksorts.js` - QuickSort variant comparisons
- `heap_sort_reference.js` - HeapSort baseline
- `merge_sort_reference.js` - MergeSort baseline
- `optimized_quicksort.js` - Optimized QuickSort implementation

**benchmarks/tools/**
- `benchmark_core.js` - Core benchmarking utilities
- `debug_segments.py` - Segment detection debugging
- `test_comparison.py` - Algorithm comparison tools

**benchmarks/web/**
- `benchmark_web.html` - Interactive web-based benchmark runner
- `benchmark_web.js` - Web benchmark implementation

**Root benchmark files:**
- `c_benchmarks.c` - Comprehensive C benchmark suite
- `js_benchmarks.js` - JavaScript benchmark runner
- `benchmark_charts.html` - Interactive result visualizer
- `generate_graphs.py` - Graph generation from results
- `Makefile` - Build and run automation

### 3. tests/

Test suites for all language implementations:

- `run_balanced_segment_merge_sort_tests.py` - Python test runner
- `run_balanced_segment_merge_tests.js` - JavaScript test runner
- `run_cpp_tests.cpp` - C++ test suite
- `run_go_tests.go` - Go test suite
- `run_js_tests.js` - JavaScript test suite
- `run_php_tests.php` - PHP test suite
- `run_python_tests.py` - Python test suite
- `run_rust_tests.rs` - Rust test suite
- `RunJavaTests.java` - Java test suite
- `test_cases.json` - Shared test case definitions

### 4. docs/

Technical documentation and research papers:

**Algorithm Documentation:**
- `TECHNICAL_PAPER.md` - Academic-style technical paper
- `ANALYSIS_BLOCK_MERGE.md` - Detailed block merge analysis
- `on_the_fly_balanced_merge.md` - Balanced merge documentation (Spanish)
- `on_the_fly_balanced_merge_sort_english.md` - English version
- `segment_sort_original.md` - Original K-way merge documentation
- `balanced_segment_merge_variant.md` - Variant analysis

**Performance Documentation:**
- `HOW_I_BEAT_QSORT.md` - qsort comparison analysis
- `HOW_I_BEAT_STD_SORT.md` - std::sort comparison analysis
- `BENCHMARK_RESULTS_CPP.md` - C++ benchmark results
- `benchmarking_methodology.md` - Testing methodology

**Development Documentation:**
- `implementation_guide.md` - Implementation guidelines
- `ROADMAP.md` - Project roadmap
- `STRATEGIC_ROADMAP.md` - Strategic development plan

### 5. original_code/

Historical development and prototype implementations:

- `mergesegmentsort.cpp` - Early merge-based prototype
- `mergesegmentsort2.cpp` - Second iteration
- `mergesegmentsort3.cpp` - Third iteration
- `segmentsort_original.cpp` - Original segment sort
- `benchmark.cpp` - Original benchmark
- `benchmark2.cpp` - Second benchmark iteration
- Multi-language prototypes: `.go`, `.java`, `.js`, `.py`, `.rs`
- `idea.txt` - Original algorithm concept notes
- `merge_strategies.pdf` - Merge strategy analysis

### 6. visualizations/

Interactive algorithm visualizers:

- `on_the_fly_visualizer.html` - Visual demonstration of algorithm
- `README.md` - Visualizer documentation

## Architectural Patterns

### Algorithm Architecture

**Three-Layer Design:**

1. **Segment Detection Layer**
   - Identifies naturally sorted runs (ascending/descending)
   - Reverses descending runs in-place
   - Builds segment metadata (start, length)

2. **Merge Strategy Layer**
   - Stack-based balanced merging
   - Maintains invariant: L₁ ≥ L₂ ≥ L₃ ≥ ...
   - Prevents degeneration to O(N²)

3. **Buffer Management Layer**
   - Fixed 64K buffer for cache efficiency
   - Hybrid merge: linear merge (buffer) vs rotation (in-place)
   - Optimal buffer size empirically determined

### Code Organization Patterns

**Header-Only Libraries (C/C++):**
- Single-file inclusion for easy integration
- No separate compilation required
- Template-based for type flexibility

**Module Pattern (JavaScript):**
- CommonJS exports for Node.js
- Self-contained implementations
- Easy require/import integration

**Test-Driven Structure:**
- Separate test files for each implementation
- Shared test case definitions (JSON)
- Automated test runners

**Benchmark Framework:**
- Modular benchmark core
- Language-specific runners
- Unified result format (JSON)
- Cross-language comparison tools

## Component Relationships

### Implementation Dependencies

```
block_merge_segment_sort.h (main)
    ↓
    Uses: Fixed 64K buffer + Stack-based merge
    ↓
    Optimized for: 1K-10M elements, structured data

balanced_segment_merge_sort.h (memory-efficient)
    ↓
    Uses: In-place rotation + Stack-based merge
    ↓
    Optimized for: Embedded systems, minimal memory

SegmentSortIterator.h (lazy evaluation)
    ↓
    Uses: Min-heap + Zero-copy
    ↓
    Optimized for: Top-K queries, streaming
```

### Benchmark Pipeline

```
Test Data Generation
    ↓
Algorithm Execution (timed)
    ↓
Result Collection (JSON)
    ↓
Visualization (HTML/Charts)
    ↓
Analysis & Comparison
```

### Cross-Language Validation

```
C Implementation (reference)
    ↓
C++ Port (with STL integration)
    ↓
JavaScript Port (V8 validation)
    ↓
Python Port (educational)
    ↓
Cross-validation ensures correctness
```

## Build System

### C/C++ Compilation

**Makefile targets:**
- `make c` - Build and run C benchmarks
- `make cpp` - Build and run C++ benchmarks
- `make js` - Run JavaScript benchmarks
- `make clean` - Clean build artifacts

**Compiler flags:**
- `-O2` or `-O3` - Optimization level
- `-lm` - Math library linking
- `-std=c11` or `-std=c++17` - Language standard

### JavaScript Execution

**Node.js runtime:**
- Direct execution: `node script.js`
- No build step required
- V8 engine optimization

### Python Execution

**Python 3.x:**
- Direct execution: `python script.py`
- No compilation required
- Setup script: `setup.py` for package installation

## Configuration Files

- `.gitignore` - Git exclusion patterns
- `LICENSE` - MIT license
- `README.md` - Main project documentation
- `setup.py` - Python package setup
- `validate_setup.py` - Environment validation
- `Makefile` - Build automation

## Data Flow

### Sorting Operation Flow

```
Input Array
    ↓
Segment Detection (O(N))
    ↓
Segment Stack Building
    ↓
Balanced Merge Loop
    │
    ├─→ Buffer Merge (if segment fits)
    │   └─→ O(N) linear merge
    │
    └─→ Rotation Merge (if segment too large)
        └─→ O(N log N) SymMerge
    ↓
Sorted Array
```

### Benchmark Data Flow

```
Benchmark Configuration
    ↓
Data Generation (multiple patterns)
    ↓
Warmup Runs
    ↓
Timed Execution (multiple iterations)
    ↓
Statistical Analysis (mean, median, std dev)
    ↓
JSON Result Export
    ↓
Visualization & Reporting
```
