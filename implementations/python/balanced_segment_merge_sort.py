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

    segments_stack = []
    i = 0
    n = len(arr)

    while i < n:
        # Detect the next segment
        start = i
        segment = []
        
        # Add the first element
        segment.append(arr[i])
        i += 1
        
        # Detect if it's ascending or descending
        is_descending = False
        if i < n:
            is_descending = arr[start] > arr[i]
        
        # Continue the segment based on direction
        while i < n:
            if is_descending:
                # Descending segment
                if arr[i-1] <= arr[i]:
                    break
            else:
                # Ascending segment
                if arr[i-1] > arr[i]:
                    break
            segment.append(arr[i])
            i += 1
        
        # If descending, reverse it to make it ascending
        if is_descending:
            segment.reverse()

        # Merge with stack if needed
        current = segment
        while segments_stack and len(current) >= len(segments_stack[-1]):
            top = segments_stack.pop()
            current = merge_two_arrays(top, current)
        segments_stack.append(current)

    # Final merge of remaining segments
    while len(segments_stack) > 1:
        a = segments_stack.pop()
        b = segments_stack.pop()
        merged = merge_two_arrays(a, b)
        segments_stack.append(merged)

    # Copy back to original array
    if segments_stack:
        arr[:] = segments_stack[0]
    else:
        arr[:] = []
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
