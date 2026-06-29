import { contextBridge, ipcRenderer } from "electron";

function notImplemented(feature) {
  return async () => ({
    ok: false,
    reason: "not-implemented",
    error: `${feature} is reserved for the native release.`
  });
}

const NativeBridge = {
  version: "0.1.0",
  calendar: {
    requestAccess: () => ipcRenderer.invoke("calendar:requestAccess"),
    listCalendars: () => ipcRenderer.invoke("calendar:listCalendars"),
    createEvent: (event) => ipcRenderer.invoke("calendar:createEvent", event),
    updateEvent: (event) => ipcRenderer.invoke("calendar:updateEvent", event),
    deleteEvent: (eventId) => ipcRenderer.invoke("calendar:deleteEvent", eventId),
    syncRecords: (records) => ipcRenderer.invoke("calendar:syncRecords", records)
  },
  storage: {
    read: notImplemented("storage.read"),
    write: notImplemented("storage.write"),
    exportFile: notImplemented("storage.exportFile"),
    importFile: notImplemented("storage.importFile")
  },
  notifications: {
    requestPermission: notImplemented("notifications.requestPermission"),
    schedule: notImplemented("notifications.schedule"),
    cancel: notImplemented("notifications.cancel")
  },
  account: {
    getProfile: notImplemented("account.getProfile"),
    updateProfile: notImplemented("account.updateProfile"),
    getSubscription: notImplemented("account.getSubscription")
  },
  search: {
    index: notImplemented("search.index"),
    query: notImplemented("search.query")
  },
  file: {
    open: notImplemented("file.open"),
    save: notImplemented("file.save"),
    saveAs: notImplemented("file.saveAs")
  }
};

contextBridge.exposeInMainWorld("NativeBridge", NativeBridge);
