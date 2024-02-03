const Mustache = require('mustache')

import Storage from '../storage/storage';
import Programs from '../programs/programs';
import Templates from '../templates/templates';

let instance = null

export default class Mainmenu
{
	constructor()
	{
        console.log('Mainmenu::constructor')

        this.renderSelectors = {
            full: '.js-mainmenu-render'
        }

        this.init()
    }

    init()
    {
        // console.log('Mainmenu::init')
        this.render()
        this.addEventListener()
    }

    addEventListener()
    {
        // console.log('Mainmenu::addEventListener')
        document.on('click', '.js-mainmenu-toggle', () => {
            document.querySelector('.js-mainmenu').dataset.closed = !('true' === document.querySelector('.js-mainmenu').dataset.closed)
        })
    
        document.on('click', 'body', e => {
            if (null !== e.target.closest('.js-mainmenu') || null !== e.target.closest('.js-mainmenu-toggle')) {
                return
            }
    
            document.querySelector('.js-mainmenu').dataset.closed = true
            document.querySelector('.js-mainmenu-shutdown').dataset.closed = true
        })

        document.querySelector(this.renderSelectors.full).on('click', '.js-program-open', e => {
            // console.log('Mainmenu - open program')
            // console.log(e.target)
            Programs.getInstance().open(e.target)
            document.querySelector('.js-mainmenu').dataset.closed = true
        })

        document.on('click', '.js-mainmenu-shutdown-toggle', () => {
            document.querySelector('.js-mainmenu-shutdown').dataset.closed = !('true' === document.querySelector('.js-mainmenu-shutdown').dataset.closed)
        })
    }

    render()
    {
        // console.log('Mainmenu::render')
        let programs = Object.values(Storage.getInstance().programs.rows),
            data = {
                name: Storage.getInstance().profile.name || 'Guest',
                rows: [],
            }

        // console.log('programs =', programs)

        data.rows = programs.filter(item => {
            // console.log('item =', item)
            return true === item.iconPlaceVisibility.mainmenu && (true === item.installed || true === item.system)
        })
        // console.log('data =', data)
        const rendered = Mustache.render(Templates.getInstance().rows.mainmenu, data)
        document.querySelector(this.renderSelectors.full).innerHTML = rendered
    }

	static getInstance()
	{
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
