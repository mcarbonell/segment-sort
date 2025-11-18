#!/usr/bin/env python3
"""
Debug script to understand segment detection differences
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'implementations', 'python'))
from balanced_segment_merge_sort import _detect_segment_indices

def test_segment_detection():
    """Test segment detection on the same data"""
    import random
    random.seed(42)
    test_arr = [random.randint(0, 1000) for _ in range(20)]

    print(f"Array: {test_arr}")
    print("Detected segments:")

    i = 0
    n = len(test_arr)
    segments = []

    while i < n:
        start, end = _detect_segment_indices(test_arr, i, n)
        segment_len = end - start
        segments.append(segment_len)
        print(f"  Position {i}: segment [{start}:{end}] (length {segment_len}) = {test_arr[start:end]}")
        i = end

    print(f"Total segments: {len(segments)}, sizes: {segments}")

if __name__ == '__main__':
    test_segment_detection()