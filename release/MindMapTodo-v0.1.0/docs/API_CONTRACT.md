# API Contract

本文件定义正式 App 版本需要保留的接口。当前 HTML 原型可以先在浏览器中运行，后续桌面端、移动端或云端实现时，只需要把这些接口接到真实服务即可。

## 全局对象

桌面壳通过 `electron/preload.js` 暴露：

```js
window.NativeBridge
```

所有接口返回统一结构：

```js
{
  ok: boolean,
  data?: unknown,
  error?: string,
  reason?: string
}
```

## Calendar

用于 Apple Calendar、系统日历或云日历同步。

当前 Electron/macOS 桌面壳已经实现 Apple Calendar 基础同步：第一次读取或写入时，macOS 会弹出系统授权提示。用户允许后，Check-in 和 Timer 记录会尝试创建对应的 Calendar 事件。静态浏览器版不能直接访问 Apple Calendar，这是浏览器沙盒限制。

如果同步没有出现，请检查：

- System Settings -> Privacy & Security -> Automation，允许本应用控制 Calendar。
- System Settings -> Privacy & Security -> Calendars，如系统显示本应用，请允许访问。
- 目标日历名称是否存在；如果找不到指定日历，桌面壳会回退到第一个可用日历。

```js
NativeBridge.calendar.requestAccess()
NativeBridge.calendar.listCalendars()
NativeBridge.calendar.createEvent(event)
NativeBridge.calendar.updateEvent(id, patch)
NativeBridge.calendar.deleteEvent(id)
NativeBridge.calendar.syncRecords(records)
```

事件结构：

```js
{
  id?: string,
  title: string,
  start: string,
  end?: string,
  type: "checkin" | "timer" | "todo" | "node" | "scene",
  calendarId?: string,
  sceneId?: string,
  projectId?: string,
  nodeId?: string,
  notes?: string,
  color?: string
}
```

## Storage

用于本地数据、导入导出和云同步前的缓存。

```js
NativeBridge.storage.read()
NativeBridge.storage.write(state)
NativeBridge.storage.exportFile(state)
NativeBridge.storage.importFile()
```

## Notifications

用于 Todo 截止提醒、Timer 提醒、重复任务提醒。

```js
NativeBridge.notifications.requestPermission()
NativeBridge.notifications.schedule(notification)
NativeBridge.notifications.cancel(id)
```

通知结构：

```js
{
  id: string,
  title: string,
  body?: string,
  at: string,
  repeat?: "none" | "daily" | "weekly" | "monthly"
}
```

## Account

用于账号、会员、邮箱、手机和同步状态。

```js
NativeBridge.account.getProfile()
NativeBridge.account.updateProfile(profile)
NativeBridge.account.getSubscription()
```

## Search

用于全局搜索：Todo、节点、项目、场景、时间线记录、收藏夹内容。

```js
NativeBridge.search.index(payload)
NativeBridge.search.query(keyword)
```

## File

用于导入图片、导出项目、保存备份。

```js
NativeBridge.file.open(options)
NativeBridge.file.save(options)
NativeBridge.file.saveAs(options)
```

## Future Cloud API

正式云端服务建议保留 REST 或 GraphQL 层：

```text
GET    /api/me
PATCH  /api/me
GET    /api/workspaces
POST   /api/workspaces
GET    /api/projects/:id
PATCH  /api/projects/:id
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/timeline
POST   /api/timeline
GET    /api/stats
POST   /api/sync
```

## Notes

- Electron/macOS 环境下，Calendar 接口会通过系统 Calendar 应用写入事件。
- 浏览器环境下没有系统日历权限，Calendar 同步会自动跳过。
- Storage、Notifications、Account、Search、File 仍是预留接口，后续可以接本地数据库、云同步或原生系统能力。
