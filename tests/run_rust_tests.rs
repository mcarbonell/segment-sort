// To compile and run this test:
// rustc --out-dir . -O run_rust_tests.rs
// ./run_rust_tests

// This includes the implementation from the other file.
// Note: This is a simple approach for a single project. For larger projects,
// you would use Cargo and modules (e.g., `mod segmentsort;`).
include!("../implementations/rust/main.rs");

struct TestCase {
    name: &'static str,
    input: Vec<i32>,
    expected: Vec<i32>,
}

fn run_tests() {
    let test_cases = vec![
        TestCase { name: "Empty array", input: vec![], expected: vec![] },
        TestCase { name: "Single element array", input: vec![42], expected: vec![42] },
        TestCase { name: "Already sorted array", input: vec![1, 2, 3, 4, 5, 6, 7, 8, 9], expected: vec![1, 2, 3, 4, 5, 6, 7, 8, 9] },
        TestCase { name: "Reverse sorted array", input: vec![9, 8, 7, 6, 5, 4, 3, 2, 1], expected: vec![1, 2, 3, 4, 5, 6, 7, 8, 9] },
        TestCase { name: "Array with all identical elements", input: vec![5, 5, 5, 5, 5], expected: vec![5, 5, 5, 5, 5] },
        TestCase { name: "Array with duplicate elements", input: vec![5, 3, 8, 3, 5, 1, 8], expected: vec![1, 3, 3, 5, 5, 8, 8] },
        TestCase { name: "Typical unsorted array", input: vec![5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18], expected: vec![2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 17, 18, 19] },
        TestCase { name: "Array with negative numbers", input: vec![-5, 3, -8, 0, -1, 10], expected: vec![-8, -5, -1, 0, 3, 10] },
        TestCase { name: "Mixed positive and negative with duplicates", input: vec![10, -2, 5, -2, 0, 5, 10, -8], expected: vec![-8, -2, -2, 0, 5, 5, 10, 10] },
        TestCase { name: "Longer random-like array", input: vec![31, 41, 59, 26, 53, 58, 97, 93, 23, 84], expected: vec![23, 26, 31, 41, 53, 58, 59, 84, 93, 97] },
    ];

    let sorter = SegmentSort;
    let mut passed = 0;
    let mut failed = 0;

    println!("Running tests for SegmentSort in Rust...\n");

    for (i, tc) in test_cases.iter().enumerate() {
        let mut array_to_sort = tc.input.clone();
        sorter.sort(&mut array_to_sort);

        if array_to_sort == tc.expected {
            println!("✅ Test #{}: {} - PASSED", i + 1, tc.name);
            passed += 1;
        } else {
            println!("❌ Test #{}: {} - FAILED", i + 1, tc.name);
            println!("   Expected: {:?}", tc.expected);
            println!("   Got:      {:?}", array_to_sort);
            failed += 1;
        }
    }

    println!("\n--------------------\n");
    println!("Test Summary:");
    println!("  {} passed", passed);
    println!("  {} failed", failed);
    println!("--------------------\n");

    if failed > 0 {
        std::process::exit(1);
    }
}

// We have two main functions, one in the included file and one here.
// We will rename the main from the implementation file to avoid a clash.
fn main() {
    run_tests();
}
