import * as Yup from "yup";
import { t as i18nT } from "@/lib/i18n";

// ─── Role Sub-Schema ──────────────────────────────────────────────────────────
export const roleSchema = Yup.object({
    scopeType: Yup.string().trim().required(),
    roleId: Yup.string().trim().required(() => i18nT("validation:user.role.required")),
    companyCountryId: Yup.string().trim().nullable().optional(),
    companyId: Yup.string().trim().nullable().optional(),
    branchId: Yup.string().trim().nullable().optional(),
});

// ─── Roles Array Field ────────────────────────────────────────────────────────
export const rolesField = Yup.array()
    .of(roleSchema)
    .min(1, () => i18nT("validation:user.roles.min"))
    .test("unique-roles", () => i18nT("validation:user.roles.unique"), (roles) => {
        if (!roles) return true;
        const uniqueRoles = new Set(
            roles.map((role) =>
                JSON.stringify({
                    roleId: role.roleId,
                    companyCountryId: role.companyCountryId ?? null,
                    companyId: role.companyId ?? null,
                    branchId: role.branchId ?? null,
                })
            )
        );
        return uniqueRoles.size === roles.length;
    });

// ─── Email Field ─────────────────────────────────────────────────────────────
export const emailField = Yup.string()
    .trim()
    .email(() => i18nT("validation:user.email.invalid"))
    .required(() => i18nT("validation:user.email.required"));

// ─── Phone Field ─────────────────────────────────────────────────────────────
export const phoneField = Yup.string()
    .nullable()
    .optional()
    .transform((value) => (!value || String(value).trim() === "" ? null : String(value).trim()))
    .test("phone-format", () => i18nT("validation:user.phone.invalid"), (value) => {
        if (!value) return true;
        return /^\+\d{1,4} \d{1,20}$/.test(value);
    });

// ─── Password Field (create — required) ──────────────────────────────────────
export const passwordField = Yup.string()
    .required(() => i18nT("validation:user.password.required"))
    .min(8, () => i18nT("validation:user.password.min"))
    .max(100, () => i18nT("validation:user.password.max"))
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        () => i18nT("validation:user.password.pattern")
    );

// ─── Password Field (edit — optional) ────────────────────────────────────────
export const passwordOptionalField = Yup.string()
    .nullable()
    .optional()
    .test("min-length", () => i18nT("validation:user.password.min"), (v) => !v || v.length >= 8)
    .test("max-length", () => i18nT("validation:user.password.max"), (v) => !v || v.length <= 100)
    .test("strength", () => i18nT("validation:user.password.pattern"), (v) =>
        !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(v)
    );

// ─── Profile Image Field ──────────────────────────────────────────────────────
// allowStringUrl: true in edit mode where an existing URL string is valid
export const profileImageField = (allowStringUrl = false) =>
    Yup.mixed()
        .test("fileSize", () => i18nT("validation:user.image.size"), (file) => {
            if (!file || (allowStringUrl && typeof file === "string")) return true;
            return file.size <= 5 * 1024 * 1024;
        })
        .test("fileType", () => i18nT("validation:user.image.type"), (file) => {
            if (!file || (allowStringUrl && typeof file === "string")) return true;
            return ["image/jpeg", "image/png"].includes(file.type);
        })
        .nullable()
        .optional();
