# Dataset Generators

This directory contains data generators for creating test datasets with specific characteristics.

## Available Generators

### Random Data
- `random_generators.py` - Generates uniformly distributed random data

### Structured Data  
- `structured_data.py` - Generates data with specific patterns:
  - K-sorted arrays
  - Nearly sorted arrays
  - Segment-sorted arrays
  - Plateau arrays (with repeated values)

### Edge Cases
- `edge_cases.py` - Generates challenging datasets:
  - Arrays with many duplicates
  - Reverse sorted arrays
  - Single element arrays
  - Empty arrays
  - Arrays with extreme values

## Usage

Data generators should be:
1. Deterministic (use seeded random number generators)
2. Configurable (support different sizes and characteristics)
3. Well-documented (clear parameter descriptions)
4. Efficient (fast generation for large datasets)

## Adding New Generators

When creating new data generators:

1. Place in this directory
2. Follow naming convention: `{purpose}_generators.{ext}`
3. Include comprehensive parameter validation
4. Support both programmatic and CLI usage
5. Add documentation to this README