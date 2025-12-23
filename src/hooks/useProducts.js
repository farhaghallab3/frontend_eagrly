import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
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

  const refetch = () => dispatch(fetchProducts());
  const refetchMyProducts = () => dispatch(fetchMyProducts());

  const addProduct = async (data) => {
    const result = await dispatch(createProduct(data));
    if (createProduct.fulfilled.match(result)) {
      refetchMyProducts();
      return result.payload;
    }
    if (createProduct.rejected.match(result)) {
      throw result.payload;
    }
    return null;
  };

  const editProduct = async (id, data) => {
    const result = await dispatch(updateProduct({ id, data }));
    if (updateProduct.fulfilled.match(result)) {
      refetchMyProducts();
      return result.payload;
    }
    if (updateProduct.rejected.match(result)) {
      throw result.payload;
    }
    return null;
  };

  const removeProduct = async (id) => {
    const result = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(result)) {
      refetchMyProducts();
      return true;
    }
    if (deleteProduct.rejected.match(result)) {
      throw result.payload;
    }
    return false;
  };

  useEffect(() => {
    refetch();
  }, [dispatch]);

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
    getMyProducts: () => dispatch(fetchMyProducts()),
  };
};
