import { deleteRequest, getRequest, postRequest } from '@/utils/request';
import categoryUtils from '../utils/category';

const getCategoryList = async (page: number, pageSize: number, name?: string) => {
  const resp = await getRequest('/api/admin/categoryList', { page, pageSize, name });
  return {
    categories: resp.data.list.map((category: any) => categoryUtils.categoryDetail(category)),
    currentPage: resp.data.currentPage,
    totalCategories: resp.data.totalData,
    totalPages: resp.data.totalPages,
  };
};

const addCategory = async (name: string) => {
  const resp = await postRequest('/api/admin/addCategory', { name });
  return {
    success: resp.data.success,
    msg: resp.data.message,
  };
};

const deleteCategory = async (_id: string) => {
  const resp = await deleteRequest('/api/admin/deleteCategory', { _id });
  return {
    deletedCount: resp.data.deletedCount,
  };
};

export default {
  getCategoryList,
  addCategory,
  deleteCategory,
};
