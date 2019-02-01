import jwtDecode from 'jwt-decode';
import axios from 'axios';

import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';
import {saveAuthToken, clearAuthToken} from '../local-storage';

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const CLEAR_AUTH = 'CLEAR_AUTH'
export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'

export const setAuthToken = authToken => ({
    type: SET_AUTH_TOKEN,
    authToken
});

export const clearAuth = () => ({
  type: CLEAR_AUTH,
});

export const authRequest = () => ({
  type: AUTH_REQUEST,
});


export const authSuccess = (currentUser) => ({
  type: AUTH_SUCCESS,
  currentUser
});

export const authError = (error) => ({
  type: AUTH_ERROR,
  error
});

// Stores the auth token in state and localStorage, 
// and decodes and stores the user data stored in the token
const storeAuthInfo = (authToken, dispatch) => {
    const decodedToken = jwtDecode(authToken);
    dispatch(setAuthToken(authToken));
    dispatch(authSuccess(decodedToken.user));
    saveAuthToken(authToken);
};

export const login = (username, password) => dispatch => {
    dispatch(authRequest());
    const config = {
        method: 'post',
        url: `${API_BASE_URL}/auth/login`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            username,
            password
        })
    }
    return (
        axios(config)
        .then(res => res.json())
        .then(({authToken}) => storeAuthInfo(authToken, dispatch))
        .catch(err => {
            const {code} = err;
            const message = 
                code === 401
                ? 'Incorrect username or password'
                : 'Unable to login, please try again';
            dispatch(authError(err));
        })
    )
}