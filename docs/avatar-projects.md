# 个人形象开源项目选型

- DiceBear Adventurer：https://www.dicebear.com/styles/adventurer/ 。卡通矢量五官、丰富发型、眼镜、耳饰。作者 Lisa Wischofsky，素材 CC BY 4.0，代码 MIT。当前采用，本地生成 SVG、不依赖远程头像 API；修改头部比例并加入鼻型，署名保留在编辑器。
- Avataaars Kit：https://github.com/VRB95/avataaars-kit 。React 19 组件，服装、发型和表情丰富，传统半身头像风格，MIT。
- React Nice Avatar：https://github.com/dapi-labs/react-nice-avatar 。MIT，小巧易接入，五官和服装可组合，风格更简洁。

当前实现：45 种发型、15 种眉毛、26 种眼睛、30 种嘴型、5 种眼镜、6 种耳饰、4 种面部点缀，可关闭配饰。8 种发色、6 种肤色、8 种服装颜色，另保留脸型、头型、鼻子、衣服和站姿。配置保存到现有 PostgreSQL 用户 profile。

依赖固定 @dicebear/core 9.4.3（包含 rotate 注入修复）、@dicebear/adventurer 9.4.2。渲染不接受任意 SVG、rotate 或远程图像，仅使用服务端校验的枚举与颜色。许可证见 AVATAR-LICENSE.txt。
