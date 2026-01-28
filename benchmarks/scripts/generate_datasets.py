import os
import struct
import random
import argparse

# --- LCG Random Number Generator (for consistency with C/JS) ---
class LCG:
    def __init__(self, seed=12345):
        self.seed = seed

    def random(self):
        a = 1103515245
        c = 12345
        m = 2**31
        self.seed = (a * self.seed + c) % m
        return self.seed / m

    def randint(self, min_val, max_val):
        return min_val + int(self.random() * (max_val - min_val + 1))

# --- Data Generators ---
def generate_random(lcg, n, min_val, max_val):
    return [lcg.randint(min_val, max_val) for _ in range(n)]

def generate_sorted(lcg, n, min_val, max_val):
    step = (max_val - min_val) / n
    return [int(min_val + i * step) for i in range(n)]

def generate_reverse(lcg, n, min_val, max_val):
    step = (max_val - min_val) / n
    return [int(max_val - i * step) for i in range(n)]

def generate_k_sorted(lcg, n, k, min_val, max_val):
    arr = generate_sorted(lcg, n, min_val, max_val)
    for i in range(n):
        max_j = min(i + k + 1, n)
        j = i + int(lcg.random() * (max_j - i))
        if j < n:
            arr[i], arr[j] = arr[j], arr[i]
    return arr

def generate_nearly_sorted(lcg, n, num_swaps, min_val, max_val):
    arr = generate_sorted(lcg, n, min_val, max_val)
    for _ in range(num_swaps):
        i = int(lcg.random() * n)
        j = int(lcg.random() * n)
        arr[i], arr[j] = arr[j], arr[i]
    return arr

def generate_duplicates(lcg, n, unique_values, min_val, max_val):
    return [
        int(min_val + (int(lcg.random() * unique_values) * (max_val - min_val) / unique_values))
        for _ in range(n)
    ]

def generate_plateau(lcg, n, plateau_size, min_val, max_val):
    arr = []
    num_plateaus = (n + plateau_size - 1) // plateau_size
    for p in range(num_plateaus):
        plateau_val = int(min_val + p * (max_val - min_val) / num_plateaus)
        count = min(plateau_size, n - len(arr))
        arr.extend([plateau_val] * count)
    return arr

# --- Main ---
def main():
    parser = argparse.ArgumentParser(description="Generate static datasets for benchmarks")
    parser.add_argument("--size", type=int, default=100000, help="Size of arrays")
    parser.add_argument("--out-dir", default="../datasets", help="Output directory")
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    
    lcg = LCG(12345) # Fixed seed

    datasets = {
        "random": lambda: generate_random(lcg, args.size, 0, 1000),
        "sorted": lambda: generate_sorted(lcg, args.size, 0, 1000),
        "reverse": lambda: generate_reverse(lcg, args.size, 0, 1000),
        "ksorted": lambda: generate_k_sorted(lcg, args.size, args.size // 10, 0, 1000),
        "nearly_sorted": lambda: generate_nearly_sorted(lcg, args.size, args.size // 20, 0, 1000),
        "duplicates": lambda: generate_duplicates(lcg, args.size, 20, 0, 100),
        "plateau": lambda: generate_plateau(lcg, args.size, args.size // 10, 0, 1000),
    }

    print(f"[*] Generating datasets of size {args.size}...")

    for name, generator in datasets.items():
        arr = generator()
        filename = os.path.join(args.out_dir, f"{name}_{args.size}.dat")
        
        # Write as little-endian 32-bit integers
        with open(filename, "wb") as f:
            for val in arr:
                f.write(struct.pack("<i", val))
        
        print(f"  -> Generated {filename} ({len(arr)} elements)")

if __name__ == "__main__":
    main()
