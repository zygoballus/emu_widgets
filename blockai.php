<?php

declare(strict_types=1);

/**
 * Block known AI training and scraping bots.
 * Include at the top of every entry point.
 * Always allows /robots.txt through.
 */
function blockAiBots(): void
{
    if (str_ends_with($_SERVER['REQUEST_URI'] ?? '', '/robots.txt')) {
        return;
    }

    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if ($ua === '') {
        return;
    }

    $pattern =
        '/GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|anthropic-ai|' .
        'Google-Extended|Bytespider|CCBot|PerplexityBot|meta-externalagent|' .
        'Amazonbot|Applebot-Extended|xAI-Bot|DeepSeekBot|MistralBot|Diffbot|' .
        'cohere-ai|AI2Bot|Ai2Bot-Dolma|YouBot|DuckAssistBot|omgili|omgilibot|' .
        'webzio-extended|gemini-deep-research/i';

    if (preg_match($pattern, $ua)) {
        http_response_code(403);
        header('Content-Type: text/plain');
        exit('Forbidden');
    }
}

blockAiBots();
