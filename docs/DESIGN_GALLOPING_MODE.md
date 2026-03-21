# Galloping Mode for Block Merge Segment Sort

## Problem Statement

When merging highly imbalanced segments (e.g., one segment has 1000 elements, other has 10), standard linear merge performs many unnecessary comparisons.

## Solution: Galloping (Exponential Search)

TimSort's approach: Instead of linear scan, use exponential search to jump ahead in the smaller segment.

## Implementation Strategy

```c
// Galloping mode thresholds (same as TimSort)
const int MIN_GALLOP = 7;
const int MAX_GALLOP = 64;

// Galloping: if we find run of X consecutive elements from one side,
// switch to exponential search for better performance

function mergeWithGallop(arr, left, right, buffer):
    gallopLeft = MIN_GALLOP
    gallopRight = MIN_GALLOP
    
    while leftNotExhausted && rightNotExhausted:
        // Check if galloping should start
        if gallopLeft >= MIN_GALLOP:
            // Find position in right using exponential search
            // Binary search to refine
            gallopLeft = 0
            gallopRight++
            
        if gallopRight >= MIN_GALLOP:
            // Find position in left using exponential search
            gallopRight = 0
            gallopLeft++
        
        // Standard merge for remaining elements
        if arr[left] <= arr[right]:
            buffer.push(arr[left++])
            gallopLeft++
        else:
            buffer.push(arr[right++])
            gallopRight++
    
    // Exhaust remaining
    // ...
```

## Galloping Algorithm

### Gallop Left (search in right array):
```c
int gallopLeft(int* arr, int rightStart, int rightEnd, int key) {
    int lo = rightStart;
    int hint = 0;
    
    // Exponential search
    while (rightEnd - lo > 0) {
        int delta = 1 << (hint + 1);
        if (arr[lo + delta - 1] < key) {
            lo += delta;
            hint++;
            if (lo > rightEnd) lo = rightEnd;
        } else {
            break;
        }
    }
    
    // Binary search to find exact position
    return binarySearch(arr, lo, min(rightEnd, lo), key);
}
```

## When to Activate

- When one segment is > 10× larger than the other
- After 7 consecutive elements from same segment in merge
- When merge would be highly unbalanced

## Complexity Impact

- Best case O(min(N, K)) where K is target position
- Maintains O(N log N) overall
- Significantly reduces comparisons for imbalanced merges

## Integration with Block Merge

1. In `bufferedMerge`, add galloping detection
2. Track consecutive picks from same side
3. If count >= MIN_GALLOP (7), activate galloping
4. Tune thresholds based on empirical testing

## Expected Improvement

- Better performance on skewed data distributions
- More competitive with TimSort on edge cases
- Reduced comparison count for imbalanced merges