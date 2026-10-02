# My Health

## Short description

Keep a private, local-first record of your personal health journey in your browser.

## Description

My Health is a multilingual personal health notebook for the browser. It keeps health profiles, records, notes, and attachments on the user's device and provides a dashboard for reviewing recent activity, BMI, water intake, mood, medications, tests, documents, and other health information.

## Features

- Records for medications, conditions, vaccines, vitals, sleep, mood, nutrition, water, menstrual cycles, care needs, pregnancy, allergies, tests, medical documents, lifestyle, blood donation, surgeries, and hospitalizations
- A personal health profile with measurement-unit preferences and an optional profile photo
- Local search, recent activity, BMI, water-intake, and mood summaries
- Gregorian, Solar Hijri, and Islamic calendar displays
- English, Persian, Arabic, Hebrew, French, Italian, Spanish, and Turkish interfaces
- Local JSON backup and restore, including attachments
- Local medication-reminder support through browser alarms and notifications
- Popup access and a full-page dashboard

## Privacy

Health information and attachments remain in the extension's local browser storage on the current device. My Health has no analytics, advertising, tracking, cloud synchronization, host permissions, or remote data storage. See `privacy-policy.md` for details.

## Medical disclaimer

My Health is a personal record-keeping tool. It does not replace medical diagnosis, treatment, prescriptions, emergency assistance, or advice from a qualified healthcare professional.

## Development

Requirements:

- Node.js 20.19 or later
- npm
- `zip` for packaged browser archives

Install dependencies and start the development server:

```sh
npm ci
npm run dev
```

Run the type checks and localization tests:

```sh
npm test
```

## Build

Create production directories with:

```sh
npm run build
```

This creates `dist`, `dist-chrome`, and `dist-firefox`.

To build and package installable ZIP archives for both browsers, run:

```sh
./build.sh
```

The archives are written to `outputs/my-health-chrome.zip` and `outputs/my-health-firefox.zip`.

## Download

[Chrome](#) - [Firefox](https://addons.mozilla.org/firefox/addon/my-health/)

## License

My Health is licensed under the MIT License. See the `LICENSE` file for the full license text.
