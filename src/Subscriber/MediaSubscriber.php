<?php declare(strict_types=1);

namespace ScientiaMobileImageEngine\Cdn\Subscriber;

use Shopware\Core\Content\Media\{MediaEntity, MediaEvents};
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class MediaSubscriber implements EventSubscriberInterface
{
    private SystemConfigService $systemConfigService;

    private RequestStack $requestStack;

    public function __construct(
        SystemConfigService $systemConfigService,
        RequestStack $requestStack
    ) {
        $this->systemConfigService = $systemConfigService;
        $this->requestStack = $requestStack;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            MediaEvents::MEDIA_LOADED_EVENT => 'onMediaLoaded'
        ];
    }

    /**
     * Check plugin config and replace media urls
     *
     * @param EntityLoadedEvent $event
     *
     * @return void
     * @throws \Exception
     */
    public function onMediaLoaded(EntityLoadedEvent $event): void
    {
        $entities = $event->getEntities();
        // getting config
        $pluginConfig = $this->systemConfigService->get('ScientiaMobileImageEngineCdn.config');

        // getting sales channel config
        if (method_exists($event->getContext()->getSource(), 'getSalesChannelId')) {
            $salesChannelId = $event->getContext()->getSource()->getSalesChannelId();
            if (!($this->systemConfigService->get('ScientiaMobileImageEngineCdn.config.isActive', $salesChannelId))) {
                return;
            }
            $pluginConfig = $this->systemConfigService->get('ScientiaMobileImageEngineCdn.config', $salesChannelId);
        }

        if (!array_key_exists('cdnDomain', $pluginConfig)) {
            return;
        }

        $schema = 'http://';
        $request = $this->requestStack->getCurrentRequest();

        if ($request) {
            if ($request->isSecure()) {
                $schema = 'https://';
            }
            $originalDomain = $schema . $request->getHost();

        } else {
            $originalDomain = $this->systemConfigService->get('ScientiaMobileImageEngineCdn.config.shopDomain');

            if (!$originalDomain) {
                throw new \Exception("Missing shop server domain in plugin config. Please update your ImageEngineCdn plugin config and enter your primary domain of the origin server.");
            }
        }

        /** @var MediaEntity $entity */
        foreach ($entities as $entity) {
            $url = $entity->getUrl();
            $url = str_replace($originalDomain, $pluginConfig['cdnDomain'], $url);
            $entity->setUrl($url);
            $thumbnails = $entity->getThumbnails();

            foreach ($thumbnails as $thumbnail) {
                $url = $thumbnail->getUrl();
                $url = str_replace($originalDomain, $pluginConfig['cdnDomain'], $url);
                $thumbnail->setUrl($url);
            }
        }
    }
}