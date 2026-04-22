import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categories";
import {
  categoriesFailure,
  categoriesRequest,
  categoriesSuccess,
} from "./actions";

export const fetchCategoriesThunk =
  ({ force = false } = {}) =>
  async (dispatch, getState) => {
    const { categories } = getState();

    if (!force && categories.isLoaded) {
      return categories.items;
    }

    dispatch(categoriesRequest());

    try {
      const response = await getCategories();
      dispatch(categoriesSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(categoriesFailure(error.message));
      throw error;
    }
  };

export const createCategoryThunk = (payload) => async (dispatch) => {
  try {
    await createCategory(payload);
    await dispatch(fetchCategoriesThunk({ force: true }));
  } catch (error) {
    dispatch(categoriesFailure(error.message));
    throw error;
  }
};

export const updateCategoryThunk = (id, payload) => async (dispatch) => {
  try {
    await updateCategory(id, payload);
    await dispatch(fetchCategoriesThunk({ force: true }));
  } catch (error) {
    dispatch(categoriesFailure(error.message));
    throw error;
  }
};

export const deleteCategoryThunk = (id) => async (dispatch) => {
  try {
    await deleteCategory(id);
    await dispatch(fetchCategoriesThunk({ force: true }));
  } catch (error) {
    dispatch(categoriesFailure(error.message));
    throw error;
  }
};
