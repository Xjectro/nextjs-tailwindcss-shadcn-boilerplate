describe('Home page', () => {
  it('exports a page component', async () => {
    const mod = await import('@/app/[locale]/page');
    expect(typeof mod.default).toBe('function');
  });

  it('exports metadata', async () => {
    const mod = await import('@/app/[locale]/page');
    expect(typeof mod.metadata).toBe('object');
  });
});
