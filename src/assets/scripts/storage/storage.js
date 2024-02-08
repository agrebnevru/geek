let instance = null

export default class Storage
{

	constructor()
	{
		console.log('Storage::constructor')

        this.saveProperties = [
            'datetime',
            'body',
            'settings',
            'profile',
            'wallet',
            'work',
            'hardware',
            // 'programs',
            // 'desktop',
            // 'taskbar',
        ]

        this.datetime = {
            timestamp: 0,
        }

        this.body = {
            os: 'win11',
            theme: 'dark',
        }

        this.settings = {
            fullscreen: false,
            computerName: '',
            workgroup: '',
            computerDescription: '',
        }

        this.profile = {
            name: '',
            xpProgress: 0, // 0 to ∞
            xpMood: 50, // 0 to 100
        }

        this.wallet = {
            amount: 0,
        }

        this.work = {
            profession: 0,
        }

        this.hardware = {
            rows: {
                powersupply: {},
                motherboard: {},
                cpu: {},
                cooling: {},
                ram: {},
                hdd: {},
                ssd: {},
                videocard: {},
                cdrom: {},
                monitor1: {},
                monitor2: {},
                monitor3: {},
                keyboard: {},
                mouse: {},
                sound: {},
                printer: {},
                scaner: {},
            },
        }

        this.programs = {
            rows: {},
            storage: {},
        }

        this.desktop = {
            programs: {},
        }

        this.taskbar = {
            programs: {},
        }

        this.init()
	}

    init()
    {
        // console.log('Storage::init')

        this.load()
    }

    getProgramManifestByName(name)
    {
        // console.log('Storage::getProgramManifestByName')
        if (!this.programs.rows[name]) {
            return null
        }

        return this.programs.rows[name]
    }

    getProgramEntityByName(name)
    {
        // console.log('Storage::getProgramEntityByName')
        return this.getProgramManifestByName(name).entity
    }

    addProgram(name, data)
    {
        // console.log('Storage::addProgram')
        if (this.programs.rows[name]) {
            return
        }

        this.programs.rows[name] = data
    }

    setCurrentTimeByTimestamp(timestamp) {
        this.datetime.timestamp = timestamp
    }

    getCurrentTimeTimestamp() {
        return this.datetime.timestamp
    }

    setProfileName(data) {
        this.profile.name = data
    }

    getProfileName() {
        return this.profile.name
    }

    setComputerName(data) {
        this.settings.computerName = data
    }

    getComputerName() {
        return this.settings.computerName
    }

    setWorkgroup(data) {
        this.settings.workgroup = data
    }

    getWorkgroup() {
        return this.settings.workgroup
    }

    setComputerDescription(data) {
        this.settings.computerDescription = data
    }

    getComputerDescription() {
        return this.settings.computerDescription
    }

    fillData(data) {
        for (let propertyName of this.saveProperties) {
            if (false === data.hasOwnProperty(propertyName)) {
                continue
            }
            this[propertyName] = data[propertyName]
        }
    }

    async load()
    {
        // console.log('Storage::load')

        let data = await window.electronApi.storageLoad()
        // console.log('data =', data)

        for (let propertyName of this.saveProperties) {
            if (false === data.hasOwnProperty(propertyName)) {
                continue
            }
            this[propertyName] = data[propertyName]
        }
        // console.log('this.profile =', this.profile)

        setTimeout(() => {
            window.dispatchEvent(new Event('storage.load.after'))
        }, 250)
    }

    async save()
    {
        console.log('Storage::save')

        let saveData = {}

        for (let propertyName of this.saveProperties) {
            saveData[propertyName] = this[propertyName]
        }

        await window.electronApi.storageSave(saveData)

        window.dispatchEvent(new Event('storage.save.after'))
    }

	static getInstance()
	{
        // console.log('Storage::getInstance')
		if (instance === null) {
			instance = new Storage(...arguments)
		}

		return instance
	}

}
