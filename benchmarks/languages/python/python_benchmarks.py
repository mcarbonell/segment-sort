#!/usr/bin/env python3
"""
Segment Sort - Python Benchmarks
Comprehensive performance testing for Segment Sort algorithm
Author: Mario Raúl Carbonell Martínez
Date: November 2025
"""

import sys
import time
import random
import json
import argparse
from typing import List, Tuple, Any
import os

# Add the implementations directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Import Segment Sort implementation
from implementations.python.balanced_segment_merge_sort import on_the_fly_balanced_merge_sort

# --- Deterministic Random Number Generator (LCG) ---
# This ensures reproducibility of benchmarks.
class LCG:
    def __init__(self, seed=12345):
        self.current_seed = seed
        self.a = 1103515245
        self.c = 12345
        self.m = 2 ** 31

    def random(self):
        """Generate a random number in [0, 1)"""
        self.current_seed = (self.a * self.current_seed + self.c) % self.m
        return self.current_seed / self.m

# Global LCG instance
lcg = LCG()

def set_seed(seed):
    """Set the seed for deterministic random generation"""
    global lcg
    lcg = LCG(seed)

# Data generators with deterministic randomness
def generate_random_array(size, min_val=0, max_val=1000):
    """Generate a random array using LCG for determinism"""
    arr = []
    for _ in range(size):
        value = int(lcg.random() * (max_val - min_val + 1)) + min_val
        arr.append(value)
    return arr

def generate_k_sorted_array(size, k, min_val=0, max_val=1000):
    """Generate a k-sorted array (elements within k positions of final position)"""
    arr = []
    step = (max_val - min_val) / size
    
    # Create sorted base array
    for i in range(size):
        arr.append(min_val + i * step)
    
    # Apply limited swaps within k
    for i in range(size):
        max_j = min(i + k + 1, size)
        j = i + int(lcg.random() * (max_j - i))
        if j < size:
            arr[i], arr[j] = arr[j], arr[i]
    
    return arr

def generate_nearly_sorted_array(size, num_swaps, min_val=0, max_val=1000):
    """Generate a nearly sorted array with random perturbations"""
    arr = []
    step = (max_val - min_val) / size
    
    # Create sorted array
    for i in range(size):
        arr.append(min_val + i * step)
    
    # Apply random swaps
    for _ in range(num_swaps):
        i = int(lcg.random() * size)
        j = int(lcg.random() * size)
        arr[i], arr[j] = arr[j], arr[i]
    
    return arr

def generate_duplicates_array(size, unique_values=10, min_val=0, max_val=100):
    """Generate array with high concentration of duplicates"""
    arr = []
    for _ in range(size):
        value_index = int(lcg.random() * unique_values)
        value = min_val + (value_index * (max_val - min_val) / unique_values)
        arr.append(int(value))
    return arr

def generate_plateau_array(size, plateau_size, min_val=0, max_val=1000):
    """Generate array with large sections of identical values"""
    arr = []
    num_plateaus = (size + plateau_size - 1) // plateau_size
    
    for p in range(num_plateaus):
        plateau_value = min_val + (p * (max_val - min_val) / num_plateaus)
        current_plateau_size = min(plateau_size, size - len(arr))
        
        for _ in range(current_plateau_size):
            arr.append(int(plateau_value))
    
    return arr

def generate_segment_sorted_array(size, segment_size, min_val=0, max_val=1000):
    """Generate array with internally sorted segments"""
    arr = []
    num_segments = (size + segment_size - 1) // segment_size
    
    for s in range(num_segments):
        segment_start = s * segment_size
        segment_end = min(segment_start + segment_size, size)
        segment_range = (max_val - min_val) / num_segments
        segment_min = min_val + s * segment_range
        segment_max = segment_min + segment_range
        
        for i in range(segment_start, segment_end):
            value = segment_min + (i - segment_start) * (segment_max - segment_min) / (segment_end - segment_start)
            arr.append(int(value))
    
    return arr

def generate_sorted_array(size, min_val=0, max_val=1000):
    """Generate a perfectly sorted array"""
    arr = []
    step = (max_val - min_val) / size
    for i in range(size):
        arr.append(int(min_val + i * step))
    return arr

def generate_reverse_array(size, min_val=0, max_val=1000):
    """Generate a reverse sorted array"""
    arr = []
    step = (max_val - min_val) / size
    for i in range(size):
        arr.append(int(max_val - i * step))
    return arr

# Sorting algorithms implementations
def quick_sort(arr, low=0, high=None):
    """Optimized Quick Sort with median-of-three pivot selection"""
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    """Partition function for quick sort with median-of-three"""
    mid = (low + high) // 2
    if arr[mid] < arr[low]:
        arr[mid], arr[low] = arr[low], arr[mid]
    if arr[high] < arr[low]:
        arr[high], arr[low] = arr[low], arr[high]
    if arr[high] < arr[mid]:
        arr[high], arr[mid] = arr[mid], arr[high]
    
    # Place median at end
    arr[mid], arr[high] = arr[high], arr[mid]
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def merge_sort(arr):
    """Standard merge sort implementation"""
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    """Merge function for merge sort"""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def heapify(arr, n, i):
    """Heapify function for heap sort"""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    """Heap sort implementation"""
    n = len(arr)
    
    # Build heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def insertion_sort(arr):
    """Insertion sort implementation for small arrays"""
    arr = arr[:]  # Make a copy
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Dictionary of sorters for benchmarking
SORTERS = {
    'balancedSegmentMergeSort': lambda arr: on_the_fly_balanced_merge_sort(arr.copy()),
    'quickSort': lambda arr: quick_sort(arr.copy()),
    'mergeSort': lambda arr: merge_sort(arr.copy()),
    'heapSort': lambda arr: heap_sort(arr.copy()),
#    'insertionSort': lambda arr: insertion_sort(arr.copy()),
    'builtinSort': lambda arr: sorted(arr),
}

def check_sorted(arr):
    """Check if an array is properly sorted"""
    if not isinstance(arr, list) or len(arr) == 0:
        return {'is_sorted': False, 'error': 'Array is empty or not a list'}

    for i in range(1, len(arr)):
        if arr[i] < arr[i - 1]:
            return {
                'is_sorted': False,
                'error': f'Array not sorted at index {i}: arr[{i-1}]={arr[i-1]}, arr[{i}]={arr[i]}'
            }

    return {'is_sorted': True}

def calculate_stats(times):
    """Calculate statistical measures for timing data"""
    if not times:
        return {
            'mean': 0, 'median': 0, 'std': 0,
            'p5': 0, 'p95': 0, 'min': 0, 'max': 0
        }
    
    sorted_times = sorted(times)
    n = len(times)
    mean = sum(times) / n
    median = sorted_times[n // 2] if n % 2 == 1 else (sorted_times[n // 2 - 1] + sorted_times[n // 2]) / 2
    
    variance = sum((t - mean) ** 2 for t in times) / n
    std = variance ** 0.5
    
    p5_idx = max(0, int(n * 0.05) - 1)
    p95_idx = min(n - 1, int(n * 0.95) - 1)
    
    return {
        'mean': mean,
        'median': median,
        'std': std,
        'p5': sorted_times[p5_idx],
        'p95': sorted_times[p95_idx],
        'min': sorted_times[0],
        'max': sorted_times[-1]
    }

def warm_up(algorithm, array, warmup_runs=3):
    """Warm up the JIT/optimization by running the algorithm multiple times"""
    try:
        for _ in range(warmup_runs):
            algorithm(array.copy())
    except Exception:
        # Silently ignore warm-up errors
        pass

def run_benchmark(algorithm, array, name, repetitions=10, validate_results=True):
    """Run a single benchmark test"""
    times = []
    sorted_result = None
    success = True
    error = None

    # Warm-up run
    warm_up(algorithm, array)

    # Multiple runs for statistical analysis
    for rep in range(repetitions):
        try:
            start_time = time.perf_counter()
            result = algorithm(array)
            end_time = time.perf_counter()

            # Validate that result is correctly sorted (if validation is enabled)
            if validate_results:
                validation = check_sorted(result)
                if not validation['is_sorted']:
                    success = False
                    error = f"Validation failed: {validation['error']}"
                    break

            times.append((end_time - start_time) * 1000)  # Convert to milliseconds
            if rep == 0:
                sorted_result = result
        except Exception as err:
            success = False
            error = str(err)
            break
    
    if success:
        stats = calculate_stats(times)
        return {
            'algorithm': name,
            'size': len(array),
            'repetitions': repetitions,
            'times': times,
            'statistics': stats,
            'sorted': sorted_result,
            'success': True
        }
    else:
        return {
            'algorithm': name,
            'size': len(array),
            'repetitions': 0,
            'times': [],
            'statistics': {},
            'sorted': [],
            'success': False,
            'error': error
        }

def run_benchmarks(sizes=[100000], repetitions=10, validate_results=True):
    """Run complete benchmark suite"""
    print('[INFO] Iniciando benchmarks PYTHON de Segment Sort (Metodología Academica)...\n')
    print(f'[CONFIG] {repetitions} repeticiones, analisis estadistico completo\n')
    print('=' * 100)
    print('| Algoritmo                   | Tamaño | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |')
    print('=' * 100)
    
    all_results = []
    
    for size in sizes:
        print(f'\n[SIZE] Probando con arrays de tamaño: {size}')
        print('-' * 60)
        
        # Generate test data
        random_array = generate_random_array(size)
        sorted_array = generate_sorted_array(size)
        reverse_array = generate_reverse_array(size)
        k_sorted_array = generate_k_sorted_array(size, size // 10)  # 10% misalignment
        nearly_sorted_array = generate_nearly_sorted_array(size, size // 20)  # 5% swaps
        duplicates_array = generate_duplicates_array(size, 20)  # 20 unique values
        plateau_array = generate_plateau_array(size, size // 10)  # 10 segments
        segment_sorted_array = generate_segment_sorted_array(size, size // 5)  # 5 segments
        
        test_cases = [
            {'name': 'Aleatorio', 'data': random_array, 'shortName': 'Aleatorio'},
            {'name': 'Ordenado', 'data': sorted_array, 'shortName': 'Ordenado'},
            {'name': 'Inverso', 'data': reverse_array, 'shortName': 'Inverso'},
            {'name': 'K-sorted (k=10%)', 'data': k_sorted_array, 'shortName': 'K-sorted'},
            {'name': 'Nearly Sorted (5% swaps)', 'data': nearly_sorted_array, 'shortName': 'NearlySorted'},
            {'name': 'Con Duplicados (20 unicos)', 'data': duplicates_array, 'shortName': 'Duplicados'},
            {'name': 'Plateau (10 segmentos)', 'data': plateau_array, 'shortName': 'Plateau'},
            {'name': 'Segment Sorted (5 segmentos)', 'data': segment_sorted_array, 'shortName': 'SegmentSorted'}
        ]
        
        for test_case in test_cases:
            print(f'\n[TEST] {test_case["name"]}:')
            
            # Test each algorithm
            for name, algorithm in SORTERS.items():
                result = run_benchmark(algorithm, test_case['data'], name, repetitions, validate_results)
                status = '[OK]' if result['success'] else '[ERROR]'
                
                if result['success']:
                    time_str = f"{result['statistics']['mean']:.3f}"
                    median_str = f"{result['statistics']['median']:.3f}"
                    std_str = f"{result['statistics']['std']:.3f}"
                    print(f"   {name:<25} | {size:>6} | {test_case['shortName']:<18} | {time_str:>9} | {median_str:>11} | {std_str:>8} | {status}")
                    
                    # Store result for JSON export
                    all_results.append({
                        'algorithm': name,
                        'size': size,
                        'dataType': test_case['shortName'],
                        'repetitions': repetitions,
                        'statistics': result['statistics'],
                        'allTimes': result['times'],
                        'success': True
                    })
                else:
                    print(f"   {name:<25} | {size:>6} | {test_case['shortName']:<18} | {'ERROR':>9} | {'ERROR':>11} | {'ERROR':>8} | {status}")
                    print(f"   Error: {result['error']}")
                    
                    all_results.append({
                        'algorithm': name,
                        'size': size,
                        'dataType': test_case['shortName'],
                        'repetitions': 0,
                        'statistics': {},
                        'allTimes': [],
                        'success': False,
                        'error': result['error']
                    })
    
    print('\n' + '=' * 100)
    print('[SUCCESS] Benchmarks completados!')
    
    # Comparative analysis
    analyze_results(all_results)
    
    # Export results to JSON
    timestamp = time.strftime('%Y-%m-%dT%H-%M-%S', time.gmtime())
    filename = f'benchmark_results_python_{timestamp}_seed{lcg.current_seed}.json'
    results = {
        'metadata': {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime()),
            'seed': lcg.current_seed,
            'python_version': sys.version,
            'platform': sys.platform,
            'repetitions': repetitions,
            'methodology': 'Academic Rigor Benchmarking v1.0'
        },
        'results': all_results
    }
    
    try:
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        print(f'[EXPORT] Resultados exportados a: {filename}')
    except Exception as error:
        print(f'[ERROR] Error exportando resultados: {error}')
    
    return results

def analyze_results(all_results):
    """Analyze and present comparative results"""
    if not all_results:
        print('No hay resultados para analizar.')
        return
    
    print('\n[ANALYSIS] Analisis comparativo resumido (media de tiempos por algoritmo y tipo de datos):')
    
    # Group by data type
    by_type = {}
    global_agg = {}
    
    for res in all_results:
        if not res['success'] or 'mean' not in res['statistics']:
            continue
        algorithm = res['algorithm']
        data_type = res['dataType']
        mean = res['statistics']['mean']
        
        # Aggregate by type
        if data_type not in by_type:
            by_type[data_type] = {}
        if algorithm not in by_type[data_type]:
            by_type[data_type][algorithm] = {'sum': 0, 'count': 0}
        by_type[data_type][algorithm]['sum'] += mean
        by_type[data_type][algorithm]['count'] += 1
        
        # Global aggregation
        if algorithm not in global_agg:
            global_agg[algorithm] = {'sum': 0, 'count': 0}
        global_agg[algorithm]['sum'] += mean
        global_agg[algorithm]['count'] += 1
    
    # Analyze by type
    for data_type, alg_map in by_type.items():
        averages = []
        for alg, agg in alg_map.items():
            averages.append({'algorithm': alg, 'mean': agg['sum'] / agg['count']})
        averages.sort(key=lambda x: x['mean'])
        
        if averages:
            best = averages[0]
            print(f'\n   => Tipo de datos: {data_type}')
            print(f'     - Mas rapido: {best["algorithm"]} (~{best["mean"]:.3f} ms)')
            ranking_str = '  |  '.join([f"{i+1}. {x['algorithm']} ({x['mean']:.3f} ms)" for i, x in enumerate(averages)])
            print(f'     - Ranking: {ranking_str}')
    
    # Global ranking
    global_arr = []
    for alg, agg in global_agg.items():
        global_arr.append({'algorithm': alg, 'mean': agg['sum'] / agg['count']})
    global_arr.sort(key=lambda x: x['mean'])
    
    if global_arr:
        print('\n[RANKING] Ranking global (promedio sobre todos los tamaños y tipos):')
        global_str = '  |  '.join([f"{i+1}. {x['algorithm']} ({x['mean']:.3f} ms)" for i, x in enumerate(global_arr)])
        print(f'     {global_str}')

def main():
    """Main function with command line argument parsing"""
    parser = argparse.ArgumentParser(
        description='Python Benchmarks for Segment Sort Algorithm',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python python_benchmarks.py                # Ejecuta con tamaño 100000, 10 repeticiones
  python python_benchmarks.py 50000          # Ejecuta solo para tamaño 50000
  python python_benchmarks.py 10000 50000    # Ejecuta para varios tamaños
  python python_benchmarks.py 100000 --reps 30  # Ejecuta tamaño 100000 con 30 repeticiones
  python python_benchmarks.py --seed 42 50000 --reps 5  # Con seed específico
  python python_benchmarks.py 10000 --no-validate  # Ejecuta sin validación de resultados

Argumentos:
  sizes...              Tamaños de arrays a probar (por defecto: 100000)
  --reps, -r N         Número de repeticiones por configuración (por defecto: 10)
  --seed S             Seed para generación determinística (por defecto: 12345)
  --no-validate        Deshabilita validación de que los resultados estén ordenados
        """
    )
    
    parser.add_argument('sizes', nargs='*', type=int,
                       help='Tamaños de arrays a probar')
    parser.add_argument('--reps', '-r', type=int, default=10,
                       help='Número de repeticiones por configuración')
    parser.add_argument('--seed', type=int, default=12345,
                       help='Seed para generación determinística')
    parser.add_argument('--no-validate', action='store_true',
                       help='Deshabilita validación de que los resultados estén ordenados')
    
    args = parser.parse_args()

    # Set seed for deterministic results
    set_seed(args.seed)

    sizes = args.sizes if args.sizes else [100000]
    repetitions = args.reps
    validate_results = not args.no_validate

    print(f'[CONFIG] Configuracion:')
    print(f'   - Tamaños: {sizes}')
    print(f'   - Repeticiones: {repetitions}')
    print(f'   - Seed: {args.seed}')
    print(f'   - Validación: {"Habilitada" if validate_results else "Deshabilitada"}\n')

    # Run benchmarks
    run_benchmarks(sizes, repetitions, validate_results)

if __name__ == '__main__':
    main()