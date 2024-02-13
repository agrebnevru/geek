const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const DIR_IMAGES = `${app.getAppPath()}/src/assets/images/`
const DIR_PROGRAMS = `${app.getAppPath()}/src/assets/programs/`
const DIR_TEMPLATES = `${app.getAppPath()}/src/assets/templates/`
const SAVE_FILE_NAME = 'save.data'
// const SAVE_FILE_PATH = `${path.dirname(app.getPath('exe'))}/${SAVE_FILE_NAME}`
const SAVE_FILE_PATH = `${app.getAppPath()}/${SAVE_FILE_NAME}`
let win = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit()
}

function shutdown() {
    // console.log('shutdown')
    app.quit()
}

function restart() {
    // console.log('restart')
    win.reload()
}

async function getProgramTemplates(e, os, programName) {
    // console.log('getProgramTemplates')
    // console.log('os =', os)
    // console.log('programName =', programName)
    let result = {},
        dirPath = `${DIR_PROGRAMS}${programName}/assets/templates/themes/${os}`,
        names = null,
        templatePath = null

    // console.log('dirPath =', dirPath)
    if (false === fs.existsSync(dirPath)) {
        return {}
    }
    // console.log('go read dir')

    names = fs.readdirSync(dirPath)
    // console.log('after read dir')
    // console.log('names =', names)

    if (0 < names.length) {
        for (let fileName of names) {
            templatePath = `${dirPath}/${fileName}`
            // console.log('templatePath =', templatePath)

            if (true === fs.lstatSync(templatePath).isDirectory()) {
                continue
            }
            // console.log('read it!')

            result[fileName.replace('.html', '')] = fs.readFileSync(templatePath, 'utf8')
        }
    }
    // console.log('result =', result)

    return result
}

async function getProgramsList(e, os) {
    // console.log('getProgramsList')
    // console.log('DIR_PROGRAMS =', DIR_PROGRAMS)
    // console.log('os =', os)
    let programs = {},
        programNames = fs.readdirSync(DIR_PROGRAMS),
        programPath = '',
        manifestPath = '',
        manifest = {}

    if (0 < programNames.length) {
        for (let programName of programNames) {
            programPath = `${DIR_PROGRAMS}${programName}`
            // console.log('programName =', programName)
            // console.log('programPath =', programPath)
            if (false === fs.lstatSync(programPath).isDirectory()) {
                continue
            }
            // console.log('is directory!')

            manifestPath = path.join(programPath, 'manifest.json')
            // console.log('manifestPath =', manifestPath)
            if (false === fs.existsSync(manifestPath)) {
                continue
            }
            // console.log('manifest exist!')

            manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

            if (
                true === Array.isArray(manifest?.os?.support)
                && 0 < manifest?.os?.support?.length
                && false === manifest?.os?.support.includes(os)
            ) {
                continue
            }

            manifest.system = manifest.system || false
            manifest.iconData = ``

            iconPath = path.join(`${programPath}/assets/images/themes/${os}`, 'icon.svg')
            if (true === fs.existsSync(iconPath)) {
                manifest.iconData = fs.readFileSync(iconPath, 'utf8')
            }

            programs['rows'] = programs['rows'] || []
            programs['rows'].push(manifest)
        }
    }
    // console.log('programs =', programs)

    return programs
}

async function getSvgIcons() {
    // console.log('getSvgIcons')
    let result = {},
        themeNames = fs.readdirSync(`${DIR_IMAGES}themes/`),
        iconsPath = null

    if (0 < themeNames.length) {
        for (let themeName of themeNames) {
            iconsPath = `${DIR_IMAGES}themes/${themeName}/svg-icons.svg`

            if (false === fs.existsSync(iconsPath)) {
                continue
            }

            let iconsKeyName = themeName
            result[iconsKeyName] = fs.readFileSync(iconsPath, 'utf8')
        }
    }

    return result
}

async function getTemplates(e, os) {
    // console.log('getTemplates')
    let result = {},
        templateNames = fs.readdirSync(DIR_TEMPLATES),
        themeNames = fs.readdirSync(`${DIR_TEMPLATES}themes/`),
        templatePath = ''

    if (0 < templateNames.length) {
        for (let templateName of templateNames) {
            templatePath = `${DIR_TEMPLATES}${templateName}`
            if (true === fs.lstatSync(templatePath).isDirectory()) {
                continue
            }

            let templateKeyName = templateName.replace('.html', '').replaceAll('-', '_')
            result[templateKeyName] = fs.readFileSync(templatePath, 'utf8')
        }
    }

    if (0 < themeNames.length) {
        for (let themeName of themeNames) {
            let themeTemplateNames = themeNames = fs.readdirSync(`${DIR_TEMPLATES}themes/${themeName}`)
            if (0 < themeTemplateNames.length) {
                for (let themeTemplateName of themeTemplateNames) {
                    templatePath = `${DIR_TEMPLATES}themes/${themeName}/${themeTemplateName}`
                    if (true === fs.lstatSync(templatePath).isDirectory()) {
                        continue
                    }

                    let templateKeyName = `theme_${themeName}_` + themeTemplateName.replace('.html', '').replaceAll('-', '_')
                    result[templateKeyName] = fs.readFileSync(templatePath, 'utf8')
                }
            }
        }
    }
    // console.log('getTemplates -> result =', result)

    return result
}

async function storageLoad() {
    // console.log('storageLoad')
    // SAVE_FILE_PATH
    let data = {}

    if (true === fs.existsSync(SAVE_FILE_PATH)) {
        data = JSON.parse(fs.readFileSync(SAVE_FILE_PATH, 'utf8'))
    }

    return data
}

async function storageSave(e, data) {
    // console.log('storageSave')

    fs.writeFileSync(SAVE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ipcMain.on('request', async (event, url) => {
//     console.log('main: request', event, url)

//     let response = await fetch(url)

//     if (false === response.ok) {
//         return {}
//     }

//     console.log('main: result', response.json())
//     return await response.json()
// })

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        // fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    })

    // and load the index.html of the app.
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    // Open the DevTools.
    win.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    ipcMain.handle('shutdown', shutdown)
    ipcMain.handle('restart', restart)
    ipcMain.handle('storage-load', storageLoad)
    ipcMain.handle('storage-save', storageSave)
    ipcMain.handle('get-programs-list', getProgramsList)
    ipcMain.handle('get-svg-icons', getSvgIcons)
    ipcMain.handle('get-templates', getTemplates)
    ipcMain.handle('get-program-templates', getProgramTemplates)

    createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
