import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

// ✅ .env 파일의 환경변수 로드
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  // .env 파일에 작성된 REACT_APP_GRAPHQL_URI 또는 GRAPHQL_SCHEMA_URL 로드
  schema: process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:4000/graphql',
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
