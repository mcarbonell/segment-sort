# Development Guidelines

## Code Quality Standards

### File Headers and Documentation

**Comprehensive file headers are mandatory:**
- Author name and date (e.g., "Author: Mario Raúl Carbonell Martínez, Date: November 2025")
- Brief description of file purpose
- Copyright/license information when applicable
- Version information for major implementations

**Example from C++ benchmarks:**
```cpp
/**
 * C++ Benchmarks for Segment Sort Algorithm
 * Comprehensive performance testing for Segment Sort algorithm
 * Author: Mario Raúl Carbonell Martínez
 * Date: November 2025
 */
```

**Python docstrings follow standard format:**
```python
"""
Validación del Setup - Segment Sort
===================================

Script para verificar que el repositorio está correctamente configurado
y que todas las implementaciones funcionan correctamente.
"""
```

### Code Formatting Patterns

**C/C++ Formatting:**
- 4-space indentation (no tabs)
- Opening braces on same line for functions and control structures
- Space after keywords: `if (condition)`, `while (condition)`, `for (init; cond; inc)`
- No space between function name and parentheses: `function(args)`
- Pointer/reference alignment: `Type* var` or `Type& var` (asterisk/ampersand with type)

**JavaScript Formatting:**
- 4-space indentation
- camelCase for variables and functions
- PascalCase for classes
- Semicolons required at statement ends
- Arrow functions preferred for callbacks: `(param) => { ... }`
- Template literals for string interpolation: `` `text ${variable}` ``

**Python Formatting:**
- 4-space indentation (PEP 8 compliant)
- snake_case for functions and variables
- PascalCase for classes
- Docstrings for all public functions and classes
- Type hints encouraged but not required

### Naming Conventions

**Variables:**
- Descriptive names over abbreviations
- C/C++: `camelCase` for local variables, `snake_case` acceptable
- JavaScript: `camelCase` consistently
- Python: `snake_case` consistently
- Constants: `UPPER_SNAKE_CASE` in all languages

**Functions:**
- Verb-based names describing action: `generateRandomArray`, `calculateStats`, `mergeSegments`
- C/C++: `camelCase` or `snake_case` (consistent within file)
- JavaScript: `camelCase`
- Python: `snake_case`

**Classes/Structs:**
- PascalCase in all languages: `SegmentSort`, `BenchmarkResult`, `TimSort`
- Descriptive names indicating purpose

**Files:**
- snake_case for most files: `benchmark_core.js`, `validate_setup.py`
- PascalCase for class-based files: `SegmentSortIterator.h`
- Descriptive names indicating content

## Structural Conventions

### Algorithm Implementation Patterns

**Segment Detection Pattern (used across all implementations):**
```cpp
// Detect naturally sorted runs (ascending or descending)
std::pair<size_t, size_t> detectSegmentIndices(std::vector<int>& arr, size_t start) {
    size_t n = arr.size();
    if (start >= n) {
        return std::make_pair(start, start);
    }
    
    size_t end = start + 1;
    if (end < n && arr[start] > arr[end]) {
        // Descending run - detect and reverse
        while (end < n && arr[end - 1] > arr[end]) {
            ++end;
        }
        std::reverse(arr.begin() + start, arr.begin() + end);
        return std::make_pair(start, end);
    } else {
        // Ascending run
        while (end < n && arr[end - 1] <= arr[end]) {
            ++end;
        }
        return std::make_pair(start, end);
    }
}
```

**Stack-Based Merge Pattern:**
- Use vector/array as stack to store segment metadata
- Maintain invariant: segment lengths decrease or stay balanced
- Merge when invariant violated
- Common across all implementations

**Hybrid Merge Strategy:**
- Check if segment fits in buffer
- Use fast linear merge if fits
- Fall back to rotation-based merge if too large
- Buffer size: 64K elements (256KB) for optimal cache performance

### Benchmarking Patterns

**Deterministic Random Number Generation:**
```cpp
// Linear Congruential Generator for reproducible results
class LCG {
private:
    uint64_t current_seed;
    const uint64_t a = 1103515245;
    const uint64_t c = 12345;
    const uint64_t m = 2ULL << 31;

public:
    LCG(uint64_t seed = 12345) : current_seed(seed) {}
    
    void setSeed(uint64_t seed) {
        current_seed = seed;
    }
    
    double random() {
        current_seed = (a * current_seed + c) % m;
        return static_cast<double>(current_seed) / static_cast<double>(m);
    }
};
```

**Statistical Analysis Pattern:**
```cpp
struct Statistics {
    double mean = 0;
    double median = 0;
    double std = 0;
    double p5 = 0;   // 5th percentile
    double p95 = 0;  // 95th percentile
    double min = 0;
    double max = 0;
};

Statistics calculateStats(const std::vector<double>& times) {
    // Sort times for percentile calculation
    std::vector<double> sorted_times = times;
    std::sort(sorted_times.begin(), sorted_times.end());
    
    // Calculate mean, median, std dev, percentiles
    // ... implementation
}
```

**Benchmark Result Structure:**
```cpp
struct BenchmarkResult {
    std::string algorithm;
    size_t size;
    std::string dataType;
    int repetitions;
    std::vector<double> times;
    Statistics statistics;
    std::vector<int> sorted_result;
    bool success;
    std::string error;
};
```

### Data Generation Patterns

**Standard test data generators (consistent across languages):**
- `generateRandomArray(size)` - Uniform random distribution
- `generateSortedArray(size)` - Already sorted ascending
- `generateReverseArray(size)` - Sorted descending
- `generateKSortedArray(size, k)` - Nearly sorted with k-distance swaps
- `generateNearlySortedArray(size, swaps)` - Sorted with random swaps
- `generateDuplicatesArray(size, unique)` - Limited unique values
- `generatePlateauArray(size, plateau_size)` - Repeated value plateaus
- `generateSegmentSortedArray(size, segment_size)` - Sorted segments

**Generator implementation pattern:**
```cpp
std::vector<int> generateRandomArray(size_t size, int min_val = 0, int max_val = 1000) {
    std::vector<int> arr;
    arr.reserve(size);  // Pre-allocate for performance
    
    for (size_t i = 0; i < size; ++i) {
        int value = static_cast<int>(rng.random() * (max_val - min_val + 1)) + min_val;
        arr.push_back(value);
    }
    return arr;
}
```

## Semantic Patterns

### Error Handling

**C/C++ Error Handling:**
- Use return codes for critical errors
- Assertions for invariant checking: `assert(condition)`
- Try-catch for benchmark runners (graceful degradation)
- Validate input sizes and parameters

**JavaScript Error Handling:**
- Try-catch blocks for async operations
- Error messages displayed to user via UI
- Console logging for debugging
- Graceful fallbacks for missing data

**Python Error Handling:**
- Try-except blocks with specific exception types
- Descriptive error messages
- Return boolean success indicators
- Print status with emoji indicators (✅, ❌, ⚠️)

### Validation Patterns

**Array Sorting Validation:**
```cpp
bool isSorted(const std::vector<int>& arr) {
    if (arr.empty()) return true;
    for (size_t i = 1; i < arr.size(); ++i) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}
```

**Benchmark Validation:**
- Warm-up runs before timing (typically 3 runs)
- Multiple repetitions for statistical significance (default: 10)
- Validate sorted output after each run
- Compare results with standard library implementations

### Performance Optimization Patterns

**Memory Pre-allocation:**
```cpp
std::vector<int> result;
result.reserve(left.size() + right.size());  // Avoid reallocation
```

**Cache-Friendly Buffer Size:**
```cpp
const size_t BUFFER_SIZE = 65536;  // 64K elements = 256KB
// Fits in typical L2 cache for optimal performance
```

**Minimize Copies:**
- Pass large structures by reference: `const std::vector<int>&`
- Use move semantics when available: `std::move()`
- In-place operations when possible

**Iterator Efficiency:**
```cpp
// Prefer iterator arithmetic over indexing in tight loops
for (auto it = vec.begin(); it != vec.end(); ++it) {
    // Process *it
}
```

### Output and Reporting Patterns

**Console Output Formatting:**
```cpp
// Table-based output with fixed-width columns
std::cout << std::left << std::setw(25) << algorithm_name
          << " | " << std::right << std::setw(6) << size
          << " | " << std::fixed << std::setprecision(3) << time_ms
          << " | " << status << "\n";
```

**JSON Export Pattern:**
```cpp
void exportResults(const std::vector<BenchmarkResult>& results) {
    std::ofstream file("results.json");
    file << "{\n";
    file << "  \"metadata\": {\n";
    file << "    \"timestamp\": \"" << timestamp << "\",\n";
    file << "    \"seed\": " << seed << ",\n";
    file << "    \"repetitions\": " << repetitions << "\n";
    file << "  },\n";
    file << "  \"results\": [\n";
    // ... serialize results
    file << "  ]\n";
    file << "}\n";
}
```

**Progress Indicators:**
- Python: Emoji-based status (🔍, ✅, ❌, ⚠️, 🚀, 📊)
- JavaScript: Loading spinners and progress bars
- C++: Text-based progress with separators

### Internal API Usage

**Segment Stack Management:**
```cpp
std::vector<std::pair<size_t, size_t>> segmentStack;

// Push new segment
segmentStack.push_back(std::make_pair(start, end));

// Merge top segments when invariant violated
while (!segmentStack.empty()) {
    auto top = segmentStack.back();
    size_t topLen = top.second - top.first;
    size_t currentLen = currentEnd - currentStart;
    
    if (currentLen < topLen) {
        break;  // Invariant satisfied
    }
    
    segmentStack.pop_back();
    symmerge(arr, top.first, currentStart, currentEnd);
    currentStart = top.first;
}
```

**Merge Function Signatures:**
```cpp
// Standard merge signature across implementations
void merge(std::vector<int>& arr, 
          size_t start1, size_t end1,
          size_t start2, size_t end2,
          std::vector<int>& buffer);

// Symmetric merge (rotation-based)
void symmerge(std::vector<int>& arr,
             size_t first, size_t middle, size_t last);
```

### Common Code Idioms

**Range-Based Iteration (C++):**
```cpp
for (const auto& result : results) {
    // Process result
}

for (auto& element : array) {
    // Modify element
}
```

**Lambda Functions for Sorting:**
```cpp
std::sort(averages.begin(), averages.end(),
         [](const auto& a, const auto& b) { 
             return a.second < b.second; 
         });
```

**Structured Bindings (C++17):**
```cpp
for (const auto& [dataType, algMap] : byType) {
    // Use dataType and algMap
}
```

**Array Destructuring (JavaScript):**
```javascript
const [first, second, ...rest] = array;
const {algorithm, size, dataType} = result;
```

**List Comprehensions (Python):**
```python
files = [f for f in os.listdir(dirpath) 
         if os.path.isfile(os.path.join(dirpath, f))]
```

### Frequently Used Annotations

**C++ Comments:**
- `// TODO:` - Future improvements
- `// FIXME:` - Known issues to address
- `// NOTE:` - Important implementation details
- `// HACK:` - Temporary workarounds

**Function Documentation:**
```cpp
/**
 * Merges two sorted vectors into a single sorted vector
 * @param left First sorted vector
 * @param right Second sorted vector
 * @return Merged sorted vector
 */
```

**Inline Comments:**
- Explain "why" not "what"
- Document non-obvious optimizations
- Reference algorithms or papers when applicable
- Mark performance-critical sections

## Testing Practices

### Test Case Patterns

**Edge Cases Always Tested:**
- Empty arrays: `[]`
- Single element: `[1]`
- Two elements: `[2, 1]`
- Already sorted: `[1, 2, 3]`
- Reverse sorted: `[3, 2, 1]`
- With duplicates: `[3, 1, 4, 1, 5]`

**Test Organization:**
```cpp
struct TestCase {
    std::string name;
    std::string shortName;
    std::vector<int> data;
};

std::vector<TestCase> generateTestCases(size_t size) {
    return {
        {"Aleatorio", "Aleatorio", generateRandomArray(size)},
        {"Ordenado", "Ordenado", generateSortedArray(size)},
        {"Inverso", "Inverso", generateReverseArray(size)},
        // ... more test cases
    };
}
```

### Validation Practices

**Correctness Validation:**
- Compare output with standard library sort
- Verify array is properly sorted
- Check stability (equal elements maintain order)
- Validate on multiple data patterns

**Performance Validation:**
- Multiple repetitions for statistical significance
- Warm-up runs to stabilize cache
- Measure mean, median, standard deviation
- Track percentiles (p5, p95) for outlier detection

## Build and Deployment

### Compilation Flags

**Required optimization:**
```bash
gcc -O3 -o output source.c -lm
g++ -O3 -std=c++17 -o output source.cpp
```

**Debug builds:**
```bash
gcc -g -O0 -o output source.c -lm
```

### Makefile Patterns

```makefile
# Standard targets
c: c_benchmarks.c
	gcc -O3 -o c_benchmarks c_benchmarks.c -lm
	./c_benchmarks

cpp: cpp_benchmarks.cpp
	g++ -O3 -std=c++17 -o cpp_benchmarks cpp_benchmarks.cpp
	./cpp_benchmarks

clean:
	rm -f *.exe *.o c_benchmarks cpp_benchmarks
```

## Documentation Standards

### README Structure

- Project title with badges (GitHub, License, Language)
- Brief description and value proposition
- Key achievements with metrics
- Performance highlights in tables
- Quick start guide with code examples
- Detailed documentation sections
- Contributing guidelines
- License information
- Author information

### Code Examples in Documentation

- Always include complete, runnable examples
- Show both usage and expected output
- Include compilation/execution commands
- Provide multiple language examples when applicable

### Markdown Formatting

- Use tables for comparisons and benchmarks
- Code blocks with language specification: ` ```cpp `
- Emoji for visual hierarchy (✅, ❌, 🚀, 📊, etc.)
- Horizontal rules for section separation
- Consistent heading hierarchy

## Version Control

### Commit Practices

- Descriptive commit messages
- Reference issue numbers when applicable
- Separate logical changes into different commits
- Keep commits focused and atomic

### File Organization

- Group related files in subdirectories
- Separate implementations by language
- Keep benchmarks separate from implementations
- Documentation in dedicated `docs/` directory
- Results in `benchmarks/results/` with timestamps
