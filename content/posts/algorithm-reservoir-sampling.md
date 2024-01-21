---
title: 详解水塘抽样(Reservoir sampling)
tags:
- programming
nav: 算法专题
categories:
- 算法详解
date: 2021-03-24 20:04:23
image: img/tech.png
---
## 一个场景
当内存无法加载全部数据时，如何从包含未知大小的数据流中随机选取`k`个数据，并且要保证每个数据被抽取到的概率相等。

## 水塘抽样
把上述问题具体化为给定一个未知大小数组`data[]`，从中选取`k`个数，要求每个数被选中的概率相等。假设数组长度为`n`，则每个数被选中概率应为`k/n`。

策略是：

1. 对最前面`k`个数，直接放到数组`chosen[]`即`chosen[i] = data[i] 0 <= i < k`。
2. 对`data[i], i >= k`，先生成个`[0...i)`间的随机数(左闭右开)，假设`rand(0, i) = j`，则如果`j < k`,则做替换`chosen[j] = data[i]`。否则，nothing happens.
3. 如此反复直到结束。

`Java`实现如下：
```java
public class ReservoirSampling {
    private Random rand = new Random();
    public int[] sampling(int[] data, int k) {
        int[] chosen = new int[k];
        int i = 0;
        for (int d : data) {
            if (i < k) {
                chosen[i] = d;
            } else {
                int j = rand.nextInt(i);
                if (j < k) {
                    chosen[j] = d;
                }
            }
            ++i;
        }
        return chosen;
    }
}
```

每个元素被选中概率相等的证明如下：

1. 对前`k`个数，直接放到了数组，所以概率为1.
2. 从第`k+1`即`data[k] (0 based)`开始，根据以上策略，`data[k]`此次被选中概率为`k/(k+1)`，而已经被选中的数此次被踢掉的概率则为`1/(k+1)`，即被保留的概率为`1 - 1/(k + 1) = k/(k+1)`。可见，到第`k+1`个数时，每个数被选中的概率均为`k/(k+1)`。
3. 以此类推，到第`k+2`个数即`data[k+1]`此次被选中概率为`k/(k+2)`，已被选中的数此次被踢掉概率`1/(k+2)`，被保留概率`(k+1)/(k+2)`,在上一步和这一步均被保留才称之为保留，所以概率为`k/(k+1) * (k+1)/(k+2) = k/(k+2)`。到第`k+2`个数时，每个数被选中的概率`k/(k+2)`。
4. 以此类推到第`n`个数，每个数被选中的概率为`k/n`。


## [Leetcode 398. Random Pick Index](https://leetcode.com/problems/random-pick-index/)
Given an array of integers with possible duplicates, randomly output the index of a given target number. You can assume that the given target number must exist in the array.

Note:
The array size can be very large. Solution that uses too much extra space will not pass the judge.

Example:

```java
int[] nums = new int[] {1,2,3,3,3};
Solution solution = new Solution(nums);

// pick(3) should return either index 2, 3, or 4 randomly. Each index should have equal probability of returning.
solution.pick(3);

// pick(1) should return 0. Since in the array only nums[0] is equal to 1.
solution.pick(1);
```

其实就是`k=1`的水塘抽样。代码如下：
```java
private int[] nums;
private Random rand = new Random();
public Solution(int[] nums) {
    this.nums = nums;
}

public int pick(int target) {
    int count = 0;
    int index = 0;
    for (int i = 0; i < nums.length; i++) {
        if (target == nums[i]) {
            if (rand.nextInt(++count) == 0) {
                index = i;
            }
        }
    }
    return index;
}
```

## [Leetcode 382. Linked List Random Node](https://leetcode.com/problems/linked-list-random-node/)

Given a singly linked list, return a random node's value from the linked list. Each node must have the same probability of being chosen.

Example 1:

Input:
["Solution", "getRandom", "getRandom", "getRandom", "getRandom", "getRandom"] \
[[[1, 2, 3]], [], [], [], [], []] \
Output \
[null, 1, 3, 2, 2, 3]

Explanation \
```java
Solution solution = new Solution([1, 2, 3]);
solution.getRandom(); // return 1
solution.getRandom(); // return 3
solution.getRandom(); // return 2
solution.getRandom(); // return 2
solution.getRandom(); // return 3
// getRandom() should return either 1, 2, or 3 randomly. Each element should have equal probability of returning.
```
依然是`k=1`的水塘抽样。
```java
private int size = 0;
private ListNode head;
private Random rand = new Random();
public Solution(ListNode head) {
    this.head = head;
}

public int getRandom() {
    ListNode cur = head;
    ListNode chosen = null;
    int count = 1;
    while (cur != null) {
        if (rand.nextInt(count++) == 0) {
            chosen = cur;
        }
        cur = cur.next;
    }
    return chosen.val;
}
```
此题完全可以在初始化时得到这个链表长度`N`，然后取`0 based rand(N)`节点即可。复杂度略有差别而已。所以题目改成以下形式更适合：
```java
public int getRandom(ListNode head) {
}
```