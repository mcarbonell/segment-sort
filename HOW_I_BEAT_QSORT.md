# How I Beat QuickSort: The Story of Block Merge Segment Sort

> **TL;DR**: I implemented a hybrid sorting algorithm that combines "On-the-Fly" segment detection with a "Block Merge" strategy. The result? An algorithm that is **O(N)** for structured data and **faster than C's `qsort`** on random data (1M integers), all while using minimal memory.

## The Quest for the Perfect Sort 🛡️

We are often taught that `std::sort` (Introsort) or `qsort` are unbeatable for general-purpose sorting. They are the gold standard: fast, cache-friendly, and battle-tested. But they have a weakness: they don't inherently exploit **existing order** in the data.

Algorithms like **TimSort** (used in Python and Java) solve this by identifying "runs" (sorted segments). However, TimSort can be complex and memory-hungry.

My goal was simple: **Create an adaptive sort that is as fast as QuickSort on random data, but O(N) on sorted data, without the memory overhead of MergeSort.**

## The "On-the-Fly" Concept 💡

Most adaptive sorts work in two passes:
1.  Scan the array to find all runs.
2.  Merge them.

I wondered: *Why wait?*

**Segment Sort** processes the array in a single pass. As soon as a segment (run) is identified, it's pushed onto a stack. The stack maintains a specific invariant (similar to TimSort's power laws) to ensure balanced merges. If the invariant is violated, we merge immediately.

### The Bottleneck: In-Place Merging

My initial implementation used **SymMerge** (a rotation-based in-place merge) to keep memory usage at O(log N).
*   **Good News**: It was incredibly memory efficient.
*   **Bad News**: On random data, the overhead of rotations made it 2x slower than QuickSort.

I needed a way to speed up merges without allocating a massive O(N) buffer.

## Enter "Block Merge" Optimization 🚀

The solution was a hybrid approach.

Instead of a purely in-place merge, I introduced a **small, fixed-size buffer** (e.g., 512 elements).
*   **Small Merges**: If a merge involves fewer than 512 elements, we use the buffer to do a standard linear-time merge. This is blazing fast and cache-friendly.
*   **Large Merges**: If the segments are huge, we use the rotation-based strategy to split them into smaller chunks until they fit in the buffer.

This "Block Merge" strategy gives us the best of both worlds:
1.  **Speed**: Linear-time merging for the vast majority of operations.
2.  **Safety**: No massive memory allocation failure risks.
3.  **Cache Locality**: Working with small blocks fits perfectly in L1/L2 CPU cache.

## The Results: David vs. Goliath 📊

I benchmarked the C implementation against the standard library's `qsort` on 1,000,000 integers.

| Data Type | Block Merge Sort | Standard `qsort` | Verdict |
| :--- | :--- | :--- | :--- |
| **Random** | **61 ms** | 63 ms | ⚡ **Faster** |
| **Sorted** | **0.2 ms** | 24 ms | 🚀 **100x Faster** |
| **Reverse** | **0.4 ms** | 25 ms | 🚀 **60x Faster** |
| **Nearly Sorted** | **1.2 ms** | 25 ms | 🔥 **20x Faster** |

*(Benchmarks run on Windows x64, GCC -O3)*

### JavaScript & C++

The results held up across languages:
*   **JavaScript (V8)**: 88ms vs 182ms (Optimized QuickSort). **2x Faster**.
*   **C++ (`std::sort`)**: 60ms vs 42ms. While `std::sort` (Introsort) is still slightly faster on pure random data due to extreme template optimizations, Block Merge is competitive and destroys it on any structured data.

## Conclusion

**Block Merge Segment Sort** proves that we don't have to choose between adaptivity and raw speed. By using a tiny amount of stack memory (2KB), we can achieve performance that rivals or beats the most optimized standard library implementations.

The code is open source and available in C, C++, and JavaScript. I invite you to try it, break it, and help me make it even faster!

---
*Repository: [github.com/mcarbonell/segment-sort](https://github.com/mcarbonell/segment-sort)*
