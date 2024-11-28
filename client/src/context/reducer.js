export const actionType = {
    SET_USER: "SET_USER",
    SET_ALL_USERS: "SET_ALL_USERS"

}

const reducer = (state, action) => {
    console.log(action);

    switch (action.type) {
        case actionType.SET_USER:
            return {
                ...state,
                user: action.user
            }

        case actionType.SET_ALL_USERS:
            return {
                ...state,
                allUsers: action.allUsers
            }

        default:
            return state;
    }

}

export default reducer