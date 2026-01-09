import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
  fetchProducts,
  fetchMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productSlice";

export const useProduct = () => {
  const dispatch = useDispatch();
  const { products, myProducts, loading, error } = useSelector((state) => state.products);

  const refetch = useCallback(() => dispatch(fetchProducts()), [dispatch]);
  const refetchMyProducts = useCallback(() => dispatch(fetchMyProducts()), [dispatch]);

  const addProduct = useCallback(async (data) => {
    const result = await dispatch(createProduct(data));
    if (createProduct.fulfilled.match(result)) {
      refetchMyProducts();
      return result.payload;
    }
    if (createProduct.rejected.match(result)) {
      throw result.payload;
    }
    return null;
  }, [dispatch, refetchMyProducts]);

  const editProduct = useCallback(async (id, data) => {
    const result = await dispatch(updateProduct({ id, data }));
    if (updateProduct.fulfilled.match(result)) {
      refetchMyProducts();
      return result.payload;
    }
    if (updateProduct.rejected.match(result)) {
      throw result.payload;
    }
    return null;
  }, [dispatch, refetchMyProducts]);

  const removeProduct = useCallback(async (id) => {
    const result = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(result)) {
      refetchMyProducts();
      return true;
    }
    if (deleteProduct.rejected.match(result)) {
      throw result.payload;
    }
    return false;
  }, [dispatch, refetchMyProducts]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    products,
    myProducts,
    loading,
    error,
    addProduct,
    editProduct,
    removeProduct,
    refetch,
    refetchMyProducts,
    getMyProducts: refetchMyProducts,
  };
};
