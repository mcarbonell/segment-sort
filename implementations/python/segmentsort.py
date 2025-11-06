import heapq

class SegmentSort:
    """
    Implements the Segment Sort algorithm.

    This algorithm works in two main phases:
    1. Segment Detection: It makes a single pass through the array to identify
       contiguous sub-arrays that are already sorted (either increasing or
       decreasing). These are called "segments".
    2. Heap Merging: It uses a min-heap to efficiently merge these segments.
       The first element of each segment is pushed into the heap. Then, the
       algorithm repeatedly extracts the minimum element from the heap, adds it
       to the result, and inserts the next element from the same segment into
       the heap. This continues until all segments are merged.
    """

    def sort(self, arr):
        """
        Sorts an array in-place using the Segment Sort algorithm.

        Args:
            arr (list[int]): The list of integers to sort.
        """
        n = len(arr)
        if n <= 1:
            return

        # Phase 1: Segment Detection
        segments = self._detect_segments(arr)

        # Phase 2: Heap Merging
        if not segments:
            return
        
        self._merge_segments(arr, segments)

    def _detect_segments(self, arr):
        """
        Detects sorted (increasing or decreasing) segments in the array.

        Args:
            arr (list[int]): The input array.

        Returns:
            list[tuple]: A list of segments, where each segment is a tuple
                         containing (start_index, end_index).
        """
        segments = []
        n = len(arr)
        if n == 0:
            return segments

        start = 0
        while start < n:
            # Find the end of an increasing or decreasing run
            end = start + 1
            if end < n and arr[start] > arr[end]:
                # Decreasing segment
                while end + 1 < n and arr[end] > arr[end + 1]:
                    end += 1
                # A decreasing segment needs to be reversed conceptually.
                # We store it as (end, start) to iterate backwards.
                segments.append((end, start))
            else:
                # Increasing segment
                while end + 1 < n and arr[end] <= arr[end + 1]:
                    end += 1
                segments.append((start, end))
            
            start = end + 1
        
        return segments

    def _merge_segments(self, arr, segments):
        """
        Merges the detected segments using a min-heap.

        Args:
            arr (list[int]): The list to be sorted (will be modified in-place).
            segments (list[tuple]): The list of detected segments.
        """
        min_heap = []
        
        # For each segment, push its first element onto the heap.
        # The heap stores tuples of (value, segment_index, current_position_in_segment).
        for i, seg in enumerate(segments):
            start, end = seg
            value = arr[start]
            # The third element tracks the direction of iteration
            direction = 1 if start <= end else -1
            heapq.heappush(min_heap, (value, i, start, direction))

        sorted_arr = []
        while min_heap:
            value, seg_idx, current_pos, direction = heapq.heappop(min_heap)
            sorted_arr.append(value)

            # Get the original segment's bounds
            _ , end = segments[seg_idx]

            # Move to the next position in the segment
            next_pos = current_pos + direction

            # If there are more elements in the segment, push the next one
            if (direction == 1 and next_pos <= end) or \
               (direction == -1 and next_pos >= end):
                next_value = arr[next_pos]
                heapq.heappush(min_heap, (next_value, seg_idx, next_pos, direction))
        
        # Copy the sorted result back to the original array
        for i in range(len(arr)):
            arr[i] = sorted_arr[i]


# Example of usage
if __name__ == "__main__":
    sorter = SegmentSort()
    # Test with the same vector as the C++ implementation
    v = [5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18]
    
    print("Original vector:", v)
    
    sorter.sort(v)
    
    print("Sorted vector:  ", v)

    # Another test case
    v2 = [9, 2, 3, 4, 5, 6, 7, 8, 1]
    print("\nOriginal vector:", v2)
    sorter.sort(v2)
    print("Sorted vector:  ", v2)
    
    # Test with an already sorted array
    v3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    print("\nOriginal vector:", v3)
    sorter.sort(v3)
    print("Sorted vector:  ", v3)

    # Test with a reverse sorted array
    v4 = [9, 8, 7, 6, 5, 4, 3, 2, 1]
    print("\nOriginal vector:", v4)
    sorter.sort(v4)
    print("Sorted vector:  ", v4)
