import Storage from '../storage/storage';

let instance = null

export default class Workers {
    constructor() {
        console.log('Workers::constructor')

        this.init()
    }

    init() {
        this.addEventListeners()
    }

    addEventListeners() {
        window.addEventListener('windows.ready', () => {
            this.start()
        })
    }

    start() {
        this.startClock()
    }

    startClock() {
        setTimeout(() => {
            const workerClock = new Worker(new URL('./datetime.js', import.meta.url))
            workerClock.postMessage({ timestamp: Storage.getInstance().getCurrentTimeTimestamp() })
            workerClock.addEventListener('message', e => {
                Storage.getInstance().setCurrentTimeByTimestamp(e.data.timestamp)
                window.dispatchEvent(new CustomEvent('windows.datetime.update', { detail: { data: e.data } }))
            })
        }, 10)
    }

    static getInstance() {
        // console.log('Workers::getInstance')
        if (instance === null) {
            instance = new Workers(...arguments)
        }

        return instance
    }

}
