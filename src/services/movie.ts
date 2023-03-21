import { deleteRequest, getRequest } from "../utils/request"
import { Movie, MovieList } from '../lib/app-interface' 
import movieUtils from '../utils/movie'
import { message } from "antd"
import { duration } from "moment"

// 获取电影列表
const getAllMovies = async (page?: number, pageSize?: number) => {
    let movieList: MovieList = {
        movies: [],
        currentPage: 0,
        totalMovies: 0,
        totalPages: 0
    }
    try {
        const resp = await getRequest('/api/movies/', {page, pageSize})
        movieList = {
            movies: resp.data.movies.map((movie:Movie)=>movieUtils.movieDetail(movie)),
            currentPage: resp.data.currentPage,
            totalMovies: resp.data.totalMovies,
            totalPages: resp.data.totalPages
        }
    } catch (error) {
        throw error
    }

    return movieList
}

// 获取上映地区列表
const getAllCountry =async () => {
    let countryList: any = {}
    try {
        const resp = await getRequest('/api/movies/countries')
        for (const value of resp.data.countries) {
            countryList[value] = value
        }
    } catch (error) {
        throw error
    }
    return countryList
}

// 获取电影列表
const getAllLanguage =async () => {
    let languageList: any = {}
    try {
        const resp = await getRequest('/api/movies/languages')
        for (const value of resp.data.languages) {
            languageList[value] = value
        }
    } catch (error) {
        throw error
    }
    return languageList
}

// 根据条件查询电影列表
const getFilterMovies = async (params:{name:string,rate:number,countries:string,languages:string,page:number,pageSize:number}) => {
    let movieList: MovieList = {
        movies: [],
        currentPage: 0,
        totalMovies: 0,
        totalPages: 0
    }
    try {
        const resp = await getRequest('/api/movies/filterMovies', params)
        movieList = {
            movies: resp.data.movies.map((movie:Movie)=>movieUtils.movieDetail(movie)),
            currentPage: resp.data.currentPage,
            totalMovies: resp.data.totalMovies,
            totalPages: resp.data.totalPages
        }
    } catch (error) {
        throw error
        
    }
    return movieList
}

// 删除电影
const delMovies = async (doubanIds: string[] | string) => {
    let deletedCount: number = 0
    if(!Array.isArray(doubanIds)) doubanIds = [doubanIds]
    try {
        console.log(doubanIds)
        const resp = await deleteRequest('/api/movies/deleteMovies', {doubanIds: doubanIds.join(',')})
        deletedCount = resp.data.deletedCount
    } catch (error) {
        message.error({content:JSON.stringify(error), duration:3})
    }
    return deletedCount
}

export default {
    getAllMovies,
    getAllCountry,
    getAllLanguage,
    getFilterMovies,
    delMovies
}