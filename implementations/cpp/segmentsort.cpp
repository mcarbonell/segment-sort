#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class SegmentSort
{
private:
    vector<int> copyarr;

    struct Segment
    {
        int start;
        int length;
    };

    struct CompareSegments
    {
        SegmentSort *segmentSort; // Puntero a la instancia de la clase

        CompareSegments(SegmentSort *ss) : segmentSort(ss) {}

        bool operator()(const Segment &a, const Segment &b)
        {
            return segmentSort->copyarr[a.start] > segmentSort->copyarr[b.start]; // Min-heap based on the start index
        }
    };

public:
    void sort(vector<int> &arr)
    {
        int n = arr.size();
        copyarr = arr;

        // Identify segments
        vector<Segment> segments;
        int start = 0;
        int direction = 0; // 0 unknown, > 0 increasing, < 0 decreasing

        for (int i = 1; i < n; ++i)
        {
            if (direction == 0)
            {
                direction = arr[i] - arr[i - 1];
                continue;
            }
            if ((direction > 0) && arr[i - 1] > arr[i])
            { // Found a decreasing segment
                int length = i - start;
                segments.push_back({start, length});
                start = i;
                direction = 0;
            }
            else if ((direction < 0) && arr[i - 1] < arr[i])
            { // Found a increasing segment
                int length = start - i;
                segments.push_back({i - 1, length});
                start = i;
                direction = 0;
            }
        }
        if (direction >= 0)
        {
            int length = n - start;
            segments.push_back({start, length});
        }
        else
        {
            int length = start - n;
            segments.push_back({n - 1, length});
        }

        // for (auto x : segments) { cout << x.start << " - " << x.length << "\n"; }

        // Use a min-heap to extract the minimum element from the heads of each segment
        CompareSegments compareSegments(this); // Pasa la instancia de la clase
        priority_queue<Segment, vector<Segment>, CompareSegments> minHeap(compareSegments);
        ;
        for (const auto &segment : segments)
        {
            minHeap.push(segment);
        }

        // Reconstruct the array
        for (int i = 0; i < n; ++i)
        {
            Segment current = minHeap.top();
            minHeap.pop();

            arr[i] = copyarr[current.start];

            // If the segment still has elements, push it back to the heap
            if (current.length > 0)
            { // Positive segment
                if (--current.length > 0)
                {
                    current.start++;
                    minHeap.push(current);
                }
            }
            else if (current.length < 0)
            { // Negative segment
                if (++current.length < 0)
                {
                    current.start--;
                    minHeap.push(current);
                }
            }
        }
    }
};

// Ejemplo de uso
int main()
{
    vector<int> v = {5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18};
    // vector<int> v = {5, 3, 8, 4, 2, 7, 1, 6};
    // vector<int> v = {9, 2, 3, 4, 5, 6, 7, 8, 1};
    cout << "Vector original: ";
    for (int x : v)
    {
        cout << x << " ";
    }
    cout << "\n";
    SegmentSort *ss = new SegmentSort();
    ss->sort(v);

    cout << "Vector ordenado: ";
    for (int x : v)
    {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
