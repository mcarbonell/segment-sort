# Segment Sort - Variante con Fusión Balanceada de Segmentos

## Descripción General

Esta variante del algoritmo Segment Sort optimiza la fase de fusión utilizando una estrategia de cola inteligente que busca fusionar segmentos de tamaños similares, minimizando el costo computacional del merge.

## Problema Identificado

En la implementación original con heap, los segmentos se fusionan sin considerar sus tamaños relativos, lo que puede resultar en merges desbalanceados:

```
Segmento A: [1000 elementos] + Segmento B: [10 elementos] = O(1010) trabajo desperdiciado
```

## Solución: Cola LIFO de Segmentos con Fusión Balanceada

### Algoritmo Principal

```cpp
class BalancedSegmentMerger {
    queue<Segment> pending;
    
public:
    Segment mergeOptimal(vector<Segment>& segments) {
        for (auto& seg : segments) {
            processSegment(seg);
        }
        return flushPending();
    }
    
private:
    void processSegment(Segment current) {
        if (pending.empty()) {
            pending.push(current);
            return;
        }
        
        Segment candidate = pending.front();
        
        if (current.size() <= candidate.size()) {
            // Fusionar inmediatamente - tamaños balanceados
            pending.pop();
            Segment merged = merge(candidate, current);
            processSegment(merged);  // Recursivo
        } else {
            // Buscar mejor match - diferir fusión
            pending.push(current);
        }
    }
};
```

### Estrategia de Decisión

**Regla de fusión:**
- Si `tamaño(segmento_actual) >= tamaño(primer_segmento_cola LIFO)` → **Fusionar**
- Si `tamaño(segmento_actual) < tamaño(primer_segmento_cola LIFO)` → **Encolar y buscar siguiente segmento**

## Análisis de Complejidad

### Espacio: O(log n)

**Propiedad clave:** Los segmentos en la cola LIFO tienen tamaños estrictamente decrecientes. El último elemento de la cola (primero en extraer) es el de menor tamaño, y el primero de la cola (el último en extraer) el de mayor.

**Demostración:**
```
Cola: [seg₁: s₁] [seg₂: s₂] [seg₃: s₃] ... [segₖ: sₖ]
Donde: s₁ > s₂ > s₃ > ... > sₖ
```

Con la restricción `s₁ + s₂ + ... + sₖ ≤ n` y tamaños mínimos:
```
s₁ ≥ 1, s₂ ≥ 2, s₃ ≥ 4, ..., sₖ   

Por tanto: 2^(k-1) ≤ n → k ≤ log₂(n) + 1

El número máximo de segmentos en la cola k es O(log n)
```

### Tiempo: O(n log n)

- Cada elemento se procesa máximo O(log n) veces
- Cada merge es O(tamaño_segmentos)
- Total: O(n log n) en el peor caso

## Ventajas de la Variante

1. **Eficiencia de Merge:** Fusiona segmentos de tamaños similares, minimizando trabajo desperdiciado
2. **Memoria Optimizada:** Cola de tamaño O(log n) vs O(n) del heap original
3. **Streaming-Friendly:** Procesa segmentos conforme se detectan
4. **Adaptativo:** Se ajusta dinámicamente a la distribución de tamaños
5. **Localidad de Memoria:** Mejor que el heap para accesos secuenciales

## Optimizaciones Adicionales

### 1. Concatenación sin Merge
```cpp
bool canConcatenate(Segment& a, Segment& b) {
    // Hay que añadir que a.increasing == b.increasing, los dos son crecientes o los dos son decrecientes
    return a.tail() <= b.head();  // Ya ordenados naturalmente
}
```

### 2. Priority Queue por Tamaño
```cpp
priority_queue<Segment, vector<Segment>, SizeComparator> pending;
```

### 3. Paralelización por Niveles
```cpp
parallel_for(nivel in merge_tree) {
    merge_segments_in_parallel(nivel);
}
```

## Casos de Uso Óptimos

- **Datos con segmentos de tamaños variables:** Maximiza el beneficio del balanceo
- **Streaming de datos:** Procesamiento incremental eficiente
- **Memoria limitada:** Cola pequeña vs heap grande
- **Datos semi-ordenados:** Aprovecha concatenaciones O(1)

## Implementación Completa

### Estructura de Segmento
```cpp
struct Segment {
    int start, end;
    bool increasing;
    
    int size() const { return end - start + 1; }
    int head() const { return increasing ? start : end; }
    int tail() const { return increasing ? end : start; }
};
```

### Algoritmo Completo
```cpp
vector<int> balancedSegmentSort(vector<int>& arr) {
    // Fase 1: Detección de segmentos (igual que original)
    vector<Segment> segments = detectSegments(arr);
    
    // Fase 2: Fusión balanceada con cola
    BalancedSegmentMerger merger;
    Segment result = merger.mergeOptimal(segments);
    
    return result.toArray();
}
```

## Comparación con Variantes

| Variante | Espacio | Tiempo | Ventajas |
|----------|---------|--------|----------|
| Heap Original | O(k) | O(n log n) | Simple, predecible |
| Merge Binario | O(k) | O(n log n) | Localidad memoria |
| **Cola Balanceada** | **O(log n)** | **O(n log n)** | **Memoria óptima, adaptativo** |
| Paralelo | O(k) | O(n log k / p) | Escalabilidad |

## Próximos Pasos

1. **Implementación en C++:** Versión optimizada con benchmarks
2. **Análisis Empírico:** Comparar con heap original en datasets reales  
3. **Paralelización:** Combinar cola balanceada con procesamiento paralelo
4. **Streaming:** Versión para datos que no caben en memoria

---

**Autor:** Mario Raúl Carbonell Martínez  
**Fecha:** Noviembre 2025  
**Versión:** Balanced Segment Merge v1.0