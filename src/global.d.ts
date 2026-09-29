declare module '*.css';
declare const chrome: { tabs: { create(options: { url: string }): void }; runtime: { getURL(path: string): string } };
