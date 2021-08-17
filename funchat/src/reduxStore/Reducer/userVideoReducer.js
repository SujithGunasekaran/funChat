import { SET_RECEIVING_CALL_INFO } from '../Types';


const initialState = {
    receivingCallInfo: null
}

export default function userVideoReducer(state = initialState, action) {

    switch (action.type) {
        case SET_RECEIVING_CALL_INFO:
            return {
                ...state,
                receivingCallInfo: action.info
            }
        default: return state;
    }

}
