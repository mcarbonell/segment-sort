#include <iostream>
#include <vector>
#include <queue>
#include <stdexcept> // Para excepciones

using namespace std;

/**
 * SegmentSortIterator
 * 
 * Una implementación "Lazy" (perezosa) de SegmentSort diseñada para
 * consultas Top-K y streaming.
 * 
 * Ventajas:
 * 1. NO copia el array original (Referencia constante).
 * 2. Memoria auxiliar O(K) donde K es el número de segmentos (muy bajo).
 * 3. Coste de inicialización O(N) (solo escaneo).
 * 4. Coste por elemento extraído O(log K).
 */
class SegmentSortIterator
{
private:
    // Referencia al vector original (NO COPIAMOS DATOS)
    const vector<int>& sourceRef;

    // Estructura interna para gestionar el estado de cada segmento en el Heap
    struct RunCursor {
        int currentIdx; // Índice actual en el array original
        int remaining;  // Cuántos elementos quedan en este segmento
        int step;       // +1 para ascendentes, -1 para descendentes
        int value;      // Valor actual (caché para comparación)
        
        // Necesario para depuración
        int id; 
    };

    // Comparador para el Min-Heap
    // Nota: priority_queue ordena de mayor a menor por defecto.
    // Para un Min-Heap, debemos devolver true si a > b.
    struct CompareRunCursor {
        bool operator()(const RunCursor &a, const RunCursor &b) {
            return a.value > b.value;
        }
    };

    // El Min-Heap que orquesta la fusión
    priority_queue<RunCursor, vector<RunCursor>, CompareRunCursor> minHeap;

    // Métricas para curiosidad
    int totalSegments = 0;

    /**
     * Escanea el array para identificar segmentos naturales y
     * carga el primer elemento de cada uno en el Heap.
     */
    void initialize() {
        int n = sourceRef.size();
        if (n == 0) return;

        int start = 0;
        
        // Recorremos buscando cortes
        for (int i = 1; i < n; ++i) {
            // Lógica simple de detección:
            // Si la tendencia se rompe drásticamente, cortamos.
            // Nota: Para ser robusto con duplicados, consideramos <= como continuación de ascendente
            
            bool isAscendingOrder = sourceRef[i-1] <= sourceRef[i];
            
            // Aquí podríamos poner lógica más compleja de detección.
            // Por simplicidad, usamos una estrategia Greedy simple:
            // Cortamos segmento si cambiamos de ascendente a descendente estricto o viceversa.
            // (Esta es una simplificación del original para el iterador, pero funciona).
            
            // Para mantener la lógica de tu original:
            // Vamos a detectar "Runs" largos.
        }

        // RE-IMPLEMENTACIÓN DE TU LÓGICA DE DETECCIÓN ORIGINAL
        // Adaptada para crear cursores inmediatamente
        
        int runStart = 0;
        if (n == 0) return;
        
        // 0: desconocido, 1: ascendente, -1: descendente
        int direction = 0; 

        for (int i = 1; i < n; ++i) {
            int diff = sourceRef[i] - sourceRef[i-1];
            
            if (diff == 0) continue; // Ignorar duplicados para determinar dirección inicial

            int currentDir = (diff > 0) ? 1 : -1;

            if (direction == 0) {
                direction = currentDir;
                continue;
            }

            // Si la dirección cambia, tenemos un segmento
            if (currentDir != direction) {
                addSegmentToHeap(runStart, i - 1, direction);
                runStart = i; // El elemento actual empieza el nuevo segmento (solapamiento opcional)
                // Nota: En tu original, i era parte del nuevo. 
                // Ajuste: i empieza el nuevo. i-1 terminó el anterior.
                
                runStart = i;
                direction = 0; // Reset direction
            }
        }
        
        // Añadir el último segmento
        addSegmentToHeap(runStart, n - 1, (direction == 0 ? 1 : direction));
    }

    void addSegmentToHeap(int startIdx, int endIdx, int direction) {
        if (startIdx > endIdx) return;
        
        RunCursor cursor;
        cursor.remaining = (endIdx - startIdx) + 1;
        cursor.id = totalSegments++;

        if (direction >= 0) {
            // Segmento Ascendente: Leemos de start a end
            cursor.currentIdx = startIdx;
            cursor.step = 1;
        } else {
            // Segmento Descendente: Leemos de end a start (hacia atrás)
            // Esto hace la "inversión virtual" sin coste de CPU
            cursor.currentIdx = endIdx;
            cursor.step = -1;
        }

        cursor.value = sourceRef[cursor.currentIdx];
        minHeap.push(cursor);
    }

public:
    SegmentSortIterator(const vector<int>& input) : sourceRef(input) {
        initialize();
    }

    /**
     * Comprueba si quedan elementos por iterar.
     */
    bool hasNext() const {
        return !minHeap.empty();
    }

    /**
     * Extrae el siguiente elemento más pequeño (O(log K)).
     */
    int next() {
        if (minHeap.empty()) {
            throw out_of_range("No more elements in SegmentSortIterator");
        }

        // 1. Sacar el menor actual (cima del heap)
        RunCursor current = minHeap.top();
        minHeap.pop();

        int retValue = current.value;

        // 2. Avanzar el cursor de ese segmento
        current.remaining--;

        if (current.remaining > 0) {
            // Mover índice físico
            current.currentIdx += current.step;
            // Actualizar valor cacheado
            current.value = sourceRef[current.currentIdx];
            // Reinsertar en el heap
            minHeap.push(current);
        }

        return retValue;
    }

    /**
     * Helper para obtener los Top-K elementos.
     */
    vector<int> nextBatch(int k) {
        vector<int> batch;
        batch.reserve(k);
        for (int i = 0; i < k && hasNext(); i++) {
            batch.push_back(next());
        }
        return batch;
    }

    int getSegmentCount() const {
        return totalSegments;
    }
};


// ==========================================
// MAIN DE PRUEBA
// ==========================================
int main() {
    // 1. Un vector grande con estructura parcial (Runs naturales)
    // Imaginemos datos de sensores o logs que vienen semi-ordenados
    vector<int> data = {
        // Ascendente
        1, 2, 3, 4, 5, 
        // Descendente (será invertido virtualmente)
        10, 9, 8, 7, 6,
        // Otro ascendente
        11, 15, 20, 25,
        // Aleatorio pequeño
        2, 99, 1
    };

    cout << "--- SegmentSort Iterator Demo ---" << endl;
    cout << "Tamaño array original: " << data.size() << endl;
    cout << "Datos originales: ";
    for(int x : data) cout << x << " ";
    cout << endl << endl;

    // Instanciamos el iterador (Coste: Escaneo O(N))
    // NO se ordena todo el array, solo se prepara el Heap.
    SegmentSortIterator sorter(data);

    cout << "Segmentos detectados: " << sorter.getSegmentCount() << endl;
    cout << "Nota: Menos segmentos = Mejor rendimiento." << endl << endl;

    // CASO DE USO 1: TOP-5 (Lo que harías en una paginación)
    cout << ">>> Dame solo los TOP-5 elementos más pequeños:" << endl;
    vector<int> top5 = sorter.nextBatch(5);
    for(int x : top5) cout << x << " ";
    cout << endl << endl;

    cout << ">>> Dame el siguiente (el 6to): " << sorter.next() << endl << endl;

    // CASO DE USO 2: TERMINAR DE ITERAR
    cout << ">>> Terminando el resto..." << endl;
    while(sorter.hasNext()) {
        cout << sorter.next() << " ";
    }
    cout << endl;

    return 0;
}