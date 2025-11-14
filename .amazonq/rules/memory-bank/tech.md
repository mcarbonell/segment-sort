# Segment Sort - Technology Stack

## Programming Languages & Versions

### Core Implementations
- **C++**: C++17 standard, optimized with -O3 flag
- **Python**: Python 3.x compatible
- **Java**: Standard Java (javac/java)
- **Go**: Modern Go version
- **Rust**: Cargo-based Rust project
- **JavaScript**: Node.js compatible ES6+
- **PHP**: Standard PHP interpreter

## Build Systems & Tools

### Compilation Commands
```bash
# C++
g++ -O3 -std=c++17 segmentsort.cpp -o segmentsort

# Java  
javac segmentsort.java && java SegmentSort

# Rust
cargo run

# Go
go run segmentsort.go

# Python
python3 segmentsort.py

# JavaScript
node segmentsort.js

# PHP
php segmentsort.php
```

### Build Automation
- **Makefile**: Unified build system for multiple languages
- **setup.py**: Python package setup and dependency management
- **validate_setup.py**: Environment validation script
- **config.yml**: Project configuration management

## Development Dependencies

### Testing Framework
- JSON-based test case definitions
- Language-specific test runners
- Cross-platform compatibility validation

### Benchmarking Tools
- JavaScript-based benchmark suite
- Web interface for performance visualization
- JSON output for benchmark results
- Statistical analysis and comparison tools

## Development Commands

### Testing
```bash
# Run all tests
make test

# Language-specific tests
python3 tests/run_python_tests.py
php tests/run_php_tests.php
g++ -O3 tests/run_cpp_tests.cpp -o cpp_test && ./cpp_test
```

### Benchmarking
```bash
# JavaScript benchmarks
node benchmarks/js_benchmarks.js

# Web benchmarks
open benchmarks/benchmark_web.html

# Core benchmarks
node benchmarks/benchmark_core.js
```

### Setup Validation
```bash
# Validate development environment
python3 validate_setup.py

# Check project configuration
cat config.yml
```

## Project Configuration
- **Git**: Version control with .gitignore for build artifacts
- **Cross-platform**: Windows/Linux/macOS compatibility
- **Modular**: Language-independent algorithm core with consistent interfaces