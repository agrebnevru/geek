const Mustache = require('mustache')

import Storage from '../storage/storage';
import Programs from '../programs/programs';
import Templates from '../templates/templates';

let instance = null

export default class Mainmenu {
    constructor() {
        console.log('Mainmenu::constructor')

        this.renderSelectors = {
            full: '.js-mainmenu-render'
        }

        this.init()
    }

    init() {
        // console.log('Mainmenu::init')
        this.render()
        this.addEventListener()
    }

    addEventListener() {
        // console.log('Mainmenu::addEventListener')
        document.on('click', '.js-mainmenu-toggle', () => {
            document.body.dataset.mainmenuClosed = !('true' === document.body.dataset.mainmenuClosed)
        })

        document.on('click', 'body', e => {
            if (null !== e.target.closest('.js-mainmenu') || null !== e.target.closest('.js-mainmenu-toggle')) {
                return
            }

            document.body.dataset.mainmenuClosed = true
            if (0 < document.querySelectorAll('.js-mainmenu-shutdown').length) {
                document.querySelector('.js-mainmenu-shutdown').dataset.closed = true
            }
        })

        document.querySelector(this.renderSelectors.full).on('click', '.js-program-open', e => {
            // console.log('Mainmenu - open program')
            Programs.getInstance().open(e.target)
            document.body.dataset.mainmenuClosed = true
        })

        if (0 < document.querySelectorAll('.js-mainmenu-shutdown').length) {
            document.on('click', '.js-mainmenu-shutdown-toggle', () => {
                document.querySelector('.js-mainmenu-shutdown').dataset.closed = !('true' === document.querySelector('.js-mainmenu-shutdown').dataset.closed)
            })
        }
    }

    render() {
        // console.log('Mainmenu::render')
        let programs = Object.values(Storage.getInstance().programs.rows),
            data = {
                name: Storage.getInstance().profile.name || 'Guest',
                rows: [],
            }

        data.rows = programs.filter(item => {
            return true === item.iconPlaceVisibility.mainmenu && (true === item.installed || true === item.system)
        })

        const rendered = Mustache.render(Templates.getInstance().getByName('mainmenu'), data)
        document.body.insertAdjacentHTML('beforeend', rendered)
    }

    static getInstance() {
        // console.log('Mainmenu::getInstance')
        if (instance === null) {
            instance = new Mainmenu(...arguments)
        }

        return instance
    }
}

window.addEventListener('windows.ready', e => {
    Mainmenu.getInstance()
})
