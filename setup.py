#!/usr/bin/env python3
"""
Segment Sort Setup Script (DEPRECATED)
======================================

⚠️  Este script está obsoleto. Usa pyproject.toml en su lugar.
    Para instalar dependencias: pip install -e .
    Para desarrollo: pip install -e ".[dev]"

Este script se mantiene solo para compatibilidad hacia atrás.
"""

import os
import sys
import subprocess
import platform

def check_dependencies():
    """Verifica que todas las herramientas necesarias estén instaladas."""
    print("🔍 Verificando dependencias...")
    
    dependencies = {
        'g++': 'C++ compiler',
        'python3': 'Python 3',
        'javac': 'Java compiler',
        'go': 'Go compiler',
        'rustc': 'Rust compiler',
        'node': 'Node.js'
    }
    
    missing = []
    
    for cmd, desc in dependencies.items():
        if subprocess.run(['which', cmd], capture_output=True, text=True).returncode != 0:
            # En Windows, usar 'where' en lugar de 'which'
            if platform.system() == 'Windows':
                result = subprocess.run(['where', cmd], capture_output=True, text=True)
            else:
                result = subprocess.run(['which', cmd], capture_output=True, text=True)
            
            if result.returncode != 0:
                missing.append(f"❌ {desc} ({cmd})")
    
    if missing:
        print("⚠️  Dependencias faltantes:")
        for dep in missing:
            print(f"  {dep}")
        print("\n📝 Instala las dependencias faltantes y vuelve a ejecutar setup.py")
        return False
    
    print("✅ Todas las dependencias están instaladas")
    return True

def setup_python_environment():
    """Configura el entorno de Python."""
    print("\n🐍 Configurando entorno Python...")
    
    # Instalar dependencias Python si es necesario
    try:
        import matplotlib
        print("✅ Matplotlib ya está instalado")
    except ImportError:
        print("📦 Instalando matplotlib...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'matplotlib', 'numpy'])
            print("✅ Matplotlib y numpy instalados")
        except subprocess.CalledProcessError:
            print("⚠️  No se pudo instalar matplotlib. Los gráficos de benchmarks pueden no funcionar.")

def compile_cpp():
    """Compila las versiones C++."""
    print("\n⚙️  Compilando C++...")
    try:
        subprocess.check_call(['g++', '-O3', '-std=c++17', 
                             'implementations/cpp/mergesegmentsort_v3.cpp', '-o', 'segmentsort'])
        print("✅ C++ Segment Sort compilado")
    except subprocess.CalledProcessError:
        print("❌ Error compilando C++")

def compile_java():
    """Compila la versión Java."""
    print("\n☕ Compilando Java...")
    try:
        subprocess.check_call(['javac', 'implementations/java/segmentsort.java'])
        print("✅ Java Segment Sort compilado")
    except subprocess.CalledProcessError:
        print("❌ Error compilando Java")

def compile_go():
    """Compila la versión Go."""
    print("\n🐹 Compilando Go...")
    try:
        subprocess.check_call(['go', 'build', '-o', 'segmentsort_go', 
                             'implementations/go/segmentsort.go'])
        print("✅ Go Segment Sort compilado")
    except subprocess.CalledProcessError:
        print("❌ Error compilando Go")

def compile_rust():
    """Compila la versión Rust."""
    print("\n🦀 Compilando Rust...")
    try:
        subprocess.check_call(['cargo', 'build', '--release'], 
                            cwd='implementations/rust')
        print("✅ Rust Segment Sort compilado")
    except subprocess.CalledProcessError:
        print("❌ Error compilando Rust")
    except FileNotFoundError:
        print("❌ Cargo no encontrado")

def run_tests():
    """Ejecuta los tests básicos."""
    print("\n🧪 Ejecutando tests...")
    try:
        subprocess.check_call([sys.executable, 'benchmarks/quick_test.py'])
        print("✅ Tests completados")
    except subprocess.CalledProcessError:
        print("❌ Error ejecutando tests")

def run_benchmarks():
    """Ejecuta benchmarks rápidos."""
    print("\n📊 Ejecutando benchmarks rápidos...")
    try:
        subprocess.check_call([sys.executable, 'benchmarks/run_benchmarks.py', 
                             '--sizes', '1000', '5000', '10000'])
        print("✅ Benchmarks completados")
    except subprocess.CalledProcessError:
        print("❌ Error ejecutando benchmarks")

def main():
    """Función principal de setup."""
    print("🚀 Segment Sort - Configuración del Proyecto")
    print("=" * 50)
    
    # Verificar dependencias
    if not check_dependencies():
        print("\n❌ Setup falló debido a dependencias faltantes")
        sys.exit(1)
    
    # Configurar entorno
    setup_python_environment()
    
    # Compilar implementaciones
    print("\n📦 Compilando implementaciones...")
    compile_cpp()
    compile_java()
    compile_go()
    compile_rust()
    
    # Ejecutar tests
    run_tests()
    
    # Resumen
    print("\n" + "=" * 50)
    print("🎉 ¡Setup completado exitosamente!")
    print("\n📋 Próximos pasos:")
    print("  • Revisa el README.md para documentación completa")
    print("  • Ejecuta 'make test' para tests completos")
    print("  • Ejecuta 'make benchmarks' para análisis de rendimiento")
    print("  • Consulta docs/implementation_guide.md para detalles de uso")
    print("\n🚀 ¡Comienza a experimentar con Segment Sort!")

if __name__ == "__main__":
    main()