import { defineConfig } from 'orval';

export default defineConfig({
  fleet: {
    input: {
      target: './fleet-openapi.json',
      filters: {
        mode: 'include',
        tags: ['Software'],
      },
    },
    output: {
      target: './src/__generated__/fleet/software.ts',
      mode: 'single',
    },
  },
});
