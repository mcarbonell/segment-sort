# 📊 Visualizador de Benchmarks

El archivo `benchmark_charts.html` es un visualizador interactivo que permite analizar los resultados de los benchmarks de forma visual.

## 🚀 Cómo Usar

### Opción 1: Abrir Directamente
1. Abre `benchmark_charts.html` en tu navegador
2. Haz clic en "📁 Cargar archivo JSON"
3. Selecciona un archivo de resultados (ej: `benchmark_results_c_*.json` o `benchmark_results_clean_*.json`)

### Opción 2: Servidor Local (Recomendado)
Para evitar restricciones de seguridad del navegador:

```bash
# Opción A: Python
python -m http.server 8000

# Opción B: Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Luego abre en el navegador:
# http://localhost:8000/benchmark_charts.html
```

## 📈 Características

### Gráficos Disponibles

1. **Gráficos por Tipo de Datos**
   - Un gráfico de barras para cada tipo de datos (Aleatorio, Ordenado, Inverso, etc.)
   - Muestra el rendimiento de cada algoritmo en ese tipo específico
   - Ordenado de más rápido a más lento

2. **Ranking Global**
   - Gráfico horizontal mostrando el promedio de todos los algoritmos
   - Colores especiales para medallas (🥇🥈🥉)
   - Ordenado por tiempo promedio

3. **Tabla Comparativa**
   - Vista completa de todos los algoritmos
   - Muestra: ranking, promedio global, mejor caso, peor caso
   - Incluye medallas para los 3 primeros lugares

### Panel de Información

Muestra metadata del benchmark:
- **Plataforma**: C, JavaScript, C++, etc.
- **Timestamp**: Cuándo se ejecutó el benchmark
- **Seed**: Semilla usada para reproducibilidad
- **Total Tests**: Número total de pruebas ejecutadas

## 📁 Archivos JSON Compatibles

El visualizador acepta archivos JSON con el siguiente formato:

```json
{
  "metadata": {
    "timestamp": "2025-11-21T16:55:30.825Z",
    "seed": 12345,
    "platform": "C",
    "methodology": "Clean Benchmark with Optimized References v1.0"
  },
  "results": [
    {
      "algorithm": "blockMergeSegmentSort",
      "size": 500000,
      "dataType": "Aleatorio",
      "repetitions": 5,
      "statistics": {
        "mean": 24.580,
        "median": 24.553,
        "std": 0.326,
        "min": 24.123,
        "max": 25.012,
        "p5": 24.200,
        "p95": 24.900
      },
      "allTimes": [24.553, 24.580, 24.612, ...],
      "success": true
    }
  ]
}
```

### Archivos Generados Automáticamente

- **C**: `benchmark_results_c_<timestamp>_seed<seed>.json`
- **JavaScript**: `benchmark_results_clean_<timestamp>_seed<seed>.json`

## 🎨 Personalización

El visualizador usa Chart.js para los gráficos. Puedes personalizar:

- **Colores**: Modifica el array `colors` en cada función de creación de gráfico
- **Tipos de gráfico**: Cambia `type: 'bar'` a `'line'`, `'pie'`, etc.
- **Estilos**: Edita la sección `<style>` en el HTML

## 🔧 Troubleshooting

### "No se pudieron cargar datos de ejemplo"
- **Causa**: El navegador no puede listar archivos locales por seguridad
- **Solución**: Usa un servidor local (ver Opción 2 arriba) o carga manualmente

### Los gráficos no se muestran
- **Causa**: Chart.js no se cargó desde el CDN
- **Solución**: Verifica tu conexión a internet o descarga Chart.js localmente

### El archivo JSON no se carga
- **Causa**: Formato JSON inválido
- **Solución**: Valida el JSON en https://jsonlint.com/

## 📊 Ejemplo de Uso

```bash
# 1. Ejecutar benchmark de C
cd benchmarks
gcc -O3 -o c_benchmarks.exe c_benchmarks.c -lm -I..
./c_benchmarks.exe 500000 --reps 5

# 2. Ejecutar benchmark de JavaScript
node js_benchmarks.js 500000 --reps 5

# 3. Iniciar servidor local
python -m http.server 8000

# 4. Abrir navegador
# http://localhost:8000/benchmark_charts.html

# 5. Cargar los archivos JSON generados y comparar
```

## 🎯 Comparación de Resultados

Para comparar C vs JavaScript:
1. Carga primero el JSON de C
2. Toma nota de los tiempos
3. Carga el JSON de JavaScript
4. Compara visualmente los gráficos

O mejor aún, usa el archivo `BENCHMARK_COMPARISON_C_VS_JS.md` que ya tiene un análisis detallado.

## 📝 Notas

- Los gráficos son interactivos: pasa el mouse sobre las barras para ver valores exactos
- Los datos se procesan en el navegador, no se envían a ningún servidor
- Puedes cargar múltiples archivos secuencialmente para comparar
- Los colores de las medallas (🥇🥈🥉) se asignan automáticamente a los 3 mejores

---

**Creado por**: Mario Raúl Carbonell Martínez  
**Fecha**: Noviembre 2025  
**Versión**: 1.0
