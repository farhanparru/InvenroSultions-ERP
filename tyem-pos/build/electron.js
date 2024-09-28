const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path'); // Required for resolving file paths
const { PosPrinter } = require('electron-pos-printer');


ipcMain.setMaxListeners(20);

// Resolve the path to the current directory
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required for newer Electron versions
    }
  });
  // //  Load the index.html from the dist directory
  //  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html')).catch(err => {
  //   console.error("Failed to load index.html:", err);
  // });

   win.loadURL('http://localhost:5173');

  // Open the developer tools for debugging
  win.webContents.openDevTools();


   win.webContents.getPrinters().forEach((printer) => {
    console.log(printer.name);
  });
}

app.whenReady().then(() => {
  createWindow();

  

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Clean up existing listeners before adding new ones
ipcMain.removeAllListeners('print');

ipcMain.on('print', (event, arg) => {
 
  const data = JSON.parse(arg)

  PosPrinter.print(data, {
    printerName: 'POS-80', // Change this to your printer name
    silent: true,
    preview: false,
  })
    .then(() => console.log('Print job sent successfully'))
    .catch((error) => console.log('Print failed: ', error));
});

app.on('window-all-closed', () => {
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
