class Tabs {

    constructor() {
        console.log('Tabs::constructor')

        this.loaded = false
        this.id = 'svg-icons'

        this.init()
    }

    init() {
        this.addEventListeners()
    }

    addEventListeners() {

        document.on('click', '[role=tab]', e => {
            this.changeActiveTab(e.target)
        })
    }

    changeActiveTab(tab) {
        let tabs = tab.closest('[role=tabs]'),
            target = tab.getAttribute('aria-controls')

        if (0 < tabs.querySelectorAll('[role=tab]').length) {
            for (let node of tabs.querySelectorAll('[role=tab]')) {
                node.setAttribute('aria-selected', 'false')
            }
        }
        if (0 < tabs.querySelectorAll('[role=tabpanel]').length) {
            for (let node of tabs.querySelectorAll('[role=tabpanel]')) {
                node.setAttribute('hidden', 'true')
            }
        }

        tab.setAttribute('aria-selected', 'true')
        tabs.querySelector(`[role=tabpanel][aria-control-id="${target}"]`).removeAttribute('hidden')
    }
}

new Tabs()
