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

        await this.initWindow()
        await this.initTemplates()

        await this.renderBefore()
        await this.render()
        await this.renderAfter()
    }

    initWindow() {
        // console.log('Program::initWindow')
        if (null !== this.window) {
            return
        }

        this.window = Window.getInstance(this.name)
    }

    async initTemplates() {
        console.log('Program::initTemplates')

        if (null === this.templates || typeof this.templates !== 'object') {
            this.templates = await Templates.getInstance().getProgramTemplates(
                Storage.getInstance().getOsId(),
                this.name
            )
            console.log('this.templates =', this.templates)
        }
    }

    async close() {
        // console.log('Program::close')
        this.window = null
    }

    async renderBefore() {}

    async renderAfter() {}

    getRenderData() {
        // console.log('Program::getRenderData')
        return {
            programName: 'Program.js'
        }
    }

    getRenderTemplate(name) {
        // console.log('Program::getRenderTemplate')
        return this.templates[name] || ''
    }

    async render() {
        // console.log('Program::render')
        let data = this.getRenderData(),
            template = this.getRenderTemplate('body')

        // console.log('data =', data)
        // console.log('template =', template)

        if (0 === Object.keys(data).length || '' === template) {
            return
        }

        const rendered = Mustache.render(template, data)
        this.window.getDomElementBody().innerHTML = rendered
    }

    getWindowSettings() {
        return this.windowSettings || {}
    }
}
