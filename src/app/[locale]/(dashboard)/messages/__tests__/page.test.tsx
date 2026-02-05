import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

describe('Messages page responsive', () => {
  it('columna de lista usa anchos progresivos md:w-64 lg:w-80', () => {
    const pagePath = join(
      process.cwd(),
      'src',
      'app',
      '[locale]',
      '(dashboard)',
      'messages',
      'page.tsx'
    );
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('md:w-64');
    expect(content).toContain('lg:w-80');
  });
});
