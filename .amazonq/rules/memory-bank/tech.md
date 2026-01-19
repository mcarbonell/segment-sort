# Technology Stack

## Programming Languages

### C (Primary Implementation)
- **Version**: C11 standard
- **Compiler**: GCC 11.2.0 or compatible
- **Optimization**: `-O2` or `-O3` flags required for performance
- **Usage**: Core algorithm implementations, performance benchmarks
- **Files**: `implementations/c/*.h`, `implementations/c/*.c`, `benchmarks/c_benchmarks.c`

### C++ (Advanced Features)
- **Version**: C++17 standard
- **Compiler**: GCC 11.2.0, Clang, or MSVC
- **Features Used**: Templates, iterators, STL containers (priority_queue, vector)
- **Usage**: Iterator-based lazy evaluation, STL integration
- **Files**: `implementations/cpp/*.h`, `implementations/cpp/*.cpp`

### JavaScript (Cross-Platform Validation)
- **Runtime**: Node.js v18.16.0+
- **Engine**: V8
- **Standard**: ES6+ (const, let, arrow functions, destructuring)
- **Usage**: Web benchmarks, cross-language validation
- **Files**: `implementations/javascript/*.js`, `benchmarks/js_benchmarks.js`

### Python (Educational & Tooling)
- **Version**: Python 3.x
- **Usage**: Testing, visualization, data analysis
- **Libraries**: Standard library only (no external dependencies)
- **Files**: `implementations/python/*.py`, `tests/*.py`, `benchmarks/tools/*.py`

### Other Languages (Prototypes)
- **Go**: `original_code/segmentsort.go`
- **Rust**: `original_code/segmentsort.rs`
- **Java**: `original_code/segmentsort.java`
- **PHP**: `tests/run_php_tests.php`

## Build Systems

### Make (Primary)
- **File**: `benchmarks/Makefile`
- **Targets**:
  - `make c` - Compile and run C benchmarks
  - `make cpp` - Compile and run C++ benchmarks
  - `make js` - Run JavaScript benchmarks
  - `make clean` - Remove build artifacts

### GCC/G++ (Compilation)
- **C Compilation**: `gcc -O3 -o output source.c -lm`
- **C++ Compilation**: `g++ -O3 -std=c++17 -o output source.cpp`
- **Required Flags**:
  - `-O2` or `-O3` - Optimization (critical for performance)
  - `-lm` - Math library (for C)
  - `-std=c11` or `-std=c++17` - Language standard

### PowerShell Scripts
- **File**: `implementations/c/run_all_benchmarks.ps1`
- **Usage**: Automated benchmark execution on Windows

## Development Tools

### Version Control
- **System**: Git
- **Platform**: GitHub
- **Repository**: https://github.com/mcarbonell/segment-sort
- **Ignore**: `.gitignore` configured for build artifacts, executables

### Testing Framework
- **Approach**: Custom test runners per language
- **Test Files**:
  - C: `implementations/c/balanced_segment_merge_sort.c`
  - C++: `tests/run_cpp_tests.cpp`
  - JavaScript: `tests/run_js_tests.js`, `tests/run_balanced_segment_merge_tests.js`
  - Python: `tests/run_python_tests.py`, `tests/run_balanced_segment_merge_sort_tests.py`
- **Test Data**: `tests/test_cases.json` - Shared test case definitions

### Benchmarking Tools
- **Core**: `benchmarks/tools/benchmark_core.js` - Reusable benchmark utilities
- **Visualization**: `benchmarks/benchmark_charts.html` - Interactive HTML visualizer
- **Graph Generation**: `benchmarks/generate_graphs.py` - Python-based graph creation
- **Result Format**: JSON with timestamps, seeds, and statistical data

### Debugging Tools
- **Segment Analysis**: `benchmarks/tools/debug_segments.py` - Visualize segment detection
- **Comparison**: `benchmarks/tools/test_comparison.py` - Algorithm comparison
- **Web Debugger**: `benchmarks/web/benchmark_web.html` - Browser-based testing

## Dependencies

### C/C++ Dependencies
- **Standard Library Only**: No external dependencies
- **System Libraries**:
  - `stdlib.h` - Memory allocation, qsort
  - `string.h` - Memory operations (memcpy, memmove)
  - `math.h` - Mathematical functions (sqrt)
  - `time.h` - Timing functions
  - `stdio.h` - I/O operations

### JavaScript Dependencies
- **Runtime**: Node.js (no npm packages required)
- **Built-in Modules**:
  - `fs` - File system operations
  - `path` - Path manipulation
  - Standard JavaScript (Array, Math, JSON)

### Python Dependencies
- **Standard Library Only**: No pip packages required
- **Modules Used**:
  - `time` - Performance timing
  - `random` - Test data generation
  - `json` - Result serialization
  - `sys`, `os` - System operations

## Development Commands

### Building & Running

**C Benchmarks:**
```bash
cd benchmarks
gcc -O3 -o c_benchmarks c_benchmarks.c -lm
./c_benchmarks
```

**C++ Benchmarks:**
```bash
cd implementations/cpp
g++ -O3 -std=c++17 -o benchmark_block benchmark_block.cpp
./benchmark_block
```

**JavaScript Benchmarks:**
```bash
cd benchmarks
node js_benchmarks.js
```

**Python Tests:**
```bash
cd tests
python run_balanced_segment_merge_sort_tests.py
```

### Using Makefile

```bash
cd benchmarks

# Run C benchmarks
make c

# Run JavaScript benchmarks
make js

# Clean build artifacts
make clean
```

### Validation

```bash
# Validate development environment
python validate_setup.py

# Run all tests
cd tests
python run_python_tests.py
node run_js_tests.js
```

## Performance Optimization

### Compiler Optimizations
- **Required**: `-O2` or `-O3` for competitive performance
- **Impact**: 10-50× speedup over `-O0`
- **Flags Used**:
  - `-O3` - Aggressive optimization
  - `-march=native` - CPU-specific optimizations (optional)
  - `-funroll-loops` - Loop unrolling (optional)

### Algorithm Optimizations
- **Fixed Buffer**: 64K elements (256KB) for L2 cache fit
- **Stack-Based Merge**: Avoids recursion overhead
- **In-Place Operations**: Minimizes memory allocation
- **Hybrid Strategy**: Switches between merge techniques

### Profiling Tools
- **C/C++**: `gprof`, `perf`, `valgrind`
- **JavaScript**: Node.js built-in profiler, V8 profiler
- **Python**: `cProfile`, `timeit`

## Platform Support

### Operating Systems
- **Primary**: Windows 10 Pro (64-bit)
- **Tested**: Linux (Ubuntu, Debian), macOS
- **Compatibility**: Cross-platform (POSIX-compliant)

### CPU Architecture
- **Primary**: x86-64 (Intel Core i7-9700K @ 3.60GHz)
- **Cache**: Optimized for typical L2 cache (256KB-512KB)
- **Cores**: Single-threaded (parallel version planned)

### Memory Requirements
- **Algorithm**: 256KB fixed buffer + O(log N) stack
- **Benchmarks**: Varies by test size (1K to 10M elements)
- **Minimum**: 512MB RAM recommended

## File Formats

### Source Code
- **C/C++ Headers**: `.h` files (header-only libraries)
- **C/C++ Implementation**: `.c`, `.cpp` files
- **JavaScript**: `.js` files (CommonJS modules)
- **Python**: `.py` files (standard modules)

### Data Files
- **Benchmark Results**: `.json` files with structured data
- **Test Cases**: `.json` files with test definitions
- **Documentation**: `.md` files (Markdown)
- **Executables**: `.exe` (Windows), no extension (Unix)

### Documentation
- **Format**: Markdown (`.md`)
- **Style**: GitHub-flavored Markdown
- **Includes**: Code blocks, tables, badges, emojis

## Configuration

### Benchmark Configuration
- **Array Sizes**: 1K, 10K, 100K, 500K, 1M, 5M, 10M elements
- **Data Patterns**: Sorted, Reverse, Random, Nearly-Sorted, Duplicates, K-Sorted
- **Iterations**: Multiple runs for statistical significance
- **Warmup**: Initial runs discarded to stabilize cache

### Algorithm Configuration
- **Buffer Size**: 65536 elements (64K) = 256KB for int arrays
- **Stack Size**: Dynamic, typically < 100 segments
- **Merge Threshold**: Automatic based on buffer capacity

## Environment Setup

### Prerequisites
```bash
# C/C++ compiler
gcc --version  # Should be 11.2.0 or later

# Node.js runtime
node --version  # Should be v18.16.0 or later

# Python interpreter
python --version  # Should be 3.x
```

### Validation
```bash
# Run setup validation
python validate_setup.py

# Expected output: All checks pass
```

### IDE Support
- **Recommended**: VS Code, CLion, Visual Studio
- **Extensions**: C/C++ IntelliSense, Python, JavaScript
- **Configuration**: `.amazonq/` directory for Amazon Q integration

## Continuous Integration

### Testing Strategy
- **Unit Tests**: Per-language test suites
- **Integration Tests**: Cross-language validation
- **Performance Tests**: Benchmark regression tracking
- **Correctness**: Comparison with standard library sorts

### Result Tracking
- **Directory**: `benchmarks/results/`
- **Format**: JSON with timestamps and random seeds
- **Versioning**: Date-based subdirectories
- **Analysis**: Historical performance comparison

## Future Technology Plans

### Planned Additions
- **Rust Implementation**: Zero-cost abstractions
- **WebAssembly**: Browser-native performance
- **SIMD**: Vectorized comparisons and merging
- **Parallel**: Multi-threaded merge operations
- **GPU**: CUDA/OpenCL acceleration

### Build System Improvements
- **CMake**: Cross-platform build configuration
- **Bazel**: Scalable build system
- **Docker**: Containerized benchmarking environment
