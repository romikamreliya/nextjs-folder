export const API_LIST = {
    // ── Auth ──────────────────────────────────────────────────────────────────
    login: "/api/v1/auth/login",
    refreshToken: "/api/v1/auth/refresh-token",
    getMyPermissions: "/api/v1/auth/getMyPermissions",
    getMyCompanies: "/api/v1/auth/getMyCompanies",
    getMyCountries: "/api/v1/auth/getMyCountries",

    // ── Common ────────────────────────────────────────────────────────────────
    common: {
        defaultData: "/api/v1/common/default-data",
        users: "/api/v1/common/users",
        usersAll: "/api/v1/common/users?pagination=false",
    },

    // ── Permissions ───────────────────────────────────────────────────────────
    permissions: {
        getAll: "/api/v1/permissions/get",
    },

    // ── Example CRUD Resource (copy this block for new resources) ─────────────
    // resourceName: {
    //     getAll:  "/api/v1/resource-name",
    //     getById: "/api/v1/resource-name",        // append /${id}
    //     create:  "/api/v1/resource-name",
    //     update:  "/api/v1/resource-name",         // append /${id}
    //     delete:  "/api/v1/resource-name",         // append /${id}
    // },
};