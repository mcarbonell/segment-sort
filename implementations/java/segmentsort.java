import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class SegmentSort {

    // Node class for the heap, storing value and segment tracking info
    private static class HeapNode {
        int value;
        int segIndex;
        int currentPos;
        int direction;

        HeapNode(int value, int segIndex, int currentPos, int direction) {
            this.value = value;
            this.segIndex = segIndex;
            this.currentPos = currentPos;
            this.direction = direction;
        }
    }

    // Segment class to store start and end indices
    private static class Segment {
        int start;
        int end;

        Segment(int start, int end) {
            this.start = start;
            this.end = end;
        }
    }

    /**
     * Sorts a list of integers using the Segment Sort algorithm.
     * @param arr The list of integers to sort.
     */
    public void sort(List<Integer> arr) {
        int n = arr.size();
        if (n <= 1) {
            return;
        }

        // Phase 1: Segment Detection
        List<Segment> segments = detectSegments(arr);

        // Phase 2: Heap Merging
        if (segments.isEmpty()) {
            return;
        }

        mergeSegments(arr, segments);
    }

    private List<Segment> detectSegments(List<Integer> arr) {
        List<Segment> segments = new ArrayList<>();
        int n = arr.size();
        if (n == 0) {
            return segments;
        }

        int start = 0;
        while (start < n) {
            int end = start + 1;
            if (end < n && arr.get(start) > arr.get(end)) {
                // Decreasing segment
                while (end + 1 < n && arr.get(end) > arr.get(end + 1)) {
                    end++;
                }
                segments.add(new Segment(end, start)); // Store as (end, start) for backward iteration
            } else {
                // Increasing segment
                while (end + 1 < n && arr.get(end) <= arr.get(end + 1)) {
                    end++;
                }
                segments.add(new Segment(start, end));
            }
            start = end + 1;
        }
        return segments;
    }

    private void mergeSegments(List<Integer> arr, List<Segment> segments) {
        // A min-heap of HeapNode objects, compared by value.
        PriorityQueue<HeapNode> minHeap = new PriorityQueue<>(Comparator.comparingInt(node -> node.value));

        for (int i = 0; i < segments.size(); i++) {
            Segment seg = segments.get(i);
            int value = arr.get(seg.start);
            int direction = (seg.start <= seg.end) ? 1 : -1;
            minHeap.add(new HeapNode(value, i, seg.start, direction));
        }

        List<Integer> sortedArr = new ArrayList<>(arr.size());
        while (!minHeap.isEmpty()) {
            HeapNode node = minHeap.poll();
            sortedArr.add(node.value);

            int nextPos = node.currentPos + node.direction;
            Segment seg = segments.get(node.segIndex);

            if ((node.direction == 1 && nextPos <= seg.end) || (node.direction == -1 && nextPos >= seg.end)) {
                int nextValue = arr.get(nextPos);
                minHeap.add(new HeapNode(nextValue, node.segIndex, nextPos, node.direction));
            }
        }

        // Copy the sorted result back to the original list
        for (int i = 0; i < arr.size(); i++) {
            arr.set(i, sortedArr.get(i));
        }
    }

    // Example of usage
    public static void main(String[] args) {
        SegmentSort sorter = new SegmentSort();
        
        List<Integer> v = new ArrayList<>(List.of(5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18));
        System.out.println("Original vector: " + v);
        sorter.sort(v);
        System.out.println("Sorted vector:   " + v);

        List<Integer> v2 = new ArrayList<>(List.of(9, 2, 3, 4, 5, 6, 7, 8, 1));
        System.out.println("\nOriginal vector: " + v2);
        sorter.sort(v2);
        System.out.println("Sorted vector:   " + v2);

        List<Integer> v3 = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9));
        System.out.println("\nOriginal vector: " + v3);
        sorter.sort(v3);
        System.out.println("Sorted vector:   " + v3);

        List<Integer> v4 = new ArrayList<>(List.of(9, 8, 7, 6, 5, 4, 3, 2, 1));
        System.out.println("\nOriginal vector: " + v4);
        sorter.sort(v4);
        System.out.println("Sorted vector:   " + v4);
    }
}
