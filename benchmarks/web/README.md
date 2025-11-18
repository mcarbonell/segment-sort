# Web Visualization Tools

This directory contains web-based tools for visualizing and interacting with benchmark results.

## Available Tools

### `benchmark_web.html`
Interactive web interface for exploring benchmark results and algorithm performance.

**Features**:
- Dynamic charts and graphs
- Side-by-side algorithm comparison
- Performance metrics visualization
- Downloadable result exports

### `benchmark_web.js`
JavaScript logic supporting the web interface.

**Features**:
- Chart rendering (using Chart.js or similar)
- Data parsing and formatting
- User interaction handling
- Real-time benchmark execution (when supported)

## Usage

### Local Development
```bash
cd benchmarks/web
python -m http.server 8000  # Python 3
# or
python -m SimpleHTTPServer 8000  # Python 2
# Then open http://localhost:8000/benchmark_web.html
```

### Production Deployment
The web tools are designed to be deployable on static hosting services (GitHub Pages, Netlify, etc.).

## Adding New Web Tools

When creating new web-based tools:

1. Place HTML files in this directory
2. Keep JavaScript modular and well-documented
3. Use responsive design principles
4. Support both desktop and mobile devices
5. Ensure accessibility compliance

## Dependencies

Web tools should minimize external dependencies and:
- Use CDN-hosted libraries when possible
- Include fallback mechanisms for offline use
- Document any required dependencies
- Support modern browsers (Chrome, Firefox, Safari, Edge)