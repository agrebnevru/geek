// preload.js

const { contextBridge, ipcRenderer } = require('electron')

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

    for (let dependency of ['chrome', 'node', 'electron']) {
        document.documentElement.dataset[`versions_${dependency}`] = process.versions[dependency]
        let elements = document.querySelectorAll(`.js-version-${dependency}`)
        for (let element of elements) {
            element.innerText = process.versions[dependency]
        }
    }

    contextBridge.exposeInMainWorld('electronApi', {
        shutdown: () => ipcRenderer.invoke('shutdown'),
        restart: () => ipcRenderer.invoke('restart'),
        storageLoad: () => ipcRenderer.invoke('storage-load'),
        storageSave: data => ipcRenderer.invoke('storage-save', data),
        getSvgIcons: () => ipcRenderer.invoke('get-svg-icons'),
        getTemplatesList: () => ipcRenderer.invoke('get-templates'),
        getProgramsList: () => ipcRenderer.invoke('get-programs-list'),
        getProgramTemplates: programName => ipcRenderer.invoke('get-program-templates', programName),
        request: url => ipcRenderer.send('request', url),
    })
})
