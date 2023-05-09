import { User } from '@/lib/app-interface';

const userDetail = (user: User) => ({
  _id: user._id,
  role: user.role || '',
  username: user.username || '',
  email: user.email || '',
  description: user.description || '',
  status: user.status,
});

export default {
  userDetail,
};
