import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true } });
try {
    const { t, locales, messages, catalogs, getLanguage } = await server.ssrLoadModule('/src/i18n.tsx');
    const { sections } = await server.ssrLoadModule('/src/types.ts');
    const allKeys = [...new Set([...Object.values(messages), ...Object.keys(catalogs.en)])];
    for (const locale of locales) {
        for (const key of allKeys) assert.ok(catalogs[locale][key], `${locale}: missing ${key}`);
        for (const section of sections) { assert.ok(messages[section.title]); for (const [, label] of section.fields) assert.ok(messages[label], label) }
        assert.ok(t('{count} مورد جایگزین می‌شود. ادامه می‌دهید؟', { count: 12 }, locale).includes('12'));
        assert.ok(!t('برای تأیید بنویسید: {word}', { word: t('حذف', {}, locale) }, locale).includes('{word}'));
    }
    globalThis.localStorage = { getItem: () => 'unsupported' };
    assert.equal(getLanguage(), 'en');
    assert.equal(t('متن شخصی بدون ترجمه', {}, 'fr'), 'متن شخصی بدون ترجمه');
    const { waterTitle } = await server.ssrLoadModule('/src/water.tsx');
    const { moodTitle } = await server.ssrLoadModule('/src/mood.tsx');
    assert.equal(waterTitle({ section: 'documents', title: 'water:250' }), 'water:250');
    assert.equal(moodTitle({ section: 'documents', title: 'mood:4' }), 'mood:4');
    assert.equal(waterTitle({ section: 'water', title: 'water:250' }), '250 ml Water');
    assert.equal(moodTitle({ section: 'mood', title: 'mood:4' }), '🙂 Good');
    console.log(`Passed: ${allKeys.length} messages × ${locales.length} languages; section labels, interpolation, invalid locale, and user-content isolation.`);
} finally { await server.close() }
