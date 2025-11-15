def on_the_fly_balanced_merge_sort(arr):
    """
    Sorts a list using the On-the-Fly Balanced Merge Strategy.
    This algorithm identifies naturally sorted segments and merges them on-the-fly
    using a stack to maintain balanced sizes, achieving O(log n) space complexity.

    :param arr: The list to sort (will be mutated).
    :return: The mutated sorted list.
    """
    if not arr or len(arr) <= 1:
        return arr

    n = len(arr)
    segments_stack = []  # list of (start, end) indices, end is exclusive
    i = 0

    while i < n:
        start, end = _detect_segment_indices(arr, i, n)
        current_start, current_end = start, end
        i = end

        while segments_stack:
            top_start, top_end = segments_stack[-1]
            top_len = top_end - top_start
            current_len = current_end - current_start
            if current_len < top_len:
                break
            segments_stack.pop()
            _symmerge(arr, top_start, current_start, current_end)
            current_start = top_start

        segments_stack.append((current_start, current_end))

    while len(segments_stack) > 1:
        a_start, a_end = segments_stack.pop()
        b_start, b_end = segments_stack.pop()
        _symmerge(arr, b_start, a_start, a_end)
        segments_stack.append((b_start, a_end))

    return arr

def merge_two_arrays(left, right):
    """
    Merges two sorted arrays into a single sorted array.
    
    :param left: The first sorted array.
    :param right: The second sorted array.
    :return: The merged and sorted array.
    """
    if not left:
        return right[:]
    if not right:
        return left[:]
    
    result = []
    i = 0
    j = 0
    
    # Merge while both arrays have elements
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements from left array
    while i < len(left):
        result.append(left[i])
        i += 1
    
    # Add remaining elements from right array
    while j < len(right):
        result.append(right[j])
        j += 1
    
    return result

def _reverse_slice(arr, start, end):
    """Reverse arr[start:end] in-place (end exclusive)."""
    i = start
    j = end - 1
    while i < j:
        arr[i], arr[j] = arr[j], arr[i]
        i += 1
        j -= 1

def _detect_segment_indices(arr, start, n):
    """Detect a natural run starting at index start; return (start, end)."""
    if start >= n:
        return start, start

    end = start + 1
    if end < n and arr[start] > arr[end]:
        # descending run
        while end < n and arr[end - 1] > arr[end]:
            end += 1
        _reverse_slice(arr, start, end)
        return start, end
    else:
        # ascending run
        while end < n and arr[end - 1] <= arr[end]:
            end += 1
        return start, end

def _rotate(arr, first, middle, last):
    """Rotate the range [first,last) so that middle becomes the first index."""
    _reverse_slice(arr, first, middle)
    _reverse_slice(arr, middle, last)
    _reverse_slice(arr, first, last)

def _lower_bound(arr, first, last, value):
    """First index in [first,last) where arr[idx] >= value."""
    left = first
    right = last
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < value:
            left = mid + 1
        else:
            right = mid
    return left

def _symmerge(arr, first, middle, last):
    """In-place stable merge of two consecutive sorted ranges [first,middle) and [middle,last)."""
    if first >= middle or middle >= last:
        return
    if last - first == 1:
        return
    if last - first == 2:
        if arr[middle] < arr[first]:
            arr[first], arr[middle] = arr[middle], arr[first]
        return

    mid1 = (first + middle) // 2
    value = arr[mid1]
    mid2 = _lower_bound(arr, middle, last, value)
    new_mid = mid1 + (mid2 - middle)
    _rotate(arr, mid1, middle, mid2)
    _symmerge(arr, first, mid1, new_mid)
    _symmerge(arr, new_mid + 1, mid2, last)
