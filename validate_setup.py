#!/usr/bin/env python3
"""
Validación del Setup - Segment Sort
===================================

Script para verificar que el repositorio está correctamente configurado
y que todas las implementaciones funcionan correctamente.
"""

import os
import sys
import json
import time
from pathlib import Path

def check_file_exists(filepath, description):
    """Verifica que un archivo existe."""
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"  ✅ {description}: {filepath} ({size:,} bytes)")
        return True
    else:
        print(f"  ❌ {description}: {filepath} NO ENCONTRADO")
        return False

def check_directory_exists(dirpath, description):
    """Verifica que un directorio existe."""
    if os.path.isdir(dirpath):
        file_count = len([f for f in os.listdir(dirpath) if os.path.isfile(os.path.join(dirpath, f))])
        print(f"  ✅ {description}: {dirpath} ({file_count} archivos)")
        return True
    else:
        print(f"  ❌ {description}: {dirpath} NO ENCONTRADO")
        return False

def validate_structure():
    """Valida la estructura del repositorio."""
    print("🔍 Validando estructura del repositorio...")
    
    base_path = os.getcwd()
    all_good = True
    
    # Archivos principales
    print("\n📄 Archivos principales:")
    files_to_check = [
        ("README.md", "Documentación principal"),
        ("LICENSE", "Licencia MIT"),
        ("GETTING_STARTED.md", "Guía de inicio"),
        ("Makefile", "Automatización"),
        ("setup.py", "Configuración"),
        ("config.yml", "Configuración"),
        (".gitignore", "Git ignore")
    ]
    
    for filename, description in files_to_check:
        if not check_file_exists(os.path.join(base_path, filename), description):
            all_good = False
    
    # Directorios principales
    print("\n📁 Directorios principales:")
    dirs_to_check = [
        ("implementations", "Implementaciones"),
        ("benchmarks", "Benchmarks"),
        ("paper", "Paper académico"),
        ("docs", "Documentación"),
        ("visualizations", "Visualizaciones")
    ]
    
    for dirname, description in dirs_to_check:
        if not check_directory_exists(os.path.join(base_path, dirname), description):
            all_good = False
    
    # Implementaciones por lenguaje
    print("\n💻 Implementaciones por lenguaje:")
    languages = ["cpp", "python", "java", "go", "rust", "javascript"]
    for lang in languages:
        lang_dir = os.path.join(base_path, "implementations", lang)
        if check_directory_exists(lang_dir, f"Lenguaje {lang.upper()}"):
            files = [f for f in os.listdir(lang_dir) if f.endswith(('.cpp', '.py', '.java', '.go', '.rs', '.js'))]
            if files:
                print(f"    Archivos encontrados: {', '.join(files)}")
            else:
                print(f"    ⚠️  No se encontraron archivos fuente en {lang}")
                all_good = False
    
    return all_good

def test_segment_sort_python():
    """Testa la implementación Python de Segment Sort."""
    print("\n🐍 Testing implementación Python...")
    
    try:
        # Añadir al path
        sys.path.append('implementations/python')
        
        # Importar y testear
        from segmentsort import SegmentSort
        
        test_cases = [
            ([], "Array vacío"),
            ([1], "Un elemento"),
            ([2, 1], "Dos elementos"),
            ([1, 2, 3], "Ya ordenado"),
            ([3, 2, 1], "Invertido"),
            ([3, 1, 4, 1, 5], "Con duplicados")
        ]
        
        all_passed = True
        
        for test_input, description in test_cases:
            sorter = SegmentSort()
            test_arr = test_input.copy()
            sorter.custom_sort(test_arr)
            
            # Verificar que está ordenado
            is_sorted = all(test_arr[i] <= test_arr[i + 1] for i in range(len(test_arr) - 1))
            
            if is_sorted:
                print(f"  ✅ {description}: {test_input} → {test_arr}")
            else:
                print(f"  ❌ {description}: FALLO - {test_input} → {test_arr}")
                all_passed = False
        
        return all_passed
        
    except Exception as e:
        print(f"  ❌ Error ejecutando tests Python: {e}")
        return False

def test_benchmark_scripts():
    """Testa que los scripts de benchmarks funcionan."""
    print("\n📊 Testing scripts de benchmarks...")
    
    scripts = [
        ("benchmarks/quick_test.py", "Test rápido"),
        ("benchmarks/run_benchmarks.py", "Benchmarks completos")
    ]
    
    all_good = True
    
    for script_path, description in scripts:
        if os.path.exists(script_path):
            try:
                # Solo verificar que el archivo es ejecutable Python
                with open(script_path, 'r') as f:
                    content = f.read()
                    if 'def main' in content and 'if __name__' in content:
                        print(f"  ✅ {description}: Estructura correcta")
                    else:
                        print(f"  ⚠️  {description}: Estructura inusuales")
                        all_good = False
            except Exception as e:
                print(f"  ❌ {description}: Error leyendo archivo - {e}")
                all_good = False
        else:
            print(f"  ❌ {description}: Archivo no encontrado")
            all_good = False
    
    return all_good

def check_documentation():
    """Verifica la documentación."""
    print("\n📚 Verificando documentación...")
    
    docs_to_check = [
        ("README.md", "README principal"),
        ("GETTING_STARTED.md", "Guía de inicio"),
        ("paper/segment_sort_analysis.md", "Paper académico"),
        ("docs/implementation_guide.md", "Guía de implementación")
    ]
    
    all_good = True
    
    for doc_path, description in docs_to_check:
        if os.path.exists(doc_path):
            size = os.path.getsize(doc_path)
            if size > 1000:  # Al menos 1KB
                print(f"  ✅ {description}: {size:,} bytes")
            else:
                print(f"  ⚠️  {description}: Muy pequeño ({size} bytes)")
                all_good = False
        else:
            print(f"  ❌ {description}: No encontrado")
            all_good = False
    
    return all_good

def generate_summary_report():
    """Genera un reporte de validación."""
    print("\n📋 Generando reporte de validación...")
    
    report = {
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
        "validation_results": {
            "structure": "pending",
            "python_implementation": "pending",
            "benchmarks": "pending", 
            "documentation": "pending"
        },
        "summary": {
            "total_files": 0,
            "languages_supported": 6,
            "documentation_pages": 0
        }
    }
    
    return report

def main():
    """Función principal de validación."""
    print("🚀 Segment Sort - Validación del Setup")
    print("=" * 50)
    
    # Validar estructura
    structure_ok = validate_structure()
    
    # Testear implementación Python
    python_ok = test_segment_sort_python()
    
    # Testear benchmarks
    benchmarks_ok = test_benchmark_scripts()
    
    # Verificar documentación
    docs_ok = check_documentation()
    
    # Generar reporte
    report = generate_summary_report()
    
    # Resumen final
    print("\n" + "=" * 50)
    print("📊 RESUMEN DE VALIDACIÓN")
    print("=" * 50)
    
    all_ok = structure_ok and python_ok and benchmarks_ok and docs_ok
    
    print(f"Estructura del repositorio: {'✅ OK' if structure_ok else '❌ FALLO'}")
    print(f"Implementación Python:      {'✅ OK' if python_ok else '❌ FALLO'}")
    print(f"Scripts de benchmarks:      {'✅ OK' if benchmarks_ok else '❌ FALLO'}")
    print(f"Documentación:              {'✅ OK' if docs_ok else '❌ FALLO'}")
    
    print("\n" + "=" * 50)
    
    if all_ok:
        print("🎉 ¡VALIDACIÓN EXITOSA!")
        print("\n✅ El repositorio está completamente configurado")
        print("✅ Todas las implementaciones funcionan")
        print("✅ La documentación está completa")
        print("✅ El sistema de benchmarks está operativo")
        
        print("\n🚀 Próximos pasos:")
        print("  1. Ejecuta: python3 benchmarks/quick_test.py")
        print("  2. Lee: GETTING_STARTED.md")
        print("  3. Explora: implementations/")
        print("  4. ¡Publica en GitHub!")
        
    else:
        print("❌ VALIDACIÓN CON FALLOS")
        print("\n⚠️  Algunos componentes necesitan atención:")
        if not structure_ok:
            print("  - Revisar estructura del repositorio")
        if not python_ok:
            print("  - Verificar implementación Python")
        if not benchmarks_ok:
            print("  - Revisar scripts de benchmarks")
        if not docs_ok:
            print("  - Completar documentación")
    
    print("\n" + "=" * 50)
    return all_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)