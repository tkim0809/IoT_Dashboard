import axios from "axios"

export const baseURL = "http://localhost:4000"

export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
            headers: { Authorization: "Bearer " + token }
        })
        return res.data;
    } catch (err) {
        return null;
    }
}

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/getUsers`)
        return res.data;
    } catch (error) {
        return null;
    }
}

export const changingUserRole = async (userId, role) => {
    try {
        const res = axios.put(`${baseURL}/api/users/updateRole/${userId}`, {
            role: role,
        });
        return res;
    } catch (error) {
        return null;
    }
}

export const removeUser = async (userId) => {
    try {
        const res = axios.delete(`${baseURL}/api/users/deleteUser/${userId}`);
        return res;
    } catch (error) {
        return null;
    }
}