<?php declare(strict_types=1);

namespace ScientiaMobileImageEngine\Cdn\Test;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @covers MediaSubscriber
 */
class MediaSubscriberTest extends TestCase
{
    use KernelTestBehaviour;

    private SystemConfigService $systemConfigService;
    private RequestStack $requestStack;

    protected function setUp(): void
    {
        $container = $this->getContainer();

        $this->systemConfigService = $container->get(SystemConfigService::class);
        $this->requestStack = $this->getContainer()->get('request_stack');
    }

    public function testCdnUrlCorrectFromConfig(): void
    {
        $url = $this->systemConfigService->get('ScientiaMobileImageEngineCdn.config', Defaults::SALES_CHANNEL);

        static::assertTrue($this->checkUrl($url));
    }

    /**
     * @param string $url
     *
     * @return bool
     */
    private function checkUrl(string $url): bool
    {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    public function testCorrectUrl(): void
    {
        $url = 'https://www.shopware.com/';

        static::assertTrue($this->checkUrl($url));
    }

    public function testEmptyCdnUrl(): void
    {
        $url = '';

        static::assertTrue($this->checkUrl($url));
    }

    public function testIfPluginConfigExists(): void
    {
        $config = $this->systemConfigService->get('ScientiaMobileImageEngineCdn.config');

        static::assertTrue($config);
    }

    /**
     * Check if response returns 200
     *
     * @return void
     */
    public function testIfCdnUrlExists(): void
    {
        $url = 'https://w4v5bghb.cdn.imgeng.in/thumbnail/63/80/61/1652883975/waschmaschine_600x600_400x400.jpg';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $output = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        static::assertSame(200, $httpcode);
    }
}