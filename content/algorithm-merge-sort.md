---
title: 详解归并排序之应用(Merge sort)
tags:
- programming
nav: 算法专题
categories:
- 算法详解
date: 2021-03-02 16:17:18
image: img/tech.png
---

归并排序基于分治思想，基本步骤是把数组一分为二，分别排序，然后将两个排序好的数组合并，合并两个排序好的数组可以在`O(N)`的复杂度完成。根据`T(N) = 2T(2/N) + N`,可以推导出时间复杂度为`O(NlogN)`。代码如下：
```java
public void sort(int[] nums) {
    mergeSort(nums, 0, nums.length - 1);
}

private void mergeSort(int[] nums, int start, int end) {
    if (start >= end) {
        return;
    }

    int mid = start + (end - start) / 2;
    // Step 1: sort nums[start ... mid].
    mergeSort(nums, start, mid);
    // Step 2: sort nums[mid+1 ... end].
    mergeSort(nums, mid + 1, end);
    // Step 3: merge two sorted sub-arrays.
    merge(nums, start, mid, end);
}

// nums[start ... mid] and nums[mid+1 ... end] are sorted, respectively.
// Merge two sorted sub-array in O(end - start + 1).
private void merge(int[] nums, int start, int mid, int end) {
    int len = end - start + 1;
    int[] sorted = new int[len];

    int i = start;
    int j = mid + 1;
    int k = 0;
    while (i <= mid && j <= end) {
        if (nums[i] <= nums[j]) {
            sorted[k++] = nums[i++];
        } else {
            sorted[k++] = nums[j++];
        }
    }
    while (i <= mid) {
        sorted[k++] = nums[i++];
    }
    while (j <= end) {
        sorted[k++] = nums[j++];
    }

    for (k = 0, i = start; i <= end; ++i, ++k) {
        nums[i] = sorted[k];
    }
}
```

归并排序代码简单易懂，其厉害之处在于巧加应用，可降低问题复杂度，仅以几例说明。

## Reverse Pairs
> [Leetcode 493 Hard](https://leetcode.com/problems/reverse-pairs/)

Given an array `nums`, we call `(i, j)` an important reverse pair if `i < j` and `nums[i] > 2*nums[j]`.

You need to return the number of important reverse pairs in the given array.

Example1:\
Input: [1,3,2,3,1] \
Output: 2

Example2: \
Input: [2,4,3,5,1] \
Output: 3

### 分析
此题难度hard，主要在于对复杂度要求。如果撇开次要求，暴力搜索`O(N^2)`,堪称easy。
```java
public int reversePairs(int[] nums) {
    int n = nums.length;
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] / 2.0 > nums[i])
                count++;
        }
    }
    return count;
}
```
要降低复杂度，各家有各法，我就一招鲜：分治归并。代码如下，很容易发现结构与上面的归并排序完全一致，`merge(nums, start, mid, end)`甚至和归并排序一模一样。

不同处在于，两个问题追求的结果不同，此处希望找到`count of reverse pairs`.所以`mergeSort(nums, start, end)`返回的是`count of reverse pairs for nums[start ... end]`。

为什么可以排序而不影响结果？试想，一个数组一分为二后，想找一个`nums[i]`在前一半而`nums[j]`在后一半的`reverse pair`,`nums[i]`在前一半数组的哪个位置还重要么？不重要，在`nums[j]`前面就行，所以排序不影响结果。
```java
// Complexity: T(N) = 2T(N/2) + N => T(N)=O(NlogN)
public int reversePairs(int[] nums) {
    return mergeSort(nums, 0, nums.length - 1);
}

// Return count of reverse pairs in nums[start ... end]
private int mergeSort(int[] nums, int start, int end) {
    if (start >= end) {
        return 0;
    }

    int mid = start + (end - start) / 2;

    // count = count of nums[start ... mid] + count of nums[mid + 1 ... end]
    int count = mergeSort(nums, start, mid) + mergeSort(nums, mid + 1, end);
    int i = start;
    int j = mid + 1;
    // Note both nums[start ... mid] and nums[mid+1 ... end] are sorted.
    // if nums[i] > 2*nums[j], then for sure nums[i+1] > 2*nums[j],
    // so it's a typical two pointer scan.
    while (i <= mid && j <= end) {
        if (nums[i] / 2.0 <= nums[j]) {
            count += (j - mid - 1);
            ++i;
        } else {
            ++j;
        }
    }
    if (i <= mid) {
        count += (mid - i + 1) * (end - mid);
    }

    merge(nums, start, mid, end);
    return count;
}
```

## Count of Smaller Numbers After Self
> [Leetcode 315 Hard](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

You are given an integer array `nums` and you have to return a new counts array. The counts array has the property where `counts[i]` is the number of smaller elements to the right of `nums[i]`.

**Example 1**:\
Input: `nums = [5,2,6,1]` \
Output: `[2,1,1,0]` \
Explanation:
To the right of 5 there are 2 smaller elements (2 and 1).\
To the right of 2 there is only 1 smaller element (1).\
To the right of 6 there is 1 smaller element (1).\
To the right of 1 there is 0 smaller element.

**Example 2**: \
Input: `nums = [-1]` \
Output: `[0]`

**Example 3**:\
Input: `nums = [-1,-1]`\
Output: `[0,0]`

此题如果换个问法，求`i < j 且 nums[i] > nums[j]`的个数，则与`Reverse pair`可以说完全一样。

但这题问的是每个元素右边比这个元素小的个数，这就与每个元素在数组中的位置相关了。排序会移动元素，即改变其位置，因此，我们需要建立一个排序后与最初位置的映射,这就是代码中`indexes[]`。一个例子：\
`nums[]    = [5, 2, 6, 1]` \
`indexes[] = [0, 1, 2, 3]` \
某次`merge`后，\
`nums[]    = [2, 5, 1, 6]` \
`indexes[] = [1, 0, 3, 2]`


```java
// Here we need to update result[] while nums[] are moved during merge sort,
// so given an index after sort, we need to map it to the original index,
// so that we can update the result[original_index]
// indexes[] is used to keep the mapping from updated nums[] to the original nums[]
// e.g., given nums[] = [5, 2, 6, 1], indexes = [0, 1, 2, 3]
//     first merge sort: [2, 5, 1, 6], indexes = [1, 0, 3, 2] means num=2 is original at index = 1
public int[] countSmaller(int[] nums) {
    int[] result = new int[nums.length];
    int[] indexes = new int[nums.length];
    for (int i = 0; i < indexes.length; i++) {
        indexes[i] = i;
    }
    mergeSort(result, indexes, nums, 0, nums.length - 1);
    return result;
}

private void mergeSort(int[] result, int[] indexes, int[] nums, int start, int end) {
    if (start >= end) {
        return;
    }

    int mid = start + (end - start) / 2;
    mergeSort(result, indexes, nums, start, mid);
    mergeSort(result, indexes, nums, mid + 1, end);

    int i = start;
    int j = mid + 1;
    while (i <= mid && j <= end) {
        if (nums[i] <= nums[j]) {
            result[indexes[i]] += j - mid - 1;
            ++i;
        } else {
            ++j;
        }
    }
    while (i <= mid) {
        result[indexes[i]] += end - mid;
        ++i;
    }

    merge(nums, indexes, start, mid, end);
}

private void merge(int[] nums, int[] indexes, int start, int mid, int end) {
    int[] sorted = new int[end - start + 1];
    int[] sortedIndexes = new int[end - start + 1];
    for (int k = 0, i = start, j = mid + 1; i <= mid || j <= end;) {
        if (j > end || (i <= mid && nums[i] <= nums[j])) {
            sortedIndexes[k] = indexes[i];
            sorted[k] = nums[i++];
        }
        else  if (i > mid || (j <= end && nums[j] <= nums[i])) {
            sortedIndexes[k] = indexes[j];
            sorted[k] = nums[j++];
        }
        k++;
    }

    for (int k = 0, i = start; i <= end; i++, k++) {
        nums[i] = sorted[k];
        indexes[i] = sortedIndexes[k];
    }
}
```

## How Many Numbers Are Smaller Than the Current Number
> [Leetcode 1365 Easy](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/)


Given the array `nums`, for each `nums[i]` find out how many numbers in the array are smaller than it. That is, for each `nums[i]` you have to count the number of valid `j`'s such that `j != i` and `nums[j] < nums[i]`.

Return the answer in an array.

**Example 1**:\
Input: `nums = [8,1,2,2,3]` \
Output: `[4,0,1,1,3]` \
Explanation: \
For `nums[0]=8` there exist four smaller numbers than it (1, 2, 2 and 3). \
For `nums[1]=1` does not exist any smaller number than it.\
For `nums[2]=2` there exist one smaller number than it (1).\
For `nums[3]=2` there exist one smaller number than it (1). \
For `nums[4]=3` there exist three smaller numbers than it (1, 2 and 2).

**Example 2**: \
Input: `nums = [7,7,7,7]`\
Output: `[0,0,0,0]`

此题难度easy，与`Reverse pair`一样，皆因要求不同而已。不失一般性的话，此题解法与`Count of Smaller Numbers After Self`可以说异曲同工，`merge(nums, indexes, start, mid, end)`甚至是原封不动照搬即可。

```java
public int[] smallerNumbersThanCurrent(int[] nums) {
    int[] indexes = new int[nums.length];
    for (int i = 0; i < indexes.length; ++i) {
        indexes[i] = i;
    }
    mergeSort(nums, indexes, 0, nums.length - 1);
    int[] result = new int[nums.length];
    for (int i = 0; i < nums.length; ++i) {
        int j = i - 1;
        // Can optimize here using binary search.
        // Otherwise, worst case O(N^2)
        while (j >= 0 && nums[j] == nums[i]) {
            --j;
        }

        result[indexes[i]] = j + 1;
    }
    return result;
}

private void mergeSort(int[] nums, int[] indexes, int start, int end) {
    if (start >= end) {
        return;
    }

    int mid = start + (end - start) / 2;
    mergeSort(nums, indexes, start, mid);
    mergeSort(nums, indexes, mid + 1, end);
    merge(nums, indexes, start, mid, end);
}
```