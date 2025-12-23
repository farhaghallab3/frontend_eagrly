import { fetchCategories } from './../store/slices/CategorySlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return { categories, loading, error };
};
