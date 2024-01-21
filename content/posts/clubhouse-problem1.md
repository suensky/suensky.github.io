---
title: Clubhouse需要你解决的算法题之一
tags:
- programming
nav: 算法专题
categories:
- 趣谈算法
date: 2021-02-05 16:50:10
image: img/tech.png
---

Clubhouse大火，平台迅速聚集了大量用户，每个用户都有自己的profile，profile里除了自己的id，还会标注推荐人。现在产品经理提出一个要求，希望能研究任意两个用户的最近的共同好友在哪。程序员也不知道pm为什么要提这么个要求，但这个功能不算费事，所以程序员决定不与pm多做讨论，因为一般情况下，所谓讨论都沦为给pm扩充知识理清思路的过程。简化起见，profile定义如下，完成TODO，注意，这个API可能会被多次调用。
```
class Profile {
    // Id of this profile.
    public String id;

    // Id of the person who nominated this person.
    public String nominatedBy;
}
```

```
public class Clubhouse {

    public Clubhouse(List<Profile> clubPool) {
      // TODO ?
    }

    public Profile getClosestCommonFriend(Profile a, Profile b) {
      // TODO
    }
}
```