import { SET_ROOM_INFO } from '../Types';

const initialState = {
    roomInfo: {}
}

export default function roomReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ROOM_INFO:
            return {
                ...state,
                roomInfo: action.roomInfo
            }
        default: return state
    }
}
