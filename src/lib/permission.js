// ── Default Permission Structure (template example) ──────────────────────────
// Define your project's permission structure here. Each module contains
// resources, and each resource has an array of permission keys.
export const defaultPermission = {
    "administration": {
        "users": [
            "administration.users.create",
            "administration.users.view",
            "administration.users.update",
            "administration.users.delete"
        ],
        "user_role": [
            "administration.user_role.create",
            "administration.user_role.view",
            "administration.user_role.update",
            "administration.user_role.delete"
        ]
    },
    // Add more modules here as your project grows:
    // "inventory": {
    //     "products": [
    //         "inventory.products.create",
    //         "inventory.products.view",
    //         "inventory.products.update",
    //         "inventory.products.delete"
    //     ],
    // },
}

// ── Core Permission Engine ───────────────────────────────────────────────────
// These utilities normalise and check permission tokens. They are
// project-agnostic and should NOT need modification.

const normalizePermissionToken = (token) => String(token || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeResourceToken = (token) => {
    const normalized = normalizePermissionToken(token);
    if (!normalized) return "";
    return normalized;
};

const normalizePermissionKey = (value) => {
    if (typeof value !== "string") return null;

    const candidate = value.trim();
    if (!candidate) return null;

    const parts = candidate
        .replace(/:/g, ".")
        .split(".")
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length < 3) return null;

    const action = normalizePermissionToken(parts[parts.length - 1]);
    const moduleName = normalizePermissionToken(parts[0]);
    const resourceRaw = parts.slice(1, -1).join("_");
    const resource = normalizeResourceToken(resourceRaw);

    if (!moduleName || !resource || !action) return null;

    return `${moduleName}.${resource}.${action}`;
};

const extractFromNestedValue = (value, collector) => {
    if (!value) return;

    if (typeof value === "string") {
        const normalized = normalizePermissionKey(value);
        if (normalized) collector.add(normalized);
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => extractFromNestedValue(item, collector));
        return;
    }

    if (typeof value === "object") {
        if (typeof value.permissionKey === "string") {
            extractFromNestedValue(value.permissionKey, collector);
        }
        if (typeof value.key === "string") {
            extractFromNestedValue(value.key, collector);
        }

        Object.values(value).forEach((nested) => extractFromNestedValue(nested, collector));
    }
};

export const extractPermissionKeys = (permissionResponse) => {
    const keys = new Set();
    extractFromNestedValue(permissionResponse, keys);
    return Array.from(keys);
};

/**
 * Check if a user has a specific permission for a scoped resource.
 *
 * @param {string[]|Set<string>} permissionKeys - The user's granted permission keys
 * @param {string} scopeKey - The resource scope (e.g. "administration.users")
 * @param {string} action - The action to check (e.g. "view", "create", "update", "delete")
 * @returns {boolean}
 */
export const hasScopedPermission = (permissionKeys, scopeKey, action) => {
    if (!scopeKey || !action) return false;

    const normalizedAction = normalizePermissionToken(action);
    const scopeParts = String(scopeKey).split(".");
    if (scopeParts.length < 2) return false;
    const normalizedScope = `${normalizePermissionToken(scopeParts[0])}.${normalizeResourceToken(scopeParts.slice(1).join("_"))}`;
    const [scopeModule, scopeResource] = normalizedScope.split(".");

    if (!Array.isArray(permissionKeys) && !(permissionKeys instanceof Set)) {
        return false;
    }

    const keySet = permissionKeys instanceof Set
        ? permissionKeys
        : new Set(permissionKeys.map((key) => normalizePermissionKey(key)).filter(Boolean));

    const resourceCompact = scopeResource.replace(/_/g, "");
    const resourceSingular = scopeResource.endsWith("s") ? scopeResource.slice(0, -1) : scopeResource;
    const resourcePlural = scopeResource.endsWith("s") ? scopeResource : `${scopeResource}s`;

    const expectedPermissions = new Set([
        `${scopeModule}.${scopeResource}.${normalizedAction}`,
        `${scopeModule}.${resourceCompact}.${normalizedAction}`,
        `${scopeModule}.${resourceSingular}.${normalizedAction}`,
        `${scopeModule}.${resourcePlural}.${normalizedAction}`,
    ]);

    for (const key of keySet) {
        if (expectedPermissions.has(key)) return true;
    }

    return false;
};

// ── Project-Specific Permission Helpers ──────────────────────────────────────
// Add permission helpers for your project's resources below.
// Example pattern:
//
// export const hasProductPermission = (permissionKeys, action) =>
//     hasScopedPermission(permissionKeys, "inventory.products", action);
