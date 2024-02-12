const Mustache = require('mustache')

import Window from '../scripts/programs/window'
import Templates from '../scripts/templates/templates'
import Storage from '../scripts/storage/storage'

export default class Program {

    constructor(manifest) {
        console.log('Program::constructor')

        Object.assign(this, manifest)

        this.window = null
        this.templates = null
    }

    async open() {
        // console.log('Program::open')
        // console.log('this =', this)

        this.initWindow()
        await this.initTemplates()

        await this.render()
    }

    initWindow() {
        // console.log('Program::initWindow')
        if (null !== this.window) {
            return
        }

        this.window = Window.getInstance(this.name)
    }

    async initTemplates() {
        // console.log('Program::initTemplates')

        if (null === this.templates || typeof this.templates !== 'object') {
            this.templates = await Templates.getInstance().getProgramTemplates(
                Storage.getInstance().getOsId(),
                this.name
            )
        }
    }

    close() {
        // console.log('Program::close')
        // console.log('this =', this)
    }

    getRenderData() {
        return {
            programName: 'Program.js'
        }
    }

    getRenderTemplate() {
        return this.templates.body || ''
    }

    render() {
        // console.log('Program::render')
        let data = this.getRenderData(),
            template = this.getRenderTemplate()

        if (0 === Object.keys(data).length || '' === template) {
            return
        }

        const rendered = Mustache.render(template, data)
        this.window.getDomElementBody().innerHTML = rendered
    }


}
