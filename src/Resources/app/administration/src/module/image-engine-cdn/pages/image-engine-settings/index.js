import template from './image-engine-settings.html.twig';
import './image-engine-settings.scss';

const {Component, Defaults} = Shopware;
const {Criteria} = Shopware.Data;

Component.register('image-engine-settings', {
    template,

    inject: [
        'repositoryFactory',
    ],

    data() {
        return {
            isLoading: false,
            isSaveSuccessful: false,
            cdnDomainFilled: false,
            shopDomainFilled: false,
            messageBlankErrorState: null,
            mappingErrorStates: {},
            config: null,
            salesChannels: []
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    created() {
        this.createdComponent();
    },

    computed: {
        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },

        shopDomainErrorState() {
            if (this.shopDomainFilled) {
                return null;
            }

            return this.messageBlankErrorState;
        },

        cdnDomainErrorState() {
            if (this.cdnDomainFilled) {
                return null;
            }

            return this.messageBlankErrorState;
        },

        hasError() {
            const hasMappingErrors = Object.values(this.mappingErrorStates)
                .filter((state) => state.code !== undefined)
                .length !== 0;

            return hasMappingErrors;
        }
    },

    watch: {
        config: {
            handler() {
                const defaultConfig = this.$refs.configComponent.allConfigs.null;
                const salesChannelId = this.$refs.configComponent.selectedSalesChannelId;
                if (salesChannelId === null) {
                    this.cdnDomainFilled = !!this.config['ScientiaMobileImageEngineCdn.config.cdnDomain'];
                    this.shopDomainFilled = !!this.config['ScientiaMobileImageEngineCdn.config.shopDomain'];
                } else {
                    this.cdnDomainFilled = !!this.config['ScientiaMobileImageEngineCdn.config.cdnDomain']
                        || !!defaultConfig['ScientiaMobileImageEngineCdn.config.cdnDomain'];
                    this.shopDomainFilled = !!this.config['ScientiaMobileImageEngineCdn.config.shopDomain']
                        || !!defaultConfig['ScientiaMobileImageEngineCdn.config.shopDomain'];
                }
            },
            deep: true,
        },
    },

    methods: {
        createdComponent() {
            this.getSalesChannels();

            this.messageBlankErrorState = {
                code: 1,
                detail: this.$tc('image-engine-cdn-settings.general.messageNotBlank'),
            };
        },

        onChangeLanguage() {
            this.getSalesChannels();
        },

        getSalesChannels() {
            this.isLoading = true;

            const criteria = new Criteria();
            criteria.addFilter(Criteria.equalsAny('typeId', [
                Defaults.storefrontSalesChannelTypeId,
                Defaults.apiSalesChannelTypeId,
            ]));

            this.salesChannelRepository.search(criteria, Shopware.Context.api).then(res => {
                res.add({
                    id: null,
                    translated: {
                        name: this.$tc('sw-sales-channel-switch.labelDefaultOption'),
                    },
                });

                this.salesChannels = res;
            }).finally(() => {
                this.isLoading = false;
            });
        },

        onSave() {
            if (this.hasError) {
                return;
            }

            this.isLoading = true;
            console.log(this.$refs.configComponent);
            this.$refs.configComponent.save().then(() => {
                this.isSaveSuccessful = true;
            }).finally(() => {
                this.isLoading = false;
            });
        }
    }
});
