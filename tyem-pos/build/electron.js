const {app, BrowserWindow, ipcMain} = require('electron')
const {PosPrinter} = require('electron-pos-printer');
const path = require('path');  // Corrected here
let win;

app.on('ready',()=>{
   win = new BrowserWindow({
     width:650,
     height:450,
     webPreferences:{
      nodeIntegration:true,
      contextIsolation: false  // Add this line if needed for newer Electron versions
     }
   })

   win.loadFile('src/index.html')
   win.webContents.openDevTools()
    // Log available printers to verify the correct printer name
  win.webContents.getPrinters().forEach(printer => {
    console.log(printer.name);
  });
})

ipcMain.on('print', (event, arg) => {
    // const data = JSON.parse(arg);
 
    const data = [
        {
            type: 'text',
            value: 'SAMPLE HEADING',
            style: { fontWeight: "700", textAlign: 'center', fontSize: "24px" }                                       // width of image in px; default: 50 or '50px'
        },
        {
          type: 'text',
          value: 'SAMPLE HEADING',
          style: { fontWeight: "700", textAlign: 'center', fontSize: "24px" }
        },
        {
          type: 'text',
          value: 'Secondary text',
          style: { textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red" }
        },
        {
          type: 'barCode',
          value: '023456789010',
          height: 40,
          width: 2,
          displayValue: true,
          fontsize: 12,
        },
        {
          type: 'qrCode',
          value: 'https://github.com/Hubertformin/electron-pos-printer',
          height: 55,
          width: 55,
          style: { margin: '10 20px 20 20px' }
        },
        {
          type: 'table',
          style: { border: '1px solid #ddd' },
          tableHeader: ['Animal', 'Age'],
          tableBody: [
            ['Cat', 2],
            ['Dog', 4],
            ['Horse', 12],
            ['Pig', 4],
          ],
          tableFooter: ['Animal', 'Age'],
          tableHeaderStyle: { backgroundColor: '#000', color: 'white' },
          tableBodyStyle: { 'border': '0.5px solid #ddd' },
          tableFooterStyle: { backgroundColor: '#000', color: 'white' },
        }
      ];
    
      PosPrinter.print(data, {
        printerName: 'POS-90',
        silent: true,
        preview: false
      })
      .then(() => console.log("Print job sent successfully"))
   .catch(error => console.error("Print failed: ", error));
      
 });