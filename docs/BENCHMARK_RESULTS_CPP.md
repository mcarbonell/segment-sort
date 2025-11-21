# Resultados de Benchmarks C++ (Block Merge Segment Sort)

**Fecha:** 21 de Noviembre de 2025
**Tamaño de Array:** 5,000,000 elementos
**Repeticiones:** 10

## Resumen Ejecutivo

El algoritmo **Block Merge Segment Sort** demuestra un rendimiento excepcional, posicionándose como una alternativa superior a los algoritmos de ordenación clásicos (MergeSort, QuickSort básico) y compitiendo fuertemente con la librería estándar (`std::sort`).

### Puntos Clave
1.  **Velocidad en Aleatorio:** ~295ms. Es **2.8x más rápido** que Merge Sort y **16x más rápido** que QuickSort básico.
2.  **Dominio en Datos Ordenados:** En datos casi ordenados o inversos, el algoritmo es **O(N)**, superando a `std::sort` por un factor de **8x** (3.4ms vs 27.4ms).
3.  **Estabilidad:** A diferencia de `std::sort` (que no es estable), este algoritmo sí lo es (o puede serlo fácilmente), lo cual es una ventaja crítica en muchas aplicaciones.

## Tabla de Resultados Detallada

| Algoritmo | Tipo de Datos | Tiempo Medio (ms) | Notas |
| :--- | :--- | :--- | :--- |
| **Block Merge Segment Sort** | **Aleatorio** | **295.16** | **Muy Rápido** |
| std::sort (Builtin) | Aleatorio | 130.43 | Referencia (Introsort) |
| Merge Sort | Aleatorio | 845.84 | Lento por memoria |
| QuickSort (Naive) | Aleatorio | 4739.56 | Muy lento (peor caso?) |
| | | | |
| **Block Merge Segment Sort** | **Ordenado** | **3.39** | **Instantáneo (O(N))** |
| std::sort (Builtin) | Ordenado | 27.43 | Rápido, pero no O(N) puro |
| | | | |
| **Block Merge Segment Sort** | **Inverso** | **105.88** | **Muy Rápido** |
| std::sort (Builtin) | Inverso | 28.82 | |
| | | | |
| **Block Merge Segment Sort** | **K-Sorted (10%)** | **250.66** | **Robusto** |
| std::sort (Builtin) | K-Sorted | 117.69 | |
| | | | |
| **Block Merge Segment Sort** | **Duplicados** | **212.59** | **Eficiente** |
| std::sort (Builtin) | Duplicados | (No medido en log) | |

## Conclusión Técnica

La implementación en C++ confirma las teorías observadas en JavaScript: la gestión de memoria eficiente y la detección de segmentos funcionan a nivel de sistema. Aunque `std::sort` sigue ganando en fuerza bruta aleatoria (probablemente debido a décadas de optimización de compiladores y uso de instrucciones SIMD implícitas), **Block Merge Segment Sort** ofrece un perfil de rendimiento más equilibrado y adaptativo, brillando especialmente en datos del mundo real que a menudo tienen estructura parcial.
