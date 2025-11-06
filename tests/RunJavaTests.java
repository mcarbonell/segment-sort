// To compile and run this test:
// javac -cp ../implementations/java:. RunJavaTests.java
// java -cp ../implementations/java:. RunJavaTests

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

// Assuming SegmentSort class is in the default package and accessible
// from implementations/java/

public class RunJavaTests {

    // Simple struct-like class to hold test case data
    static class TestCase {
        String name;
        List<Integer> input;
        List<Integer> expected;

        TestCase(String name, Integer[] input, Integer[] expected) {
            this.name = name;
            this.input = new ArrayList<>(Arrays.asList(input));
            this.expected = new ArrayList<>(Arrays.asList(expected));
        }
    }

    public static void main(String[] args) {
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase("Empty array", new Integer[]{}, new Integer[]{}));
        testCases.add(new TestCase("Single element array", new Integer[]{42}, new Integer[]{42}));
        testCases.add(new TestCase("Already sorted array", new Integer[]{1, 2, 3, 4, 5, 6, 7, 8, 9}, new Integer[]{1, 2, 3, 4, 5, 6, 7, 8, 9}));
        testCases.add(new TestCase("Reverse sorted array", new Integer[]{9, 8, 7, 6, 5, 4, 3, 2, 1}, new Integer[]{1, 2, 3, 4, 5, 6, 7, 8, 9}));
        testCases.add(new TestCase("Array with all identical elements", new Integer[]{5, 5, 5, 5, 5}, new Integer[]{5, 5, 5, 5, 5}));
        testCases.add(new TestCase("Array with duplicate elements", new Integer[]{5, 3, 8, 3, 5, 1, 8}, new Integer[]{1, 3, 3, 5, 5, 8, 8}));
        testCases.add(new TestCase("Typical unsorted array", new Integer[]{5, 3, 2, 4, 6, 8, 7, 19, 10, 12, 13, 14, 17, 18}, new Integer[]{2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 17, 18, 19}));
        testCases.add(new TestCase("Array with negative numbers", new Integer[]{-5, 3, -8, 0, -1, 10}, new Integer[]{-8, -5, -1, 0, 3, 10}));
        testCases.add(new TestCase("Mixed positive and negative with duplicates", new Integer[]{10, -2, 5, -2, 0, 5, 10, -8}, new Integer[]{-8, -2, -2, 0, 5, 5, 10, 10}));
        testCases.add(new TestCase("Longer random-like array", new Integer[]{31, 41, 59, 26, 53, 58, 97, 93, 23, 84}, new Integer[]{23, 26, 31, 41, 53, 58, 59, 84, 93, 97}));

        SegmentSort sorter = new SegmentSort();
        int passed = 0;
        int failed = 0;

        System.out.println("Running tests for SegmentSort in Java...\n");

        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            List<Integer> arrayToSort = new ArrayList<>(tc.input); // Make a copy

            try {
                sorter.sort(arrayToSort);
                if (!arrayToSort.equals(tc.expected)) {
                    throw new AssertionError("Arrays are not equal");
                }
                System.out.printf("✅ Test #%d: %s - PASSED\n", i + 1, tc.name);
                passed++;
            } catch (AssertionError e) {
                System.out.printf("❌ Test #%d: %s - FAILED\n", i + 1, tc.name);
                System.out.println("   Expected: " + tc.expected);
                System.out.println("   Got:      " + arrayToSort);
                failed++;
            }
        }

        System.out.println("\n--------------------\n");
        System.out.println("Test Summary:");
        System.out.printf("  %d passed\n", passed);
        System.out.printf("  %d failed\n", failed);
        System.out.println("--------------------\n");

        if (failed > 0) {
            System.exit(1);
        }
    }
}
