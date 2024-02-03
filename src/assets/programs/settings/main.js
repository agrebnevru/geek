import Program from '../program'

export class Main extends Program
{

	constructor()
	{
        super(...arguments)
        console.log('Main::constructor [settings]')
    }

    testDinamic()
    {
        console.log('Main::testDinamic [settings]')
    }

    static testStatic()
    {
        console.log('Main::testStatic [settings]')
    }
}

export default function init() {
    return new Main(...arguments)
}
