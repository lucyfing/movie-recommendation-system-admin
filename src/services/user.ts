import { deleteRequest, postRequest } from '@/utils/request';
import userUtils from '../utils/user';

const getUserList = async (params: {
  page: number;
  pageSize: number;
  username?: string;
  email?: string;
  status?: number;
}) => {
  const resp = await postRequest('/api/admin/userList', params);
  return {
    users: resp.data.list.map((user: any) => userUtils.userDetail(user)),
    totalUsers: resp.data.totalData,
    currentPage: resp.data.currentPage,
    totalPages: resp.data.totalPages,
  };
};

const addUser = async (username: string, email: string, password: string) => {
  const resp = await postRequest('/api/admin/addUser', { username, email, password });
  return {
    success: resp.data.success,
    msg: resp.data.message,
  };
};

const delUsers = async (_ids: string[] | string) => {
  if (!Array.isArray(_ids)) _ids = [_ids];
  const resp = await deleteRequest('/api/admin/delUsers', { _ids: JSON.stringify(_ids) });
  return resp.data.deletedCount;
};

export default {
  getUserList,
  addUser,
  delUsers,
};
