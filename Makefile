# Segment Sort Makefile
# =====================

CXX = g++
CXXFLAGS = -O3 -std=c++17 -Wall -Wextra
PYTHON = python3
JAVA = javac
GO = go
RUST = cargo

# Targets
all: cpp_segmentsort python_test java_compile

cpp_segmentsort: implementations/cpp/segmentsort.cpp
	$(CXX) $(CXXFLAGS) implementations/cpp/segmentsort.cpp -o segmentsort
	@echo "✅ C++ Segment Sort compilado exitosamente"

python_test: benchmarks/quick_test.py
	@echo "🧪 Ejecutando tests de Python..."
	$(PYTHON) benchmarks/quick_test.py

java_compile: implementations/java/segmentsort.java
	$(JAVA) implementations/java/segmentsort.java
	@echo "✅ Java Segment Sort compilado exitosamente"

go_build: implementations/go/segmentsort.go
	$(GO) build -o segmentsort_go implementations/go/segmentsort.go
	@echo "✅ Go Segment Sort compilado exitosamente"

rust_build: implementations/rust/Cargo.toml
	$(RUST) build --release
	@echo "✅ Rust Segment Sort compilado exitosamente"

# Ejecutar todos los tests
test: python_test
	@echo "🎉 Tests completados"

# Ejecutar benchmarks completos
benchmarks:
	$(PYTHON) benchmarks/run_benchmarks.py --sizes 1000 5000 10000 50000

# Limpiar archivos generados
clean:
	rm -f segmentsort benchmark segmentsort_go
	rm -rf implementations/python/__pycache__
	rm -f implementations/java/*.class
	rm -rf target/
	rm -f *.o
	@echo "🧹 Archivos limpiados"

# Instalar dependencias e inicializar proyecto
setup:
	@echo "🚀 Configurando entorno de desarrollo..."
	@echo "Verificando herramientas..."
	@command -v $(CXX) >/dev/null 2>&1 || { echo "❌ g++ no encontrado"; exit 1; }
	@command -v $(PYTHON) >/dev/null 2>&1 || { echo "❌ python3 no encontrado"; exit 1; }
	@command -v $(JAVA) >/dev/null 2>&1 || { echo "❌ javac no encontrado"; exit 1; }
	@command -v $(GO) >/dev/null 2>&1 || { echo "❌ go no encontrado"; exit 1; }
	@command -v $(RUST) >/dev/null 2>&1 || { echo "❌ rust no encontrado"; exit 1; }
	@echo "✅ Todas las herramientas encontradas"
	@make all
	@echo "🎉 ¡Proyecto configurado exitosamente!"

# Ayuda
help:
	@echo "Segment Sort - Comandos disponibles:"
	@echo "  all           - Compilar todas las implementaciones"
	@echo "  cpp_segmentsort - Compilar C++ Segment Sort"
	@echo "  python_test   - Ejecutar tests de Python"
	@echo "  java_compile  - Compilar Java"
	@echo "  go_build      - Compilar Go"
	@echo "  rust_build    - Compilar Rust"
	@echo "  test          - Ejecutar todos los tests"
	@echo "  benchmarks    - Ejecutar benchmarks completos"
	@echo "  clean         - Limpiar archivos generados"
	@echo "  setup         - Configurar entorno de desarrollo"
	@echo "  help          - Mostrar esta ayuda"

.PHONY: all test benchmarks clean setup help