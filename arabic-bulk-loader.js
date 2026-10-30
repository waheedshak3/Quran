/*
 * Quran Companion — Arabic-only complete-corpus importer.
 * To activate, place a VERIFIED 114-surah Al Islam file named
 * alislam-quran.json in the same folder as index.html.
 * The importer does not download or manufacture an Al Islam edition.
 * It refuses incomplete datasets and leaves all other website features intact.
 */
(() => {
  'use strict';
  const arabicBySurah = new Map();
  const formatError = (message) => new Error('Arabic dataset rejected: ' + message);

  function validateDataset(data) {
    if (!data || !Array.isArray(data.surahs) || data.surahs.length !== 114) {
      throw formatError('114 surahs required');
    }
    if (typeof SURAHS === 'undefined' || SURAHS.length !== 114) {
      throw formatError('original surahs.js unavailable');
    }
    const checked = new Map();
    data.surahs.forEach((surah, index) => {
      const id = index + 1;
      if (Number(surah?.number) !== id || !Array.isArray(surah.ayahs)) {
        throw formatError(`surah ${id}: missing or unordered ayahs`);
      }
      const expected = SURAHS[index].count;
      if (surah.ayahs.length !== expected) {
        throw formatError(`surah ${id}: expected ${expected} Al Islam numbered verses, got ${surah.ayahs.length}`);
      }
      const content = surah.ayahs.map((ayah, i) => {
        const text = typeof ayah === 'string' ? ayah : ayah?.text;
        if (typeof ayah === 'object' && ayah !== null && Number(ayah.number) !== i + 1) {
          throw formatError(`surah ${id}: bad verse number at ${i + 1}`);
        }
        if (typeof text !== 'string' || !text.trim() || !/[\u0621-\u06FF]/u.test(text)) {
          throw formatError(`surah ${id}: invalid Arabic at verse ${i + 1}`);
        }
        return text;
      });
      checked.set(id, content);
    });
    return checked;
  }

  function activeSurah() {
    const url = new URL(location.href);
    const n = Number(url.searchParams.get('s'));
    const shown = document.querySelector('#surahSelect');
    return n >= 1 && n <= 114 ? n : Number(shown?.value) || 1;
  }

  function applyArabic() {
    const text = arabicBySurah.get(activeSurah());
    if (!text) return;
    document.querySelectorAll('#verses article.verse').forEach(article => {
      const v = Number(article.dataset.verse);
      if (!Number.isSafeInteger(v) || v < 1 || v > text.length) return;
      const arabic = article.querySelector('.arabic-verse');
      if (arabic && arabic.textContent !== text[v - 1]) {
        arabic.textContent = text[v - 1];
      }
    });
  }

  async function importArabic() {
    try {
      const response = await fetch('./alislam-quran.json', {cache: 'no-cache'});
      if (!response.ok) throw Error(`File not found (${response.status})`);
      const dataset = validateDataset(await response.json());
      dataset.forEach((content, s) => arabicBySurah.set(s, content));
      applyArabic();
      console.info('Quran Companion: full Arabic dataset imported. Verify its authenticity and transcription against Al Islam.');
    } catch (error) {
      // The original website and its Arabic source remain operational.
      console.warn('Quran Companion: complete Al Islam Arabic dataset was not loaded. Existing text remains.', error.message);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const host = document.getElementById('verses');
    if (!host) return;
    const observer = new MutationObserver(() => applyArabic());
    observer.observe(host, {childList: true, subtree: true});
    importArabic();
  });
})();
