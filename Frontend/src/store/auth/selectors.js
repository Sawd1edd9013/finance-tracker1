export const selectAuth = (state) => state.auth;

export const selectCurrentUser = (state) => state.auth.user;

export const selectAuthIsLoading = (state) => state.auth.isLoading;

export const selectAuthError = (state) => state.auth.error;

export const selectIsAuthChecked = (state) => state.auth.isAuthChecked;
