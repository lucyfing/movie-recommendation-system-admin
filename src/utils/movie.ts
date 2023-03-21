import { Movie } from "@/lib/app-interface";

// 获取统一的电影详细数据
const movieDetail = (movie: Movie) => ({
    doubanId: movie.doubanId || '',
    rate: movie.rate || 0,
    name: movie.name || '',
    description: movie.description || '',
    video: movie.video || '',
    poster: movie.poster || '',
    movieTypes: movie.movieTypes || [],
    year: movie.year || 0,
    languages: movie.languages || [],
    countries: movie.countries || [],
    actors: movie.actors || [],
    directors: movie.directors || [],
    writers: movie.writers || [],
    dateReleased: movie.dateReleased || '',
    meta: {
        createdAt: new Date(movie.meta.createdAt),
        updatedAt: new Date(movie.meta.updatedAt)
    }
})


export default {
    movieDetail
}