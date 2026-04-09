import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

 const createslices = createSlice({
    name : "sendingname",
    initialState :{
        name : "",
        firstletter : "",
        username : "",
        loginname : "",
        creatorname: "",
        question: ""
    },
    reducers : {
        sendname : (state, action) => {
            state.name = action.payload
    },
    sendletter:(state,action) =>{
        state.firstletter = action.payload
    },
    sendusername:(state,action) =>{
        state.username = action.payload
    },
    sendloginname:(state,action) =>{
        state.loginname = action.payload
    },
    sendcreatorname:(state,action) =>{
        state.creatorname = action.payload
    },
    sendquestion:(state,action) =>{
        state.question = action.payload
    },
    
},

 })
export const{sendname}  = createslices.actions;
export const {sendletter} = createslices.actions;
export const {sendusername} = createslices.actions;
export const {sendloginname} = createslices.actions;
export const {sendcreatorname} = createslices.actions;
export const {sendquestion} = createslices.actions;
export default createslices.reducer;