import Storage from './storage/storage';
import Application from './application';

let instance = null

export default class Newgame {

    constructor(data) {
        console.log('PcStarter::constructor')

        this._isNewGame = '' === Storage.getInstance().profile.name || 0 === Storage.getInstance().getCurrentTimeTimestamp()

        this.data = {}

        this.startStorage = {
            datetime: {
                timestamp: 788950800,  // 01.01.1995 12:00
            },
            os: {
                id: 'win95',
                theme: 'dark',
            },
            settings: {
                fullscreen: false,
                computerName: '',
                workgroup: '',
                computerDescription: '',
            },
            profile: {
                name: '',
                xpProgress: 0, // 0 to ∞
                xpMood: 50, // 0 to 100
            },
            wallet: {
                amount: 0,
            },
            work: {
                profession: 0,
            },
            hardware: {
                rows: {
                    powersupply: {},
                    motherboard: {},
                    cpu: {},
                    cooling: {},
                    ram: {},
                    hdd: {},
                    ssd: {},
                    videocard: {},
                    cdrom: {},
                    monitor1: {},
                    monitor2: {},
                    monitor3: {},
                    keyboard: {},
                    mouse: {},
                    sound: {},
                    printer: {},
                    scaner: {},
                },
            },
            programs: {
                rows: {},
                storage: {},
            },
            desktop: {
                programs: {},
            },
            taskbar: {
                programs: {},
            },
        }

        this.init()
    }

    init() {
        this.addEventListeners()
    }

    addEventListeners() {
        // console.log('Newgame::addEventListeners')

        document.on('click', '.js-newgame-prev-window, .js-newgame-next-window', e => {
            document.querySelector('.js-newgame').dataset.activeWindow = e.target.dataset.activeWindow
            this.goProgressBar()
        })

        document.on('click', '.js-newgame-exit', e => {
            Application.getInstance().shutdown()
        }, { once: true })

        document.on('click', '.js-newgame-start', e => {
            this.startMewGame()
        }, { once: true })
    }

    startMewGame() {
        // console.log('Newgame::startMewGame')

        this.prepareNewGame()
        Application.getInstance().restart({immediate: true})
    }

    resetProgressBar() {
        // console.log('Newgame::resetProgressBar')

        let index = document.querySelector(`.js-newgame`).dataset.activeWindow || 1,
            progressStep = 20,
            win = document.querySelector(`.js-newgame-window-${index}`),
            progressBar = win.querySelector('.js-newgame-progressbar'),
            progressBarValue = win.querySelector('.js-newgame-progressbar-value')

        if (!progressBar) {
            return
        }

        progressBar.dataset.progress = progressStep

        progressBarValue.innerHTML = `${progressStep}%`
        progressBarValue.style.width = `${progressStep}%`
    }

    goProgressBar() {
        // console.log('Newgame::goProgressBar')

        let index = document.querySelector(`.js-newgame`).dataset.activeWindow || 1,
            progressStep = 20,
            win = document.querySelector(`.js-newgame-window-${index}`),
            progressBar = win.querySelector('.js-newgame-progressbar'),
            progressBarValue = win.querySelector('.js-newgame-progressbar-value'),
            currentValue = Number(progressBar?.dataset?.progress || progressStep)

        if (!progressBar) {
            return
        }

        this.resetProgressBar()

        this.intervalId = setInterval(() => {
            if (100 === currentValue) {
                clearInterval(this.intervalId)
                if (0 < win.querySelectorAll('.js-newgame-start').length) {
                    let errorMessage = this.validateData()
                    if (null === errorMessage) {
                        win.querySelector('.js-newgame-start').removeAttribute('disabled')
                    } else {
                        if (0 < win.querySelectorAll('.js-newgame-prev-window').length) {
                            win.querySelector('.js-newgame-prev-window').removeAttribute('disabled')
                        }
                        alert(`While process installation we found few errors, last error: ${errorMessage}`)
                    }
                } else {
                    if (0 < win.querySelectorAll('.js-newgame-prev-window').length) {
                        win.querySelector('.js-newgame-prev-window').removeAttribute('disabled')
                    }
                    if (0 < win.querySelectorAll('.js-newgame-next-window').length) {
                        win.querySelector('.js-newgame-next-window').removeAttribute('disabled')
                    }
                    if (0 < win.querySelectorAll('.js-newgame-exit').length) {
                        win.querySelector('.js-newgame-exit').removeAttribute('disabled')
                    }
                }
                return
            }

            currentValue += progressStep

            progressBar.dataset.progress = currentValue

            progressBarValue.innerHTML = `${currentValue}%`
            progressBarValue.style.width = `${currentValue}%`
        }, 3000)
    }

    prepareNewGame() {
        // console.log('Newgame::prepareNewGame')

        this.modifyData()
        this.fillStorage()
    }

    modifyData() {
        // console.log('Newgame::modifyData')

        this.data['name'] = `${this.data.firstName} ${this.data.lastName}`.trim()
    }

    fillStorage() {
        // console.log('Newgame::fillStorage')

        Storage.getInstance().fillData(this.startStorage)
        Storage.getInstance().setProfileName(this.data.name)
        Storage.getInstance().setComputerName(this.data.computerName)
        Storage.getInstance().setWorkgroup(this.data.workgroup)
        Storage.getInstance().setComputerDescription(this.data.computerDescription)
        Storage.getInstance().save()
    }

    validateData() {
        // console.log('Newgame::validateData')

        let minNameLength = 3

        this.data = {
            firstName: document.querySelector('.js-newgame').querySelector('input[name="first_name"]').value,
            lastName: document.querySelector('.js-newgame').querySelector('input[name="last_name"]').value,
            computerName: document.querySelector('.js-newgame').querySelector('input[name="computer_name"]').value,
            workgroup: document.querySelector('.js-newgame').querySelector('input[name="workgroup"]').value,
            computerDescription: document.querySelector('.js-newgame').querySelector('input[name="computer_description"]').value,
        }

        if (minNameLength > this.data.firstName.length) {
            return `Minimal first name length - ${minNameLength} symbols`
        } else if ('' === this.data.computerName.length) {
            return `Computer name cant be empty`
        } else if ('' === this.data.workgroup.length) {
            return `Workgroup cant be empty`
        }

        return null
    }

    isNewgame() {
        return this._isNewGame
    }

    static getInstance() {
        // console.log('Newgame::getInstance')
        if (instance === null) {
            instance = new Newgame(...arguments)
        }

        return instance
    }

}
