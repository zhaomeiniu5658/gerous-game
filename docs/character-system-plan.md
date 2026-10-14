# 角色换装系统实施

现有 React 19 + TypeScript + Vite，Express + PostgreSQL。保留主页面与账号认证，新增独立 SVG 分层角色模块；SVG 是项目已使用的原生技术，首版无需额外 WebGL/PixiJS 引擎。统一画布 1000×1600、正面站姿、固定装备锚点。

数据分离：shared/characters.json 角色与物品；public/characters/source 可编辑原创 SVG；角色保存表只含 characterId/equipped/revision；钱包、库存、购买流水独立表。服务端事务锁钱包，检查所有权、价格、角色适配，重复购买不再扣费。离线只预览、装备已拥有物品、保存搭配；禁止离线购买，联网后提交搭配并校验修订号，冲突要求选择。

阶段：①分析；②男女各一名、两套衣服、两件武器；③六角色与全部分类、购买背包属性；④美术替换接口、原始 SVG 与美术缺口清单；⑤购买并发、恢复、视口、失效素材测试。

参考 pjanaya/2d-character-creator 的 parts/partTypes 分离、VRoid 的离线制作工作流。未复制两项目美术。当前原创 SVG 为功能与锚点验证素材，不能宣称已经交付最终 3D 渲染级高清美术。
