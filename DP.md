### 01 backpack problem

## 1.1 Problem

Given N items and a bag of weight capacity W. Each item has weight w[i] and value v[i].
What's the most value this bag can hold?E.g., N = 5, W = 10.w[i]: [1 2 3 4 5]v[i]: [5 4 3 2 1]
Output: 14.Explanation: Choose item 1 2 3 4 whose total weight is 10 and total value is 14.

## 1.2 Solution

```java
dp[i][j] := the most value to get if taken from item [1:i] and weight <= j. Then dp[N][W] is the answer to the problem.

dp[0][j] = 0 // given 0 items, the value you can get is always 0
dp[i][j] = dp[i-1][j]                 // if j < w[i], item i cannot be put into the bag
         = max(dp[i-1][j]             // don't take item i
               dp[i-1][j-w[i]] + v[i]) // take item i,
```

```java
public int backpack(int N, int W, int[] w, int[] v) {
      int[][] dp = new int[N + 1][W + 1];
      for (int i = 1; i <= N; i++) {
            for (int j = 0; j <= W; j++) {
                  // Depends if there is item of weight 0.
                  // If yes, j starts from 0. Otherwise, j starts from 1.
                  if (w[i - 1] > j)  {
                        dp[i][j] = dp[i - 1][j];
                  }
                  else {
                        dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i - 1]] + v[i - 1]);
                  }
            }
      }
      return dp[N][V];
}

// Since dp[i][j] only depends on dp[i - 1][k], where k <= j,
// we can use one dimension array dp[j]
public int backpack(int N, int W, int[] w, int[] v) {
      int[] dp = new int[W + 1];    for (int i = 0; i < N; i++) {
            for (int j = W; j >= w[i]; j--) {
                  dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
            }
      }
      return dp[W];
}
```
