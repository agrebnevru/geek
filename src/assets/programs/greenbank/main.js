import Program from '../program'

export class Main extends Program
{

	constructor()
	{
        super(...arguments)
        console.log('Main::constructor [greenbank]')
    }

    testDinamic()
    {
        console.log('Main::testDinamic [greenbank]')
    }

    static testStatic()
    {
        console.log('Main::testStatic [greenbank]')
    }
}

export default function init() {
    return new Main(...arguments)
}
