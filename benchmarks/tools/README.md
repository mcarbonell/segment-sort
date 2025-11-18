# Development Tools

This directory contains tools for development, debugging, and testing of the benchmark suite.

## Available Tools

### `benchmark_core.js`
Reusable benchmarking framework that can be imported by different benchmark implementations.

**Features**:
- Standardized timing functions
- Statistical analysis utilities
- Consistent output formatting
- Validation helpers

### `debug_segments.py`
Python utility for debugging segment detection in the algorithms.

**Purpose**: Visualize and analyze how segments are detected and processed.

**Usage**:
```bash
cd benchmarks/tools
python debug_segments.py [array_size_or_data]
```

### `test_comparison.py`
Cross-implementation testing to ensure all language versions produce identical results.

**Purpose**: Validate correctness across different language implementations.

**Usage**:
```bash
cd benchmarks/tools
python test_comparison.py
```

## Tool Guidelines

When creating new development tools:

1. Place in this directory (`benchmarks/tools/`)
2. Follow naming convention: `{purpose}_tools.{ext}`
3. Include comprehensive error handling
4. Support both interactive and automated usage
5. Add documentation to this README

## Creating Reusable Tools

Tools in this directory should be:
- **Reusable**: Can be imported/used by other scripts
- **Well-documented**: Clear usage instructions and examples
- **Robust**: Handle edge cases and invalid input gracefully
- **Efficient**: Don't significantly impact benchmark performance