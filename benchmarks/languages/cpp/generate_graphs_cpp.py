import json
import os
import sys

def generate_html(json_file):
    print(f"Loading data from: {json_file}")
    with open(json_file, 'r') as f:
        data = json.load(f)

    results = data['results']
    # Detect target size automatically from the first result if possible, or use 500000
    target_size = 500000
    if results:
        target_size = results[0]['size']
    
    print(f"Generating charts for size: {target_size}")

    # Prepare data for Chart.js
    algo_labels = {
        'blockMergeSegmentSort': 'Block Merge (New)',
        'balancedSegmentMergeSort': 'Balanced Segment',
        'segmentSortOriginal': 'Segment Sort (Original)',
        'quickSort': 'QuickSort',
        'mergeSort': 'Merge Sort',
        'heapSort': 'Heap Sort',
        'builtinSort': 'std::sort (Introsort)'
    }
    
    # Colors for bars
    colors = [
        'rgba(255, 99, 132, 0.7)',   # Red
        'rgba(54, 162, 235, 0.7)',   # Blue
        'rgba(255, 206, 86, 0.7)',   # Yellow
        'rgba(75, 192, 192, 0.7)',   # Green
        'rgba(153, 102, 255, 0.7)',  # Purple
        'rgba(255, 159, 64, 0.7)',   # Orange
        'rgba(199, 199, 199, 0.7)',  # Grey
        'rgba(255, 99, 255, 0.7)'    # Pink
    ]

    # Group by DataType
    grouped = {}
    for res in results:
        if res['size'] != target_size:
            continue
        dtype = res['dataType']
        if dtype not in grouped:
            grouped[dtype] = []
        grouped[dtype].append(res)

    html_charts = ""
    
    # Order of charts
    ordered_types = ['Aleatorio', 'Ordenado', 'Inverso', 'K-sorted', 'NearlySorted', 'Duplicados', 'Plateau']
    
    for dtype in ordered_types:
        if dtype not in grouped:
            continue
            
        items = grouped[dtype]
        # Sort items by mean time
        items.sort(key=lambda x: x['statistics']['mean'])
        
        labels = [algo_labels.get(x['algorithm'], x['algorithm']) for x in items]
        means = [x['statistics']['mean'] for x in items]
        
        chart_id = f"chart_{dtype.replace(' ', '_').replace('-', '_')}"
        
        html_charts += f"""
        <div class="chart-container">
            <h3>{dtype} ({target_size:,} Elements)</h3>
            <canvas id="{chart_id}"></canvas>
        </div>
        <script>
            new Chart(document.getElementById('{chart_id}'), {{
                type: 'bar',
                data: {{
                    labels: {json.dumps(labels)},
                    datasets: [{{
                        label: 'Time (ms)',
                        data: {json.dumps(means)},
                        backgroundColor: {json.dumps(colors[:len(labels)])},
                        borderColor: {json.dumps([c.replace('0.7', '1') for c in colors[:len(labels)]])},
                        borderWidth: 1
                    }}]
                }},
                options: {{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {{
                        x: {{
                            beginAtZero: true,
                            title: {{ display: true, text: 'Time (ms) - Lower is Better' }}
                        }}
                    }},
                    plugins: {{
                        legend: {{ display: false }},
                        title: {{ display: true, text: 'Benchmark Results: {dtype}' }}
                    }}
                }}
            }});
        </script>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>C++ Benchmark Results - Block Merge Sort</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #f0f2f5; color: #333; }}
            .container {{ max_width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 30px; }}
            .chart-container {{ background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); height: 400px; }}
            h1 {{ text-align: center; color: #1a1a1a; margin-bottom: 40px; }}
            h3 {{ text-align: center; color: #555; margin-bottom: 20px; }}
            .summary {{ max_width: 800px; margin: 0 auto 40px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        </style>
    </head>
    <body>
        <h1>Block Merge Segment Sort - C++ Performance Analysis</h1>
        
        <div class="summary">
            <h2>Resumen de Ejecución</h2>
            <p><strong>Tamaño de Array:</strong> {target_size:,} elementos</p>
            <p><strong>Plataforma:</strong> C++ (MinGW g++)</p>
            <p>Este dashboard muestra el rendimiento comparativo del nuevo algoritmo <em>Block Merge Segment Sort</em> frente a implementaciones estándar.</p>
        </div>

        <div class="container">
            {html_charts}
        </div>
    </body>
    </html>
    """
    
    output_file = "cpp_benchmark_charts.html"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"Generated {output_file}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file = os.path.join(current_dir, 'results.json')
    
    if os.path.exists(json_file):
        try:
            generate_html(json_file)
            print("Done!")
        except Exception as e:
            print(f"Error generating HTML: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"Results file not found: {json_file}")
