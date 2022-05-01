import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["login"],
        // ignoredActionPaths: ["payload.user"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
