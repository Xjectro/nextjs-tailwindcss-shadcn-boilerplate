import '@testing-library/jest-dom';

jest.mock('next-intl', () => {
	return {
		useTranslations: () => (key: string) => key,
		useFormatter: () => ({
			number: (value: unknown) => String(value),
			dateTime: (value: unknown) => String(value),
			relativeTime: (value: unknown) => String(value),
			list: (value: unknown) => String(value),
		}),
		NextIntlClientProvider: ({ children }: { children: unknown }) => children,
	};
});

jest.mock('next-intl/server', () => {
	return {
		getTranslations: async () => (key: string) => key,
	};
});
