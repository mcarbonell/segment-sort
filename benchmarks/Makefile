# Benchmarks Makefile
# ===================

# Default targets
.PHONY: all test clean help js cpp python

# Language-specific directories
JS_DIR = languages/javascript
CPP_DIR = languages/cpp
PYTHON_DIR = languages/python

# Default target
all: js cpp python

# JavaScript benchmarks
js:
	@echo "🚀 Running JavaScript benchmarks..."
	@cd $(JS_DIR) && node js_benchmarks.js 100000 --reps 5

js-quick:
	@echo "⚡ Running quick JavaScript benchmark..."
	@cd $(JS_DIR) && node js_benchmarks.js 10000 --reps 3

# C++ benchmarks
cpp:
	@echo "⚙️  Compiling and running C++ benchmarks..."
	@cd $(CPP_DIR) && ./compile.bat
	@cd $(CPP_DIR) && cpp_benchmarks.exe 100000

cpp-test:
	@echo "🧪 Running C++ benchmarks with smaller dataset..."
	@cd $(CPP_DIR) && cpp_benchmarks.exe 50000

# Python benchmarks  
python:
	@echo "🐍 Running Python benchmarks..."
	@cd $(PYTHON_DIR) && python python_benchmarks.py 100000 --repetitions 5

python-quick:
	@echo "⚡ Running quick Python benchmark..."
	@cd $(PYTHON_DIR) && python python_benchmarks.py 10000 --repetitions 3

# Analysis scripts
compare-quicksorts:
	@echo "🔬 Comparing QuickSort implementations..."
	@cd scripts && node compare_quicksorts.js

# Development tools
debug:
	@echo "🐛 Running debug tools..."
	@cd tools && python debug_segments.py 1000

validate:
	@echo "✅ Running validation tests..."
	@cd tools && python test_comparison.py

# Cross-language comparison (when implemented)
cross-lang:
	@echo "🌐 Running cross-language comparison..."
	@echo "Note: This target will be implemented when multi-language comparisons are added"

# Results management
archive-results:
	@echo "📁 Archiving old benchmark results..."
	@mkdir -p results/archive
	@find results -name "*.json" -not -path "*/archive/*" -exec mv {} results/archive/ \;
	@echo "✅ Results archived"

show-results:
	@echo "📊 Available benchmark results:"
	@ls -la results/ 2>/dev/null || echo "No results directory found"
	@echo ""
	@echo "Archived results:"
	@ls -la results/archive/ 2>/dev/null || echo "No archived results"

# Cleanup
clean:
	@echo "🧹 Cleaning benchmark artifacts..."
	@# Remove C++ executables
	@rm -f $(CPP_DIR)/cpp_benchmarks.exe
	@rm -f $(CPP_DIR)/segmentsort_go
	@# Remove Python cache
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -name "*.pyc" -delete 2>/dev/null || true
	@# Remove temporary files
	@rm -f *.tmp
	@echo "✅ Cleanup completed"

clean-results:
	@echo "🗑️  Cleaning benchmark results (keeping last 5)..."
	@cd results && ls -t *.json 2>/dev/null | tail -n +6 | xargs -I {} mv {} archive/ 2>/dev/null || echo "No old results to clean"

# Documentation
docs:
	@echo "📚 Benchmark documentation:"
	@echo "Main README: ./README.md"
	@echo "Languages: ./languages/README.md"
	@echo "Scripts: ./scripts/README.md"
	@echo "Tools: ./tools/README.md"

# Testing
test: js-quick python-quick
	@echo "🧪 Basic functionality tests completed"

validate-all:
	@echo "🔍 Running comprehensive validation..."
	@$(MAKE) validate
	@$(MAKE) compare-quicksorts
	@echo "✅ All validations completed"

# Help
help:
	@echo "🎯 Segment Sort Benchmarks - Available Commands"
	@echo "=============================================="
	@echo ""
	@echo "📊 Main Targets:"
	@echo "  all              - Run all language benchmarks"
	@echo "  js               - Run JavaScript benchmarks (100K elements)"
	@echo "  cpp              - Run C++ benchmarks (100K elements)"
	@echo "  python           - Run Python benchmarks (100K elements)"
	@echo ""
	@echo "⚡ Quick Tests:"
	@echo "  js-quick         - JavaScript benchmarks with 10K elements"
	@echo "  python-quick     - Python benchmarks with 10K elements"
	@echo "  test             - Run quick tests for all languages"
	@echo ""
	@echo "🔬 Analysis:"
	@echo "  compare-quicksorts - Compare QuickSort implementations"
	@echo "  validate-all       - Run all validation tests"
	@echo ""
	@echo "🛠️  Development:"
	@echo "  debug              - Run debugging tools"
	@echo "  validate           - Cross-implementation validation"
	@echo "  docs               - Show documentation locations"
	@echo ""
	@echo "📁 Results Management:"
	@echo "  show-results       - List available benchmark results"
	@echo "  archive-results    - Move old results to archive"
	@echo "  clean-results      - Clean up old benchmark results"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  clean              - Remove temporary files and executables"
	@echo "  help               - Show this help message"
	@echo ""
	@echo "📝 Usage Examples:"
	@echo "  make js           # Run JavaScript benchmarks"
	@echo "  make cpp-test     # Quick C++ test with 50K elements"
	@echo "  make compare-quicksorts  # Validate QuickSort implementations"
	@echo "  make validate     # Ensure all implementations are correct"