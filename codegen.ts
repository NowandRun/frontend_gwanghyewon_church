import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://backend:4000/graphql',
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      presetConfig: {
        //fragmentMasking: false 로 두면 fragment로 지정한부분을 $fragmentRef라는 필드로 안감싸게 해주는 옵션
        fragmentMasking: false,
      },
    },
  },
};
export default config;
