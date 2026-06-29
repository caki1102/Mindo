import { app, BrowserWindow, ipcMain, shell } from "electron";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execFileAsync = promisify(execFile);

function appleScriptString(value = "") {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function calendarName(value = "") {
  return String(value || "Home").replace(/^Apple Calendar\s*\/\s*/i, "").trim() || "Home";
}

function appleDateScript(value, varName) {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return `
set ${varName} to current date
set year of ${varName} to ${safeDate.getFullYear()}
set month of ${varName} to ${safeDate.getMonth() + 1}
set day of ${varName} to ${safeDate.getDate()}
set time of ${varName} to ${safeDate.getHours()} * hours + ${safeDate.getMinutes()} * minutes + ${safeDate.getSeconds()}
`;
}

async function runAppleScript(script) {
  if (process.platform !== "darwin") {
    return { ok: false, reason: "unsupported-platform", error: "Apple Calendar sync is only available on macOS." };
  }
  try {
    const { stdout } = await execFileAsync("osascript", ["-e", script], { timeout: 20000 });
    return { ok: true, value: stdout.trim() };
  } catch (error) {
    return {
      ok: false,
      reason: "calendar-script-failed",
      error: error.stderr?.trim() || error.message
    };
  }
}

async function createCalendarEvent(event = {}) {
  const start = new Date(event.start || event.date || Date.now());
  const end = new Date(event.end || start.getTime() + 15 * 60 * 1000);
  const script = `
${appleDateScript(start, "startDate")}
${appleDateScript(end, "endDate")}
tell application "Calendar"
  activate
  set targetName to ${appleScriptString(calendarName(event.calendar))}
  set targetCalendar to missing value
  repeat with eachCalendar in calendars
    if name of eachCalendar is targetName then
      set targetCalendar to eachCalendar
      exit repeat
    end if
  end repeat
  if targetCalendar is missing value then set targetCalendar to first calendar
  set newEvent to make new event at end of events of targetCalendar with properties {summary:${appleScriptString(event.title || "Mindo")}, start date:startDate, end date:endDate, description:${appleScriptString(event.notes || event.description || "")}}
  return uid of newEvent
end tell
`;
  const result = await runAppleScript(script);
  return result.ok ? { ok: true, eventId: result.value } : result;
}

async function updateCalendarEvent(event = {}) {
  if (!event.eventId) return createCalendarEvent(event);
  const start = new Date(event.start || event.date || Date.now());
  const end = new Date(event.end || start.getTime() + 15 * 60 * 1000);
  const script = `
${appleDateScript(start, "startDate")}
${appleDateScript(end, "endDate")}
tell application "Calendar"
  activate
  set targetUid to ${appleScriptString(event.eventId)}
  repeat with eachCalendar in calendars
    repeat with eachEvent in events of eachCalendar
      if uid of eachEvent is targetUid then
        set summary of eachEvent to ${appleScriptString(event.title || "Mindo")}
        set start date of eachEvent to startDate
        set end date of eachEvent to endDate
        set description of eachEvent to ${appleScriptString(event.notes || event.description || "")}
        return uid of eachEvent
      end if
    end repeat
  end repeat
end tell
return ""
`;
  const result = await runAppleScript(script);
  if (!result.ok) return result;
  return result.value ? { ok: true, eventId: result.value } : createCalendarEvent(event);
}

async function deleteCalendarEvent(eventId) {
  if (!eventId) return { ok: true, skipped: true };
  const script = `
tell application "Calendar"
  activate
  set targetUid to ${appleScriptString(eventId)}
  repeat with eachCalendar in calendars
    repeat with eachEvent in events of eachCalendar
      if uid of eachEvent is targetUid then
        delete eachEvent
        return "deleted"
      end if
    end repeat
  end repeat
end tell
return "missing"
`;
  const result = await runAppleScript(script);
  return result.ok ? { ok: true, status: result.value || "missing" } : result;
}

ipcMain.handle("calendar:requestAccess", async () => {
  const result = await runAppleScript('tell application "Calendar" to count of calendars');
  return result.ok ? { ok: true, calendars: Number(result.value) || 0 } : result;
});

ipcMain.handle("calendar:listCalendars", async () => {
  const result = await runAppleScript('tell application "Calendar" to return name of calendars');
  return result.ok ? { ok: true, calendars: result.value ? result.value.split(/,\\s*/) : [] } : result;
});

ipcMain.handle("calendar:createEvent", async (_event, payload) => createCalendarEvent(payload));
ipcMain.handle("calendar:updateEvent", async (_event, payload) => updateCalendarEvent(payload));
ipcMain.handle("calendar:deleteEvent", async (_event, eventId) => deleteCalendarEvent(eventId));
ipcMain.handle("calendar:syncRecords", async (_event, records = []) => {
  const results = [];
  for (const record of records) {
    results.push(record.eventId ? await updateCalendarEvent(record) : await createCalendarEvent(record));
  }
  return { ok: results.every((item) => item.ok), results };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    title: "Mindo",
    backgroundColor: "#f7f8fb",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadFile(path.join(__dirname, "..", "app", "index.html"));

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
