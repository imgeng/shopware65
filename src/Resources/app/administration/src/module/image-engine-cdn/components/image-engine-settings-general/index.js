import template from './image-engine-settings-general.html.twig';
import './image-engine-settings-general.scss';

const {Component} = Shopware;

Component.register('image-engine-settings-general', {
    template,

    props: {
        actualConfigData: {
            type: Object,
            required: true,
        },
        allConfigs: {
            type: Object,
            required: true,
        },
        selectedSalesChannelId: {
            type: String,
            required: false,
            default: null,
        },
        shopDomainErrorState: {
            type: Object,
            required: false,
            default: null,
        },
        cdnDomainErrorState: {
            type: Object,
            required: false,
            default: null,
        }
    },

    computed: {
        originalUrl() {
            let homeUrl = location.origin;

            return "https://control.imageengine.io/register/website/?website=" + homeUrl +
                "&utm_source=Shopware-plugin-settigns&utm_medium=page&utm_term=shopware-imageengine&utm_campaign=shopware_plugin";
        },
        homeUrl() {
            return location.origin;
        }
    },

    data() {
        return {
            isLoading: false,
            shouldShowInfoAlert: true,
        };
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            const configPrefix = 'ScientiaMobileImageEngineCdn.config.',
                defaultConfigs = {
                    isActive: true,
                    cdnDomain: '',
                    shopDomain: '',
                };

            /**
             * Initialize config data with default values.
             */
            for (const [key, defaultValue] of Object.entries(defaultConfigs)) {
                if (this.allConfigs['null'][configPrefix + key] === undefined) {
                    this.$set(this.allConfigs['null'], configPrefix + key, defaultValue);
                }
            }
        },

        checkTextFieldInheritance(value) {
            if (typeof value !== 'string') {
                return true;
            }

            return value.length <= 0;
        },

        checkBoolFieldInheritance(value) {
            return typeof value !== 'boolean';
        }
    },
});
