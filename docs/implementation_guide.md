# Guía de Implementación - Segment Sort

## 📋 Índice
1. [Introducción](#introducción)
2. [Instalación por Lenguaje](#instalación-por-lenguaje)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [API Reference](#api-reference)
5. [Optimizaciones](#optimizaciones)
6. [Troubleshooting](#troubleshooting)

## Introducción

Esta guía proporciona instrucciones detalladas para usar las diferentes implementaciones de Segment Sort en varios lenguajes de programación.

## Instalación por Lenguaje

### C++

#### Requisitos
- C++17 o superior
- Compilador: g++, clang++, MSVC

#### Compilación
```bash
# Versión básica
g++ -O3 -std=c++17 implementations/cpp/segmentsort.cpp -o segmentsort

# Versión optimizada (recomendada)
g++ -O3 -march=native -std=c++17 implementations/cpp/mergesegmentsort_v3.cpp -o segmentsort

# Con benchmarks
g++ -O3 -std=c++17 benchmarks/benchmark2.cpp -o benchmark
```

#### Ejecución
```bash
./segmentsort
./benchmark
```

### Python

#### Requisitos
- Python 3.7+
- Bibliotecas: heapq (incluida en Python estándar)

#### Instalación
```bash
# No requiere instalación de dependencias adicionales
python3 --version  # Verificar versión
```

#### Ejecución
```bash
# Implementación básica
python3 implementations/python/segmentsort.py

# Benchmarks completos
python3 benchmarks/run_benchmarks.py --sizes 1000 5000 10000

# Test rápido
python3 benchmarks/quick_test.py
```

### Java

#### Requisitos
- JDK 8+

#### Compilación
```bash
cd implementations/java
javac segmentsort.java
```

#### Ejecución
```bash
java SegmentSort
```

### Go

#### Requisitos
- Go 1.11+

#### Ejecución
```bash
cd implementations/go
go run segmentsort.go
```

### Rust

#### Requisitos
- Rust 1.40+

#### Compilación y ejecución
```bash
cd implementations/rust
cargo run
```

### JavaScript

#### Requisitos
- Node.js 12+

#### Ejecución
```bash
cd implementations/javascript
node segmentsort.js
```

## Ejemplos de Uso

### C++

```cpp
#include <iostream>
#include <vector>
#include "segmentsort.cpp"

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    SegmentSort sorter;
    sorter.customSort(arr);
    
    std::cout << "Array ordenado: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

### Python

```python
import sys
sys.path.append('implementations/python')
from segmentsort import SegmentSort

# Ejemplo básico
arr = [64, 34, 25, 12, 22, 11, 90]
sorter = SegmentSort()
sorter.custom_sort(arr)

print("Array ordenado:", arr)

# Ejemplo con diferentes tipos de datos
data = [
    ("Integers", [3, 1, 4, 1, 5]),
    ("Floats", [3.1, 1.4, 2.7, 1.5]),
    ("Strings", ["b", "a", "c", "a"])
]

for name, data_list in data:
    # Para strings, usar comparación lexicográfica
    sorted_data = sorter.custom_sort(data_list)
    print(f"{name}: {sorted_data}")
```

### Java

```java
public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        SegmentSort sorter = new SegmentSort();
        sorter.customSort(arr);
        
        System.out.print("Array ordenado: ");
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
```

### Go

```go
package main

import (
	"fmt"
	"segmentsort"
)

func main() {
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	
	sorter := new(segmentsort.SegmentSort)
	sorter.CustomSort(arr)
	
	fmt.Print("Array ordenado: ")
	for _, num := range arr {
		fmt.Printf("%d ", num)
	}
	fmt.Println()
}
```

### Rust

```rust
use std::cmp::Ord;

fn segment_sort<T: Ord + Copy>(arr: &mut [T]) {
    // Implementación en Rust del Segment Sort
    if arr.len() <= 1 {
        return;
    }
    
    // Detección de segmentos
    let n = arr.len();
    let mut segments: Vec<(usize, usize, i8)> = Vec::new();
    let mut start = 0;
    let mut direction = 0i8;
    
    for i in 1..n {
        if direction == 0 {
            direction = if arr[i] > arr[i-1] { 1 } else { -1 };
            continue;
        }
        
        if (direction > 0 && arr[i-1] > arr[i]) || 
           (direction < 0 && arr[i-1] < arr[i]) {
            let length = if direction > 0 { i - start } else { start - i };
            if length > 0 {
                segments.push((start, length, direction));
            }
            start = i;
            direction = 0;
        }
    }
    
    // Fusionar segmentos usando heap
    // ... implementación del heap merge
}

fn main() {
    let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
    segment_sort(&mut arr);
    
    println!("Array ordenado: {:?}", arr);
}
```

### JavaScript

```javascript
const SegmentSort = require('./segmentsort.js');

const arr = [64, 34, 25, 12, 22, 11, 90];
const sorter = new SegmentSort();

sorter.customSort(arr);

console.log('Array ordenado:', arr);

// Ejemplo con objetos personalizados
const objects = [
    {name: 'Alice', age: 30},
    {name: 'Bob', age: 25},
    {name: 'Charlie', age: 35}
];

// Para ordenar por propiedad específica
const sorted = objects.sort((a, b) => a.age - b.age);
console.log('Objetos ordenados por edad:', sorted);
```

## API Reference

### SegmentSort Class

#### `customSort(arr)`
Método principal para ordenar un array.

**Parámetros:**
- `arr` (Array/List/Vector): Array a ordenar

**Retorna:**
- `void`: El array se modifica in-place

**Ejemplo:**
```python
sorter = SegmentSort()
sorter.custom_sort([3, 1, 4, 1, 5])  # Modifica el array
```

#### Propiedades

- `copyarr`: Array auxiliar para operaciones internas
- `segments`: Lista de segmentos detectados

## Optimizaciones

### 1. Compilación C++
```bash
# Optimizaciones de rendimiento máximo
g++ -O3 -march=native -flto -funroll-loops -std=c++17 \
    implementations/cpp/mergesegmentsort_v3.cpp -o segmentsort

# Para debugging
g++ -O1 -g -std=c++17 implementations/cpp/segmentsort.cpp -o debug_sort
```

### 2. Configuración de Python
```python
# Para mejor rendimiento con arrays grandes
import sys
sys.setrecursionlimit(1000000)  # Incrementar límite de recursión
```

### 3. Java Heap Settings
```bash
# Para benchmarks con datasets grandes
java -Xmx4g -XX:+UseG1GC -jar segmentsort.jar
```

### 4. Go Performance
```go
// Para Go, compilar con optimizaciones
go build -ldflags="-s -w" -o segmentsort segmentsort.go
GOGC=off go run segmentsort.go  # Deshabilitar GC para benchmarks
```

## Troubleshooting

### Errores Comunes

#### C++: "heap operations not found"
**Solución:** Incluir `<queue>` y `<vector>`

#### Python: "Index out of range"
**Solución:** Verificar que el array no esté vacío antes de ordenar

#### Java: "NullPointerException"
**Solución:** Inicializar correctamente los arrays

#### Go: "index out of range"
**Solución:** Verificar índices en bucles for

#### Rust: "borrowed value does not live long enough"
**Solución:** Usar referencias apropiadas en slice operations

### Performance Issues

#### Rendimiento lento en arrays grandes
1. Verificar que se esté usando la versión optimizada (v3)
2. Compilar con optimizaciones `-O3`
3. Usar tipos de datos primitivos cuando sea posible

#### Error de memoria
1. Verificar que hay suficiente memoria RAM disponible
2. Para Python: usar `array.array` en lugar de listas para datos grandes
3. Para Java: incrementar heap size con `-Xmx`

### Debug Mode

#### Activar logging detallado
```python
# En implementaciones que soporten debug
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### Verificar detección de segmentos
```cpp
// En C++, añadir prints para debug
std::cout << "Segmento: start=" << start << ", length=" << length << std::endl;
```

---

Para más información, consulta el [paper académico](../paper/segment_sort_analysis.md) o los [benchmarks](../benchmarks/README.md).