import './assets/styles/main.scss'

import Program from '../program'

export class Main extends Program
{

	constructor()
	{
        super(...arguments)
        console.log('Main::constructor [ui]')

        this.data = {}

        this.init()
    }

    async init() {
        // console.log('Help::init')
    }
}

export default function init() {
    return new Main(...arguments)
}
