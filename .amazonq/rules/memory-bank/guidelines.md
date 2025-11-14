# Segment Sort - Development Guidelines

## Code Quality Standards

### Naming Conventions
- **Classes**: PascalCase (SegmentSort, MergeSegmentSort, MinHeap)
- **Functions/Methods**: camelCase in JS/Java, snake_case in Python/Rust, camelCase in C++
- **Variables**: camelCase in most languages, descriptive names (segIndex, currentPos, auxarr)
- **Constants**: UPPER_CASE for configuration values
- **Files**: lowercase with language extensions (.cpp, .py, .js, .rs, .java)

### Documentation Standards
- **Header Comments**: Include algorithm description and purpose
- **Function Documentation**: JSDoc style for JavaScript, docstrings for Python
- **Inline Comments**: Explain complex logic, especially segment detection and merging
- **Example Usage**: Include working examples in each implementation
- **Multi-language Comments**: Spanish comments acceptable in benchmark files

### Code Structure Patterns
- **Class-based Implementation**: All languages use class structure for SegmentSort
- **Private Methods**: Use underscore prefix (_detectSegments, _mergeSegments) or private keywords
- **Error Handling**: Validate input arrays, handle edge cases (empty, single element)
- **Memory Management**: Use auxiliary arrays efficiently, minimize allocations

## Implementation Patterns

### Algorithm Structure (Consistent Across Languages)
```
1. Input Validation (n <= 1 early return)
2. Segment Detection Phase
   - Identify increasing/decreasing segments
   - Store as [start, end] pairs with direction indicators
3. Heap Merging Phase
   - Use min-heap for efficient merging
   - Track current position in each segment
   - Extract minimum values iteratively
```

### Segment Detection Pattern
- **Direction Detection**: Compare adjacent elements to determine increasing/decreasing
- **Segment Boundaries**: Track start/end indices for each segment
- **Direction Encoding**: Use +1/-1 or boolean flags for segment direction
- **Edge Cases**: Handle single elements and transitions between segments

### Heap Implementation Pattern
- **Min-Heap Structure**: Priority queue based on current segment head values
- **Node Structure**: Store {value, segmentIndex, currentPosition}
- **Heapify Operations**: Standard bubble-up/bubble-down operations
- **Extraction Logic**: Remove minimum, advance segment pointer, re-insert if segment not exhausted

## Testing Standards

### Test Case Categories
- **Edge Cases**: Empty arrays, single elements, identical elements
- **Sorted Data**: Already sorted, reverse sorted arrays
- **Mixed Data**: Random arrays, arrays with duplicates, negative numbers
- **Performance Cases**: Large arrays for benchmarking

### Test Structure Pattern
```
1. Define test cases with descriptive names
2. Clone input arrays to preserve originals
3. Apply sorting algorithm
4. Compare with expected results
5. Report pass/fail with detailed output
6. Exit with appropriate status codes
```

### Cross-Language Validation
- **Standardized Test Cases**: Use test_cases.json for consistency
- **Identical Inputs**: Same test data across all language implementations
- **Result Verification**: Compare outputs between languages
- **Performance Benchmarking**: Consistent timing methodologies

## Performance Optimization

### Benchmarking Patterns
- **Multiple Repetitions**: Run tests multiple times for statistical accuracy
- **Data Generation**: Consistent random data generation with seeds
- **Timing Precision**: Use high-resolution timers (chrono in C++, performance.now() in JS)
- **Statistical Analysis**: Calculate mean, median, standard deviation
- **Result Storage**: JSON format for benchmark results with metadata

### Memory Efficiency
- **Auxiliary Arrays**: Reuse auxiliary space, minimize allocations
- **In-Place Operations**: Modify original array when possible
- **Segment Storage**: Efficient representation of segment metadata
- **Heap Management**: Minimize heap operations, efficient node structures

## Build and Development

### Language-Specific Patterns
- **C++**: Use -O3 optimization, C++17 standard, include guards
- **JavaScript**: ES6+ features, module.exports for Node.js compatibility
- **Python**: Python 3.x compatibility, class-based structure
- **Rust**: Cargo project structure, ownership patterns
- **Java**: Standard javac compilation, public class structure

### File Organization
- **Implementation Files**: One main class per file with algorithm implementation
- **Test Files**: Separate test runners for each language
- **Benchmark Files**: Dedicated benchmarking scripts with visualization
- **Documentation**: Comprehensive README and implementation guides

### Error Handling Patterns
- **Input Validation**: Check for null/undefined inputs, validate array types
- **Graceful Degradation**: Handle edge cases without crashes
- **Error Reporting**: Clear error messages in test failures
- **Assertion Usage**: Use assertions for development-time validation

## Code Review Standards

### Quality Checklist
- Algorithm correctness across all test cases
- Consistent API design across languages
- Proper memory management and cleanup
- Comprehensive test coverage
- Performance benchmarking results
- Documentation completeness
- Code style consistency within each language