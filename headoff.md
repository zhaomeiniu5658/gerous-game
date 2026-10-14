# 《仇恨体系》项目交接说明

更新日期：2026-10-14

## 一、项目概况

《仇恨体系》是一个手机优先的社交策略小游戏原型，核心概念是：

> 你不在的时候，仇人可能正在行动。

当前仓库已经完成的是**主界面交互预览版**，可在手机浏览器和电脑浏览器访问。当前页面使用本地演示状态，刷新页面后会重置；尚未接入真实账号、数据库、服务端游戏规则、WebSocket 联机和真实金币结算。

GitHub 仓库：<https://github.com/zhaomeiniu5658/gerous-game>

默认分支：`main`

当前最新提交：`22c77ec chore: containerize and deploy preview app`

## 二、当前线上预览

Sealos 公网地址：

<https://gerous-game-ibppyqeh.sealoshzh.site>

当前部署应用：`gerous-game-ehlezgsv`

部署区域：Sealos 杭州，区域域名 `hzh.sealos.run`

线上应用是静态 React 前端，由 Nginx 提供服务。应用已经验证：

- Deployment 状态为 `1/1 Ready`；
- 首页 HTTPS 请求返回 200；
- `/healthz` 返回 200 和 `ok`；
- 手机尺寸约 `390 × 844` 下页面无横向溢出；
- “找人干架”→选择对手→自动战斗动画→战斗结果流程可操作。

## 三、本地启动

环境要求：Node.js 22 或以上版本。

```bash
npm install
npm run dev
```

默认访问：<http://localhost:5173>

局域网手机访问时，手机和电脑连接同一个 Wi-Fi，然后访问 Vite 输出的 `Network` 地址，例如：

```text
http://192.168.x.x:5173
```

生产构建：

```bash
npm run build
npm run preview
```

## 四、代码结构

```text
.
├── src/
│   ├── main.tsx          # 当前全部前端页面和交互逻辑
│   └── style.css         # 自定义 Apple 风格响应式样式
├── public/icon.svg       # 应用图标
├── index.html            # HTML 入口、移动端 meta 配置
├── package.json          # React、Vite、Motion、Lucide 依赖和脚本
├── Dockerfile            # Node 构建阶段 + Nginx 运行阶段
├── .dockerignore
├── deploy/nginx.conf     # 8080 端口、SPA fallback、healthz
├── deploy/sealos.yaml    # Sealos Deployment、Service、Ingress 模板
├── README.md             # 用户运行和部署说明
└── headoff.md            # 本交接文档
```

目前 `src/main.tsx` 仍是单文件原型。接入真实后端前，建议拆分为：

```text
src/
├── app/
├── components/
├── pages/HomePage.tsx
├── pages/HatePage.tsx
├── pages/BattlePage.tsx
├── pages/AssetsPage.tsx
├── stores/
├── services/
└── styles/
```

## 五、当前已实现功能

- 首页角色卡片：昵称、头像、生命值、武力、金币、行动力、状态。
- 首页主操作：“找人干架”。
- 底部四项导航：首页、仇恨、战斗、资产。
- 仇恨页面：示例攻击记录、查看战报、去复仇入口。
- 战斗页面：示例好友列表、在线/离线/保护中状态。
- 自动战斗演示：角色前冲、受击震动、伤害数字、血条变化和结果提示。
- 资产页面：钱包、金库、本地演示流水。
- 武力训练：消耗 100 演示金币，武力增加 15。
- 每日工资：领取 100 演示金币，一次性按钮状态。
- 好友排行榜、消息通知、个人设置弹层。
- 桌面端左侧品牌引导区，手机端单列布局。
- iPhone 刘海和底部 Home Indicator 的安全区适配。
- `prefers-reduced-motion` 减少动画适配。

## 六、重要的原型边界

以下内容目前只是 UI 交互演示，不能作为正式游戏结算逻辑：

- 金币、训练、金库存取只存在 React state 中；
- 刷新页面后所有数值恢复初始值；
- 战斗伤害不会实际改变角色生命和金币；
- 仇恨、战报、排行榜均为静态示例数据；
- 好友房间只展示“局域网预览”，尚未实现房间发现或 WebSocket；
- PWA Manifest、Service Worker、离线缓存尚未实现；
- 没有登录、注册、账号绑定和推送通知；
- 没有后端服务、SQLite、Drizzle、Fastify 或真实 API。

UI 中出现“真实房间联机将在后续版本接入”等提示，是有意保留的产品边界，接入后端后应删除或改为真实连接状态。

## 七、下一阶段建议

### 7.1 先完成仇恨页面改版

用户曾要求把“仇恨”页面调整为参考图片样式，但当前会话无法读取图片文件：

```text
/Users/zhaoy/Downloads/小游戏.png
```

因此目前没有根据图片完成视觉改版。接手时需要用户重新提供可读取的图片链接，或者用文字明确：背景、顶部区域、仇恨列表结构、头像、伤害/金币/时间字段、复仇按钮、悬赏按钮和底部导航。不要凭猜测声称已还原参考图。

### 7.2 建立前后端 Monorepo

按原始产品要求逐步增加：

- `apps/web`：React + TypeScript + Vite + Zustand；
- `apps/server`：Node.js + Fastify + WebSocket；
- `packages/shared`：共享类型、校验、数值配置和战斗规则；
- SQLite + Drizzle 迁移；
- 用户、角色、房间、房间成员、战斗、仇恨关系、钱包、流水、复活、训练、悬赏、通知等数据表。

所有金币、生命、行动力、战斗、复活和悬赏结算必须放到服务端；客户端只能提交意图并展示服务端结果。

### 7.3 优先打通三个验收场景

1. B 关闭页面后，A 偷袭 B；B 重连看到真实战报和剩余生命。
2. B 支付 100 金币赎身，A 收到 100 金币，重复提交不会重复扣款。
3. B 向 A 发起复仇，仇恨历史持续存在并正确标记复仇结果。

然后再补工资、打工、寻宝、训练、金库、悬赏、排行榜和局域网/互联网双模式。

## 八、容器与 Sealos 部署

### Docker

`Dockerfile` 使用两阶段构建：

1. `public.ecr.aws/docker/library/node:24-alpine` 构建 Vite 静态文件；
2. `public.ecr.aws/docker/library/nginx:1.28-alpine` 提供静态页面。

运行端口为 `8080`，健康检查路径为 `/healthz`。镜像内没有项目密钥，也没有持久化数据。

构建并推送：

```bash
docker login ccr.ccs.tencentyun.com
  -t ccr.ccs.tencentyun.com/tenvoice/gerous-game:v0.1.0 \
  --push .
```

当前镜像：

```text
ccr.ccs.tencentyun.com/tenvoice/gerous-game:v0.1.0
```

TCR 命名空间：`tenvoice`

仓库为私有仓库。不要把 Docker 登录密码、TCR token 或 Sealos kubeconfig 提交到 GitHub。

### Sealos

模板文件：`deploy/sealos.yaml`

模板当前使用：

- 1 个 Deployment 副本；
- CPU limit `200m`；
- Memory limit `256Mi`；
- 容器和 Service 端口 `8080`；
- TCR 私有镜像 Secret：`gerous-game-tcr`；
- HTTPS Ingress；
- 无持久化卷。

后续更新流程：

```bash
docker buildx build --platform linux/amd64 \
  -t ccr.ccs.tencentyun.com/tenvoice/gerous-game:v0.1.1 \
  --push .
```

然后在原 Sealos 应用 `gerous-game-ehlezgsv` 中更新镜像版本，继续使用原 Service、Ingress 和网络配置，这样公网地址保持不变。

正式接入数据库后，必须先设计持久化卷、备份和恢复流程，不能把 SQLite 数据放在当前无状态 Deployment 的容器文件系统中。

## 九、常用检查命令

```bash
git status
npm run build
docker buildx build --platform linux/amd64 -t <image> .

export KUBECONFIG=~/.sealos/kubeconfig
kubectl get deploy,svc,ingress
kubectl rollout status deployment/gerous-game-ehlezgsv
kubectl logs deployment/gerous-game-ehlezgsv --tail=100
curl -fsS https://gerous-game-ibppyqeh.sealoshzh.site/healthz
```

## 十、提交与发布记录

```text
fee47f3 feat: build interactive mobile home screen
22c77ec chore: containerize and deploy preview app
```

最近一次发布对应镜像 `v0.1.0` 和提交 `22c77ec`。本交接文档新增后需要单独提交并推送。
