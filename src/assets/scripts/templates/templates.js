import Storage from '../storage/storage';

let instance = null

export default class Templates {
    constructor() {
        console.log('Templates::constructor')

        this.loaded = false
        this.rows = {}

        this.init()
    }

    init() {
        // console.log('Templates::init')
        this.load()
    }

    async getProgramTemplates(programName) {
        // console.log('Templates::getProgramTemplates')

        let keyName = `program-${programName}`

        if (this.rows[keyName]) {
            return this.rows[keyName]
        }

        let templates = await window.electronApi.getProgramTemplates(programName)
        // console.log('templates =', templates)
        this.rows[keyName] = templates

        return this.rows[keyName]
    }

    async load() {
        // console.log('Templates::load')
        if (true === this.isLoaded()) {
            return
        }
        
        let list = await window.electronApi.getTemplatesList()
        // console.log('list =', list)
        this.rows = list
        this.afterLoad()
    }

    getByName(name)
    {
        let osId = Storage.getInstance().getOsId()

        if (this.rows[`theme_${osId}_${name}`]) {
            return this.rows[`theme_${osId}_${name}`]
        } else if (this.rows[name]) {
            return this.rows[name]
        } else {
            return null
        }
    }

    afterLoad() {
        this.loaded = true
    }

    isLoaded() {
        return this.loaded
    }

    static getInstance() {
        // console.log('Templates::getInstance')
        if (instance === null) {
            instance = new Templates(...arguments)
        }

        return instance
    }
}
