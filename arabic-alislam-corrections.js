/*
 * Qur'an Companion — Arabic-only source corrections (30 October 2026).
 * All displayed strings below are reproduced from official Al Islam Quran app
 * verse listings. They use the Al Islam / Ahmadiyya verse numbers.
 * The site already displays verse numbers in pills, so decorative ending
 * markers (﴿۲﴾ etc.) are not included here.
 *
 * Deliberately does not change typography, layout, navigation, translations,
 * recitation or playback, QR codes, or any non-Arabic text.
 * This is NOT a complete verified Al Islam Arabic Quran. Unlisted verses
 * retain the site's existing alternative Uthmani source.
 */
(() => {
  'use strict';
  const OFFICIAL = Object.freeze({
    2: Object.freeze({
      2: 'الٓـمّٓ ۚ',
      3: 'ذٰلِکَ الۡکِتٰبُ لَا رَیۡبَ ۚۖۛ فِیۡہِ ۚۛ ہُدًی لِّلۡمُتَّقِیۡنَ ۙ',
      4: 'الَّذِیۡنَ یُؤۡمِنُوۡنَ بِالۡغَیۡبِ وَیُقِیۡمُوۡنَ الصَّلٰوۃَ وَمِمَّا رَزَقۡنٰہُمۡ یُنۡفِقُوۡنَ ۙ',
      5: 'وَالَّذِیۡنَ یُؤۡمِنُوۡنَ بِمَاۤ اُنۡزِلَ اِلَیۡکَ وَمَاۤ اُنۡزِلَ مِنۡ قَبۡلِکَ ۚ وَبِالۡاٰخِرَۃِ ہُمۡ یُوۡقِنُوۡنَ ؕ',
      6: 'اُولٰٓئِکَ عَلٰی ہُدًی مِّنۡ رَّبِّہِمۡ ٭ وَاُولٰٓئِکَ ہُمُ الۡمُفۡلِحُوۡنَ',
      7: 'اِنَّ الَّذِیۡنَ کَفَرُوۡا سَوَآءٌ عَلَیۡہِمۡ ءَاَنۡذَرۡتَہُمۡ اَمۡ لَمۡ تُنۡذِرۡہُمۡ لَا یُؤۡمِنُوۡنَ',
      8: 'خَتَمَ اللّٰہُ عَلٰی قُلُوۡبِہِمۡ وَعَلٰی سَمۡعِہِمۡ ؕ وَعَلٰۤی اَبۡصَارِہِمۡ غِشَاوَۃٌ ۫ وَّلَہُمۡ عَذَابٌ عَظِیۡمٌ',
      9: 'وَمِنَ النَّاسِ مَنۡ یَّقُوۡلُ اٰمَنَّا بِاللّٰہِ وَبِالۡیَوۡمِ الۡاٰخِرِ وَمَا ہُمۡ بِمُؤۡمِنِیۡنَ ۘ',
      10: 'یُخٰدِعُوۡنَ اللّٰہَ وَالَّذِیۡنَ اٰمَنُوۡا ۚ وَمَا یَخۡدَعُوۡنَ اِلَّاۤ اَنۡفُسَہُمۡ وَمَا یَشۡعُرُوۡنَ ؕ',
      15: 'وَاِذَا لَقُوا الَّذِیۡنَ اٰمَنُوۡا قَالُوۡۤا اٰمَنَّا ۚۖ وَاِذَا خَلَوۡا اِلٰی شَیٰطِیۡنِہِمۡ ۙ قَالُوۡۤا اِنَّا مَعَکُمۡ ۙ اِنَّمَا نَحۡنُ مُسۡتَہۡزِءُوۡنَ'
    })
  });

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    try {
      if (!response.ok) return response;
      const input = args[0];
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input && input.url;
      if (!url) return response;
      const parsed = new URL(url, location.href);
      if (parsed.origin !== 'https://quran-json.risanb.com') return response;
      const match = /^\/text\/uthmani\/chapters\/(\d+)\.json$/.exec(parsed.pathname);
      if (!match) return response;
      const surah = Number(match[1]);
      const edits = OFFICIAL[surah];
      if (!edits) return response;

      const data = await response.clone().json();
      if (!data || !Array.isArray(data.verses)) return response;
      // The source uses ordinary Hafs numbers; the website adds the opening
      // Bismillah as 1 except for Surah At-Taubah. Map the two safely.
      for (const [alIslamNumber, text] of Object.entries(edits)) {
        const standardNumber = surah === 9 ? Number(alIslamNumber) : Number(alIslamNumber) - 1;
        const index = standardNumber - 1;
        if (index < 0 || index >= data.verses.length || typeof data.verses[index].text !== 'string') continue;
        data.verses[index].text = text;
      }
      const headers = new Headers(response.headers);
      headers.delete('content-length');
      headers.delete('content-encoding');
      headers.set('Content-Type', 'application/json; charset=utf-8');
      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      console.warn('Al Islam Arabic correction unavailable; original text retained.', error);
      return response;
    }
  };
})();
