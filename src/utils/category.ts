import { Category } from '@/lib/app-interface';

const categoryDetail = (category: Category) => ({
  _id: category._id,
  name: category.name,
  moviesLen: category.movies?.length,
  createdAt: category.meta?.createdAt.slice(0, 10),
});

export default {
  categoryDetail,
};
