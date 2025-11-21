import json
import glob
import os
import sys

def find_latest_benchmark_file(directory):
    list_of_files = glob.glob(os.path.join(directory, 'benchmark_results_clean_*.json'))
    if not list_of_files:
        return None
    return max(list_of_files, key=os.path.getctime)

def generate_html(json_file):
    print(f"Loading data from: {json_file}")
    with open(json_file, 'r') as f:
        data = json.load(f)

    results = data['results']
    target_size = 1000000
    
    # Prepare data for Chart.js
    # Structure: { DataType: { labels: [], data: [] } }
    chart_data = {}
    
    algo_labels = {
        'blockMergeSegmentSort': 'Block Merge (New)',
        'balancedSegmentMergeSort': 'Balanced Segment',
        'optimizedQuickSort': 'QuickSort (Opt)',
        'builtinSort': 'V8 Builtin',
        'mergeSort': 'Merge Sort',
        'heapSort': 'Heap Sort',
        'segmentSort': 'Segment Sort (Original)'
    }
    
    # Colors for bars
    colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
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
    
    for dtype, items in grouped.items():
        # Sort items by mean time
        items.sort(key=lambda x: x['statistics']['mean'])
        
        labels = [algo_labels.get(x['algorithm'], x['algorithm']) for x in items]
        means = [x['statistics']['mean'] for x in items]
        
        chart_id = f"chart_{dtype.replace(' ', '_')}"
        
        html_charts += f"""
        <div class="chart-container">
            <h3>{dtype} (1M Elements)</h3>
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
                    responsive: true,
                    scales: {{
                        y: {{
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
        <title>Benchmark Results</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {{ font-family: sans-serif; padding: 20px; background: #f5f5f5; }}
            .container {{ max_width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 20px; }}
            .chart-container {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
            h1 {{ text-align: center; color: #333; }}
            h3 {{ text-align: center; color: #666; }}
        </style>
    </head>
    <body>
        <h1>Block Merge Segment Sort - Benchmark Dashboard</h1>
        <div class="container">
            {html_charts}
        </div>
    </body>
    </html>
    """
    
    output_file = "benchmark_charts.html"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"Generated {output_file}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    latest_file = find_latest_benchmark_file(current_dir)
    
    if latest_file:
        try:
            generate_html(latest_file)
            print("Done!")
        except Exception as e:
            print(f"Error generating HTML: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("No benchmark result files found.")
