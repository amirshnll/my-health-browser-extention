import { emptyProfile, type Attachment, type Backup, type Entry, type Profile } from './types';

const DB_NAME = 'local-health-notebook';
const DB_VERSION = 2;
export const DATA_SCHEMA_VERSION = 2;
let connection: Promise<IDBDatabase> | undefined;

function open() {
    if (connection) return connection;
    connection = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = event => {
            const database = request.result;
            const transaction = request.transaction!;
            if (!database.objectStoreNames.contains('entries')) database.createObjectStore('entries', { keyPath: 'id' });
            if (!database.objectStoreNames.contains('attachments')) database.createObjectStore('attachments', { keyPath: 'id' });
            const meta = database.objectStoreNames.contains('meta') ? transaction.objectStore('meta') : database.createObjectStore('meta');
            if (event.oldVersion < 2) meta.put(DATA_SCHEMA_VERSION, 'schemaVersion');
        };
        request.onsuccess = () => { const database = request.result; database.onversionchange = () => { database.close(); connection = undefined }; resolve(database) };
        request.onerror = () => { connection = undefined; reject(request.error) };
        request.onblocked = () => console.warn('My Health database upgrade is waiting for another extension page to close.');
    });
    return connection;
}

async function all<T>(store: string): Promise<T[]> { const database = await open(); return new Promise((resolve, reject) => { const request = database.transaction(store).objectStore(store).getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error) }) }
async function put(store: string, value: unknown, key?: string) { const database = await open(); return new Promise<void>((resolve, reject) => { const request = database.transaction(store, 'readwrite').objectStore(store).put(value, key); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error) }) }
const normalizeProfile = (profile?: Partial<Profile>): Profile => ({ ...emptyProfile, ...profile });
const normalizeEntry = (entry: Entry): Entry => ({ ...entry, notes: entry.notes || '', fields: entry.fields || {}, attachmentIds: entry.attachmentIds || [], createdAt: entry.createdAt || new Date().toISOString(), updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString() });

export const repo = {
    async profile() { const database = await open(); return new Promise<Profile | undefined>((resolve, reject) => { const request = database.transaction('meta').objectStore('meta').get('profile'); request.onsuccess = () => resolve(request.result ? normalizeProfile(request.result) : undefined); request.onerror = () => reject(request.error) }) },
    saveProfile: (profile: Profile) => put('meta', normalizeProfile(profile), 'profile'),
    async entries() { return (await all<Entry>('entries')).map(normalizeEntry) },
    saveEntry: (entry: Entry) => put('entries', normalizeEntry(entry)),
    async deleteEntry(id: string) { const database = await open(); return new Promise<void>((resolve, reject) => { const request = database.transaction('entries', 'readwrite').objectStore('entries').delete(id); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error) }) },
    attachments: () => all<Attachment>('attachments'),
    saveAttachment: (attachment: Attachment) => put('attachments', attachment),
    async clear() { const database = await open(); return new Promise<void>((resolve, reject) => { const transaction = database.transaction(['entries', 'attachments', 'meta'], 'readwrite');['entries', 'attachments', 'meta'].forEach(store => transaction.objectStore(store).clear()); transaction.objectStore('meta').put(DATA_SCHEMA_VERSION, 'schemaVersion'); transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error) }) },
    async backup(profile: Profile): Promise<Backup> { const [entries, attachments] = await Promise.all([this.entries(), this.attachments()]); return { format: 'local-health-notebook', version: 2, exportedAt: new Date().toISOString(), metadata: { product: 'My Health', extensionVersion: '1.0.0', dataSchemaVersion: DATA_SCHEMA_VERSION, projectUrl: 'https://github.com/amirshnll/my-health-extension', copyright: '© 2026 My Health contributors. All rights reserved.', exportPurpose: 'Exported by the My Health browser extension. This metadata is informational and is ignored during import.' }, profile: normalizeProfile(profile), entries, attachments: await Promise.all(attachments.map(async attachment => ({ ...attachment, data: await blobData(attachment.blob) }))) } },
    async restore(backup: Backup) { if (backup.format !== 'local-health-notebook' || ![1, 2].includes(backup.version) || !Array.isArray(backup.entries)) throw new Error('این فایل پشتیبان معتبر نیست.'); await this.clear(); await this.saveProfile(normalizeProfile(backup.profile)); for (const entry of backup.entries) await this.saveEntry(normalizeEntry(entry)); for (const attachment of backup.attachments || []) await this.saveAttachment({ ...attachment, blob: dataBlob(attachment.data, attachment.type) }) }
};

const blobData = (blob: Blob) => new Promise<string>(resolve => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(blob) });
const dataBlob = (data: string, type: string) => { const [head, body] = data.split(','); const binary = atob(body); const bytes = new Uint8Array(binary.length); for (let index = 0; index < binary.length; index++)bytes[index] = binary.charCodeAt(index); return new Blob([bytes], { type: type || head.match(/:(.*?);/)?.[1] || '' }) };
