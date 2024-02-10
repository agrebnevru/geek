export default class Clock {
    constructor() {
        console.log('Clock::constructor')

        this.init()
    }

    init() {
        // console.log('Clock::init')

        this.addEventListeners()
    }

    addEventListeners() {
        // console.log('Clock::addEventListeners')

        window.addEventListener('windows.datetime.update', e => {
            this.updateClock(e.detail.data)
        })
    }

    updateClock(data) {
        // console.log('Clock::updateClock')

        if (0 < document.querySelectorAll('.js-taskbar-clock-time').length) {
            document.querySelector('.js-taskbar-clock-time').innerHTML = data.timeDisplay
        }

        if (0 < document.querySelectorAll('.js-taskbar-clock-date').length) {
            document.querySelector('.js-taskbar-clock-date').innerHTML = data.dateFullDisplay
        }
    }

}
