import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    text: '',
    indexLetter: 0
};

export const fetchText = createAsyncThunk(
    'text/fetchText',
    async () => {
        try {
            const response = await fetch('https://baconipsum.com/api/?type=all-meat&paras=1');
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }
);

const textSlice = createSlice({
    name: "text",
    initialState,
    reducers: {
        setIndex: (state, action) => {
            state.indexLetter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchText.fulfilled, (state, action) => {
            state.text = action.payload[0];
        });
    }
});
const {reducer: textReducer, actions} = textSlice;
export { textReducer };
export const {setIndex} = actions;