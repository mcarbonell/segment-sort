# Segment Sort - Project Structure

## Directory Organization

### Core Implementation
- **implementations/**: Multi-language implementations of the Segment Sort algorithm
  - `cpp/` - C++ implementation with optimizations
  - `python/` - Python reference implementation
  - `java/` - Java implementation
  - `go/` - Go implementation  
  - `rust/` - Rust implementation
  - `javascript/` - JavaScript/Node.js implementation
  - `php/` - PHP implementation

### Testing & Validation
- **tests/**: Comprehensive test suite for all language implementations
  - `test_cases.json` - Standardized test cases in JSON format
  - `run_*_tests.*` - Test runners for each language
  - Cross-language validation ensuring consistent behavior

### Performance Analysis
- **benchmarks/**: Performance measurement and comparison tools
  - `benchmark_core.js` - Core benchmarking logic
  - `benchmark_web.js` - Web-based benchmark interface
  - `js_benchmarks.js` - JavaScript-specific benchmarks
  - Benchmark result JSON files with timestamps

### Documentation & Research
- **paper/**: Academic analysis and theoretical documentation
- **docs/**: Implementation guides and methodology documentation
- **visualizations/**: Algorithm visualization materials
- **memory-bank/**: Project knowledge base

### Development History
- **original_code/**: Historical implementations and experimental versions
  - Multiple iterations of the algorithm (mergesegmentsort.cpp, mergesegmentsort2.cpp, etc.)
  - Original language implementations before standardization

## Architectural Patterns

### Algorithm Structure
1. **Segment Detection Phase**: Identifies sorted segments (increasing/decreasing)
2. **Heap Merging Phase**: Uses priority queue to merge segments efficiently
3. **Output Generation**: Produces sorted array maintaining stability

### Cross-Language Consistency
- Standardized algorithm implementation across all languages
- Consistent API and function signatures
- Unified test cases ensuring behavioral equivalence
- Performance benchmarking with comparable methodologies

### Build System
- Language-specific build configurations
- Makefile for unified build operations
- Setup scripts for environment validation
- Configuration management via config.yml