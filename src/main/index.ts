import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { Database } from 'duckdb';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const url = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '../renderer/index.html')}`;
  mainWindow.loadURL(url);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Minimal IPC: test query to DuckDB
ipcMain.handle('db.test', async (_evt) => {
  const db = new Database();
  const conn = db.connect();
  const res = await conn.all("SELECT 1 AS ok");
  conn.close();
  return res;
});
