export const initialState = {
    startTime: null,
    hasIncorrectLetter: false,
    letterError: 0
};

export function reducer(state, action) {
    switch (action.type) {
        case 'SET_START_TIME':
            return {
                ...state,
                startTime: action.payload
            };
        case 'SET_HAS_INCORRECT_LETTER':
            return {
                ...state,
                hasIncorrectLetter: action.payload
            };
        case 'SET_LETTER_ERROR':
            return {
                ...state,
                letterError: action.payload
            };
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
}
