const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 3000);
});

// ===== أحداث التحديث =====

autoUpdater.on('checking-for-update', () => {
  win.webContents.send('update-status', '🔍 جاري الفحص...');
});

autoUpdater.on('update-available', (info) => {
  win.webContents.send('update-status', `⬇️ تحديث متاح: ${info.version} — جاري التحميل`);
});

autoUpdater.on('update-not-available', () => {
  win.webContents.send('update-status', '✅ التطبيق محدث');
});

autoUpdater.on('download-progress', (progress) => {
  win.webContents.send('update-status', `⬇️ جاري التحميل: ${Math.round(progress.percent)}%`);
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update-status', '✅ اكتمل التحديث — جاري إعادة التشغيل...');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 3000);
});

autoUpdater.on('error', (err) => {
  win.webContents.send('update-status', `❌ خطأ: ${err.message}`);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});