import './pages/image-engine-settings';
import './components/image-engine-settings-general';
import './components/image-engine-settings-icon';

import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const {Module} = Shopware;

Module.register('imageEngine-cdn', {
    type: 'plugin',
    name: 'ImageEngineCdn',
    title: 'image-engine-cdn-settings.title',
    color: '#F88962',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        settings: {
            component: 'image-engine-settings',
            path: 'settings',
            meta: {
                parentPath: 'sw.settings.index.plugins'
            }
        }
    },

    settingsItem: {
        group: 'plugins',
        to: 'imageEngine.cdn.settings',
        label: "image-engine-cdn-settings.label",
        iconComponent: 'image-engine-settings-icon',
        backgroundEnabled: true
    }
})
