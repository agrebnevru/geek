const Mustache = require('mustache')

import Storage from '../storage/storage';
import Templates from '../templates/templates';
import Programs from '../programs/programs'
import WindowDraggable from './window-draggable'
import WindowResizer from './window-resizer'

let instance = {}

export default class Window {

    constructor(programName) {
        console.log('Window::constructor')
        // console.log('programName =', programName)

        this.active = false
        this.closeTimeoutId = 0
        this.domElement = null
        this.domElementBody = null
        this.programName = programName
        this.programManifest = Storage.getInstance().getProgramManifestByName(programName)
        this.programEntity = Storage.getInstance().getProgramEntityByName(programName)
        this.windowSelector = `.js-window[data-program-name="${this.programName}"]`
        this.rendered = false

        this.defaultWindowSettings = {
            resizable: true,
            graggable: true,
            toolbarShow: true,
            toolbarName: true,
            toolbarIcon: true,
            toolbarTitle: true,
            toolbarButtonsShow: true,
            toolbarButtonsMinimize: true,
            toolbarButtonsMaximize: true,
            toolbarButtonsClose: true,
            sizeFullsize: true,
            windowStyle: "",
        }

        this.init()
    }

    init() {
        // console.log('Window::init')

        this.initSettings()
        // this.addEventListeners() // after mount
    }

    addEventListeners() {
        // console.log('Window::addEventListeners')

        this.domElement.on('mousedown', '.js-window-draggabler', WindowDraggable.draggable)
        this.domElement.on('ontouchstart', '.js-window-draggabler', WindowDraggable.draggable)

        this.domElement.on('mousedown', '.js-window-resizable-top', WindowResizer.resizeYNegative(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-bottom', WindowResizer.resizeYPositive(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-left', WindowResizer.resizeXNegative(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-right', WindowResizer.resizeXPositive(this.domElement))

        this.domElement.on('mousedown', '.js-window-resizable-corner-top-left', WindowResizer.resizeXNegative(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-corner-top-left', WindowResizer.resizeYNegative(this.domElement))

        this.domElement.on('mousedown', '.js-window-resizable-corner-top-right', WindowResizer.resizeXPositive(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-corner-top-right', WindowResizer.resizeYNegative(this.domElement))

        this.domElement.on('mousedown', '.js-window-resizable-corner-bottom-right', WindowResizer.resizeXPositive(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-corner-bottom-right', WindowResizer.resizeYPositive(this.domElement))

        this.domElement.on('mousedown', '.js-window-resizable-corner-bottom-left', WindowResizer.resizeXNegative(this.domElement))
        this.domElement.on('mousedown', '.js-window-resizable-corner-bottom-left', WindowResizer.resizeYPositive(this.domElement))

        this.domElement.on('dblclick', '.js-window-resizable-doubleclick', e => {
            Programs.getInstance().fullsize(e.target)
        })
    }

    initSettings() {
        // console.log('Window::initSettings')

        let progSettings = this.programEntity.getWindowSettings()
        if (0 === Object.values(progSettings).length) {
            return
        }

        for (let optionName in this.defaultWindowSettings) {
            if (false === progSettings.hasOwnProperty(optionName)) {
                continue
            }

            this.defaultWindowSettings[optionName] = progSettings[optionName]
        }
    }

    open() {
        // console.log('Window::open')

        if (true === this.active) {
            this.animate('maximize')
            return
        }

        this.mount()
        this.programEntity.open()

        this.animate('open')

        this.active = true
    }

    close() {
        // console.log('Window::close')

        this.animate('close')

        const close = () => {
            this.closeTimeoutId = setTimeout(() => {
                this.programEntity.close()
                this.unmount()
                this.unset()
            }, 50)
        }

        if (true === this.domElement.dataset.closeAnimation) {
            this.domElement.addEventListener('transitionend', () => {
                // console.log('transitionend')
                clearTimeout(this.closeTimeoutId)
                close()
            }, { once: true })
        } else {
            close()
        }
    }

    mount() {
        if (true === this.rendered) {
            return
        }
        // console.log('Window::mount')

        let data = {
            windowSettings: this.defaultWindowSettings,
            name: this.programName,
            focus: true,
            iconData: this.programManifest.iconData,
            title: this.programManifest.title,
        }

        const rendered = Mustache.render(Templates.getInstance().getByName('window'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)

        this.domElement = document.querySelector(this.windowSelector)
        this.domElement.dataset.window = this

        this.domElementBody = this.domElement.querySelector('.js-windows-body-render')

        this.rendered = true

        this.addEventListeners()
    }

    unmount() {
        // console.log('Window::unmount')
        this.domElement.remove()
    }

    unset() {
        // console.log('Window::unset')
        delete instance[this.programName]
    }

    minimize() {
        // console.log('Window::minimize')

        this.animate('minimize')
    }

    maximize() {
        // console.log('Window::maximize')

        this.animate('maximize')
    }

    fullsize() {
        // console.log('Window::fullsize')

        this.animate('fullsize')
    }

    setZindex(index) {
        // console.log('Window::setZindex')

        this.domElement.style.zIndex = index
    }

    setFocus(value = true) {
        // console.log('Window::setFocus')
        if (false !== value) {
            this.unsetFocusOther(this.programName)
        }
        this.focus = value
        this.getDomElement().dataset.focus = value
    }

    unsetFocusOther(name = '') {
        // console.log('Window::unsetFocusOther')

        setTimeout(function () {
            let elements = document.querySelectorAll(`.js-window:not([data-program-name="${name}"])`)
            if (0 === elements.length) {
                return
            }

            for (let node of elements) {
                if (name === node.dataset.programName) {
                    continue
                }


                Window.getInstance(node.dataset.programName).setFocus(false)
            }
        }, 10)
    }

    animate(type) {
        // console.log('Window::animate')

        setTimeout(() => {
            switch (type) {
                case 'open':
                    this.domElement.dataset.closed = false
                    break;
                case 'close':
                    this.domElement.dataset.closed = true
                    break;
                case 'minimize':
                    this.domElement.dataset.maximize = false
                    break;
                case 'maximize':
                    this.domElement.dataset.maximize = true
                    break;
                case 'fullsize':
                    this.domElement.dataset.fullsize = !('true' === this.domElement.dataset.fullsize)
                    break;
            }
        }, 50)
    }

    getDomElement() {
        return this.domElement
    }

    getDomElementBody() {
        return this.domElementBody
    }

    static getInstance(programName = '') {
        // console.log('Window::getInstance')
        if ('' === programName) {
            return null
        }

        if (!instance[programName]) {
            // console.log('Window - new instance')
            instance[programName] = new Window(...arguments)
        }

        return instance[programName]
    }

}
