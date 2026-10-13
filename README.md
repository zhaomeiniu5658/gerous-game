# 仇恨体系

手机优先的社交策略小游戏。当前交付为**主界面可交互原型**，不是已上线的多人游戏。

## 运行

需要 Node.js 22 或以上版本。

```sh
npm install
npm run dev
```

电脑访问终端显示的地址；同一 Wi-Fi 的手机访问 `http://电脑局域网IP:5173`。本地防火墙需允许该端口。

```sh
npm run build
npm run preview
```

静态部署上传 `dist` 内容即可，资源采用相对路径，可部署到 GitHub Pages 子目录。

## 本版内容

- 苹果系浅色主界面、角色卡片、生命条、武力、金币和行动力。
- 首页、仇恨、战斗、资产四项导航。
- 训练、工资领取、金库存取的本地状态演示。
- 好友列表、战报、排行榜、通知、设置弹层。
- 自动战斗前冲、受击、伤害数字和血条动画演示。
- 手机安全区域、桌面布局、减少动态效果适配。

所有数据为示例，刷新会重置。战斗伤害用于动画预览，不修改真实资产。未接入登录、数据库、真实联机、后台通知或 PWA 离线缓存。后续真实业务计算必须迁移至服务端，不能沿用客户端演示交易作为权威结算。

技术：React、TypeScript、Vite、Motion、Lucide，自定义 CSS 设计系统。

## 容器与 Sealos 部署

项目提供 `Dockerfile`，构建阶段生成静态资源，运行阶段由 Nginx 在 `8080` 端口提供服务。当前版本没有数据库或需要持久化的服务端数据，因此不挂载存储；后续接入数据库时必须改用持久化卷并先备份数据。镜像中不包含环境密钥。

```sh
docker login ccr.ccs.tencentyun.com
docker buildx build --platform linux/amd64 \
  -t ccr.ccs.tencentyun.com/tenvoice/gerous-game:v0.1.0 \
  --push .
```

`deploy/sealos.yaml` 是 Sealos 应用模板，使用 TCR 私有镜像、`8080` 容器端口、HTTPS Ingress 和健康检查。私有仓库拉取凭据应在 Sealos 的应用配置中作为 Image Pull Secret 管理，不要提交到 Git。

当前公网预览：

<https://gerous-game-ibppyqeh.sealoshzh.site>

后续更新时，先构建新的 `vX.Y.Z` 镜像并推送 TCR，再在 Sealos 原应用 `gerous-game-ehlezgsv` 中更新镜像，继续沿用原 Service、Ingress 和访问地址。
