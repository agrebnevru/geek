const Mustache = require('mustache')

import Storage from '../storage/storage';
import Programs from '../programs/programs';
import Templates from '../templates/templates';

let instance = null

export default class Mainmenu {
    constructor() {
        console.log('Mainmenu::constructor')

        this.renderSelector = '.js-mainmenu-render'

        this.init()
    }

    init() {
        // console.log('Mainmenu::init')

        this.addEventListener()
    }

    addEventListener() {
        // console.log('Mainmenu::addEventListener')

        window.addEventListener('templates.load.after', () => {
            this.render()

            document.on('click', '.js-mainmenu-toggle', () => {
                let value = !('true' === document.body.dataset.mainmenuClosed)
                document.body.dataset.mainmenuClosed = value
            })

            document.on('click', 'body', e => {
                if (null !== e.target.closest('.js-mainmenu') || null !== e.target.closest('.js-mainmenu-toggle')) {
                    return
                }

                document.body.dataset.mainmenuClosed = true

                if ('true' === document.querySelector('.js-mainmenu-shutdown').dataset.closeByOutsideClick) {
                    document.body.dataset.mainmenuShutdownClosed = true
                }
            })

            document.querySelector(this.renderSelector).on('click', '.js-program-open', e => {
                // console.log('Mainmenu - open program')
                Programs.getInstance().open(e.target)
                document.body.dataset.mainmenuClosed = true
            })

            document.on('click', '.js-mainmenu-shutdown-toggle', () => {
                let value = ('false' === document.body.dataset.mainmenuShutdownClosed)
                document.body.dataset.mainmenuShutdownClosed = value
                if (
                    'true' === document.querySelector('.js-mainmenu-shutdown').dataset.closeWhenShutdownOpen
                    && false === value
                ) {
                    document.body.dataset.mainmenuClosed = true
                }
            })
        }, { once: true })
    }

    render() {
        // console.log('Mainmenu::render')
        let programs = Object.values(Storage.getInstance().programs.rows),
            data = {
                name: Storage.getInstance().profile.name || 'Guest',
                programs: {
                    rows: [],
                },
                shutdown: {
                    rows: [
                        {
                            id: 'save',
                            label: 'Сохранить',
                            actionClass: 'js-app-save',
                            default: false,
                        },
                        {
                            id: 'load',
                            label: 'Загрузить последнее сохранение',
                            actionClass: 'js-app-load',
                            default: false,
                        },
                        {
                            id: 'lock',
                            label: 'Блокировка',
                            actionClass: 'js-app-lock',
                            default: false,
                        },
                        {
                            id: 'save-and-shutdown',
                            label: 'Сохранить и завершить работу',
                            actionClass: 'js-app-save-and-shutdown',
                            default: true,
                        },
                        {
                            id: 'shutdown',
                            label: 'Завершить работу',
                            actionClass: 'js-app-shutdown',
                            default: false,
                        },
                        {
                            id: 'save-and-restart',
                            label: 'Сохранить и перезагрузиться',
                            actionClass: 'js-app-save-and-restart',
                            default: false,
                        },
                        {
                            id: 'restart',
                            label: 'Перезагрузиться',
                            actionClass: 'js-app-restart',
                            default: false,
                        },
                    ],
                }
            }

        data.programs.rows = programs.filter(item => {
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
