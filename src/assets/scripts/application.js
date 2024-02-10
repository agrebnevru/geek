import Storage from './storage/storage';
import PcStarter from './pcstarter';

let instance = null

export default class Application {

    constructor() {
        console.log('Application::constructor')

        this.init()
    }

    init() {
        // console.log('Application::init')

        this.addEventListeners()
    }

    addEventListeners(name) {
        // console.log('Application::addEventListeners')

        document.on('click', '.js-app-load', () => {
            // this.load()
            this.restart()
        })

        document.on('click', '.js-app-save', () => {
            this.save()
        })

        document.on('click', '.js-app-save-and-shutdown', () => {
            this.saveAndShutdown()
        })

        document.on('click', '.js-app-shutdown', () => {
            this.shutdown()
        })

        document.on('click', '.js-app-save-and-restart', () => {
            this.saveAndRestart()
        })

        document.on('click', '.js-app-restart', () => {
            this.restart()
        })

        document.on('click', '.js-app-lock', () => {
            this.lock()
        })

        window.addEventListener('storage.load.after', () => {
            this.addBodyCssClasses()
        }, { once: true })
    }

    addBodyCssClasses() {
        // console.log('Application::saveAndShutdown')

        let storage = Storage.getInstance(),
            os = storage.getOsId(),
            theme = storage.getOsTheme()

        document.documentElement.classList.add(`ui-os--${os}`)
        document.documentElement.classList.add(`ui-theme--${theme}`)
    }

    async saveAndShutdown() {
        // console.log('Application::saveAndShutdown')

        await this.save()
        await this.shutdown()
    }

    async saveAndRestart() {
        // console.log('Application::saveAndRestart')

        await this.save()
        await this.restart()
    }

    async save() {
        // console.log('Application::save')

        await Storage.getInstance().save()
    }

    async load() {
        // console.log('Application::load')

        await Storage.getInstance().load()
    }

    shutdown() {
        // console.log('Application::shutdown')

        PcStarter.getInstance().startPcShutdown(false)

        setTimeout(async () => {
            await window.electronApi.shutdown()
        }, 5000)
    }

    restart(options = {}) {
        // console.log('Application::restart')

        if (true === options?.immediate) {
            setTimeout(async () => {
                await window.electronApi.restart()
            }, 10)
            
            return
        }

        PcStarter.getInstance().startPcShutdown(false, {customText: 'Перезагрузка'})

        setTimeout(async () => {
            await window.electronApi.restart()
        }, 5000)
    }

    lock() {
        // console.log('Application::lock')

        PcStarter.getInstance().startOsLock(false, { updateCLock: true, form: true })
    }

    showLoading() {
        // console.log('Application::showLoading')

    }

    hideLoading() {
        // console.log('Application::hideLoading')

    }

    static getInstance() {
        // console.log('Application::getInstance')
        if (instance === null) {
            instance = new Application(...arguments)
        }

        return instance
    }

}
