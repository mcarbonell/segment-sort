# Visualizaciones - Segment Sort Algorithm

Esta carpeta contiene herramientas de visualización para entender mejor cómo funciona el algoritmo Segment Sort.

## 📊 Tipos de Visualizaciones

### 1. Diagramas de Flujo
- `flowchart.md` - Diagrama del flujo principal del algoritmo
- `segment_detection.svg` - Visualización de la detección de segmentos
- `heap_merge.svg` - Animación de la fusión con heap

### 2. Animaciones Interactivas
- `interactive_demo.html` - Demo interactivo en JavaScript
- `segment_animation.py` - Animación en Python con matplotlib

### 3. Análisis Visual
- `performance_charts.md` - Gráficos de rendimiento comparativo
- `complexity_analysis.svg` - Representación visual de la complejidad

## 🎨 Cómo Usar

### Animación Python
```bash
cd visualizations
python segment_animation.py
```

### Demo Interactivo
```bash
# Abrir en navegador web
open interactive_demo.html
```

### Generar Gráficos de Rendimiento
```bash
python generate_charts.py
```

## 📈 Interpretación

### Detección de Segmentos
La visualización muestra cómo el algoritmo identifica automáticamente:
- **Segmentos crecientes** (→)
- **Segmentos decrecientes** (←)
- **Puntos de cambio** (⊥)

### Fusión con Heap
La animación demuestra:
- Inserción de elementos en el heap
- Extracción del mínimo/máximo
- Reorganización dinámica de segmentos

## 🎯 Casos de Estudio

1. **Array Ordenado** - Mejor caso O(n)
2. **Array Aleatorio** - Caso promedio O(n log n)
3. **Array Semi-ordenado** - Caso de ventaja competitiva
4. **Array con Patrones** - Casos de uso óptimos

---

*Nota: Algunas visualizaciones requieren bibliotecas adicionales como matplotlib o una conexión web para funcionar completamente.*