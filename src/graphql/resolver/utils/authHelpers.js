import {
    AuthenticationError,ApolloError
} from "apollo-server-core";

import User from "../../../mongoDB/UserSchema";

import jwt from 'jsonwebtoken';


export const checkAuthenticated = req => {
    const message = "Il faut se connecter. "
    if (!req.session.userId) {
        throw new AuthenticationError(message)
    }
}
export const checkUnAuthenticatedNew = req => {
    const message = "Il faut se deconnecter. "
    if (!req || !req.headers || !req.headers.authorization) {
        const authTokenHeader = context.req.headers.authorization;
        const authToken = authTokenHeader.split("Bearer")[1];

        if (jwt.verify(authToken, context.secret)) {
            throw new AuthenticationError(message)

        }
        // throw new AuthenticationError(message)
    }
}
export const checkUnAuthenticated = req => {
    const message = "Il faut se deconnecter. "
    if (req.session.userId) {
        throw new AuthenticationError(message)
    }
}

export const trySignUp = async (mail, password) => {

    const message = "les informations sont fausses, veuillez réessayer."

    const user = await User.findOne({
        mail
    })


    if (!user) {
        throw new AuthenticationError(message)
    }

    if (!await user.checkPasswordEquals(password)) {
        throw new AuthenticationError(message)

    }

    return user
}


export const fun = async () => {

    const token = req.headers['x-token'];
    console.log(token);
    if (token) {
        try {
            const {
                user
            } = jwt.verify(token, SECRET);
            req.user = user;
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(
                token,
                refreshToken,
                models,
                SECRET,
            );
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;
        }
    }
    next();
};



export const createRefreshedToken = async (id, secret, expiresIn) => jwt.sign({
    id
}, secret, {
    expiresIn,
    algorithm: 'HS384'


});
export const createToken = async (user, secret, expiresIn) => {
    var lastConnection = new Date(Date.now())
    const {
        id,
        mail,
        username,
        courses,
        timeSpent
    } = user;
    return await jwt.sign({
        id,
        mail,
        username,
        courses,
        lastConnection,
        timeSpent
    }, secret, {
        expiresIn,
        algorithm: 'HS384'


    });
};

// https: //raw.githubusercontent.com/benawad/graphql-express-template/22_advanced_jwt_auth/auth.js
export const generateTokens = async (user) => {
    
    const {id} = user
    const createToken = jwt.sign({
        id : id,    
        user
        },
        process.env.JWT_SECRET, {
            expiresIn: '35m',
            algorithm: 'HS384'

        },
    );

    const createRefreshToken = jwt.sign({
            id
        },
        process.env.JWT_SECRET_SECOND, {
            expiresIn: '7d',
            algorithm: 'HS384'

        },
    );

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET_2) => {
    let userId = -1;
    try {
        const {
            user: {
                id
            }
        } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) {
        return {};
    }

    const user = await models.User.findOne({
        where: {
            id: userId
        },
        raw: true
    });

    if (!user) {
        return {};
    }

    const refreshSecret = SECRET_2 + user.password;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};


export const regenerateToken = (formerToken, refreshToken, user) => {
    jwt.sign()
}

export const tradeTokenForUser = async (authToken) => {

    return User.findById(authToken);

}

export const tradeTokenForUserNew = async (authToken, secret) => {
    var user = jwt.verify(authToken, secret, {
        algorithms: "HS384"
    });

    return User.findById(user.id);

}

/**
 * 
 * @param {ObjectConstructor} context 
 * @returns {String} trimmedAuthToken
 */
export const extractToken = async (context) =>{

    
    try {
        const authTokenHeader = context.req.headers.authorization;
        const authToken = authTokenHeader.split("Bearer")[1];
        
        return authToken.trim()

    } catch (error) {
        
        throw new ApolloError('UNAUTHORIZED')

    }
}

/**
 * 
 * @param {String} authToken 
 * @param {String} secret 
 */
export const readToken = async (authToken, secret) => {
    
    try {
        var user = jwt.verify(authToken, secret, {
            algorithms: "HS384"
        });
        
        return user
        
    } catch (error) {
        throw new ApolloError('UNAUTHORIZED')
    }

}


export const authenticatedNew = next => (root, args, context, info) => {
    if (!context || !context.req || !context.req.headers.authorization) {
        throw new Error(`UNAUTHORIZED`);

    }
    const authTokenHeader = context.req.headers.authorization;
    const authToken = authTokenHeader.split("Bearer")[1];

    try {
        const user = jwt.verify(authToken, context.secret)
        console.log(user)
    } catch (error) {

        throw new Error(`UNAUTHORIZED`);
    }


    return next(root, args, context, info);
};
