---
title: 详解并查集(Union Find)
tags:
- programming
nav: 算法专题
categories:
- 算法详解
date: 2021-03-01 13:12:12
image: img/tech.png
---
# What's Union Find?
Union Find is useful in finding connected components. The idea behind UF is quite simple.
1. You have **N** items initially. Each item forms its own group by setting parent to pointing to itself, i.e., `parents[i] = i`.
2. Then you can union two items if they are connected or share some common properties in your problem definition. E.g., `union(1,3)` will connect item 1 and 3 and make their parents both pointing to the same item.
3. You can continue `union(x, y)` and put more items into one group.
![Disjoint Set process](/algorithm_union-find/dsu.png)

A very common implementation of Disjoint Set Union. Here I applied two optimization: path compression and union by rank. The idea is to flatten the tree when `find(x)` is called so as to reduce the time complexity, which is `O(logN)` now. In reality, the amortized time complexity is a very small constant. Refer to [wiki](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) for more detailed discussion.
```java
public class DSU {
    private int[] parents;
    private int[] rank;
    private int size;

    public DSU(int size) {
      this.size = size;
      parents = new int[size];
      rank = new int[size];
      for (int i = 0; i < size; ++i) {
        parents[i] = i;
      }
    }

    public boolean union(int x, int y) {
      int parentX = find(x);
      int parentY = find(y);
      if (parentX == parentY) {
        return false;
      }

      if (rank[parentX] < rank[parentY]) {
        parents[parentX] = parentY;
      }
      else {
        parents[parentY] = parentX;
        if (rank[parentX] == rank[parentY]) {
          ++rank[parentX];
        }
      }

      --size;
      return true;
    }

    public int getGroups() {
      return size;
    }

    public int find(int x) {
      while (parents[x] != x) {
        parents[x] = parents[parents[x]];
        x = parents[x];
      }

      return parents[x];
    }
}
```
# How to user UF?
While it's easy to get the idea of UF, it's not straightforward to use it to solve problems sometimes. Especially when the problems are presented in a way distancing itself from UF. I'll give two examples to illustrate the use of UF.

## [Redundant Connection](https://leetcode.com/problems/redundant-connection/)
### Problem
In this problem, a tree is an undirected graph that is connected and has no cycles.

The given input is a graph that started as a tree with N nodes (with distinct values 1, 2, ..., N), with one additional edge added. The added edge has two different vertices chosen from 1 to N, and was not an edge that already existed.

The resulting graph is given as a 2D-array of `edges`. Each element of `edges` is a pair [`u`, `v`] with `u` < `v`, that represents an undirected edge connecting nodes `u` and `v`.

Return **an edge** that can be removed so that the resulting graph is a tree of N nodes. If there are multiple answers, return the answer that occurs last in the given 2D-array. The answer edge [`u`, `v`] should be in the same format, with `u` < `v`.

> Example:\
Input: [[1,2], [1,3], [2,3]]\
Output: [2,3] \
Explanation: The given undirected graph will be like this: \
   &nbsp; 1\
 &nbsp;&nbsp;\/  \\ \
2 - 3

### Solution:
The problem only needs to remove one edge that's redundant and the last one in the case of multiple answers, which significantly simplifies the problem.

Think with UF in mind, each vertex in the graph is a group at first. With each edge connecting two vertices, they become the same group. If we find two vertices of an edge already in the same group, we find the answer. The reason is an edge between two vertices that are already connected will cause cycle, as illustrated in above example.

And the code. Here I used a simplified DSU without rank.
```java
public int[] findRedundantConnection(int[][] edges) {
        int size = edges.length;
        DSU dsu = new DSU(size + 1);
        for (int[] edge : edges) {
            int x = dsu.find(edge[0]);
            int y = dsu.find(edge[1]);
            if (x == y) {
                return edge;
            }
            dsu.union(x, y);
        }

        return new int[2];
    }

    static class DSU {
        private int[] parents;
        public DSU(int size) {
            parents = new int[size + 1];
            for (int i = 1; i <= size; i++) {
                parents[i] = i;
            }
        }

        public int find(int x) {
            if (parents[x] != x) {
                parents[x] = find(parents[x]);
            }
            return parents[x];
        }

        public void union(int x, int y) {
            parents[find(x)] = find(y);
        }
    }
```

## [Regions Cut by Slashes](https://leetcode.com/problems/regions-cut-by-slashes/)
### Problem
In a N x N grid composed of 1 x 1 squares, each 1 x 1 square consists of a /, \\, or blank space.  These characters divide the square into contiguous regions.
Return the number of regions.

> Note that backslash characters are escaped, so a \ is represented as "\\\\".

**Example 1:** \
Input:  \
[    \
  ".  /", \
  "/ ."  \
]
Output: 2 \
Explanation: The 2x2 grid is as follows: \
![eg1](/algorithm_union-find/1.png)

**Example 2:** \
Input:  \
[    \
  ".  /", \
  ". ."  \
]
Output: 1 \
Explanation: The 2x2 grid is as follows: \
![eg2](/algorithm_union-find/2.png)

Example 1:
Input:  \
[    \
  "\\  /", \
  "/ \\"  \
]
Output: 4 \
Explanation: The 2x2 grid is as follows: \
![eg3](/algorithm_union-find/3.png)

### Solution
It's not straightforward to link this problem to UF though the regions cut by the slashes may remind of groups then UF. First, if we each grid cell into 4 small cells like below figure, we know that the four small cells are connected to each other without slashes or back slashes. Also, we know that each small cell connects to its neighbor small cell regardless of slashes or back slashes. Let `cell(row, col, index)` represents the small cell of `index` at `grid[row][col]`. Then we get:
 1. `cell(1, 0, 1)` connects to `cell(0, 0, 3)`
 2. `cell(0, 1, 0)` connects to `cell(0, 0, 2)` for sure. And all other neighbor cells to be connected.
 3. If there is no / in `grid[row][col]`, then `cell(row, col, 0)` connects to `cell(row, col, 3)` and `cell(row, col, 1)` connects to `cell(row, col, 2)`.
 4. If there is no \\ in `grid[row][col]`, then `cell(row, col, 0)` connects to `cell(row, col, 1)` and `cell(row, col, 2)` connects to `cell(row, col, 3)`.

![eg3](/algorithm_union-find/dsu_4.png)

With above in mind, we can apply UF here by initially setting each small cell to its own group. Iterate all small cells and union connected cells based on the above rules. The resulting groups is the answer to this problem.

And the code. Here `DSU` is defined at the beginning.
```java
public int regionsBySlashes(String[] grid) {
  int len = grid.length;
  int groups = 4 * len * len;
  DSU dsu = new DSU(groups);

  for (int i = 0; i < len; ++i) {
      for (int j = 0; j < len; ++j) {
          if (i > 0) {
              dsu.union(index(len, i, j, 1), index(len, i - 1, j, 3));
          }
          if (j > 0) {
              dsu.union(index(len, i, j, 0), index(len, i, j - 1, 2));
          }

          char ch = grid[i].charAt(j);
          if (ch != '/') {
              dsu.union(index(len, i, j, 0), index(len, i, j, 3));
              dsu.union(index(len, i, j, 1), index(len, i, j, 2));
          }
          if (ch != '\\') {
              dsu.union(index(len, i, j, 0), index(len, i, j, 1));
              dsu.union(index(len, i, j, 2), index(len, i, j, 3));
          }
      }
  }

  return dsu.count;
}

private int index(int len, int row, int col, int k) {
  return 4 * (row * len + col) + k;
}
```