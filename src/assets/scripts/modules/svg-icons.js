import Storage from '../storage/storage';

class SvgIcons {

    constructor() {
        console.log('SvgIcons::constructor')

        this.loaded = false
        this.id = 'svg-icons'

        this.init()
    }

    init() {
        this.addEventListeners()
    }

    addEventListeners() {

        window.addEventListener('windows.ready', e => {
            this.load()
        })

    }

    async load() {
        // console.log('SvgIcons::load')
        let icons = await window.electronApi.getSvgIcons(),
            os = Storage.getInstance().getOsId()

        // console.log('icons =', icons)
        document.getElementById(this.id).innerHTML = icons[os]
        this.afterLoad()
    }

    afterLoad() {
        this.loaded = true
    }
}

new SvgIcons()