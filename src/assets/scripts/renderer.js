import '../styles/main.scss';

import './modules/all';
import './blocks/all';

import Storage from './storage/storage';
import Application from './application';
import Templates from './templates/templates';
import Workers from './workers/workers';
import Programs from './programs/programs';
import PcStarter from './pcstarter';

window.App = window.App || {}

window.addEventListener('DOMContentLoaded', () => {
    App.Storage = Storage.getInstance()
    App.Application = Application.getInstance()
    App.Templates = Templates.getInstance()
    App.Workers = Workers.getInstance()
    App.Programs = Programs.getInstance()
    App.PcStarter = PcStarter.getInstance()

    setTimeout(async () => {
        window.dispatchEvent(new Event('windows.ready'))
    }, 250)
})
