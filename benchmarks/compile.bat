@echo off
REM Batch script for compiling and running C++ benchmarks on Windows
REM This script requires MinGW-w64 or Visual Studio with C++ compiler

echo ============================================
echo C++ Segment Sort Benchmarks Build Script
echo ============================================

REM Check if g++ is available
where g++ >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: g++ not found in PATH
    echo Please install MinGW-w64 or add Visual Studio compiler to PATH
    echo.
    echo For MinGW-w64:
    echo   Download from: https://sourceforge.net/projects/mingw-w64/
    echo   Add bin directory to PATH environment variable
    echo.
    echo For Visual Studio:
    echo   Install Visual Studio 2019/2022 with C++ workload
    echo   Use "Developer Command Prompt for VS"
    pause
    exit /b 1
)

echo Found g++ compiler, proceeding with compilation...
echo.

REM Compile the benchmark
echo Compiling benchmark executable...
g++ -std=c++17 -O2 -Wall -Wextra ^
    cpp_benchmarks.cpp ^
    -o cpp_benchmarks.exe

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Compilation failed
    pause
    exit /b 1
)

echo Compilation successful!
echo.

REM Run benchmark with default settings if requested
if "%1"=="run" (
    echo Running benchmarks with default settings...
    cpp_benchmarks.exe
)

if "%1"=="clean" (
    echo Cleaning build artifacts...
    if exist cpp_benchmarks.exe del cpp_benchmarks.exe
    if exist *.o del *.o
    echo Clean completed.
)

if "%1"=="help" (
    echo.
    echo Usage examples:
    echo   compile.bat              # Just compile
    echo   compile.bat run          # Compile and run with default settings
    echo   compile.bat clean        # Remove build artifacts
    echo   cpp_benchmarks.exe       # Run with custom parameters
    echo.
    echo Benchmark usage:
    echo   cpp_benchmarks.exe [sizes...] [--reps repetitions] [--seed seed]
    echo.
    echo Examples:
    echo   cpp_benchmarks.exe                    # Default: 100k elements, 10 reps
    echo   cpp_benchmarks.exe 50000              # Single size
    echo   cpp_benchmarks.exe --reps 30 100000   # Custom repetitions
    echo   cpp_benchmarks.exe --seed 42 50000    # Custom seed
)

pause