type FileMap = Record<string, { code: string }>;

export const projectState: {
  files: FileMap;
} = {
  files: {}
};
