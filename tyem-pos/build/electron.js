const { app, BrowserWindow } = require('electron')
const path = require('node:path')



// Resolve the path to the current directory
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });
   // Load the index.html from the dist directory
  //  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html')).catch(err => {
  //   console.error("Failed to load index.html:", err);
  // });

   win.loadURL('https://ventrues.invenro.site');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
