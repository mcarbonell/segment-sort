// Segment Sort - Visualizador de Benchmarks Web
// Interfaz web para visualizar resultados de benchmarks de algoritmos de ordenación

let benchmarkData = null;
let charts = {};

// Paleta de colores para los algoritmos
const algorithmColors = {
    'segmentSort': '#667eea',
    'quickSort': '#f093fb',
    'mergeSort': '#4facfe',
    'heapSort': '#43e97b',
    'builtinSort': '#fa709a'
};

// Configuración por defecto
const defaultConfig = {
    sizes: [100, 500, 1000, 2000],
    repetitions: 10,
    dataTypes: [
        'Aleatorio', 'Ordenado', 'Inverso', 'K-sorted',
        'NearlySorted', 'Duplicados', 'Plateau', 'SegmentSorted'
    ],
    algorithms: ['segmentSort', 'quickSort', 'mergeSort', 'heapSort', 'builtinSort']
};

// Función principal para ejecutar benchmarks
async function runBenchmark() {
    const sizes = document.getElementById('sizes').value.split(',').map(s => parseInt(s.trim()));
    const repetitions = parseInt(document.getElementById('repetitions').value);
    const selectedDataType = document.getElementById('dataType').value;
    const selectedAlgorithms = Array.from(document.getElementById('algorithms').selectedOptions).map(o => o.value);

    // Validar entrada
    if (sizes.some(isNaN)) {
        showError('Error: Los tamaños deben ser números válidos');
        return;
    }

    if (repetitions < 1 || repetitions > 100) {
        showError('Error: Las repeticiones deben estar entre 1 y 100');
        return;
    }

    if (selectedAlgorithms.length === 0) {
        showError('Error: Selecciona al menos un algoritmo');
        return;
    }

    // Mostrar estado de carga
    showLoading('Ejecutando benchmarks... Esto puede tomar varios minutos.');

    try {
        // Usar el benchmark core real
        benchmarkData = await runBenchmarkReal(sizes, repetitions, selectedDataType, selectedAlgorithms);

        // Procesar y mostrar resultados
        processAndDisplayResults(benchmarkData);

        showSuccess(`✅ Benchmarks completados! ${sizes.length} tamaños × ${repetitions} repeticiones`);

    } catch (error) {
        showError(`Error ejecutando benchmarks: ${error.message}`);
        console.error(error);
    }
}

// Ejecutar benchmarks reales usando el core
async function runBenchmarkReal(sizes, repetitions, selectedDataType, selectedAlgorithms) {
    // Ejecutar en chunks para mostrar progreso
    const allResults = [];

    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        updateLoadingProgress((i / sizes.length) * 80);

        // Ejecutar benchmarks para este tamaño
        const results = await runBenchmarkForSize(size, repetitions, selectedDataType, selectedAlgorithms);
        allResults.push(...results);

        // Pequeña pausa para UI
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    updateLoadingProgress(95);

    return {
        metadata: {
            timestamp: new Date().toISOString(),
            seed: 12345,
            node_version: 'web-browser',
            platform: navigator.platform,
            arch: 'x64',
            repetitions: repetitions,
            methodology: 'Academic Rigor Benchmarking v1.0 (Web Browser)'
        },
        results: allResults
    };
}

// Ejecutar benchmark para un tamaño específico
async function runBenchmarkForSize(size, repetitions, selectedDataType, selectedAlgorithms) {
    const results = [];
    const dataGenerators = {
        'Aleatorio': BenchmarkCore.generateRandomArray,
        'Ordenado': BenchmarkCore.generateSortedArray,
        'Inverso': BenchmarkCore.generateReverseArray,
        'K-sorted': (s) => BenchmarkCore.generateKSortedArray(s, Math.floor(s * 0.1)),
        'NearlySorted': (s) => BenchmarkCore.generateNearlySortedArray(s, Math.floor(s * 0.05)),
        'Duplicados': (s) => BenchmarkCore.generateDuplicatesArray(s, 20),
        'Plateau': (s) => BenchmarkCore.generatePlateauArray(s, Math.floor(s / 10)),
        'SegmentSorted': (s) => BenchmarkCore.generateSegmentSortedArray(s, Math.floor(s / 5))
    };

    const dataTypes = selectedDataType === 'all'
        ? Object.keys(dataGenerators)
        : [selectedDataType];

    for (const dataType of dataTypes) {
        const generator = dataGenerators[dataType];
        const data = generator(size);

        for (const algorithm of selectedAlgorithms) {
            if (BenchmarkCore.sorters[algorithm]) {
                // Ejecutar benchmark
                const result = BenchmarkCore.runBenchmark(
                    BenchmarkCore.sorters[algorithm],
                    data,
                    algorithm,
                    repetitions
                );
                results.push(result);
            }
        }
    }

    return results;
}

// Procesar y mostrar resultados
function processAndDisplayResults(data) {
    benchmarkData = data;

    // Mostrar sección de resultados
    document.getElementById('results').style.display = 'block';
    document.getElementById('fileUpload').style.display = 'none';

    // Crear gráficas
    createComparisonChart();
    createScalabilityChart();
    createVariabilityChart();
    createHeatmapChart();

    // Llenar tabla
    populateResultsTable();
}

// Crear gráfica de comparación
function createComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    // Agrupar por algoritmo y promediar tiempo
    const algoAverages = {};
    benchmarkData.results.forEach(result => {
        if (!algoAverages[result.algorithm]) {
            algoAverages[result.algorithm] = [];
        }
        algoAverages[result.algorithm].push(result.statistics.mean);
    });

    // Calcular promedios
    const labels = Object.keys(algoAverages);
    const data = labels.map(algo => {
        const times = algoAverages[algo];
        return times.reduce((a, b) => a + b, 0) / times.length;
    });

    // Destruir gráfica anterior si existe
    if (charts.comparison) {
        charts.comparison.destroy();
    }

    charts.comparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tiempo Promedio (ms)',
                data: data,
                backgroundColor: labels.map(algo => algorithmColors[algo] || '#666'),
                borderColor: labels.map(algo => algorithmColors[algo] || '#666'),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparación de Performance por Algoritmo'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo (ms)'
                    }
                }
            }
        }
    });
}

// Crear gráfica de escalabilidad
function createScalabilityChart() {
    const ctx = document.getElementById('scalabilityChart').getContext('2d');
    const selectedDataType = document.getElementById('dataType').value;
    const selectedAlgorithms = Array.from(document.getElementById('algorithms').selectedOptions).map(o => o.value);

    const datasets = [];
    const allSizes = [...new Set(benchmarkData.results.map(r => r.size))].sort((a, b) => a - b);

    for (const algorithm of selectedAlgorithms) {
        const data = [];
        for (const size of allSizes) {
            const results = benchmarkData.results.filter(r =>
                r.algorithm === algorithm &&
                (selectedDataType === 'all' || r.dataType === selectedDataType) &&
                r.size === size
            );

            const avgTime = results.length > 0
                ? results.reduce((sum, r) => sum + r.statistics.mean, 0) / results.length
                : 0;
            data.push(avgTime);
        }

        datasets.push({
            label: algorithm,
            data: data,
            borderColor: algorithmColors[algorithm] || '#666',
            backgroundColor: algorithmColors[algorithm] || '#666',
            fill: false,
            tension: 0.4
        });
    }

    if (charts.scalability) {
        charts.scalability.destroy();
    }

    charts.scalability = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allSizes,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Escalabilidad por Tamaño (${selectedDataType === 'all' ? 'Todos los Tipos' : selectedDataType})`
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tamaño del Array'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tiempo Promedio (ms)',
                        type: 'logarithmic'
                    }
                }
            }
        }
    });
}

// Crear gráfica de variabilidad
function createVariabilityChart() {
    const ctx = document.getElementById('variabilityChart').getContext('2d');

    const datasets = [];
    const allSizes = [...new Set(benchmarkData.results.map(r => r.size))].sort((a, b) => a - b);
    const selectedAlgorithms = Array.from(document.getElementById('algorithms').selectedOptions).map(o => o.value);

    for (const algorithm of selectedAlgorithms) {
        const data = [];
        for (const size of allSizes) {
            const results = benchmarkData.results.filter(r =>
                r.algorithm === algorithm && r.size === size
            );

            const avgStd = results.length > 0
                ? results.reduce((sum, r) => sum + r.statistics.std, 0) / results.length
                : 0;
            data.push(avgStd);
        }

        datasets.push({
            label: algorithm,
            data: data,
            borderColor: algorithmColors[algorithm] || '#666',
            backgroundColor: algorithmColors[algorithm] || '#666',
            fill: false
        });
    }

    if (charts.variability) {
        charts.variability.destroy();
    }

    charts.variability = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allSizes,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consistencia de Performance (Desviación Estándar Promedio)'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tamaño del Array'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Desviación Estándar (ms)'
                    }
                }
            }
        }
    });
}

// Crear heatmap
function createHeatmapChart() {
    const ctx = document.getElementById('heatmapChart').getContext('2d');
    const selectedAlgorithms = Array.from(document.getElementById('algorithms').selectedOptions).map(o => o.value);
    const allSizes = [...new Set(benchmarkData.results.map(r => r.size))].sort((a, b) => a - b);

    if (selectedAlgorithms.length === 0 || allSizes.length === 0) {
        console.log('No hay datos suficientes para el heatmap');
        return;
    }

    // Crear matriz de datos
    const dataMatrix = [];
    for (let i = 0; i < selectedAlgorithms.length; i++) {
        dataMatrix[i] = [];
        for (let j = 0; j < allSizes.length; j++) {
            const results = benchmarkData.results.filter(r =>
                r.algorithm === selectedAlgorithms[i] && r.size === allSizes[j] && r.success
            );

            const avgTime = results.length > 0
                ? results.reduce((sum, r) => sum + (r.statistics?.mean || 0), 0) / results.length
                : 0;
            dataMatrix[i][j] = avgTime;
        }
    }

    // Verificar si hay datos válidos
    const flatData = dataMatrix.flat().filter(v => v > 0);
    if (flatData.length === 0) {
        console.log('No hay datos válidos para el heatmap');
        return;
    }

    const minTime = Math.min(...flatData);
    const maxTime = Math.max(...flatData);

    if (charts.heatmap) {
        charts.heatmap.destroy();
    }

    // Generar puntos para el heatmap
    const heatmapData = [];
    const backgroundColors = [];

    for (let i = 0; i < selectedAlgorithms.length; i++) {
        for (let j = 0; j < allSizes.length; j++) {
            const value = dataMatrix[i][j];
            heatmapData.push({
                x: j,
                y: selectedAlgorithms.length - 1 - i,
                r: value > 0 ? 15 : 5 // Radio más pequeño para valores vacíos
            });

            if (value > 0) {
                const intensity = (value - minTime) / (maxTime - minTime);
                backgroundColors.push(`rgba(102, 126, 234, ${intensity * 0.8 + 0.2})`);
            } else {
                backgroundColors.push('rgba(200, 200, 200, 0.3)');
            }
        }
    }

    charts.heatmap = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Performance Heatmap',
                data: heatmapData,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(102, 126, 234, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Heatmap de Performance (Más oscuro = Más lento)'
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            const dataIndex = context[0].dataIndex;
                            const algoIndex = Math.floor(dataIndex / allSizes.length);
                            const sizeIndex = dataIndex % allSizes.length;
                            return `${selectedAlgorithms[algoIndex]} vs ${allSizes[sizeIndex]} elementos`;
                        },
                        label: function (context) {
                            const dataIndex = context.dataIndex;
                            const algoIndex = Math.floor(dataIndex / allSizes.length);
                            const sizeIndex = dataIndex % allSizes.length;
                            const value = dataMatrix[algoIndex][sizeIndex];
                            return value > 0 ? `Tiempo promedio: ${value.toFixed(3)} ms` : 'Sin datos';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    min: -0.5,
                    max: allSizes.length - 0.5,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            return allSizes[Math.round(value)] || '';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tamaño del Array'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    min: -0.5,
                    max: selectedAlgorithms.length - 0.5,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const algoIndex = selectedAlgorithms.length - 1 - Math.round(value);
                            return selectedAlgorithms[algoIndex] || '';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Algoritmo'
                    }
                }
            }
        }
    });
}

// Llenar tabla de resultados
function populateResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    if (!tbody) {
        console.error('resultsTableBody element not found');
        return;
    }

    tbody.innerHTML = '';

    if (!benchmarkData || !benchmarkData.results) {
        console.error('benchmarkData or benchmarkData.results not available');
        return;
    }

    benchmarkData.results.forEach((result, index) => {
        if (result.success) {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${result.algorithm || 'N/A'}</td>
                <td>${result.size || 'N/A'}</td>
                <td>${result.dataType || 'N/A'}</td>
                <td>${(result.statistics?.mean || 0).toFixed(3)}</td>
                <td>${(result.statistics?.median || 0).toFixed(3)}</td>
                <td>${(result.statistics?.std || 0).toFixed(3)}</td>
                <td>${(result.statistics?.p5 || 0).toFixed(3)}</td>
                <td>${(result.statistics?.p95 || 0).toFixed(3)}</td>
                <td>${(result.statistics?.min || 0).toFixed(3)}</td>
                <td>${(result.statistics?.max || 0).toFixed(3)}</td>
            `;
        } else {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${result.algorithm || 'N/A'}</td>
                <td>${result.size || 'N/A'}</td>
                <td>${result.dataType || 'N/A'}</td>
                <td colspan="7" style="color: red;">Error: ${result.error || 'Unknown error'}</td>
            `;
        }
    });
}

// Cargar resultados desde archivo JSON
function loadResultsFile() {
    document.getElementById('fileUpload').style.display = 'block';
    showSuccess('📁 Selecciona un archivo JSON de resultados para visualizar');
}

// Manejar carga de archivo
function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.results && data.metadata) {
                benchmarkData = data;
                processAndDisplayResults(data);
                showSuccess(`✅ Archivo cargado: ${file.name}`);
            } else {
                showError('Error: Archivo JSON no tiene el formato esperado');
            }
        } catch (error) {
            showError('Error: No se pudo parsear el archivo JSON');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Funciones de UI
function showLoading(message) {
    document.getElementById('status').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            ${message}
        </div>
    `;
}

function updateLoadingProgress(progress) {
    const statusDiv = document.getElementById('status');
    const loadingDiv = statusDiv.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.innerHTML = `
            <div class="spinner"></div>
            ${Math.round(progress)}% - ${loadingDiv.textContent.split('-')[1] || 'Ejecutando...'}
        `;
    }
}

function showError(message) {
    document.getElementById('status').innerHTML = `
        <div class="error">${message}</div>
    `;
    document.getElementById('status').scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(message) {
    document.getElementById('status').innerHTML = `
        <div class="success">${message}</div>
    `;
    setTimeout(() => {
        const statusDiv = document.getElementById('status');
        if (statusDiv.querySelector('.success')) {
            statusDiv.innerHTML = '';
        }
    }, 5000);
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Segment Sort Visualizer inicializado');

    // Configurar eventos
    document.getElementById('dataType').addEventListener('change', function () {
        if (benchmarkData) {
            createScalabilityChart();
        }
    });

    document.getElementById('algorithms').addEventListener('change', function () {
        if (benchmarkData) {
            createComparisonChart();
            createScalabilityChart();
            createVariabilityChart();
            createHeatmapChart();
        }
    });
});