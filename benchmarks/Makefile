# Makefile for C++ Benchmarks
# Compiles the benchmark suite for Segment Sort algorithm

CXX = g++
CXXFLAGS = -std=c++17 -O2 -Wall -Wextra
SRC_DIR = ../implementations/cpp
BENCHMARK_DIR = .

# Source files
BENCHMARK_SRC = cpp_benchmarks.cpp
ALGORITHM_SRC = $(SRC_DIR)/balanced_segment_merge_sort.cpp

# Object files
BENCHMARK_OBJ = cpp_benchmarks.o
ALGORITHM_OBJ = balanced_segment_merge_sort.o

# Executable
TARGET = cpp_benchmarks

# Default target
all: $(TARGET)

# Link the executable
$(TARGET): $(BENCHMARK_OBJ) $(ALGORITHM_OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^

# Compile benchmark source
cpp_benchmarks.o: cpp_benchmarks.cpp cpp_benchmarks.h
	$(CXX) $(CXXFLAGS) -I$(BENCHMARK_DIR) -I$(SRC_DIR) -c cpp_benchmarks.cpp

# Compile algorithm source
balanced_segment_merge_sort.o: $(ALGORITHM_SRC)
	$(CXX) $(CXXFLAGS) -I$(BENCHMARK_DIR) -c $(ALGORITHM_SRC) -o balanced_segment_merge_sort.o

# Clean build artifacts
clean:
	rm -f $(BENCHMARK_OBJ) $(ALGORITHM_OBJ) $(TARGET) benchmark_results_cpp_*.json

# Run benchmarks with default settings
run: $(TARGET)
	./$(TARGET)

# Run with specific settings
run-10k: $(TARGET)
	./$(TARGET) 10000

run-50k: $(TARGET)
	./$(TARGET) 50000

run-100k: $(TARGET)
	./$(TARGET) 100000

# Help target
help:
	@echo "Available targets:"
	@echo "  all          - Build the benchmark executable (default)"
	@echo "  clean        - Remove build artifacts and result files"
	@echo "  run          - Run benchmarks with default settings (100k elements, 10 reps)"
	@echo "  run-10k      - Run benchmarks with 10,000 elements"
	@echo "  run-50k      - Run benchmarks with 50,000 elements"
	@echo "  run-100k     - Run benchmarks with 100,000 elements"
	@echo "  help         - Show this help message"
	@echo ""
	@echo "Benchmark usage:"
	@echo "  ./cpp_benchmarks [sizes...] [--reps repetitions] [--seed seed]"
	@echo ""
	@echo "Examples:"
	@echo "  ./cpp_benchmarks                    # Default: 100k elements, 10 repeticiones"
	@echo "  ./cpp_benchmarks 50000              # Single size"
	@echo "  ./cpp_benchmarks 10000 50000        # Multiple sizes"
	@echo "  ./cpp_benchmarks --reps 30 100000   # Custom repetitions"
	@echo "  ./cpp_benchmarks --seed 42 50000    # Custom seed"

.PHONY: all clean run run-10k run-50k run-100k help