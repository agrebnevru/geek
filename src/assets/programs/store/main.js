import Program from '../program'

export class Main extends Program
{

	constructor()
	{
        super(...arguments)
        console.log('Main::constructor [store]')
    }

    getRenderData() {
        return {
            programName: 'Store.js'
        }
    }
}

export default function init() {
    return new Main(...arguments)
}
