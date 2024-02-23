const Mustache = require('mustache')

import Newgame from '../newgame';
import Storage from '../storage/storage';
import Templates from '../templates/templates';
import Programs from '../programs/programs';
import Clock from './taskbar/clock';
import Lang from './taskbar/lang';
import Weather from './taskbar/weather';

let instance = null

export default class Taskbar {
    constructor() {
        console.log('Taskbar::constructor')

        this.renderSelector = '.js-taskbar-render'

        this.programs = {}

        this.init()
    }

    init() {
        // console.log('Taskbar::init')

        this.initModules()
        this.addEventListener()
    }

    addEventListener() {
        // console.log('Taskbar::addEventListener')
        document.querySelector(this.renderSelector).on('click', '.js-program-open', e => {
            // console.log('Taskbar - open program')
            // console.log(e.target)
            Programs.getInstance().open(e.target)
        })
    }

    initModules() {
        new Clock()
        new Lang()
        new Weather()
    }

    addProgram(name, program) {
        // console.log('Taskbar::addProgram')
        if (Storage.getInstance().taskbar.programs[name]) {
            return
        }

        Storage.getInstance().taskbar.programs[name] = program
        Storage.getInstance().taskbar.programs[name].sticky = true === program.iconPlaceVisibility.taskbar
        Storage.getInstance().taskbar.programs[name].closed = true
        Storage.getInstance().taskbar.programs[name].active = false

        this.order()
        this.render()
    }

    open(name = '', render = true) {
        if ('' === name || !Storage.getInstance().taskbar.programs[name]) {
            return
        }
        // console.log('Taskbar::open')

        Storage.getInstance().taskbar.programs[name].closed = false

        this.maximize(name)

        if (true === render) {
            this.render()
        }
    }

    close(name = '', render = true) {
        if ('' === name || !Storage.getInstance().taskbar.programs[name]) {
            return
        }
        // console.log('Taskbar::close')
        // console.log('name =', name)

        this.minimize(name, false)

        Storage.getInstance().taskbar.programs[name].closed = true

        if (true === render) {
            this.render()
        }
    }

    minimize(name = '', render = true) {
        if ('' === name || !Storage.getInstance().taskbar.programs[name]) {
            return
        }
        // console.log('Taskbar::minimize')

        Storage.getInstance().taskbar.programs[name].active = false

        if (true === render) {
            this.render()
        }
    }

    maximize(name = '', render = true) {
        if ('' === name || !Storage.getInstance().taskbar.programs[name]) {
            return
        }
        // console.log('Taskbar::maximize')

        this.minimizeOther(name)

        Storage.getInstance().taskbar.programs[name].active = true

        if (true === render) {
            this.render()
        }
    }

    minimizeOther(name = '', render = true) {
        // console.log('Taskbar::minimizeOther')
        for (let programName in Storage.getInstance().taskbar.programs) {
            if (programName === name) {
                continue
            }

            Storage.getInstance().taskbar.programs[programName].active = false
        }

        if (true === render) {
            this.render()
        }
    }

    setActive(name = '', render = true) {
        // console.log('Taskbar::setActive')

        this.maximize(name, render)
    }

    order() {
        // console.log('Taskbar::order')

        let start = {},
            end = {}

        for (let programName in Storage.getInstance().taskbar.programs) {
            if (true === Storage.getInstance().taskbar.programs[programName].sticky) {
                start[programName] = Storage.getInstance().taskbar.programs[programName]
            } else {
                end[programName] = Storage.getInstance().taskbar.programs[programName]
            }
        }

        Storage.getInstance().taskbar.programs = Object.assign(start, end)
    }

    render() {
        // console.log('Taskbar::render')

        if (true === Newgame.getInstance().isNewgame()) {
            return
        }
        
        let timestamp = Storage.getInstance().getCurrentTimeTimestamp(),
            currentDatetime = new Date(timestamp * 1000),
            dayDisplay = currentDatetime.getDate(),
            monthDisplay = Number(currentDatetime.getMonth()) + 1,
            yearDisplay = currentDatetime.getFullYear()

        if (10 > dayDisplay) {
            dayDisplay = '0' + dayDisplay
        }
        if (10 > monthDisplay) {
            monthDisplay = '0' + monthDisplay
        }

        let data = {
            rows: Object.values(Storage.getInstance().taskbar.programs),
            date: `${dayDisplay}.${monthDisplay}.${yearDisplay}`,
            time: currentDatetime.toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit' }),
        }
        // console.log('data =', data)

        const rendered = Mustache.render(Templates.getInstance().getByName('taskbar'), data)
        document.querySelector(this.renderSelector).innerHTML = rendered
    }

    static getInstance() {
        // console.log('Taskbar::getInstance')
        if (instance === null) {
            instance = new Taskbar(...arguments)
        }

        return instance
    }
}

window.addEventListener('windows.ready', e => {
    Taskbar.getInstance()
})
