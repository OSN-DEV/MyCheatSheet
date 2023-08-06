export const CheatListFileSchema = {
  $id: "http://osn.com/schemas/exercise-file-schema.json",
  type: "array",
  items: {
    properties: {
      id: { type: "integer" },
      displayName: { type: "string" },
      filePath: { type: "string" },
      importedAt: { type: "string" },
    },
    required: ["id", "displayName", "filePath"],
  }
} as const;

export const CheatFileSchema = {
  $id: "http://osn.com/schemas/exercise-file-schema.json",
  type: "array",
  items: {
    properties: {
      title: { type: "string" },
      keys: {
        type: "array",
        items: {
          properties: {
            key: { type: "string" },
            desc: { type: "string" },
            note: { type: "string" },
          },
        },
      },
    },
  },
} as const;
