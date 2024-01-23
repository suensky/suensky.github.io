---
title: Automate deploying this blog using Github action
tags:
  - devops
date: 2024-01-07 07:17:16
categories:
- DevOps
image: img/tech.png
---

了解github action后，第一步想到的是改造下这个博客。利用github action的工作流，做到直接在github上编辑markdown，保存后，触发一个设定的workflow，做到编译，部署编译好的静态网站到GitHub pages。

这里面关键是，如何部署编译好的静态网站到Github Pages。我用的是hexo这个静态网站生成器，代码是在一个独立repo，与要部署的目标repo不同。在GitHub的runner也就是服务器上，如何设置github credentials，从而能从那里部署是关键。
几番搜索发现了有个现成的github action: [hexo-action](https://github.com/marketplace/actions/hexo-action)。简单总结下:
1. Generate a deploy key pair.
```bash
ssh-keygen -t rsa -C "username@example.com"
```
2. Public key is saved in github page repo's Settings/Deploy Keys.
3. Private key is saved as a secret in source repo's Settings/Secrets, e.g., named `DEPLOY_KEY`.
4. Add the github workflow:
```yml
name: Blog CICD

on:
  push:
    branches:
      - 'main'

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - name: Install dependencies
        run: npm install hexo
      - name: Deploy
        id: deploy
        uses: sma11black/hexo-action@v1.0.3
        with:
          deploy_key: ${{ secrets.DEPLOY_KEY }}
          user_name: github_action
```

这是第一篇自动部署的文章。Let's see if it works.
