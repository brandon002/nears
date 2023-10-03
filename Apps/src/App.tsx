import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
// import authToken from './utils/authToken';
import { PrivateRoute} from './components/index';
import { remember } from './redux/slices/authSlice';
import { Register, Login, ForgotPassword, ResetPassword, LandingPage, EditProfile, Forum, SearchUser, User, Group, SearchGroup, Threads, Meetings, UserThreads, Leaderboard, VerificationPage} from "./pages/index"

import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme';
function App() { 
  if (localStorage.jwtToken) {
    store.dispatch(remember());
  }
  return (
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<LandingPage user={store.getState().login} />}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/profile" element={<EditProfile user={store.getState().login}/>}/>
              <Route path="/forum" element={<Forum user={store.getState().login}/>}/>
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/search-user" element={<SearchUser user={store.getState().login} />} />
              <Route path="/friend/:id" element={<User user={store.getState().login} />} />
              <Route path="/group/:id" element={<Group user={store.getState().login} />} />
              <Route path="/threads" element={<Threads user={store.getState().login} />} />
              <Route path="/user-threads/:id" element={<UserThreads user={store.getState().login} />} />
              <Route path="/meetings" element={<Meetings user={store.getState().login} />} />
              <Route path="/search-group" element={<SearchGroup user={store.getState().login} />} />
              <Route path="/leaderboard" element={<Leaderboard user={store.getState().login} />} />
              <Route path="/home" element={<PrivateRoute />}/>
              <Route path="/verificationPage" element={<VerificationPage />}/>
            </Routes>
          </HashRouter>
        </ChakraProvider>
      </Provider>
    
  );
}

export default App;
 
