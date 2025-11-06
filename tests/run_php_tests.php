<?php

require_once __DIR__ . '/../implementations/php/segmentsort.php';

function runTests()
{
    $testCasesPath = __DIR__ . '/test_cases.json';
    $testCases = json_decode(file_get_contents($testCasesPath), true);

    $sorter = new SegmentSort();
    $passed = 0;
    $failed = 0;

    echo "Running tests for SegmentSort in PHP...\n\n";

    foreach ($testCases as $i => $testCase) {
        // Create a copy of the input to be sorted
        $arrayToSort = $testCase['input'];
        $expected = $testCase['expected'];
        $name = $testCase['name'];

        try {
            $sorter->sort($arrayToSort);
            assert($arrayToSort === $expected, new AssertionError("Arrays are not equal"));
            echo "✅ Test #" . ($i + 1) . ": {$name} - PASSED\n";
            $passed++;
        } catch (Throwable $e) {
            echo "❌ Test #" . ($i + 1) . ": {$name} - FAILED\n";
            echo "   Expected: " . json_encode($expected) . "\n";
            echo "   Got:      " . json_encode($arrayToSort) . "\n";
            $failed++;
        }
    }

    echo "\n--------------------\n";
    echo "Test Summary:\n";
    echo "  {$passed} passed\n";
    echo "  {$failed} failed\n";
    echo "--------------------\n\n";

    if ($failed > 0) {
        exit(1);
    }
}

// Enable assertions
ini_set('assert.active', 1);
ini_set('assert.exception', 1);

runTests();

