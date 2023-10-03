import { configureStore } from '@reduxjs/toolkit'
import registerReducer from './slices/registerSlice'
import loginReducer from './slices/authSlice'
import forgotPasswordReducer from './slices/forgotPasswordSlice'
import resetPasswordReducer from './slices/resetPasswordSlice'
import profileReducer from './slices/profileSlice'
import forumReducer from './slices/forumSlice'
import {groupForum} from './slices/forumSlice'
import friendReducer from './slices/friendSlice'
import usersReducer from './slices/usersSlice'
import groupReducer from './slices/groupSlices'
import meetingReducer from './slices/meetingSlice'
import leaderBoardReducer from './slices/leaderBoardSlice'
export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    forgotPassword:forgotPasswordReducer,
    resetPassword:resetPasswordReducer,
    profile: profileReducer,
    forum: forumReducer,
    groupForum:groupForum,
    friend: friendReducer,
    users: usersReducer,
    group: groupReducer,
    meeting: meetingReducer,
    leaderboard: leaderBoardReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    // thunk: {
    //   extraArgument: myCustomApiService,
    // },
    serializableCheck: false,
  }),
})