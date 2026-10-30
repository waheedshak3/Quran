/*
 * Arabic text corrections for Quran Companion.
 * Loaded BEFORE app.js; all existing UI, CSS, translations and audio are unchanged.
 * Mapping uses AL ISLAM verse numbering (Bismillah is 1 except Surah 9).
 * Only enter text checked against the official Al Islam edition.
 * The 2:6 entry is a provisional comparison text and should be independently checked
 * character by character against Al Islam before treating it as authoritative.
 */
(() => {
  'use strict';
  const corrections = {
    2: {
      6: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ'
    }
  };
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const response = await nativeFetch(input, init);
    const url = typeof input === 'string' ? input : input && input.url;
    const match = /^https:\/\/quran-json\.risanb\.com\/text\/uthmani\/chapters\/(\d+)\.json(?:\?.*)?$/.exec(url || '');
    if (!match || !response.ok) return response;
    const surah = Number(match[1]);
    if (!Object.prototype.hasOwnProperty.call(corrections, surah)) return response;
    const data = await response.clone().json();
    if (!Array.isArray(data.verses)) return response;
    for (const [reference, text] of Object.entries(corrections[surah])) {
      const alIslamAyah = Number(reference);
      const standardAyah = surah === 9 ? alIslamAyah : alIslamAyah - 1;
      const verse = data.verses[standardAyah - 1];
      if (verse && typeof verse.text === 'string') verse.text = text;
    }
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8'})
    });
  };
})();
