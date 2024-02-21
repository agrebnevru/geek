import Program from '../program'

export class Main extends Program
{

	constructor()
	{
        super(...arguments)
        console.log('Main::constructor [greenbank]')
    }

    getRenderData() {
        return {
            programName: 'ГринБанк'
        }
    }
}

export default function init() {
    return new Main(...arguments)
}
