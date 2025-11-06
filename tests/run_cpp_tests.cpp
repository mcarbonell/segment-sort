// To compile and run this test:
// g++ -std=c++17 -o run_cpp_tests run_cpp_tests.cpp
// ./run_cpp_tests

#include <iostream>
#include <vector>
#include <string>
#include <cassert>

// Include the implementation file. 
// This is a simple way to test without creating a complex build system.
#include "../implementations/cpp/segmentsort.cpp"

struct TestCase {
    std::string name;
    std::vector<int> input;
    std::vector<int> expected;
};

void runTests() {
    std::vector<TestCase> testCases = {
        {"Empty array", {}, {}},
        {"Single element array", {42}, {42}},
        {"Already sorted array", {1, 2, 3, 4, 5, 6, 7, 8, 9}, {1, 2, 3, 4, 5, 6, 7, 8, 9}},
        {"Reverse sorted array", {9, 8, 7, 6, 5, 4, 3, 2, 1}, {1, 2, 3, 4, 5, 6, 7, 8, 9}},
        {"Array with all identical elements", {5, 5, 5, 5, 5}, {5, 5, 5, 5, 5}},
        {"Array with duplicate elements", {5, 3, 8, 3, 5, 1, 8}, {1, 3, 3, 5, 5, 8, 8}},
        {"Typical unsorted array", {5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18}, {2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 17, 18, 19}},
        {"Array with negative numbers", {-5, 3, -8, 0, -1, 10}, {-8, -5, -1, 0, 3, 10}},
        {"Mixed positive and negative with duplicates", {10, -2, 5, -2, 0, 5, 10, -8}, {-8, -2, -2, 0, 5, 5, 10, 10}},
        {"Longer random-like array", {31, 41, 59, 26, 53, 58, 97, 93, 23, 84}, {23, 26, 31, 41, 53, 58, 59, 84, 93, 97}}
    };

    SegmentSort sorter;
    int passed = 0;
    int failed = 0;

    std::cout << "Running tests for SegmentSort in C++..." << std::endl << std::endl;

    for (int i = 0; i < testCases.size(); ++i) {
        TestCase& tc = testCases[i];
        std::vector<int> arrayToSort = tc.input; // Make a copy

        try {
            sorter.sort(arrayToSort);
            assert(arrayToSort == tc.expected);
            std::cout << "✅ Test #" << (i + 1) << ": " << tc.name << " - PASSED" << std::endl;
            passed++;
        } catch (const std::exception& e) {
            std::cout << "❌ Test #" << (i + 1) << ": " << tc.name << " - FAILED" << std::endl;
            // C++ assert doesn't throw by default, but this is good practice
            failed++;
        }
    }

    std::cout << std::endl << "--------------------" << std::endl;
    std::cout << "Test Summary:" << std::endl;
    std::cout << "  " << passed << " passed" << std::endl;
    std::cout << "  " << failed << " failed" << std::endl;
    std::cout << "--------------------" << std::endl << std::endl;

    if (failed > 0) {
        exit(1);
    }
}

int main() {
    runTests();
    return 0;
}
