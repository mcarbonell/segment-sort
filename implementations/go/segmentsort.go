package main

import (
	"container/heap"
	"fmt"
)

// Segment stores the start and end indices of a detected segment.
type Segment struct {
	start, end int
}

// HeapNode represents an object in our min-heap.
type HeapNode struct {
	value      int // The value of the element
	segIndex   int // The segment this element belongs to
	currentPos int // The position of this element in the original array
	direction  int // The direction of iteration for this segment
}

// MinHeap implements heap.Interface for a slice of HeapNode pointers.
type MinHeap []*HeapNode

func (h MinHeap) Len() int { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i].value < h[j].value }
func (h MinHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }

// Push adds an element to the heap.
func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(*HeapNode))
}

// Pop removes and returns the minimum element from the heap.
func (h *MinHeap) Pop() interface{} {
	old := *h
	int n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

// SegmentSort encapsulates the sorting logic.
type SegmentSort struct{}

// Sort sorts a slice of integers using the Segment Sort algorithm.
func (s *SegmentSort) Sort(arr []int) {
	n := len(arr)
	if n <= 1 {
		return
	}

	// Phase 1: Segment Detection
	segments := s.detectSegments(arr)

	// Phase 2: Heap Merging
	if len(segments) == 0 {
		return
	}

	s.mergeSegments(arr, segments)
}

func (s *SegmentSort) detectSegments(arr []int) []Segment {
	var segments []Segment
	n := len(arr)
	if n == 0 {
		return segments
	}

	start := 0
	for start < n {
		end := start + 1
		if end < n && arr[start] > arr[end] {
			// Decreasing segment
			for end+1 < n && arr[end] > arr[end+1] {
				end++
			}
			segments = append(segments, Segment{start: end, end: start})
		} else {
			// Increasing segment
			for end+1 < n && arr[end] <= arr[end+1] {
				end++
			}
			segments = append(segments, Segment{start: start, end: end})
		}
		start = end + 1
	}
	return segments
}

func (s *SegmentSort) mergeSegments(arr []int, segments []Segment) {
	minHeap := &MinHeap{}
	heap.Init(minHeap)

	for i, seg := range segments {
		value := arr[seg.start]
		direction := 1
		if seg.start > seg.end {
			direction = -1
		}
		heap.Push(minHeap, &HeapNode{
			value:      value,
			segIndex:   i,
			currentPos: seg.start,
			direction:  direction,
		})
	}

	sortedArr := make([]int, 0, len(arr))
	for minHeap.Len() > 0 {
		node := heap.Pop(minHeap).(*HeapNode)
		sortedArr = append(sortedArr, node.value)

		nextPos := node.currentPos + node.direction
		seg := segments[node.segIndex]

		if (node.direction == 1 && nextPos <= seg.end) || (node.direction == -1 && nextPos >= seg.end) {
			nextValue := arr[nextPos]
			heap.Push(minHeap, &HeapNode{
				value:      nextValue,
				segIndex:   node.segIndex,
				currentPos: nextPos,
				direction:  node.direction,
			})
		}
	}

	// Copy sorted result back
	copy(arr, sortedArr)
}

func main() {
	sorter := &SegmentSort{}

	v := []int{5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18}
	fmt.Println("Original vector:", v)
	sorter.Sort(v)
	fmt.Println("Sorted vector:  ", v)

	v2 := []int{9, 2, 3, 4, 5, 6, 7, 8, 1}
	fmt.Println("\nOriginal vector:", v2)
	sorter.Sort(v2)
	fmt.Println("Sorted vector:  ", v2)

	v3 := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}
	fmt.Println("\nOriginal vector:", v3)
	sorter.Sort(v3)
	fmt.Println("Sorted vector:  ", v3)

	v4 := []int{9, 8, 7, 6, 5, 4, 3, 2, 1}
	fmt.Println("\nOriginal vector:", v4)
	sorter.Sort(v4)
	fmt.Println("Sorted vector:  ", v4)
}
