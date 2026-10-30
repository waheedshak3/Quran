# Qur’an Companion — Arabic source correction

Upload `index.html` and `alislam-verified-verses.json` together to the root of your GitHub Pages repository.

## Verified Arabic

The Arabic text of verse **2:6** is transcribed from the Al Islam Quran app at https://www.alislam.org/quran/app/2%3A0 . The `alislam-verified-verses.json` file contains the exact copied string for this verse, including its unusual Urdu-script character forms and pause mark.

**This is NOT a complete Al Islam edition.** All other verses still use a different edition from AlQuran Cloud at runtime, with Al Islam-style renumbering. The page distinguishes verified verses and displays this limitation openly. Never assume the fallback is Al Islam Arabic.

## Completing all 114 Surahs

Provide an authorised, verified full Al Islam JSON data export in `alislam-quran.json` following the structure `{"surahs":[{"number":1,"name":"Al-Fatihah","ayahs":[{"number":1,"text":"..."}]}]}` for every one of the 114 Surahs. The app already supports this format, with the first ayah (Bismillah) numbered as 1 in every Surah except At-Taubah. Each Surah must be verified against the Al Islam source before publication.

Existing GitHub Pages repository code was not accessible, so this package updates the earlier stand-alone prototype, not the unavailable live website source.
