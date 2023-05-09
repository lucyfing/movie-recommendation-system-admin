export interface Movie {
  doubanId: string;
  rate: number; //电影评分
  name: string; // 电影名称
  description: string; // 电影简介
  video: string; // 电影预告
  poster: string; // 电影海报
  movieTypes: [string]; // 电影类型
  year: number; // 电影年份
  languages: [string]; // 电影语言
  countries: [string]; // 电影地区
  actors: [string]; // 电影演员
  directors: [string]; // 电影导演
  writers: [string]; // 电影编剧
  dateReleased: string; // 电影上映时间
  meta: {
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface Category {
  _id: string;
  name: string;
  movies?: string[];
  moviesLen?: number;
  createdAt?: string;
  meta?: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface categoryList {
  categories: Array<Category>;
  currentPage: number;
  totalCategories: number;
  totalPages: number;
}

export interface MovieList {
  movies: Array<Movie>;
  currentPage: number;
  totalMovies: number;
  totalPages: number;
}

export interface User {
  _id: string;
  role?: string;
  username: string;
  email: string;
  description?: string;
  status?: number;
}

export interface UserList {
  users: Array<User>;
  currentPage: number;
  totalUsers: number;
  totalPages: number;
}
