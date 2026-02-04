export type BoardBlock =
  | {
      id: string;
      type: 'text';
      content: string;
    }
  | {
      id: string;
      type: 'image';
      file?: File;
      previewUrl: string;
    };
