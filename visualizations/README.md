# Visualizations - Segment Sort Algorithm

This folder contains visualization tools to better understand how the Segment Sort algorithm works.

## 📊 Types of Visualizations

### 1. Flow Diagrams
- `flowchart.md` - Main algorithm flow diagram
- `segment_detection.svg` - Segment detection visualization
- `heap_merge.svg` - Heap merging animation

### 2. Interactive Animations
- **`on_the_fly_visualizer.html`** - **NEW: Comprehensive interactive JavaScript visualizer for On-the-Fly Balanced Merge Sort**
- `interactive_demo.html` - Interactive JavaScript demo
- `segment_animation.py` - Python animation with matplotlib

### 3. Visual Analysis
- `performance_charts.md` - Comparative performance charts
- `complexity_analysis.svg` - Visual complexity representation

## 🎨 How to Use

### Python Animation
```bash
cd visualizations
python segment_animation.py
```

### Interactive Demo
```bash
# Open in web browser
open interactive_demo.html
```

### Generate Performance Charts
```bash
python generate_charts.py
```

## 📈 Interpretation

### Segment Detection
The visualization shows how the algorithm automatically identifies:
- **Increasing segments** (→)
- **Decreasing segments** (←)
- **Change points** (⊥)

### Heap Merging
The animation demonstrates:
- Inserting elements into the heap
- Extracting minimum/maximum
- Dynamic segment reorganization

## 🎯 Case Studies

1. **Sorted Array** - Best case O(n)
2. **Random Array** - Average case O(n log n)
3. **Semi-ordered Array** - Competitive advantage case
4. **Patterned Array** - Optimal use cases

---

## 👨‍💻 Author

**Segment Sort Algorithm Visualization Tools**
- Created by: Mario Raúl Carbonell Martínez
- Date: November 2025

*Note: Some visualizations require additional libraries such as matplotlib or a web connection to function completely.*
