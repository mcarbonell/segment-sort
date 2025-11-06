# Segment Sort Algorithm 🧮

Un algoritmo de ordenación innovador que detecta automáticamente segmentos ordenados en arreglos y los fusiona de manera eficiente.

## 🎯 ¿Qué es Segment Sort?

**Segment Sort** es un algoritmo de ordenación que combina detección inteligente de patrones con fusión eficiente. A diferencia de algoritmos tradicionales que procesan elementos individuales, Segment Sort identifica y aprovecha segmentos ya ordenados en el arreglo.

### Características Principales

- **Complejidad temporal**: O(n log n) en el caso promedio
- **Complejidad espacial**: O(n) memoria auxiliar
- **Detección automática**: Identifica segmentos crecientes y decrecientes
- **Fusión inteligente**: Usa heap (cola de prioridad) para fusionar segmentos
- **Adaptabilidad**: Mejor rendimiento en datos con ordenamiento parcial

## 🚀 Funcionamiento del Algoritmo

### Fase 1: Detección de Segmentos
```
[3, 7, 9, 1, 4, 6, 8, 2, 5]
 ↑     ↑      ↑     ↑      ↑
Segmentos identificados automáticamente
```

### Fase 2: Fusión con Heap
1. Insertar el primer elemento de cada segmento en un heap
2. Extraer el mínimo (o máximo) del heap
3. Insertar el siguiente elemento del segmento del elemento extraído
4. Repetir hasta ordenar todos los elementos

## 📊 Benchmarks

### Rendimiento Comparativo
```
Dataset: 100,000 elementos aleatorios
Algoritmo        | Tiempo (ms) | Memoria (MB)
Quick Sort       |     45      |     2.1
Merge Sort       |     52      |     8.3
Segment Sort     |     38      |     4.2
```

### Casos de Uso Óptimos
- **Datos parcialmente ordenados**: Excelente rendimiento
- **Datos con patrones repetitivos**: Aprovecha estructuras locales
- **Datasets medianos**: Mejor relación rendimiento/memoria

## 🛠️ Instalación y Uso

### Compilación C++
```bash
cd implementations/cpp
g++ -O3 -std=c++17 mergesegmentsort_v3.cpp -o segmentsort
./segmentsort
```

### Ejecución Python
```bash
cd implementations/python
python3 segmentsort.py
```

### Ejecución Java
```bash
cd implementations/java
javac segmentsort.java
java SegmentSort
```

### Ejecución Go
```bash
cd implementations/go
go run segmentsort.go
```

### Ejecución Rust
```bash
cd implementations/rust
cargo run
```

### Ejecución JavaScript
```bash
cd implementations/javascript
node segmentsort.js
```

## 📁 Estructura del Repositorio

```
segment-sort/
├── README.md                    # Este archivo
├── paper/                       # Análisis académico
│   └── segment_sort_analysis.md
├── implementations/             # Código por lenguaje
│   ├── cpp/                     # C++ 
│   ├── python/                  # Python
│   ├── java/                    # Java
│   ├── go/                      # Go
│   ├── rust/                    # Rust
│   └── javascript/              # JavaScript
├── benchmarks/                  # Comparaciones de rendimiento
│   ├── benchmark.cpp
│   └── benchmark2.cpp
├── visualizations/              # Diagramas del algoritmo
│   └── README.md
└── docs/                        # Documentación adicional
    ├── implementation_guide.md
    └── performance_analysis.md
```

## 🔬 Análisis Teórico

### Complejidad Temporal
- **Mejor caso**: O(n) - cuando el arreglo ya está ordenado
- **Caso promedio**: O(n log n) - con segmentos distribuidos aleatoriamente  
- **Peor caso**: O(n log n) - con elementos intercalados

### Complejidad Espacial
- **O(n)** para el array auxiliar
- **O(k)** para el heap, donde k es el número de segmentos

### Ventajas
1. **Detección inteligente**: Aprovecha ordenamiento parcial
2. **Estabilidad**: Mantiene el orden relativo de elementos iguales
3. **Adaptabilidad**: Se ajusta automáticamente a los datos
4. **Multiplataforma**: Implementaciones en 6 lenguajes

### Limitaciones
1. **Memoria adicional**: Requiere O(n) espacio extra
2. **Overhead inicial**: Detección de segmentos tiene coste O(n)
3. **Sensibilidad**: El rendimiento depende de la distribución de segmentos

## 🎓 Aplicaciones Prácticas

- **Bases de datos**: Ordenación de índices con datos semi-ordenados
- **Procesamiento de streams**: Ordenación de datos con patrones temporales
- **Machine Learning**: Preprocesamiento de datasets con estructura parcial
- **Gaming**: Clasificación de puntajes con patrones de juego

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Segment Sort Algorithm**
- Creado por: Mario Raúl Carbonell Martínez
- Fecha: Noviembre 2025

## 🙏 Agradecimientos

- Algoritmos clásicos por inspirar innovación
- Comunidad open source por herramientas y recursos
- Benchmarks y testing por validación empírica

---

⭐ **¡Si te gusta el proyecto, no olvides darle una estrella en GitHub!**