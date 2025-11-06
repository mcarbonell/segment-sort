import json
import sys
import os

# Add the parent directory to the sys.path to allow importing from implementations
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from implementations.python.segmentsort import SegmentSort

def run_tests():
    test_cases_path = os.path.join(os.path.dirname(__file__), 'test_cases.json')
    with open(test_cases_path, 'r') as f:
        test_cases = json.load(f)

    sorter = SegmentSort()
    passed = 0
    failed = 0

    print('Running tests for SegmentSort in Python...\n')

    for i, test_case in enumerate(test_cases):
        # Create a copy of the input to be sorted
        array_to_sort = list(test_case['input'])
        expected = test_case['expected']
        name = test_case['name']

        try:
            sorter.sort(array_to_sort)
            assert array_to_sort == expected
            print(f'✅ Test #{i + 1}: {name} - PASSED')
            passed += 1
        except AssertionError:
            print(f'❌ Test #{i + 1}: {name} - FAILED')
            print(f'   Expected: {expected}')
            print(f'   Got:      {array_to_sort}')
            failed += 1

    print('\n--------------------')
    print('Test Summary:')
    print(f'  {passed} passed')
    print(f'  {failed} failed')
    print('--------------------\n')

    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
