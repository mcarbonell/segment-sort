# Implementation Guide - Segment Sort

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Installation by Language](#installation-by-language)
3. [Usage Examples](#usage-examples)
4. [API Reference](#api-reference)
5. [Optimizations](#optimizations)
6. [Troubleshooting](#troubleshooting)

## Introduction

This guide provides detailed instructions for using the different Segment Sort implementations across various programming languages.

## Installation by Language

### C++

#### Requirements
- C++17 or higher
- Compiler: g++, clang++, MSVC

#### Compilation
```bash
# Basic version
g++ -O3 -std=c++17 implementations/cpp/segmentsort.cpp -o segmentsort

# Optimized version (recommended)
g++ -O3 -march=native -std=c++17 implementations/cpp/mergesegmentsort_v3.cpp -o segmentsort

# With benchmarks
g++ -O3 -std=c++17 benchmarks/benchmark2.cpp -o benchmark
```

#### Execution
```bash
./segmentsort
./benchmark
```

### Python

#### Requirements
- Python 3.7+
- Libraries: heapq (included in standard Python)

#### Installation
```bash
# No additional dependencies required
python3 --version  # Verify version
```

#### Execution
```bash
# Basic implementation
python3 implementations/python/segmentsort.py

# Complete benchmarks
python3 benchmarks/run_benchmarks.py --sizes 1000 5000 10000

# Quick test
python3 benchmarks/quick_test.py
```

### Java

#### Requirements
- JDK 8+

#### Compilation
```bash
cd implementations/java
javac segmentsort.java
```

#### Execution
```bash
java SegmentSort
```

### Go

#### Requirements
- Go 1.11+

#### Execution
```bash
cd implementations/go
go run segmentsort.go
```

### Rust

#### Requirements
- Rust 1.40+

#### Build and execution
```bash
cd implementations/rust
cargo run
```

### JavaScript

#### Requirements
- Node.js 12+

#### Execution
```bash
cd implementations/javascript
node segmentsort.js
```

### PHP

#### Requirements
- PHP 7.4+

#### Execution
```bash
cd implementations/php
php segmentsort.php
```

## Usage Examples

### C++

```cpp
#include <iostream>
#include <vector>
#include "segmentsort.cpp"

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    SegmentSort sorter;
    sorter.sort(arr);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

### Python

```python
import sys
sys.path.append('implementations/python')
from segmentsort import SegmentSort

# Basic example
arr = [64, 34, 25, 12, 22, 11, 90]
sorter = SegmentSort()
sorter.custom_sort(arr)

print("Sorted array:", arr)

# Example with different data types
data = [
    ("Integers", [3, 1, 4, 1, 5]),
    ("Floats", [3.1, 1.4, 2.7, 1.5]),
    ("Strings", ["b", "a", "c", "a"])
]

for name, data_list in data:
    # For strings, use lexicographic comparison
    sorted_data = sorter.custom_sort(data_list)
    print(f"{name}: {sorted_data}")
```

### Java

```java
public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        SegmentSort sorter = new SegmentSort();
        sorter.sort(arr);
        
        System.out.print("Sorted array: ");
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
```

### Go

```go
package main

import (
	"fmt"
	"segmentsort"
)

func main() {
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	
	sorter := new(segmentsort.SegmentSort)
	sorter.Sort(arr)
	
	fmt.Print("Sorted array: ")
	for _, num := range arr {
		fmt.Printf("%d ", num)
	}
	fmt.Println()
}
```

### Rust

```rust
use std::cmp::Ord;

fn segment_sort<T: Ord + Copy>(arr: &mut [T]) {
    // Segment Sort implementation in Rust
    if arr.len() <= 1 {
        return;
    }
    
    // Segment detection
    let n = arr.len();
    let mut segments: Vec<(usize, usize, i8)> = Vec::new();
    let mut start = 0;
    let mut direction = 0i8;
    
    for i in 1..n {
        if direction == 0 {
            direction = if arr[i] > arr[i-1] { 1 } else { -1 };
            continue;
        }
        
        if (direction > 0 && arr[i-1] > arr[i]) || 
           (direction < 0 && arr[i-1] < arr[i]) {
            let length = if direction > 0 { i - start } else { start - i };
            if length > 0 {
                segments.push((start, length, direction));
            }
            start = i;
            direction = 0;
        }
    }
    
    // Merge segments using heap
    // ... heap merge implementation
}

fn main() {
    let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
    segment_sort(&mut arr);
    
    println!("Sorted array: {:?}", arr);
}
```

### JavaScript

```javascript
const SegmentSort = require('./segmentsort.js');

const arr = [64, 34, 25, 12, 22, 11, 90];
const sorter = new SegmentSort();

sorter.sort(arr);

console.log('Sorted array:', arr);

// Example with custom objects
const objects = [
    {name: 'Alice', age: 30},
    {name: 'Bob', age: 25},
    {name: 'Charlie', age: 35}
];

// To sort by specific property
const sorted = objects.sort((a, b) => a.age - b.age);
console.log('Objects sorted by age:', sorted);
```

### PHP

```php
<?php
require_once 'segmentsort.php';

// Basic example
$arr = [64, 34, 25, 12, 22, 11, 90];
$sorter = new SegmentSort();
$sorter->sort($arr);

echo "Sorted array: " . implode(' ', $arr) . "\n";

// Example with different data types
$testCases = [
    "Integers" => [3, 1, 4, 1, 5],
    "Floats" => [3.1, 1.4, 2.7, 1.5],
    "Strings" => ["b", "a", "c", "a"]
];

foreach ($testCases as $name => $data) {
    $sorter->sort($data);
    echo "$name: " . implode(' ', $data) . "\n";
}
?>
```

## API Reference

### SegmentSort Class

#### `sort(arr)`
Main method to sort an array.

**Parameters:**
- `arr` (Array/List/Vector): Array to sort

**Returns:**
- `void`: The array is modified in-place

**Example:**
```python
sorter = SegmentSort()
sorter.custom_sort([3, 1, 4, 1, 5])  # Modifies the array
```

#### Properties

- `copyarr`: Auxiliary array for internal operations
- `segments`: List of detected segments

## Optimizations

### 1. C++ Compilation
```bash
# Maximum performance optimizations
g++ -O3 -march=native -flto -funroll-loops -std=c++17 \
    implementations/cpp/mergesegmentsort_v3.cpp -o segmentsort

# For debugging
g++ -O1 -g -std=c++17 implementations/cpp/segmentsort.cpp -o debug_sort
```

### 2. Python Configuration
```python
# For better performance with large arrays
import sys
sys.setrecursionlimit(1000000)  # Increase recursion limit
```

### 3. Java Heap Settings
```bash
# For large dataset benchmarks
java -Xmx4g -XX:+UseG1GC -jar segmentsort.jar
```

### 4. Go Performance
```go
// For Go, compile with optimizations
go build -ldflags="-s -w" -o segmentsort segmentsort.go
GOGC=off go run segmentsort.go  # Disable GC for benchmarks
```

### 5. PHP Performance
```bash
# Enable OPcache for better performance
php -d opcache.enable=1 -d opcache.memory_consumption=256 segmentsort.php
```

## Testing

The project includes a comprehensive test suite that validates all implementations:

### Running Tests

```bash
# Run all language tests
cd tests
python3 run_python_tests.php

# Run PHP-specific tests
php run_php_tests.php

# Run C++ tests
g++ -O3 -std=c++17 run_cpp_tests.cpp -o cpp_test && ./cpp_test
```

### Test Coverage

- **Empty arrays and edge cases**
- **Single element and small arrays**
- **Already sorted and reverse sorted arrays**
- **Arrays with duplicates and identical elements**
- **Semi-ordered and pattern-based data**
- **All 7 implementations cross-validated**

### Test Structure

```json
// tests/test_cases.json
[
    {
        "name": "Empty array",
        "input": [],
        "expected": []
    },
    {
        "name": "Single element",
        "input": [42],
        "expected": [42]
    },
    // ... more test cases
]
```

## Troubleshooting

### Common Errors

#### C++: "heap operations not found"
**Solution:** Include `<queue>` and `<vector>`

#### Python: "Index out of range"
**Solution:** Verify the array is not empty before sorting

#### Java: "NullPointerException"
**Solution:** Initialize arrays correctly

#### Go: "index out of range"
**Solution:** Check indices in for loops

#### Rust: "borrowed value does not live long enough"
**Solution:** Use appropriate references in slice operations

#### PHP: "Call to undefined method" or class not found
**Solution:** Ensure PHP file is included/required correctly:
```php
require_once 'segmentsort.php';
// or
include 'segmentsort.php';
```

### Performance Issues

#### Slow performance on large arrays
1. Verify you're using the optimized version (v3)
2. Compile with `-O3` optimizations
3. Use primitive data types when possible

#### Memory errors
1. Verify sufficient RAM is available
2. For Python: use `array.array` instead of lists for large data
3. For Java: increase heap size with `-Xmx`

### Debug Mode

#### Enable detailed logging
```python
# In implementations that support debug
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### Verify segment detection
```cpp
// In C++, add prints for debug
std::cout << "Segment: start=" << start << ", length=" << length << std::endl;
```

---

## 👨‍💻 Author

**Segment Sort Algorithm Implementation Guide**
- Created by: Mario Raúl Carbonell Martínez
- Date: November 2025

For more information, check the [academic paper](../paper/segment_sort_analysis.md) or the [benchmarks](../benchmarks/README.md).