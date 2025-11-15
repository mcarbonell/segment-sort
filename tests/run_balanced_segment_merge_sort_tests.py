import json
import sys
import os

# Add the parent directory to the sys.path to allow importing from implementations
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from implementations.python.balanced_segment_merge_sort import on_the_fly_balanced_merge_sort

def run_tests():
    # Construct the absolute path for test_cases.json
    test_cases_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_cases.json')
    
    with open(test_cases_path, 'r') as f:
        test_cases = json.load(f)

    passed = 0
    failed = 0

    print('Running tests for On-the-Fly Balanced Merge Sort in Python...\n')

    for i, test_case in enumerate(test_cases):
        # Create a copy of the input to be sorted
        arr_to_sort = list(test_case['input'])
        expected = test_case['expected']
        name = test_case['name']
        
        # Truncate long arrays for printing
        input_str = str(test_case['input'])
        if len(input_str) > 70:
            input_str = input_str[:67] + '...'

        print(f'Test Case {i + 1}: {name}')
        print(f'  Input:    {input_str}')

        try:
            # The function sorts in-place
            on_the_fly_balanced_merge_sort(arr_to_sort)
            
            assert arr_to_sort == expected
            
            result_str = str(arr_to_sort)
            if len(result_str) > 70:
                result_str = result_str[:67] + '...'

            print(f'  Result:   {result_str}')
            print(f'  Status:   PASSED\n')
            passed += 1
        except AssertionError:
            result_str = str(arr_to_sort)
            if len(result_str) > 70:
                result_str = result_str[:67] + '...'
            
            expected_str = str(expected)
            if len(expected_str) > 70:
                expected_str = expected_str[:67] + '...'

            print(f'  Result:   {result_str}')
            print(f'  Status:   FAILED')
            print(f'  Expected: {expected_str}\n')
            failed += 1

    print('----------------------------------------')
    print(f'Test Summary: {passed} passed, {failed} failed.')
    print('----------------------------------------\n')

    # Exit with a non-zero status code if any test failed
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
