# Changelog

All notable changes to this project will be documented in this file.

## [4.1] - 2026-03-21

### Added
- **3-way partitioning**: New merge strategy for high-duplicate data (>50% duplicates). Uses Dutch National Flag algorithm to split into `< pivot`, `= pivot`, `> pivot` regions.
- **Galloping mode**: Optimized merging for imbalanced segment sizes (10:1+). Uses exponential search similar to TimSort.
- **Dataset generation improvements**: Added `--varied-range` flag for more realistic benchmark data.

### Changed
- Updated README with latest improvements
- Improved documentation in benchmark methodology

### Fixed
- Fixed segmentsort.js exports for backward compatibility

---

## [4.0] - 2025-11

### Added
- Fixed 64K buffer optimization (256KB, fits in L2 cache)
- Block Merge Segment Sort (recommended implementation)
- On-the-Fly Balanced Merge Sort (O(log N) space variant)
- Full benchmark suite with C, C++, JavaScript implementations

### Performance
- Up to 125× faster than qsort on sorted data
- 72% faster than JavaScript's Array.sort() on average
- Competitive with std::sort on structured data

---

## [3.x] - Earlier versions

- Original K-way merge algorithm implementation
- Segment detection and heap-based merging
- Basic benchmark infrastructure