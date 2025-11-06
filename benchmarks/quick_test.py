#!/usr/bin/env python3
"""
Segment Sort - Test Rápido
==========================

Script para testing rápido del algoritmo Segment Sort.
Ejecuta pruebas básicas y compara con algoritmos estándar.
"""

import time
import random
import sys
import os

# Añadir el directorio padre al path
sys.path.append(os.path.join(os.path.dirname(__file__), '../implementations/python'))

def segment_sort(arr):
    """Implementación del algoritmo Segment Sort."""
    if len(arr) <= 1:
        return arr.copy()
    
    n = len(arr)
    copyarr = arr.copy()
    
    # Fase 1: Detección de segmentos
    segments = []
    start = 0
    direction = 0  # 0: desconocido, >0: creciente, <0: decreciente
    
    for i in range(1, n):
        if direction == 0:
            direction = copyarr[i] - copyarr[i - 1]
            continue
        
        if (direction > 0 and copyarr[i - 1] > copyarr[i]) or \
           (direction < 0 and copyarr[i - 1] < copyarr[i]):
            length = i - start if direction > 0 else start - i
            if length > 0:
                segments.append({'start': start, 'length': length, 'direction': direction})
            start = i
            direction = 0
    
    # Añadir el último segmento
    if direction >= 0:
        length = n - start
        if length > 0:
            segments.append({'start': start, 'length': length, 'direction': 1})
    else:
        length = start + 1
        if length > 0:
            segments.append({'start': start, 'length': length, 'direction': -1})
    
    # Fase 2: Fusión con heap
    import heapq
    
    class SegmentWrapper:
        def __init__(self, start, length, direction):
            self.start = start
            self.length = length
            self.direction = direction
        
        def __lt__(self, other):
            return copyarr[self.start] < copyarr[other.start]
    
    heap = []
    for segment in segments:
        if segment['length'] > 0:
            heapq.heappush(heap, SegmentWrapper(
                segment['start'], 
                segment['length'], 
                segment['direction']
            ))
    
    result = []
    while heap:
        current_segment = heapq.heappop(heap)
        result.append(copyarr[current_segment.start])
        current_segment.start += current_segment.direction
        current_segment.length -= 1
        
        if current_segment.length > 0:
            heapq.heappush(heap, current_segment)
    
    return result

def quick_sort(arr):
    """Quick Sort básico."""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

def test_algorithm(algorithm, test_name, test_array):
    """Testa un algoritmo con un array dado."""
    print(f"\n🔍 Test: {test_name}")
    print(f"   Input: {test_array[:10]}{'...' if len(test_array) > 10 else ''}")
    
    start_time = time.perf_counter()
    result = algorithm(test_array.copy())
    end_time = time.perf_counter()
    
    execution_time = (end_time - start_time) * 1000  # ms
    
    # Verificar si está ordenado
    is_sorted = all(result[i] <= result[i + 1] for i in range(len(result) - 1))
    
    print(f"   Output: {result[:10]}{'...' if len(result) > 10 else ''}")
    print(f"   Tiempo: {execution_time:.2f} ms")
    print(f"   Estado: {'✅ CORRECTO' if is_sorted else '❌ ERROR'}")
    
    return is_sorted, execution_time

def run_quick_tests():
    """Ejecuta tests rápidos de validación."""
    print("🚀 Segment Sort - Test Rápido")
    print("=" * 40)
    
    # Casos de prueba
    test_cases = [
        ("Array vacío", []),
        ("Un elemento", [42]),
        ("Dos elementos ordenados", [1, 2]),
        ("Dos elementos invertidos", [2, 1]),
        ("Array ya ordenado", [1, 2, 3, 4, 5]),
        ("Array invertido", [5, 4, 3, 2, 1]),
        ("Con duplicados", [3, 1, 4, 1, 5, 9, 2, 6]),
        ("Semi-ordenado", [1, 2, 3, 8, 4, 5, 6, 9]),
    ]
    
    all_passed = True
    
    for test_name, test_array in test_cases:
        passed, _ = test_algorithm(segment_sort, test_name, test_array)
        if not passed:
            all_passed = False
    
    # Benchmark rápido
    print(f"\n⚡ Benchmark Rápido (10,000 elementos)")
    print("-" * 40)
    
    test_sizes = [1000, 5000, 10000]
    algorithms = [
        ("Segment Sort", segment_sort),
        ("Python sorted()", sorted),
        ("Quick Sort", quick_sort)
    ]
    
    for size in test_sizes:
        print(f"\n📊 Tamaño: {size:,} elementos")
        
        # Generar diferentes tipos de arrays
        arrays = {
            'Aleatorio': [random.randint(1, size * 2) for _ in range(size)],
            'Semi-ordenado': list(range(size)) + [random.randint(1, size * 2) for _ in range(size // 5)],
            'Segmentado': []
        }
        
        # Crear array con segmentos
        segment_size = 50
        for i in range(0, size, segment_size * 2):
            segment = list(range(i + 1, min(i + segment_size, size + 1)))
            if (i // segment_size) % 2:
                segment.reverse()
            arrays['Segmentado'].extend(segment[:segment_size])
        
        arrays['Segmentado'] = arrays['Segmentado'][:size]
        
        for array_type, test_array in arrays.items():
            print(f"\n  Dataset: {array_type}")
            for alg_name, alg_func in algorithms:
                start_time = time.perf_counter()
                result = alg_func(test_array.copy())
                end_time = time.perf_counter()
                execution_time = (end_time - start_time) * 1000
                
                # Verificar que está ordenado
                is_sorted = all(result[i] <= result[i + 1] for i in range(len(result) - 1))
                status = "✅" if is_sorted else "❌"
                
                print(f"    {alg_name:<15}: {execution_time:>8.2f} ms {status}")
    
    print(f"\n{'🎉 TODOS LOS TESTS PASARON' if all_passed else '❌ ALGUNOS TESTS FALLARON'}")
    return all_passed

if __name__ == "__main__":
    run_quick_tests()