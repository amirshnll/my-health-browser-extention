export type SectionId = 'operations' | 'medications' | 'conditions' | 'vaccines' | 'vitals' | 'sleep' | 'mood' | 'nutrition' | 'water' | 'period' | 'disabilities' | 'pregnancy' | 'allergies' | 'tests' | 'documents' | 'lifestyle' | 'bloodDonation';
export type Entry = { id: string; section: SectionId; title: string; date: string; notes: string; fields: Record<string, string>; attachmentIds: string[]; createdAt: string; updatedAt: string };
export type Profile = { alias: string; birthDate: string; gender: string; bloodGroup: string; height: string; weight: string; notes: string; photoId?: string };
export type Attachment = { id: string; name: string; type: string; blob: Blob };
export type Backup = { format: 'local-health-notebook'; version: 1 | 2; exportedAt: string; metadata?: { product: string; extensionVersion: string; dataSchemaVersion?: number; projectUrl: string; copyright: string; exportPurpose: string }; profile: Profile; entries: Entry[]; attachments: Array<Omit<Attachment, 'blob'> & { data: string }> };
export const emptyProfile: Profile = { alias: '', birthDate: '', gender: '', bloodGroup: '', height: '', weight: '', notes: '', photoId: '' };
export const sections: Array<{ id: SectionId; title: string; icon: string; fields: Array<[string, string, string?]> }> = [
  { id: 'operations', title: 'عمل‌ها و بستری‌ها', icon: '✚', fields: [['description', 'توضیحات'], ['facility', 'مرکز درمانی']] },
  { id: 'medications', title: 'داروها', icon: '◉', fields: [['type', 'نوع دارو'], ['schedule', 'برنامه مصرف'], ['direction', 'دستور مصرف'], ['current', 'در حال مصرف است؟', 'checkbox']] },
  { id: 'conditions', title: 'بیماری‌ها و شرایط', icon: '⌁', fields: [['category', 'دسته‌بندی', 'select-condition-category'], ['diagnosisDate', 'تاریخ تشخیص', 'date']] },
  { id: 'vaccines', title: 'واکسن‌ها', icon: '◈', fields: [['type', 'نوع', 'select-vaccine'], ['totalDoses', 'تعداد کل دوزها', 'number'], ['dose', 'دوز تزریق‌شده']] },
  { id: 'vitals', title: 'علائم حیاتی', icon: '♥', fields: [['bloodPressure', 'فشار خون'], ['heartRate', 'ضربان قلب (bpm)', 'number'], ['glucose', 'قند خون', 'number'], ['temperature', 'دما', 'number'], ['oxygen', 'اشباع اکسیژن', 'number']] },
  { id: 'sleep', title: 'خواب', icon: '☾', fields: [['start', 'ساعت شروع', 'time'], ['end', 'ساعت پایان', 'time'], ['quality', 'کیفیت خواب']] },
  { id: 'mood', title: 'خلق‌وخو', icon: '☻', fields: [['score', 'امتیاز ۱ تا ۵', 'number'], ['feeling', 'حس کلی']] },
  { id: 'nutrition', title: 'تغذیه و کالری', icon: '◒', fields: [['meal', 'وعده'], ['amount', 'مقدار (گرم)', 'number'], ['calories', 'کالری', 'number'], ['protein', 'پروتئین'], ['carbs', 'کربوهیدرات'], ['fat', 'چربی'], ['fiber', 'فیبر']] },
  { id: 'water', title: 'آب', icon: '◌', fields: [['amount', 'مقدار (میلی‌لیتر)', 'number']] },
  { id: 'period', title: 'چرخه قاعدگی', icon: '◐', fields: [['endDate', 'تاریخ پایان'], ['pain', 'شدت درد (۰ تا ۵)', 'number'], ['feeling', 'حس کلی']] },
  { id: 'disabilities', title: 'نیازهای مراقبتی', icon: '♿', fields: [['details', 'جزئیات']] },
  { id: 'pregnancy', title: 'بارداری', icon: '◍', fields: [['outcome', 'نتیجه / وضعیت']] },
  { id: 'allergies', title: 'آلرژی‌ها', icon: '⚠', fields: [['reaction', 'واکنش'], ['firstNoted', 'نخستین مشاهده']] },
  { id: 'tests', title: 'آزمایش‌ها', icon: '▣', fields: [['type', 'نوع آزمایش'], ['result', 'خلاصه نتیجه']] },
  { id: 'documents', title: 'اسناد پزشکی', icon: '▤', fields: [['tags', 'برچسب‌ها']] },
  { id: 'bloodDonation', title: 'اهدای خون', icon: '♥', fields: [['type', 'نوع اهدا'], ['amount', 'مقدار اهدا (میلی‌لیتر)', 'number'], ['center', 'مرکز اهدای خون'], ['status', 'وضعیت اهدا']] },
  { id: 'lifestyle', title: 'سبک زندگی', icon: '✦', fields: [['sleepPattern', 'الگوی خواب'], ['drink', 'نوشیدنی دلخواه'], ['preference', 'ترجیح دیگر']] }
];
sections.forEach(section => { section.icon = '' });
