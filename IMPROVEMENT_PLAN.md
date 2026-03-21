# Project Improvement Plan

## Overview
Roadmap para mejorar, limpiar y publicar el proyecto Block Merge Segment Sort.

---

## Session 1: Cleanup & Code Organization (2-3 turns)

- [x] **1.1** Eliminar archivos `.bak` redundantes en `benchmarks/`
- [x] **1.2** Revisar y decidir sobre implementaciones de lenguajes:
  - [x] Python: mantener solo `balanced_segment_merge_sort.py`
  - [x] Eliminar versiones antiguas de Java, Go, Rust, PHP (tests eliminados)
  - [x] Mantener solo las implementaciones principales (C, C++, JS, Python)
- [x] **1.3** Unificar estructura de carpetas (original_code → archive/)
- [x] **1.4** Limpiar archivos de benchmarks obsoletos (.exe, .txt, __pycache__)

**Completado en turn 1**

---

## Session 2: Benchmark Infrastructure (2 turns)

- [x] **2.1** Regenerar datasets con mayor variedad de datos (añadido --varied-range)
- [x] **2.2** Actualizar scripts de benchmark para medir cold-start (documentado)
- [ ] **2.3** Añadir tests de rendimiento con floats y strings (pendiente)
- [x] **2.4** Documentar metodología de benchmarks (actualizado)

**Completado en turn 2**

---

## Session 3: Algorithm Improvements (2-3 turns)

- [x] **3.1** Implementar 3-way partitioning para duplicados
  - [x] Añadir detección de alta cardinalidad de duplicados (estimateDuplicateRatio)
  - [x] Implementar merge con 3-way en código JS (merge3Way)
- [x] **3.2** Añadir galloping mode para merges desbalanceados
  - [x] Implementado gallopRight(), gallopLeft(), mergeWithGallop()
  - [x] Activado en merges con imbalance >= 10:1
- [ ] **3.3** Tests de rendimiento (pendiente - requiere CPU libre)

**Session 3 completada** (turns 3-4)

---

## Session 4: Documentation & Polish (2 turns)

- [ ] **4.1** Actualizar README.md con estado actual del proyecto
- [ ] **4.2** Crear/actualizar CHANGELOG.md
- [ ] **4.3** Documentar decisiones de diseño en archivos
- [ ] **4.4** Revisar y mejorar comentarios en código

**Estimación:** 2 turns

---

## Session 5: Academic Publication (2-3 turns)

- [ ] **5.1** Escribir paper técnico (ampliar TECHNICAL_PAPER.md)
  - [ ] Abstract y introducción
  - [ ] Algoritmo y análisis teórico
  - [ ] Resultados experimentales
  - [ ] Comparación con trabajos relacionados
  - [ ] Conclusiones y trabajo futuro
- [ ] **5.2** Crear versión para preprint (arXiv)
- [ ] **5.3** Preparar slides para presentación (opcional)
- [ ] **5.4** Revisar que todo el código tenga licencias claras

**Estimación:** 2-3 turns

---

## Optional / Future (not in current scope)

- [ ] Parallel implementation (multithreading)
- [ ] SIMD vectorization
- [ ] GPU acceleration
- [ ] WebAssembly port
- [ ] Python C extension

---

## Progress Summary

| Session | Tasks | Status |
|---------|-------|--------|
| 1 | Cleanup | ⬜ |
| 2 | Benchmarks | ⬜ |
| 3 | Improvements | ⬜ |
| 4 | Documentation | ⬜ |
| 5 | Paper | ⬜ |

---

## Notes

- Total estimado: **10-12 turns**
- Prioridad: Session 1 → 2 → 3 → 4 → 5
- Ejecutar benchmarks solo cuando CPU no esté ocupada
- Mantener backwards compatibility en cambios de API