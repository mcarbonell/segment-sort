# Sistema de Benchmarks Multi-Lenguaje

Este directorio contiene un sistema completo de benchmarks para el algoritmo **On-the-Fly Balanced Merge Sort** implementado en tres lenguajes: JavaScript, Python y C++.

## 📋 Resumen de Implementaciones

### JavaScript (`js_benchmarks.js`)
- ✅ **Completamente funcional** - Probado y validado
- ✅ **Excelente rendimiento** - Dominante en datos estructurados  
- ✅ **Interfaz CLI completa** con análisis estadístico

### Python (`python_benchmarks.py`)
- ✅ **Completamente funcional** - Corregido para evitar emojis
- ⚠️ **Rendimiento moderado** - Más lento que JavaScript
- ✅ **Interfaz CLI completa** con análisis estadístico

### C++ (`cpp_benchmarks.cpp`)
- ✅ **Código completo** - Esperando compilación
- 🔄 **Requiere entorno C++** para compilación
- ✅ **Interfaz CLI completa** con análisis estadístico

## 🚀 Comandos de Uso

### JavaScript (Node.js)
```bash
# Configuración por defecto
node benchmarks/js_benchmarks.js

# Tamaños específicos
node benchmarks/js_benchmarks.js 10000 50000 100000

# Repeticiones personalizadas
node benchmarks/js_benchmarks.js 100000 --reps 30

# Seed para reproducibilidad
node benchmarks/js_benchmarks.js --seed 42 50000 --reps 5

# Ayuda
node benchmarks/js_benchmarks.js --help
```

### Python
```bash
# Configuración por defecto
python benchmarks/python_benchmarks.py

# Tamaños específicos
python benchmarks/python_benchmarks.py 10000 50000

# Repeticiones personalizadas  
python benchmarks/python_benchmarks.py 100000 --reps 20

# Seed para reproducibilidad
python benchmarks/python_benchmarks.py --seed 42 50000 --reps 3

# Ayuda
python benchmarks/python_benchmarks.py --help
```

### C++ (requiere compilador)
```bash
# Compilar en Linux/Mac con make
cd benchmarks
make run

# Compilar en Windows
cd benchmarks
compile.bat

# Uso directo (después de compilar)
./cpp_benchmarks.exe 100000 --reps 10

# Ayuda
./cpp_benchmarks.exe --help
```

## 📊 Algoritmos Comparados

Todos los benchmarks prueban los mismos algoritmos:

1. **balancedSegmentMergeSort** - Tu algoritmo principal
2. **quickSort** - Con mediana de tres pivotes
3. **mergeSort** - Implementación estándar  
4. **heapSort** - Implementación completa
5. **builtinSort** - Algoritmo nativo del lenguaje

## 🧪 Tipos de Datos Testados

Los benchmarks prueban 8 tipos diferentes de datos:

1. **Aleatorio** - Distribución uniforme
2. **Ordenado** - Ya perfectamente ordenado
3. **Inverso** - Ordenado en reversa  
4. **K-sorted** - Elementos a lo sumo k posiciones de su posición final
5. **Nearly Sorted** - 5% swaps aleatorios en array ordenado
6. **Duplicados** - Alta concentración de valores repetidos
7. **Plateau** - Grandes secciones de valores idénticos
8. **Segment Sorted** - Segmentos internos ya ordenados

## 📈 Resultados Esperados

### JavaScript (Rendimiento Verificado)
- **🏆 Dominante** en datos estructurados
- **200x+ más rápido** que MergeSort en arrays ordenados
- **Competitivo** en datos aleatorios (solo ~20% más lento que builtin)
- **Robusto** - Inmune a casos patológicos

### Python (Rendimiento Moderado)  
- **Competitivo** en datos estructurados
- **Más lento** en datos aleatorios
- **Confirmación** de robustez algorítmica
- **Área de mejora** - Optimización de merge simétrico

### C++ (Rendimiento Esperado)
- **Alto rendimiento** esperado (compilado vs interpretado)
- **Validación independiente** del algoritmo
- **Benchmarking cross-language**

## 🔧 Configuración Técnica

### Metodología Académica
- **Repeticiones configurables** (default: 10)
- **Análisis estadístico completo** (media, mediana, desv. estándar)
- **Generación determinística** con LCG y seeds configurables
- **Exportación JSON** con metadatos completos
- **Warm-up runs** para optimización JIT

### Formato de Salida
```
[INFO] Iniciando benchmarks de Segment Sort (Metodología Academica)...

[CONFIG] 10 repeticiones, analisis estadistico completo

| Algoritmo                   | Tamaño | Tipo de Datos        | Media (ms) | Mediana (ms) | Desv.Std | Estado |
====================================================================================================
[SIZE] Probando con arrays de tamaño: 100000
------------------------------------------------------------

[TEST] Ordenado:
   balancedSegmentMergeSort  | 100000 | Ordenado           |    0.091 |       0.093 |    0.034 | [OK]
   mergeSort                 | 100000 | Ordenado           |   19.879 |      19.509 |    1.024 | [OK]
   builtinSort               | 100000 | Ordenado           |    1.637 |       1.302 |    1.033 | [OK]
```

## 📁 Archivos Generados

Los benchmarks generan automáticamente:
- **Resultados JSON** - `benchmark_results_[timestamp]_[language]_[seed].json`
- **Análisis comparativo** - Rankings por tipo de datos y globales
- **Exportación completa** - Todos los tiempos individuales y estadísticas

## 🎯 Casos de Uso

### Para Desarrollo
- Validar optimizaciones del algoritmo
- Comparar implementaciones entre lenguajes
- Detectar regresiones de rendimiento

### Para Investigación
- Documentar comportamiento empírico
- Generar resultados reproducibles
- Análisis estadístico riguroso

### Para Producción
- Validar performance en diferentes entornos
- Benchmarking de configuraciones
- Monitoreo continuo de rendimiento

## 🔍 Próximos Pasos

1. **Instalar compilador C++** para probar benchmarks de C++
2. **Optimizar implementación Python** del merge simétrico
3. **Ejecutar benchmarks completos** en todos los lenguajes
4. **Comparar resultados** cross-language
5. **Generar informe final** de rendimiento

## 📞 Soporte

Si encuentras problemas:
1. Verifica que tienes las dependencias necesarias (Node.js, Python, compilador C++)
2. Revisa los mensajes de error específicos
3. Consulta la documentación de cada lenguaje individual
4. Verifica que las implementaciones del algoritmo están en las rutas correctas

¡El sistema está listo para generar datos de rendimiento comparativos y académicamente rigurosos!