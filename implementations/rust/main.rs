use std::collections::BinaryHeap;
use std::cmp::Ordering;

// A node for the heap, containing value and segment tracking info.
// We need to implement Ord, PartialOrd, Eq, PartialEq to use it in BinaryHeap.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
struct HeapNode {
    value: i32,
    seg_index: usize,
    current_pos: usize,
    direction: i32,
}

// Custom implementation of Ord to make BinaryHeap a min-heap.
// By default, it's a max-heap, so we reverse the comparison.
impl Ord for HeapNode {
    fn cmp(&self, other: &Self) -> Ordering {
        other.value.cmp(&self.value)
    }
}

impl PartialOrd for HeapNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

// Represents a detected segment with a start and end index.
#[derive(Clone, Copy, Debug)]
struct Segment {
    start: usize,
    end: usize,
}

struct SegmentSort;

impl SegmentSort {
    pub fn sort(&self, arr: &mut [i32]) {
        let n = arr.len();
        if n <= 1 {
            return;
        }

        // Phase 1: Segment Detection
        let segments = self.detect_segments(arr);

        // Phase 2: Heap Merging
        if segments.is_empty() {
            return;
        }

        self.merge_segments(arr, &segments);
    }

    fn detect_segments(&self, arr: &[i32]) -> Vec<Segment> {
        let mut segments = Vec::new();
        let n = arr.len();
        if n == 0 {
            return segments;
        }

        let mut start = 0;
        while start < n {
            let mut end = start + 1;
            if end < n && arr[start] > arr[end] {
                // Decreasing segment
                while end + 1 < n && arr[end] > arr[end + 1] {
                    end += 1;
                }
                segments.push(Segment { start: end, end: start });
            } else {
                // Increasing segment
                while end + 1 < n && arr[end] <= arr[end + 1] {
                    end += 1;
                }
                segments.push(Segment { start, end });
            }
            start = end + 1;
        }
        segments
    }

    fn merge_segments(&self, arr: &mut [i32], segments: &[Segment]) {
        let mut min_heap = BinaryHeap::new();

        for (i, &seg) in segments.iter().enumerate() {
            let value = arr[seg.start];
            let direction = if seg.start <= seg.end { 1 } else { -1 };
            min_heap.push(HeapNode {
                value,
                seg_index: i,
                current_pos: seg.start,
                direction,
            });
        }

        let mut sorted_arr = Vec::with_capacity(arr.len());
        while let Some(node) = min_heap.pop() {
            sorted_arr.push(node.value);

            let next_pos = (node.current_pos as i32 + node.direction) as usize;
            let seg = segments[node.seg_index];

            let condition = if node.direction == 1 {
                next_pos <= seg.end
            } else {
                next_pos >= seg.end
            };

            if condition {
                min_heap.push(HeapNode {
                    value: arr[next_pos],
                    seg_index: node.seg_index,
                    current_pos: next_pos,
                    direction: node.direction,
                });
            }
        }

        arr.copy_from_slice(&sorted_arr);
    }
}

pub fn run_examples() {
    let sorter = SegmentSort;

    let mut v = vec![5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18];
    println!("Original vector: {:?}", v);
    sorter.sort(&mut v);
    println!("Sorted vector:   {:?}", v);

    let mut v2 = vec![9, 2, 3, 4, 5, 6, 7, 8, 1];
    println!("\nOriginal vector: {:?}", v2);
    sorter.sort(&mut v2);
    println!("Sorted vector:   {:?}", v2);

    let mut v3 = vec![1, 2, 3, 4, 5, 6, 7, 8, 9];
    println!("\nOriginal vector: {:?}", v3);
    sorter.sort(&mut v3);
    println!("Sorted vector:   {:?}", v3);

    let mut v4 = vec![9, 8, 7, 6, 5, 4, 3, 2, 1];
    println!("\nOriginal vector: {:?}", v4);
    sorter.sort(&mut v4);
    println!("Sorted vector:   {:?}", v4);
}
