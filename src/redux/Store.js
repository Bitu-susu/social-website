// import React from 'react'
import { configureStore } from '@reduxjs/toolkit';
// import { sender } from '../actions/mainmenu/login/signup/Signup';
// import Signup from '../actions/mainmenu/login/signup/Signup';
// import { sender } from './createslice';
import createslicesReducer from './createslice';
// import { leg } from './createslice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage, 
  };
  const persistedReducer = persistReducer(persistConfig, createslicesReducer);
const store = configureStore({

    // reducer : {
    //     sendingname : createslicesReducer,
    // }
    reducer: {
        sendingname: persistedReducer,
        
      },
})
// console.log("Redux Store Initial State:", store.getState());
export const persistor = persistStore(store);
export default store;  