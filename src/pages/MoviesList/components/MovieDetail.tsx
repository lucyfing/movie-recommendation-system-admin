import { Movie } from "@/lib/app-interface";
import './MovieDetail.less';

export function MovieDetail(props: {movieDetail: Movie}) {
    return (
      <div className='introduce-content'>
        <div className='poster'>
          <img src={props.movieDetail?.poster} alt="海报" className='poster-img'/>
          <h3 className='poster-name'>{props.movieDetail?.name}</h3>
        </div>
        <div>
          <h3>概述</h3>
          {props.movieDetail?.description}
        </div>
        <div>
          <h3>影片信息</h3>
          <p>类型：{props.movieDetail?.movieTypes.join('/')}</p>
          <p>制片地区/国家：{props.movieDetail?.countries.join('/')}</p>
          <p>语言：{props.movieDetail?.languages.join('/')}</p>
        </div>
        <div>
          <h3>演职人员</h3>
          <p>导演：{props.movieDetail?.directors.join('/')}</p>
          <p>主演：{props.movieDetail?.actors.join('/')}</p>
        </div>
      </div>
    )
  }