import {
  BorderBox1,
  BorderBox13,
  BorderBox8,
  DigitalFlop,
  ScrollBoard,
  ScrollRankingBoard,
} from '@jiaminghi/data-view-react';
import echarts from 'echarts';
import { Component } from 'react';
import api from '../../services/welcome';
import './Welcome.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart2: null,
      myChart3: null,
      myChart4: null,
      myChart5: null,
      myChart6: null,
      topdata: {
        data: [],
        carousel: '分',
      },
      tabledata: {
        header: ['影片', '上映地区', '上映语言'],
        data: [],
        index: true,
        columnWidth: [40, 250, 100],
        align: ['center'],
      },
      digConfig: {
        number: [0],
        content: '电影总数  ',
        textAlign: 'center',
        rowGap: 5,
        style: {
          fill: 'rgb(42, 156, 181)',
        },
      },
      digUserConfig: {
        number: [0],
        content: '用户总数  ',
        textAlign: 'center',
        rowGap: 5,
        style: {
          fill: 'rgb(42, 156, 181)',
        },
      },
    };
  }
  async componentDidMount() {
    const movies = await api.getHottstMovies();
    const count = await api.getAllCount();
    this.setState({
      topdata: {
        data: movies.map((movie) => ({ name: movie.name, value: movie.value })),
        carousel: 'single',
      },
      tabledata: {
        header: ['影片', '上映地区', '上映语言'],
        data: movies.map((movie) => [movie.name, movie.countries, movie.languages]),
        index: true,
        columnWidth: [40, 250, 100],
        align: ['center'],
        headerBGC: '#071E3D',
        evenRowBGC: '#bbcdc5',
        oddRowBGC: '#88ada6',
        headerBGC: '#4890A0',
      },
      digConfig: {
        number: [count.moviesCount],
        content: '电影总数  ',
        textAlign: 'center',
        rowGap: 5,
        style: {
          fill: 'rgb(42, 156, 181)',
        },
      },
      digUserConfig: {
        number: [count.userCount],
        content: '用户总数  ',
        textAlign: 'center',
        rowGap: 5,
        style: {
          fill: 'rgb(42, 156, 181)',
        },
      },
    });
    this.initalECharts1();
    this.initalECharts5();
    const that = this;
    window.onresize = function () {
      that.state.myChart2.resize();
      that.state.myChart6.resize();
    };
  }
  async initalECharts5() {
    const moviesArr = await api.getMovieLen();
    const newHighArr = moviesArr.filter((movie) => movie.len > 10 && movie);
    this.setState({ myChart6: echarts.init(document.getElementById('mainMap3')) }, () => {
      this.state.myChart6.setOption({
        title: {
          show: true,
          text: '电影类型排行榜',
          x: 'center',
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
            color: '#071e3d',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: newHighArr.map((item) => item.name),
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#071e3d'],
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#1f4287', //更改坐标轴文字颜色
              fontSize: 12, //更改坐标轴文字大小
            },
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#07234d'],
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#c3dbff', //更改坐标轴文字颜色
              fontSize: 12, //更改坐标轴文字大小
            },
          },
        },
        series: [
          {
            name: '影片个数（部）',
            type: 'bar',
            data: newHighArr.map((item) => item.len),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#278ea5' },
              ]),
            },
          },
        ],
      });
    });
  }

  async initalECharts1() {
    let countryMovies = await api.getCountryMovies();
    countryMovies = countryMovies.sort((a, b) => b.count - a.count).slice(0, 5);
    const countryData = countryMovies.map((item, index) => {
      if (index == 4) return { value: item.count, name: '其它' };
      return { value: item.count * 2, name: item.country };
    });
    const countries = countryData.map((item) => item.name);
    this.setState({ myChart2: echarts.init(document.getElementById('provinceMap')) }, () => {
      this.state.myChart2.setOption({
        color: ['#071e3d', '#278ea5', '#21e6c1', '#37cbff', '#1f4287'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          top: 30,
          right: '10%',
          data: countries,
          textStyle: {
            fontSize: 12,
            color: '#071e3d',
          },
          icon: 'circle',
          itemWidth: 10, // 设置宽度

          itemHeight: 10, // 设置高度

          itemGap: 10, // 设置间距
        },
        series: [
          {
            name: '影片个数（部）',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: countryData,
          },
        ],
      });
    });
  }

  render() {
    const { topdata, tabledata, digUserConfig, digConfig } = this.state;
    return (
      <div className="data">
        <div className="wrapper">
          <div className="container-fluid">
            {/* 左上 */}
            <div className="fill-h-1" style={{ width: '30%' }}>
              <div className="xpanel-wrapper xpanel-wrapper-5" style={{ height: '100%' }}>
                <BorderBox13 color={['#182952', '#44679f']}>
                  <div className="xpanel">
                    <div className="inner-title">收藏热度最高的10部电影</div>
                    <div className="fill-h-3" id="mainMap1" style={{ color: '#224894' }}>
                      <ScrollRankingBoard config={topdata} />
                    </div>
                  </div>
                </BorderBox13>
              </div>
            </div>

            {/* 上中 */}
            <div className="fill-h-1" style={{ width: '40%' }}>
              <div className="content_title">电影上映地区分布占比</div>
              <BorderBox1 color={['#182952', '#44679f']}>
                <div className="xpanel">
                  <div className="fill-h" id="provinceMap"></div>
                </div>
              </BorderBox1>
            </div>

            {/* 右上 */}
            <div className="fill-h-1" style={{ width: '25%' }}>
              <BorderBox13 color={['#182952', '#44679f']}>
                <div className="xpanel">
                  <div className="inner-title">电影及用户总数</div>
                  <div className="fill-h-3" style={{ paddingLeft: '40px' }}>
                    <DigitalFlop
                      config={digConfig}
                      style={{ width: '200px', height: '50px', marginTop: '40px' }}
                    />
                    <DigitalFlop
                      config={digUserConfig}
                      style={{ width: '200px', height: '50px', marginTop: '40px' }}
                    />
                  </div>
                </div>
              </BorderBox13>
            </div>

            {/* 左下 */}
            <div className="fill-h-2" style={{ width: '45%' }}>
              <BorderBox8 color={['#182952', '#44679f']}>
                <div className="xpanel">
                  <div className="inner-title" style={{ position: 'relative', top: '-10px' }}>
                    收藏热度最高的电影分布
                  </div>
                  <div className="fill-h-3" id="worldMap">
                    <ScrollBoard config={tabledata} style={{ width: '530px' }} />
                  </div>
                </div>
              </BorderBox8>
            </div>

            {/* 右下 */}
            <div className="fill-h-2" style={{ width: '50%' }}>
              <BorderBox8 color={['#182952', '#44679f']}>
                <div className="xpanel">
                  <div className="fill-h" id="mainMap3"></div>
                </div>
              </BorderBox8>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
