# Mindo

一个以思维导图为项目拆解核心、以 Daily Todo 执行为入口的目标执行系统。

## 当前版本

`v0.1.1 Prototype Release`

当前版本已经整理为可发布结构：

- `app/index.html`：可直接打开的静态应用入口
- `assets/`：Mindo 应用图标源文件与 macOS / Windows 打包图标
- `outputs/mindo.html`：原始原型文件
- `electron/`：桌面应用壳，可打包为 macOS App，并已接入 Apple Calendar 桥接
- `native/macos-widget/`：macOS 桌面小组件 WidgetKit 模板
- `capacitor.config.json`：Android APK 壳配置
- `docs/API_CONTRACT.md`：系统日历、通知、账号、本地文件等接口预留说明
- `scripts/build-release.mjs`：生成 GitHub Release 下载包

## 功能范围

- 思维导图项目拆解
- Daily Todo
- Check-in / Timer
- 悬浮计时球
- 时间线
- 日历视图
- 统计视图
- 场景管理
- 设置页权限管理与 Apple Calendar 连接状态
- macOS 桌面小组件模板：场景启动与自由计时入口
- 工作区、文件夹、项目层级
- Trash 30 天恢复
- 节点收藏夹与资料侧栏

## 本地使用

直接打开：

```bash
open app/index.html
```

或打开原始原型：

```bash
open outputs/mindo.html
```

## 生成下载包

```bash
npm run release:static
```

生成后会得到：

```text
release/Mindo-v0.1.1.zip
```

这个压缩包可以上传到 GitHub Releases。

## 桌面应用打包

桌面壳已预留在 `electron/`。安装依赖后可运行：

```bash
npm install
npm run start
```

打包 macOS DMG：

```bash
npm run release:mac
```

打包 Windows EXE：

```bash
npm run release:win
```

打包 Android APK：

```bash
npx cap add android
npm run release:android
```

Apple Calendar 同步需要使用 macOS 桌面版运行。打开设置页后点击“连接 Apple Calendar”，macOS 会弹出系统授权；允许后，Mindo 会读取现有日历分类，Todo、Check-in 和 Timer 可以选择对应日历并创建事件。直接用浏览器打开 `app/index.html` 时，系统日历同步不会生效。

Android APK 当前用于原型预览。Apple Calendar 同步只适用于 macOS 桌面版；Android 未来需要接入 Android Calendar Provider 权限。

macOS 桌面小组件需要原生 WidgetKit 扩展。当前包内已提供 `native/macos-widget/MindoWidget.swift` 作为 Xcode 接入模板，详见 `docs/APPLE_WIDGETS.md`。

## 接口预留

当前原型主要运行在浏览器本地存储中。桌面版可通过 `electron/preload.js` 暴露的 `window.NativeBridge` 接入：

- Apple Calendar（macOS 桌面版已实现基础写入）
- 本地文件读写
- 系统通知
- 账号与会员
- 云同步
- 全局搜索索引

详细见 [docs/API_CONTRACT.md](docs/API_CONTRACT.md)。
