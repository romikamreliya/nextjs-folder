import * as yup from "yup";

export const docEntrySchema = yup.object({
  documentTypeId: yup.string().required("Document type is required"),
  documentName: yup.string().required("Document name is required").min(2, "Min 2 chars"),
  documentNumber: yup.string().optional(),
  remarks: yup.string().optional(),
  issueDate: yup.string().optional(),
  expiryDate: yup.string().optional(),
  notifyBeforeDays: yup
    .number()
    .transform((v, o) => (o === "" ? undefined : v))
    .optional()
    .min(0, "Must be ≥ 0")
    .nullable(),
});

export const stagingSchema = yup.object({
  docs: yup.array().of(docEntrySchema),
});
