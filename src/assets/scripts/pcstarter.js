const Mustache = require('mustache')

import Templates from './templates/templates';
import Storage from './storage/storage';
import Newgame from './newgame';

let instance = null

export default class PcStarter {

    constructor() {
        console.log('PcStarter::constructor')

        this.timePcLoading = 10000
        this.timeOsLoading = 15000

        this.timerIds = {}

        this.init()
    }

    init() {
        // console.log('PcStarter::init')

        if (false === Templates.getInstance().isLoaded()) {
            setTimeout(() => {
                this.init()
            }, 500)
            return
        }

        this.render()
        this.addEventListeners()
        this.startApp()

        this.startPcLoading()
        this.startNewgame()
        this.startOsLoading()
        this.finishPcLoading()
        this.startOsLock()
        this.finishOsLoading()
    }

    addEventListeners() {
        document.addEventListener('keydown', this.eventKeydown)

        window.addEventListener('windows.datetime.update', e => {
            this.updateClock(e.detail.data.datetimeEntity)
        })

        document.on('click', 'body[data-show-pc-loading="false"][data-show-os-loading="false"][data-show-os-lock="true"] .js-os-lock-show-form', e => {
            this.showForm()
        })

        document.on('click', '.js-os-lock-signin', e => {
            this.finishOsLock()
            this.unmount()
        }, { once: true })
    }

    startPcLoading() {
        // console.log('PcStarter::startPcLoading')

        this.renderPcLoading()

        this.start('showPcLoading', 'pcloading')
    }

    finishPcLoading(useTimeout = true) {
        // console.log('PcStarter::finishPcLoading')

        if (true === useTimeout) {
            this.timerIds['pcLoadingHide'] = setTimeout(() => {
                this.finish('showPcLoading', 'pcloading')
            }, this.timePcLoading)
        } else {
            this.finish('showPcLoading', 'pcloading')
        }
    }

    startNewgame(useTimeout = true, options = {}) {
        // console.log('PcStarter::startNewgame')
        if (false === Newgame.getInstance().isNewgame()) {
            return
        }

        this.renderNewgame()

        if (true === useTimeout) {
            this.timerIds['newgame'] = setTimeout(() => {
                this.start('newgame', 'newgame')
            }, this.timePcLoading - 100)
        } else {
            clearTimeout(this.timerIds['newgame'])
            this.start('newgame', 'newgame')
        }
    }

    startOsLoading(useTimeout = true) {
        // console.log('PcStarter::startOsLoading')
        if (true === Newgame.getInstance().isNewgame()) {
            return
        }

        this.renderOsLoading()

        if (true === useTimeout) {
            this.timerIds['osLoadingShow'] = setTimeout(() => {
                this.start('showOsLoading', 'osloading')
            }, this.timePcLoading - 100)
        } else {
            this.start('showOsLoading', 'osloading')
        }
    }

    finishOsLoading(useTimeout = true) {
        // console.log('PcStarter::finishOsLoading')
        if (true === Newgame.getInstance().isNewgame()) {
            return
        }

        if (true === useTimeout) {
            this.timerIds['osLoadingHide'] = setTimeout(() => {
                clearTimeout(this.timerIds['osLoadingShow'])
                this.finish('showOsLoading', 'osloading')
            }, this.timePcLoading + this.timeOsLoading)
        } else {
            clearTimeout(this.timerIds['osLoadingShow'])
            this.finish('showOsLoading', 'osloading')
        }
    }

    startOsLock(useTimeout = true, options = {}) {
        // console.log('PcStarter::startOsLoading')
        if (true === Newgame.getInstance().isNewgame()) {
            return
        }

        this.renderOsLock()

        if (false === options?.form) {
            document.querySelector('.js-os-lock').querySelector('.js-os-lock-show-form').classList.remove('js-os-lock-show-form')
        }
        if (true === options?.updateCLock) {
            this.updateClock()
        }

        if (true === useTimeout) {
            this.timerIds['osLockShow'] = setTimeout(() => {
                this.start('showOsLock', 'oslock')
            }, this.timePcLoading + this.timeOsLoading - 100)
        } else {
            clearTimeout(this.timerIds['osLockShow'])
            this.start('showOsLock', 'oslock')
        }
    }

    startPcShutdown(useTimeout = true, options = {}) {
        // console.log('PcStarter::startPcShutdown')

        this.renderPcShutdown()

        if (options?.customText) {
            document.querySelector('.js-pc-shutdown-text').innerHTML = options?.customText
        }

        if (true === useTimeout) {
            this.timerIds['pcShutdownShow'] = setTimeout(() => {
                this.start('showPcShutdown', 'pcshutdown')
            }, 10)
        } else {
            clearTimeout(this.timerIds['pcShutdownShow'])
            this.start('showPcShutdown', 'pcshutdown')
        }
    }

    start(propName, eventName) {
        this.startFinish(propName, true, `${eventName}.start`)
    }

    finish(propName, eventName) {
        this.startFinish(propName, false, `${eventName}.finish`)
    }

    startFinish(propName, propValue, eventName) {
        document.body.dataset[propName] = propValue

        window.dispatchEvent(new Event(`pcstarter.${eventName}`))
    }

    showForm() {
        document.querySelector('.js-os-lock').dataset.showForm = true
    }

    finishOsLock() {
        document.body.dataset.showOsLock = false
    }

    registerRemovier() {
        setTimeout(() => {
            this.init()
        }, 500)
    }

    render() {
        // this.renderPcLoading()
        // this.renderOsLoading()
        // this.renderOsLock()
    }

    renderPcLoading() {
        // console.log('PcStarter::renderPcLoading')
        if (document.querySelector('.js-pc-loading')) {
            return
        }

        let data = {
            versions: {
                node: document.documentElement.dataset.versions_node,
                chrome: document.documentElement.dataset.versions_chrome,
                electron: document.documentElement.dataset.versions_electron,
            }
        }

        const rendered = Mustache.render(Templates.getInstance().getByName('pcstarter_pc_loading'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)
    }

    renderOsLoading() {
        // console.log('PcStarter::renderOsLoading')
        if (document.querySelector('.js-os-loading')) {
            return
        }

        let data = {}

        const rendered = Mustache.render(Templates.getInstance().getByName('pcstarter_os_loading'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)
    }

    renderNewgame() {
        // console.log('PcStarter::renderNewgame')
        if (document.querySelector('.js-newgame')) {
            return
        }

        let data = {}

        const rendered = Mustache.render(Templates.getInstance().getByName('pcstarter_newgame'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)
    }

    renderOsLock() {
        // console.log('PcStarter::renderOsLock')
        if (document.querySelector('.js-os-lock')) {
            return
        }

        let data = {
            time: '00:00',
            date: 'понедельник, 01 января',
            name: Storage.getInstance().profile.name,
        }

        const rendered = Mustache.render(Templates.getInstance().getByName('pcstarter_os_lock'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)
    }

    renderPcShutdown() {
        // console.log('PcStarter::renderPcShutdown')
        if (document.querySelector('.js-pc-shutdown')) {
            return
        }

        let data = {}

        const rendered = Mustache.render(Templates.getInstance().getByName('pcstarter_pc_shutdown'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)
    }

    updateClock(currentDate = null) {
        if (0 === document.querySelectorAll('.js-os-lock-clock-time').length && 0 === document.querySelectorAll('.js-os-lock-clock-date').length) {
            return
        }
        // console.log('PcStarter::updateClock')

        if (null === currentDate || !currentDate) {
            currentDate = new Date(Storage.getInstance().datetime.timestamp * 1000)
        }
        let dayName = currentDate.toLocaleDateString({}, { weekday: 'long' })
        let day = currentDate.getDate()
        if (10 > day) {
            day = '0' + day
        }
        let month = currentDate.toLocaleDateString({}, { month: 'short' })
        let date = `${dayName}, ${day} ${month}`
        let time = currentDate.toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit', })

        if (document.querySelector('.js-os-lock-clock-time')) {
            document.querySelector('.js-os-lock-clock-time').innerHTML = time
        }
        if (document.querySelector('.js-os-lock-clock-date')) {
            document.querySelector('.js-os-lock-clock-date').innerHTML = date
        }
    }

    unmount() {
        setTimeout(() => {
            if (0 < document.querySelectorAll('.js-pc-loading').length) {
                document.querySelector('.js-pc-loading').remove()
            }
            if (0 < document.querySelectorAll('.js-os-loading').length) {
                document.querySelector('.js-os-loading').remove()
            }
            if (0 < document.querySelectorAll('.js-os-lock').length) {
                document.querySelector('.js-os-lock').remove()
            }
        }, 1000)
    }

    startApp() {
        document.body.dataset.off = ""
    }

    eventKeydown(e) {
        // console.log('PcStarter::eventKeydown')
        if ('Escape' !== e.key) {
            return
        }

        if ('true' === document.body.dataset.showPcLoading) {
            PcStarter.getInstance().startOsLoading(false)
            PcStarter.getInstance().finishPcLoading(false)
        } else if ('true' === document.body.dataset.showOsLoading) {
            PcStarter.getInstance().startNewgame(false)
            PcStarter.getInstance().startOsLock(false)
            PcStarter.getInstance().finishOsLoading(false)
        }
    }

    static getInstance() {
        // console.log('PcStarter::getInstance')
        if (instance === null) {
            instance = new PcStarter(...arguments)
        }

        return instance
    }

}
