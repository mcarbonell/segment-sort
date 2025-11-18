#!/usr/bin/env python3
"""
Test script to compare Python vs JavaScript implementations
"""

import sys
import time
import subprocess
import json
import os

# Add implementations to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'implementations', 'python'))
from balanced_segment_merge_sort import on_the_fly_balanced_merge_sort

def test_small_array():
    """Test with a small array to see basic functionality"""
    test_arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
    print(f"Original: {test_arr}")

    # Test Python implementation
    python_arr = test_arr.copy()
    start = time.perf_counter()
    on_the_fly_balanced_merge_sort(python_arr)
    python_time = time.perf_counter() - start

    print(f"Python result: {python_arr}")
    print(".6f")

    # Test JavaScript implementation
    js_test = json.dumps(test_arr)
    try:
        result = subprocess.run(
            ['node', '-e', f"""
            const sorter = require('../implementations/javascript/balanced_segment_merge_sort.js');
            const arr = {js_test};
            const start = process.hrtime.bigint();
            sorter(arr);
            const end = process.hrtime.bigint();
            console.log(JSON.stringify({{result: arr, time: Number(end - start) / 1e6}}));
            """],
            capture_output=True,
            text=True,
            cwd='benchmarks'
        )

        if result.returncode == 0:
            js_data = json.loads(result.stdout.strip())
            print(f"JavaScript result: {js_data['result']}")
            print(".6f")
        else:
            print(f"JavaScript error: {result.stderr}")
    except Exception as e:
        print(f"Error running JavaScript: {e}")

def count_operations():
    """Add some debugging to count operations"""
    import sys
    import os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'implementations', 'python'))
    import balanced_segment_merge_sort as bsms

    # Monkey patch to count operations
    original_symmerge = bsms._symmerge
    original_detect = bsms._detect_segment_indices

    symmerge_count = 0
    detect_count = 0
    segments_found = []

    def counted_symmerge(*args, **kwargs):
        nonlocal symmerge_count
        symmerge_count += 1
        return original_symmerge(*args, **kwargs)

    def counted_detect(arr, start, n):
        nonlocal detect_count, segments_found
        detect_count += 1
        result = original_detect(arr, start, n)
        segment_len = result[1] - result[0]
        segments_found.append(segment_len)
        return result

    bsms._symmerge = counted_symmerge
    bsms._detect_segment_indices = counted_detect

    # Test with random array
    import random
    random.seed(42)
    test_arr = [random.randint(0, 1000) for _ in range(100)]

    print(f"Testing with {len(test_arr)} random elements...")
    print(f"First 20 elements: {test_arr[:20]}")

    start = time.perf_counter()
    result = on_the_fly_balanced_merge_sort(test_arr.copy())
    end_time = time.perf_counter() - start

    print(f"Python: {end_time:.6f}s, {symmerge_count} symmerge calls, {detect_count} detect calls")
    print(f"Segments found: {segments_found}")
    print(f"Total segments: {len(segments_found)}, Avg segment size: {sum(segments_found)/len(segments_found):.1f}")

    # Reset counters
    symmerge_count = 0
    detect_count = 0
    segments_found.clear()

if __name__ == '__main__':
    print("=== Comparación Python vs JavaScript ===")
    test_small_array()
    print()
    count_operations()