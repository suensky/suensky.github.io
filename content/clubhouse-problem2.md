---
title: Clubhouse需要你解决的算法题之二
tags:
- programming
nav: 算法专题
categories:
- 趣谈算法
date: 2021-02-05 17:13:57
image: img/tech.png
---
书接前文，the coding guy delivered the feature of finding the closest friend in a timely manner. PM got new task from the leads team. They want to improve clubhouse users' engagement.

PM proposed the immediate idea that it would benefit the engagement if we can improve the joining rate of the rooms recommended to users.

Dev said, I would prefer to join rooms with my closest friends in. That's said, we can recommend rooms based on the closeness between the room and the user.

But what's the closeness, PM asked.

We can measure a room's closeness to a user by aggregating the distance of the user's following friends in the room to this user. Let's say we have user A, A's friend B, B's friend C who's not a direct friend of A. Then for A, the closeness of user B is 1024, and C 512. If C's friend D is neither a friend of A nor B, then D's closeness is 256. The higher the closeness rate, the closer these two users. If B, C and D are all in room #1, then room #1's closeness rate to A is 1024+512+256.

PM nodded with confusion and prepared a deck in 7 seconds. The presentation was very successful and PM got high appreciation from leads team. At the end of the performance review cycle, PM got promoted to partner level.

What about Dev? Dev is very satisfied with the algorithm and the beauty of implementation.

Here you go, Dev!
```
class Profile {
    // Id of this profile.
    public String id;

    // All users this user follows
    public List<Profile> following;
}

class Room {
    public String roomId;

    public List<Profile> usersInRoom;

    // ... more to come as long as PM still has the job.
}
```

```
public class Clubhouse {

    // limit represents the number of indirection level to
    // reach. E.g., limit == 1, then we only consider the direct friends.
    // limit == 2, then only C is considered.
    public Clubhouse(
      List<Profile> clubPool,
      List<Room> currentRooms,
      int limit) {
      // TODO ?
    }

    // Recommend the topN rooms for the given user.
    public List<Room> recommendRooms(Profile user, int topN) {
      // TODO
    }
}
```