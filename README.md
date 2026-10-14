# 仇恨体系

React 19 + TypeScript + Vite 手机游戏原型，Express + PostgreSQL 同源后端。线上地址：https://gerous-game-ibppyqeh.sealoshzh.site/

## 运行

Node.js 22+。`npm install`，配置 `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE` 后 `npm run server`；另一个终端 `npm run dev`，API 代理到 8080。`npm run build` 生成 dist。生产必须运行 Node 后端，不能仅部署静态文件。

## 角色与换装

「我的 → 我的角色与衣橱」或首页全身角色进入。提供选择、换装、背包、详情四个页面，6 个角色（男女各3），发型、上衣、下装、鞋子、帽子、饰品、武器7类。点击物品实时分层预览，未拥有物品购买后永久入库，保存穿戴后属性生效。支持卸下、默认搭配、角色滑动切换。

- 配置：`shared/characters.json`。
- 前端：`src/characters/`，原生 SVG 分层，无复杂 3D 引擎。
- 原始素材：`public/characters/source/`；`python3 scripts/generate-character-assets.py` 可重建配置和素材（编辑配置后不要盲目重建）。
- 服务端：`server/wardrobe.mjs`，钱包、库存、交易流水、人物外观分表；事务锁钱包，服务端验证价格和库存归属。
- `/api/character` GET/PUT，`/api/character/buy` POST，`/api/game` GET，`/api/game/action` POST。
- 离线支持已拥有搭配本机保存；联网按 revision 校验同步，冲突需要在衣橱处理。离线购买和金币操作禁用。Service Worker 缓存页面及角色素材，不缓存 API。

当前美术是原创可编辑 SVG **功能占位素材**，不是最终精致 3D Q 版渲染。缺失资产及统一制作规格见 `docs/character-art-spec.md`，版权来源见 `docs/character-asset-provenance.json`。未复制参考项目美术。

## 游戏数据与限制

手机号密码账号、记住登录90天、好友邀请关系已存 PostgreSQL。钱包、训练、食物、卡片、装备和 HP 都由服务端保存；基础 HP 100，每分钟恢复0.5，装备可增加上限。现有战斗仍是演示规则，未完成双方实时 PVP 结算。手机号归属验证与找回密码未接入。

## 验证

`npm run build`；`node tests/character-assets.mjs` 验证34个SVG并生成六角色组合图。`TEST_BASE=http://localhost:8080 TEST_PHONE=<独立测试手机号> node tests/wardrobe.mjs` 验证交易、库存、属性、存档和冲突。API 测试会创建账号并修改其钱包，仅使用测试账号/数据库。

## 部署

`Dockerfile` 构建前端并运行 Node，同源端口8080。镜像必须 linux/amd64。模板 `deploy/sealos.yaml`，已部署应用更新补丁 `deploy/backend-patch.json`。原应用 `gerous-game-ehlezgsv`，数据库 `gerous-users-db-20261014-pg`（3Gi PVC）；凭据通过 Kubernetes Secret 注入，不提交到仓库。
