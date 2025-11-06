<?php

class SegmentSort
{
    /**
     * Sorts an array in-place using the Segment Sort algorithm.
     * @param array &$arr The array of numbers to sort.
     */
    public function sort(array &$arr): void
    {
        $n = count($arr);
        if ($n <= 1) {
            return;
        }

        // Phase 1: Segment Detection
        $segments = $this->detectSegments($arr);

        // Phase 2: Heap Merging
        if (empty($segments)) {
            return;
        }

        $this->mergeSegments($arr, $segments);
    }

    /**
     * Detects sorted (increasing or decreasing) segments in the array.
     * @param array $arr The input array.
     * @return array A list of segments, where each segment is a tuple [start_index, end_index].
     */
    private function detectSegments(array $arr): array
    {
        $segments = [];
        $n = count($arr);
        if ($n === 0) {
            return $segments;
        }

        $start = 0;
        while ($start < $n) {
            $end = $start;
            if ($end + 1 < $n && $arr[$end] > $arr[$end + 1]) {
                // Decreasing segment
                while ($end + 1 < $n && $arr[$end] > $arr[$end + 1]) {
                    $end++;
                }
                $segments[] = [$end, $start]; // Store as [end, start] for backward iteration
            } else {
                // Increasing or single-element segment
                while ($end + 1 < $n && $arr[$end] <= $arr[$end + 1]) {
                    $end++;
                }
                $segments[] = [$start, $end];
            }
            $start = $end + 1;
        }
        return $segments;
    }

    /**
     * Merges the detected segments using a min-heap.
     * @param array &$arr The list to be sorted (will be modified in-place).
     * @param array $segments The list of detected segments.
     */
    private function mergeSegments(array &$arr, array $segments): void
    {
        $minHeap = new SplMinHeap();

        foreach ($segments as $i => $seg) {
            [$start, $end] = $seg;
            $value = $arr[$start];
            // SplMinHeap compares arrays, so we store [value, ...]
            $minHeap->insert([$value, $i, $start]);
        }

        $sortedArr = [];
        while (!$minHeap->isEmpty()) {
            [$value, $segIndex, $currentPos] = $minHeap->extract();
            $sortedArr[] = $value;

            [$start, $end] = $segments[$segIndex];
            $direction = ($start <= $end) ? 1 : -1;

            $nextPos = $currentPos + $direction;

            if (($direction === 1 && $nextPos <= $end) || ($direction === -1 && $nextPos >= $end)) {
                $nextValue = $arr[$nextPos];
                $minHeap->insert([$nextValue, $segIndex, $nextPos]);
            }
        }

        // Copy the sorted result back to the original array
        foreach ($sortedArr as $i => $val) {
            $arr[$i] = $val;
        }
    }
}

// Example of usage, can be run from the command line with `php segmentsort.php`
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    $sorter = new SegmentSort();

    $v = [5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18];
    echo "Original vector: " . implode(' ', $v) . "\n";
    $sorter->sort($v);
    echo "Sorted vector:   " . implode(' ', $v) . "\n";

    $v2 = [9, 2, 3, 4, 5, 6, 7, 8, 1];
    echo "\nOriginal vector: " . implode(' ', $v2) . "\n";
    $sorter->sort($v2);
    echo "Sorted vector:   " . implode(' ', $v2) . "\n";
}
