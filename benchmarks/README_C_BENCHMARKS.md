# Segment Sort Benchmarks - C Implementation

Este directorio contiene los benchmarks en C para los algoritmos de Segment Sort, diseñados para ser consistentes con los benchmarks de JavaScript.

## 🎯 Algoritmos Implementados

1. **Balanced Segment Merge Sort** (`balancedSegmentMergeSort`)
   - Complejidad temporal: O(N log N)
   - Complejidad espacial: O(log N)
   - Usa SymMerge (rotaciones) para merge in-place

2. **Block Merge Segment Sort** (`blockMergeSegmentSort`)
   - Complejidad temporal: O(N log N)
   - Complejidad espacial: O(sqrt N) o O(1) con buffer fijo
   - Usa buffer de 512 elementos para merges lineales rápidos

3. **qsort** (referencia estándar de C)
   - Implementación estándar de la biblioteca C

## 🚀 Compilación y Ejecución

### Compilación Manual

```bash
gcc -O3 -o c_benchmarks.exe c_benchmarks.c -lm -I..
```

### Usando Make

```bash
# Compilar y ejecutar con 500K elementos, 5 repeticiones
make c

# Test rápido con 10K elementos, 3 repeticiones
make c-quick

# Solo compilar
make c-compile
```

## 📊 Uso del Benchmark

### Sintaxis Básica

```bash
./c_benchmarks.exe [tamaños...] [--reps repeticiones] [--no-validate]
```

### Ejemplos

```bash
# Ejecuta con tamaño por defecto (100,000 elementos)
./c_benchmarks.exe

# Ejecuta con un tamaño específico
./c_benchmarks.exe 50000

# Ejecuta con múltiples tamaños
./c_benchmarks.exe 10000 50000 100000

# Ejecuta con 30 repeticiones para mayor precisión estadística
./c_benchmarks.exe 100000 --reps 30

# Ejecuta sin validación (más rápido, pero sin verificación de correctitud)
./c_benchmarks.exe 500000 --no-validate
```

## 📋 Tipos de Datos de Prueba

El benchmark prueba cada algoritmo con 8 tipos diferentes de datos:

1. **Aleatorio**: Datos completamente aleatorios
2. **Ordenado**: Datos ya ordenados (mejor caso para segment sort)
3. **Inverso**: Datos en orden inverso
4. **K-sorted**: Datos casi ordenados (k = 10% del tamaño)
5. **Nearly Sorted**: Datos con 5% de swaps aleatorios
6. **Con Duplicados**: 20 valores únicos repetidos
7. **Plateau**: 10 segmentos de valores constantes
8. **Segment Sorted**: 5 segmentos ordenados internamente

## 📈 Salida del Benchmark

### Formato de Consola

```
====================================================================================================
| Algoritmo                   | Tamano | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |
====================================================================================================

[*] Probando con arrays de tamano: 100000
------------------------------------------------------------

[TEST] Aleatorio:
   balancedSegmentMergeSort  | 100000 | Aleatorio          |    10.234 |      10.150 |    0.234 | [OK] (vs qsort)
   blockMergeSegmentSort     | 100000 | Aleatorio          |     3.456 |       3.420 |    0.123 | [OK] (vs qsort)
   qsort                     | 100000 | Aleatorio          |     5.678 |       5.650 |    0.156 | [OK]
```

### Exportación JSON

Los resultados se exportan automáticamente a un archivo JSON con el formato:
```
benchmark_results_c_<timestamp>_seed<seed>.json
```

El archivo JSON contiene:
- **metadata**: Información sobre la ejecución (timestamp, seed, plataforma, metodología)
- **results**: Array con todos los resultados detallados
  - Estadísticas: media, mediana, desviación estándar, min, max, percentiles
  - Todos los tiempos individuales de cada repetición

## 🔬 Características Técnicas

### Generador de Números Aleatorios (LCG)

Usa el mismo generador LCG que JavaScript para garantizar reproducibilidad:
- Seed por defecto: 12345
- Parámetros: a=1103515245, c=12345, m=2^31

### Medición de Tiempo

- **Windows**: `QueryPerformanceCounter` (alta resolución)
- **Unix/Linux**: `gettimeofday` (microsegundos)

### Validación

Cada algoritmo es validado contra `qsort`:
1. Verifica que el array esté ordenado
2. Compara elemento por elemento con el resultado de `qsort`

## 🎯 Comparación con JavaScript

Este benchmark está diseñado para ser directamente comparable con `js_benchmarks.js`:

| Característica | C | JavaScript |
|----------------|---|------------|
| Generador aleatorio | LCG (seed 12345) | LCG (seed 12345) |
| Tipos de datos | 8 tipos idénticos | 8 tipos idénticos |
| Estadísticas | Media, mediana, std, percentiles | Media, mediana, std, percentiles |
| Exportación | JSON | JSON |
| Validación | vs qsort | vs Array.sort |

## 📝 Notas de Rendimiento

- **Compilación**: Usa `-O3` para optimización máxima
- **Repeticiones**: 
  - 3-5 repeticiones para tests rápidos
  - 10-30 repeticiones para resultados estadísticamente significativos
- **Tamaños recomendados**:
  - Test rápido: 10,000 elementos
  - Test estándar: 100,000 elementos
  - Test completo: 500,000 - 1,000,000 elementos

## 🐛 Troubleshooting

### Error de compilación: "cannot find -lm"

En Windows con MinGW, asegúrate de tener las bibliotecas matemáticas instaladas.

### Tiempos muy bajos (< 0.001 ms)

Para arrays pequeños, considera aumentar el número de repeticiones para obtener mediciones más precisas.

### Resultados inconsistentes

- Cierra otras aplicaciones para reducir ruido del sistema
- Aumenta el número de repeticiones
- Usa tamaños de array más grandes

## 📚 Referencias

- Implementaciones: `../implementations/c/`
- Benchmarks JavaScript: `js_benchmarks.js`
- Documentación del proyecto: `../README.md`
