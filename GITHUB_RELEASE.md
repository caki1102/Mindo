# GitHub Release Checklist

## Release title

```text
Mindo v0.1.0 Prototype
```

## Release description

```markdown
## Mindo v0.1.0 Prototype

Mindo is a mind-map-first planning and execution app. It helps you break down goals and projects with a visual mind map, then turn them into Daily Todo, Check-in, Timer, Timeline, Calendar and Statistics records.

This release is the first downloadable prototype package. It is suitable for product preview, UI review, interaction testing and future desktop packaging.

### Key Features

- Mind map based project and goal decomposition
- Daily Todo workflow
- Check-in and Timer task records
- Floating timer ball
- Timeline view for daily activity records
- Calendar and statistics views
- Scene management with icons, colors and timer/check-in modes
- Workspace, folder and project hierarchy
- Trash restore for deleted items
- macOS Apple Calendar bridge for Check-in and Timer records
- Reserved native interfaces for notifications, account, file, search and future cloud sync

### Download

Download the release asset for your platform:

```text
Mindo-v0.1.0.zip          Static prototype package
Mindo-*.dmg               macOS desktop installer
Mindo Setup *.exe         Windows desktop installer
app-debug.apk             Android prototype APK
```

### Installation / Usage

#### Static prototype

1. Download `Mindo-v0.1.0.zip`.
2. Unzip the file.
3. Open `app/index.html` in a browser.

This mode is best for quickly previewing the product interface and interactions.

#### Desktop development mode

If you want to run it as an Electron desktop app:

```bash
npm install
npm run start
```

To build a macOS desktop package:

```bash
npm run release:mac
```

To build a Windows desktop package:

```bash
npm run release:win
```

#### Android prototype APK

The Android APK is generated through Capacitor:

```bash
npx cap add android
npm run release:android
```

### Apple Calendar Sync

Apple Calendar sync only works in the Electron/macOS desktop build. The browser version, Windows EXE and Android APK cannot write to Apple Calendar through macOS permissions.

When the desktop app first reads or writes Calendar data, macOS may show a system permission dialog. After permission is approved, Check-in and Timer records can create matching events in Apple Calendar.

If sync does not work, check:

- `System Settings -> Privacy & Security -> Automation`
- Allow Mindo to control Calendar
- If macOS shows a Calendar permission item, allow Mindo to access Calendar

### Status

This is a prototype release. Core UI, interaction flow and release structure are ready. DMG, EXE and APK packaging are configured through GitHub Actions. Some native features are reserved for future implementation.
```

## Upload assets

Upload this generated file:

```text
release/Mindo-v0.1.0.zip
```
