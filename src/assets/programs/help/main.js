import './assets/styles/main.scss'

import Program from '../program'

// import photo from './assets/images/photo.jpg';

export class Main extends Program
{

	constructor()
	{
        super(...arguments)
        console.log('Main::constructor [help]')

        this.data = {}

        this.init()
    }

    async init() {
        // console.log('Help::init')

        await this.packageLoad()
    }

    getRenderData() {
        // console.log('Help::getRenderData')
        return this.data
    }

    async packageLoad() {
        // console.log('Help::packageLoad')

        this.data = await window.electronApi.packageLoad()

        this.data['email'] = 'my.grebnev.work@gmail.com'
    }
}

export default function init() {
    return new Main(...arguments)
}
