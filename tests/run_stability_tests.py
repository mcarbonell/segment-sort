import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from implementations.python.balanced_segment_merge_sort import on_the_fly_balanced_merge_sort

"""
Stability Test Suite for Segment Sort Algorithms (Python)

A stable sort preserves the relative order of elements with equal keys.
Since our sorts operate on plain integer arrays, we encode (key, originalIndex)
pairs as: encoded = key * MULTIPLIER + originalIndex.
After sorting, we decode and verify that for elements sharing the same key,
their original indices appear in ascending order.
"""

# Keys must be non-negative for the encoding to work correctly,
# since Python's // and % behave differently with negative values.
MULTIPLIER = 100000


def encode(key, original_index):
    return key * MULTIPLIER + original_index


def decode_key(val):
    return val // MULTIPLIER


def decode_index(val):
    return val % MULTIPLIER


def build_encoded(keys):
    return [encode(key, i) for i, key in enumerate(keys)]


def check_stability(sorted_encoded):
    for i in range(1, len(sorted_encoded)):
        prev_key = decode_key(sorted_encoded[i - 1])
        curr_key = decode_key(sorted_encoded[i])

        if prev_key > curr_key:
            return False, True, f'Not sorted: key {prev_key} before key {curr_key} at position {i}'

        if prev_key == curr_key:
            prev_idx = decode_index(sorted_encoded[i - 1])
            curr_idx = decode_index(sorted_encoded[i])
            if prev_idx >= curr_idx:
                return True, False, (
                    f'Unstable: key={prev_key}, original index {prev_idx} appeared before '
                    f'{curr_idx} in input but after it in output (positions {i - 1},{i})'
                )

    return True, True, ''


STABILITY_TESTS = [
    ('All equal keys (5 elements)', [3, 3, 3, 3, 3]),
    ('All equal keys (10 elements)', [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]),
    ('Two groups of equal keys', [2, 1, 2, 1, 2, 1]),
    ('Three groups interleaved', [3, 1, 2, 3, 1, 2, 3, 1, 2]),
    ('Duplicates at boundaries', [1, 1, 2, 3, 3, 3, 4, 4, 5, 5]),
    ('Reverse sorted with duplicates', [5, 5, 4, 4, 3, 3, 2, 2, 1, 1]),
    ('Already sorted with duplicates', [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]),
    ('Single unique value among many', [5, 5, 5, 3, 5, 5, 5]),
    ('Pipe organ with duplicates', [1, 2, 3, 4, 4, 3, 2, 1]),
    ('Many duplicates few uniques', [2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2]),
    ('Large array with duplicate blocks', [3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4]),
    ('Alternating two values (20 elements)', [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]),
    ('Sawtooth with duplicates', [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]),
    ('Random-like with many ties', [4, 2, 3, 1, 4, 2, 3, 1, 4, 2, 3, 1, 4, 2, 3, 1]),
    ('50 elements with 5 unique keys', [(i * 7 + 3) % 5 for i in range(50)]),
]


def run_stability_tests(sort_fn, sort_name):
    print(f'\nRunning stability tests for {sort_name}...\n')
    passed = 0
    failed = 0

    for i, (name, keys) in enumerate(STABILITY_TESTS):
        encoded = build_encoded(keys)
        arr = list(encoded)
        sort_fn(arr)

        is_sorted, is_stable, details = check_stability(arr)

        print(f'  Test {i + 1}: {name}')

        if not is_sorted:
            print(f'    Status: FAILED (not sorted) - {details}\n')
            failed += 1
        elif not is_stable:
            print(f'    Status: FAILED (unstable) - {details}\n')
            failed += 1
        else:
            print(f'    Status: PASSED\n')
            passed += 1

    print(f'  ----------------------------------------')
    print(f'  {sort_name}: {passed} passed, {failed} failed.')
    print(f'  ----------------------------------------\n')

    return failed


if __name__ == '__main__':
    print('=== Stability Test Suite (Python) ===')

    total_failed = 0
    total_failed += run_stability_tests(on_the_fly_balanced_merge_sort, 'On-the-Fly Balanced Merge Sort')

    if total_failed > 0:
        sys.exit(1)
