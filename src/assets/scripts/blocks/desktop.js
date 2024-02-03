const Mustache = require('mustache')

import Storage from '../storage/storage';
import Programs from '../programs/programs';
import Templates from '../templates/templates';

let instance = null

export default class Desktop
{
	constructor()
	{
        console.log('Desktop::constructor')

        this.renderSelectors = {
            programs: '.js-desktop-programs-render'
        }

        this.init()
    }

    init()
    {
        // console.log('Desktop::init')
        
        this.addEventListener()
    }

    addEventListener()
    {
        // console.log('Desktop::addEventListener')
        document.querySelector(this.renderSelectors.programs).on('dblclick', '.js-program-open', e => {
            // console.log('Desktop - open program')
            // console.log(e.target)
            Programs.getInstance().open(e.target)
        })
    }

    addProgram(name, program)
    {
        // console.log('Desktop::addProgram')
        if (Storage.getInstance().desktop.programs[name] || false === program.iconPlaceVisibility.desktop) {
            return
        }

        Storage.getInstance().desktop.programs[name] = program
        Storage.getInstance().desktop.programs[name].active = true === program.system
        
        this.render()
    }

    render()
    {
        // console.log('Desktop::render')
        let programs = Object.values(Storage.getInstance().desktop.programs),
            data = {
                rows: []
            }
            
        // console.log('programs =', programs)

        data.rows = programs.filter(item => {
            // console.log('item =', item)
            return true === item.iconPlaceVisibility.desktop && (true === item.installed || true === item.system)
        })
        // console.log('data =', data)

        const rendered = Mustache.render(Templates.getInstance().rows.desktop, data)
        document.querySelector(this.renderSelectors.programs).innerHTML = rendered
    }

	static getInstance()
	{
        // console.log('Desktop::getInstance')
		if (instance === null) {
			instance = new Desktop(...arguments)
		}

		return instance
	}
}

window.addEventListener('windows.ready', e => {
    Desktop.getInstance()
})
