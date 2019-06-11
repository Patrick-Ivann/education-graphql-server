export const ERROR = {
    USER: {
        WRONG_PASSWORD: 'Mauvais Mot de passe',
        WRONG_CREDENTIALS: 'Il n\'y a pas d\'utilisateur avec associé',
        DOES_NOT_EXIST: 'Il n\'y a pas d\'utilisateur associé',
    },
};



export const {
    CONSTANTS: {
        UNAUTHORIZED = 'Unauthorized!'
    } = {}
} = APP;
export const {
    CONSTANTS: {
        FORBIDDEN = 'Forbidden'
    } = {}
} = APP;
export const {
    CONSTANTS: {
        NOT_ALLOWED = 'Not allowed'
    } = {}
} = APP;




const rolesAndPermissions = {
    ADMIN: {
        SPEC: SCOPES.ROLES.ADMIN,
        PERMISSIONS: {
            [SCOPES.OPERATION.READ]: [
                SCOPES.TYPE.PROFILE,
                // add more
            ],
            [SCOPES.OPERATION.CREATE]: [
                SCOPES.TYPE.PROFILE,
                // add more
            ],
        },
    },
    USER: {
        PERMISSIONS: {
            [SCOPES.OPERATION.READ]: [
                // add more
            ],
            [SCOPES.OPERATION.CREATE]: [
                // add more
            ],
        },
    },
    // add more
};



export const SCOPES = {
    OPERATION: {
        READ: 'read',
        EDIT: 'edit',
        CREATE: 'create',
        DELETE: 'delete',
        // add more
    },
    TYPE: {
        PROFILE: 'profile',
        BILLING: 'profile',
        // add more
    },
    ROLES: {
        OWNER: {
            RANK: 0,
            VALUE: 'OWNER',
        },
        ADMIN: {
            RANK: 1,
            VALUE: 'ADMIN',
        },
        USER: {
            RANK: 2,
            VALUE: 'USER',
        },
        // add more
    },
};