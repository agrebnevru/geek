import Storage from '../storage/storage';
import Desktop from '../blocks/desktop';
import Taskbar from '../blocks/taskbar';
import Window from './window';

let instance = null

export default class Programs {

    constructor() {
        console.log('Programs::constructor')

        this.loaded = false
        this.rows = []
        this.layers = []

        this.init()
    }

    init() {
        // console.log('Programs::init')
        this.load()
        this.addEventListener()
    }

    addEventListener() {
        document.on('click', '.js-window-minimize', e => {
            this.minimize(e.target)
        })

        document.on('click', '.js-window-fullsize', e => {
            this.fullsize(e.target)
        })

        document.on('click', '.js-window-close', e => {
            this.close(e.target)
        })

        document.on('mousedown', '.js-window[data-focus=false]', e => {
            this.focus(e.target)
        })
    }

    open(target) {
        // console.log('Programs::open')
        let windowDom = target.closest('.js-program-open')

        let programEntity = Storage.getInstance().getProgramEntityByName(windowDom.dataset.programName)
        // console.log('programEntity =', programEntity)
        if (null === programEntity) {
            return
        }

        let window = Window.getInstance(windowDom.dataset.programName)
        window.open()
        window.setFocus()

        Taskbar.getInstance().open(windowDom.dataset.programName)

        this.layerAdd(windowDom.dataset.programName)
    }

    close(target) {
        // console.log('Programs::close')
        let windowDom = target.closest('.js-window')

        let programEntity = Storage.getInstance().getProgramEntityByName(windowDom.dataset.programName)
        // console.log('programEntity =', programEntity)
        if (null === programEntity) {
            return
        }
        // console.log('windowDom.dataset.programName =', windowDom.dataset.programName)

        let window = Window.getInstance(windowDom.dataset.programName)
        window.close()

        Taskbar.getInstance().close(windowDom.dataset.programName)

        // console.log('this.layers - before remove =', this.layers)
        this.layerRemove(windowDom.dataset.programName)
        // console.log('this.layers - after remove =', this.layers)

        let lastProgramName = this.getLastLayer()
        // console.log('lastProgramName =', lastProgramName)

        if ('' !== lastProgramName) {
            Taskbar.getInstance().setActive(lastProgramName)

            window = Window.getInstance(lastProgramName)
            window.setFocus()
        }
    }

    minimize(target) {
        // console.log('Programs::minimize')
        let windowDom = target.closest('.js-window')

        let programEntity = Storage.getInstance().getProgramEntityByName(windowDom.dataset.programName)
        // console.log('programEntity =', programEntity)
        if (null === programEntity) {
            return
        }

        let window = Window.getInstance(windowDom.dataset.programName)
        window.setFocus(false)
        window.minimize()

        Taskbar.getInstance().minimize(windowDom.dataset.programName)

        this.layerRemove(windowDom.dataset.programName)

        let lastProgramName = this.getLastLayer()
        if ('' !== lastProgramName) {
            Taskbar.getInstance().setActive(lastProgramName)

            window = Window.getInstance(lastProgramName)
            window.setFocus()
        }
    }

    maximize(target) {
        // console.log('Programs::maximize')
        let windowDom = target.closest('.js-window')

        let programEntity = Storage.getInstance().getProgramEntityByName(windowDom.dataset.programName)
        // console.log('programEntity =', programEntity)
        if (null === programEntity) {
            return
        }

        let window = Window.getInstance(windowDom.dataset.programName)
        window.maximize()

        // Taskbar.getInstance().maximize(windowDom.dataset.programName)

        // this.layerReindex(windowDom.dataset.programName)
    }

    fullsize(target) {
        // console.log('Programs::fullsize')
        let windowDom = target.closest('.js-window')

        let programEntity = Storage.getInstance().getProgramEntityByName(windowDom.dataset.programName)
        // console.log('programEntity =', programEntity)
        if (null === programEntity) {
            return
        }

        let window = Window.getInstance(windowDom.dataset.programName)
        window.fullsize()

        // Taskbar.getInstance().fullsize(windowDom.dataset.programName)

        // this.layerReindex(windowDom.dataset.programName)
    }

    focus(target) {
        // console.log('Programs::focus')
        let windowDom = target.closest('.js-window')

        if (target.closest('.js-window-close')) {
            return
        }

        let programEntity = Storage.getInstance().getProgramEntityByName(windowDom.dataset.programName)
        // console.log('programEntity =', programEntity)
        if (null === programEntity) {
            return
        }
        // console.log('[Programs::focus] program name =', windowDom.dataset.programName)

        this.layerReindex(windowDom.dataset.programName)

        Taskbar.getInstance().setActive(windowDom.dataset.programName)

        let window = Window.getInstance(windowDom.dataset.programName)
        window.setFocus()
    }

    layerAdd(programName) {
        // console.log('Programs::layerAdd')
        let index = this.layers.indexOf(programName)
        if (-1 !== index) {
            this.layers.splice(index, 1)
        }
        this.layers.push(programName)
        this.layerReindex()
    }

    layerRemove(programName) {
        // console.log('Programs::layerRemove')
        let index = this.layers.indexOf(programName)
        if (index !== -1) {
            this.layers.splice(index, 1)
        }
        this.layerReindex()
    }

    layerReindex(programName = '') {
        // console.log('Programs::layerReindex')
        if ('' !== programName) {
            let index = this.layers.indexOf(programName)
            if (index !== -1) {
                this.layers.splice(index, 1)
                this.layers.push(programName)
            }
        }

        let index = 0,
            window = null

        if (1 < this.layers.length) {
            for (let programName of this.layers) {

                window = Window.getInstance(programName)
                window.setZindex(index)

                index += 1
            }
        }
    }

    getLastLayer() {
        // console.log('Programs::layerReindex')
        return 0 < this.layers.length ? this.layers.at(-1) : ''
    }

    isFocused(programName) {
        return this.getLastLayer() === programName
    }

    async load() {
        // console.log('Programs::load')
        let list = await window.electronApi.getProgramsList()
        // console.log('list =', list)
        this.rows = list
        this.afterLoad()
    }

    async afterLoad() {
        // console.log('Programs::afterLoad')
        // console.log('this.rows =', this.rows)
        if (0 === this.rows?.rows?.lenth) {
            return
        }

        for (let program of this.rows.rows) {
            // console.log('program =', program)
            // let module = await import(`${program.localPath}`)
            let module = await import(`../../programs/${program.name}/main.js`)
            // window.App.programs[program.name] = module.default()
            program.entity = module.default(program)
            this.register(program)
        }

        this.loaded = true
    }

    register(program) {
        // console.log('Programs::register')
        // console.log('program =', program)
        Storage.getInstance().addProgram(program.name, program)

        if (true === program.iconPlaceVisibility.desktop) {
            Desktop.getInstance().addProgram(program.name, program)
        }

        Taskbar.getInstance().addProgram(program.name, program)
    }

    static getInstance() {
        if (instance === null) {
            instance = new Programs(...arguments)
        }

        return instance
    }

}
