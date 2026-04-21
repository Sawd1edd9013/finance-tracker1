export const selectAccountsState = (state) => state.accounts;

export const selectAccounts = (state) => state.accounts.items;

export const selectAccountsIsLoading = (state) => state.accounts.isLoading;

export const selectAccountsIsLoaded = (state) => state.accounts.isLoaded;

export const selectAccountsError = (state) => state.accounts.error;

export const selectAccountsMap = (state) =>
  state.accounts.items.reduce((acc, account) => {
    acc[account.id] = account.name;
    return acc;
  }, {});

export const selectAccountById = (state, id) =>
  state.accounts.items.find((account) => account.id === id) || null;
