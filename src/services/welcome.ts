import { getRequest } from '@/utils/request';

const getHottstMovies = async () => {
  const resp = await getRequest('/api/admin/getHottstMovies');
  return resp.data.movies.map((movie: any) => ({
    name: movie.name,
    value: movie.votes,
    languages: movie.languages,
    countries: movie.countries,
  }));
};

// 获取电影和用户总数
const getAllCount = async () => {
  const resp = await getRequest('/api/admin/getAllCount');
  return {
    userCount: resp.data.userCount,
    moviesCount: resp.data.moviesCount,
  };
};

// 获取类型关联电影的数量
const getMovieLen = async () => {
  const resp = await getRequest('/api/admin/getMovieLen');
  return resp.data.moviesArr;
};

// 获取地区上映电影数
const getCountryMovies = async () => {
  const resp = await getRequest('/api/admin/getCountryMovies');
  return resp.data.result;
};

export default {
  getHottstMovies,
  getAllCount,
  getMovieLen,
  getCountryMovies,
};
