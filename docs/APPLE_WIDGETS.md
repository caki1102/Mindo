# Apple Desktop Widgets

Mindo can receive widget actions through deep links:

- `mindo://scene/{sceneId}` starts or stops the selected Scene.
- `mindo://timer/free` toggles the free floating timer.
- `mindo://calendar` opens Apple Calendar connection settings.

## Current status

The Electron app is configured to register the `mindo://` URL scheme. A WidgetKit Swift scaffold is included in:

```text
native/macos-widget/MindoWidget.swift
```

This scaffold provides:

- A Scenes widget that shows scene buttons.
- A Timer widget that controls the free timer.
- Deep-link actions back into the Mindo desktop app.

## What still requires Xcode

macOS desktop widgets must be built as a native WidgetKit extension. Electron cannot generate a real macOS widget by itself.

To finish the widget for App Store or notarized release:

1. Create a macOS app wrapper project in Xcode.
2. Add a Widget Extension target.
3. Copy `native/macos-widget/MindoWidget.swift` into that target.
4. Configure the shared App Group if the widget needs live scene data.
5. Let Mindo export scene data into the shared container.
6. Sign and notarize the app with an Apple Developer account.

The included scaffold is ready for the next native step, but it is not bundled into the current Electron DMG automatically.
