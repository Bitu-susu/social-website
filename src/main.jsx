import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/Store.js'
import Profile from './actions/mainmenu/profile/profile.jsx'
import { PersistGate } from 'redux-persist/integration/react'
 import { persistor } from './redux/Store.js'
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider store ={store} >
       <PersistGate loading={null} persistor={persistor}>
    <App />
    {/* <Profile></Profile> */}
    </PersistGate>
    </Provider>
    </QueryClientProvider>
     </StrictMode> 
)
