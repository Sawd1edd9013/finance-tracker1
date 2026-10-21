import { createSelector } from "reselect";

export const selectCategoriesState = (state) => state.categories;

export const selectCategories = (state) => state.categories.items;

export const selectCategoriesIsLoading = (state) => state.categories.isLoading;

export const selectCategoriesIsLoaded = (state) => state.categories.isLoaded;

export const selectCategoriesError = (state) => state.categories.error;

export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories) =>
    categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {}),
);

export const selectCategoryById = (state, id) =>
  state.categories.items.find((category) => category.id === id) || null;
