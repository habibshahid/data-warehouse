import React                     from 'react';
import HighchartsReact           from 'highcharts-react-official';
import * as Highcharts           from 'highcharts/highcharts';
import * as HighchartsMore       from 'highcharts/highcharts-more';
import * as HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import axios                     from "axios"
import {
  Spinner,
  Menu,
  MenuItem,
  Popover,
  Icon
}                                from "@blueprintjs/core"
import { editWidgetBus }         from '../../systemBus';

require('highcharts/modules/funnel')(Highcharts);
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

export const MultilineChart = (props) => {

  const chartData = {
    chart: {
      scrollablePlotArea: {
        minWidth: props?.data?.series.length * 50, // Minimum width of the plot area
        scrollPositionX: 0 // Initial scroll position
      }
    },

    title: {
      text: props?.data?.title
    },

    subtitle: {
      text: props?.data?.subTitle
    },

    yAxis: {
      title: {
        text: props.data.yAxisTitle
      }
    },

    xAxis: {
      categories: props?.data?.series,
      labels: {
        rotation: -45,
        style: {
          fontSize: '10px'
        }
      }
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    series: props?.data?.chartData,

    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b>' + '<br/>' + '<b>Label: </b>' + this.x + '<br/>' + '<b>Value: </b>' + Math.round(this.y)
      }
    },

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }

  return (
    <HighchartsReact
      highcharts={ Highcharts }
      options={ chartData }
    />
  )
}

const MultiBarChart = (props) => {

  // const chartData = ;

  console.log(props?.data?.series, props?.data?.series.length, '((((((((((((((((((((9')

  return (
    <HighchartsReact
      highcharts={ Highcharts }
      options={ {
        chart: {
          type: "column",
          zoomType: 'x',
          scrollablePlotArea: {
            minWidth: props?.data?.series.length * 50,
            scrollPositionX: 0
          }
        },

        title: {
          text: props?.data?.title
        },

        subtitle: {
          text: props?.data?.subTitle
        },

        yAxis: {
          title: {
            text: props?.data?.yAxisTitle
          }
        },

        xAxis: {
          categories: props?.data?.series,
          labels: {
            rotation: -45,
            style: {
              fontSize: '10px'
            }
          }
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },

        series: props?.data?.chartData,

        tooltip: {
          formatter: function () {
            return `<b>${this.series.name}</b><br/><b>Label:</b> ${this.x}<br/><b>Value:</b> ${Math.round(this.y)}`;
          }
        },

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },

        plotOptions: {
          column: {
            pointWidth: 15 // Fixed bar width
          }
        }
      } }
    />
  )
}

export const StackedPieChart = (props) => {

  const chartData = {
    chart: {
      type: 'column',
      inverted: true,
      polar: true,
    },

    pane: {
      size: '85%',
      innerSize: '20%',
      endAngle: 270
    },

    title: {
      text: props?.data?.title
    },

    yAxis: {
      tickInterval: 0,
    },

    xAxis: {
      categories: props?.data?.series,
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0.15,
        pointWidth: 15 // Fixed bar width
      }
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    series: props?.data?.chartData,

    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b>' + '<br/>' + '<b>Label: </b>' + this.x + '<br/>' + '<b>Value: </b>' + Math.round(this.y)
      }
    },

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }

  return (
    <HighchartsReact
      highcharts={ Highcharts }
      options={ chartData }
    />
  )
}


export default class StackedCharts extends React.PureComponent {
  state = {
    chartData: null,
    status: '',
    series: [],
    error: {}
  }

  setData = async () => {
    const { file, status, error } = this.props.data

    if (status === 'ready') {

      let url = this.props.shouldRenderGlobal ? `${ window.env.FILE_UPLOAD }${ file[1]?.url }` : `${ window.env.FILE_UPLOAD }${ file[0]?.url }`

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {

        const { chartData, series } = response.data

        this.setState({
          status,
          chartData,
          series,
          error
        })
      }
    }
    else {
      this.setState({
        status,
        error
      })
    }
  }

  componentDidMount() {
    this.setData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.setData()
    }
  }

  showData = () => {
    const { status, error } = this.state

    const { name, chartType } = this.props.data

    return (
      <>
        {
          status === 'ready' ? (
            <div className={ !!this.state.chartData ? 'biReadyCards' : '' }>
              <React.Fragment>
                {
                  chartType.value === 'bar' ? (
                    <MultiBarChart
                      data={
                        {
                          chartData: this.state.chartData,
                          series: this.state.series,
                          title: name,
                          subtitle: "chart",
                          yAxisTitle: "Counts"
                        }
                      }
                    />
                  ) : chartType.value === 'line' ? (
                    <MultilineChart
                      data={
                        {
                          chartData: this.state.chartData,
                          series: this.state.series,
                          title: name,
                          subtitle: "chart",
                          yAxisTitle: "Counts"
                        }
                      }
                    />
                  ) : (
                    <StackedPieChart
                      data={
                        {
                          chartData: this.state.chartData,
                          series: this.state.series,
                          title: name,
                          subtitle: "chart",
                          yAxisTitle: "Counts"
                        }
                      }
                    />
                  )
                }
              </React.Fragment>
            </div>
          ) : status === 'processing' ? (
            <div className={ 'biStackedCharts' }>
              <div className={ 'biChartHeading' }>Processing</div>
              <p className={ `additionalInfo` }>Doing calculations, your representation will be available shortly</p>
              <div className={ 'biChartSpinner' }>
                <Spinner
                  intent={ `primary` }
                />
              </div>
            </div>
          ) : status === 'waiting' ? (
            <div className={ 'biStackedCharts' }>
              <div className={ 'biChartHeading' }>Waiting</div>
              <p className={ `additionalInfo` }>Waiting for my turn, will process your data shortly</p>
              <div className={ 'biChartSpinner' }>
                <Spinner
                  intent={ `primary` }
                />
              </div>
            </div>
          ) : status === "error" ? (
            <div className={ 'biStackedCharts' }>
              <div className={ 'biChartHeading' }>Error!</div>
              <p className={ `additionalInfo` }>An error occured during processing</p>
              <div className={ 'biChartSpinner' }>
                <Popover
                  position={ `bottom` }
                  content={ (
                    <p style={ { padding: "1rem" } }>{ error.error.message }</p>
                  ) }
                >
                  <Icon
                    icon={ 'issue' }
                    intent={ 'danger' }
                    size={ 40 }
                    style={ {
                      cursor: "pointer"
                    } }
                  /></Popover>
              </div>
            </div>
          ) : (<></>)
        }
      </>
    )
  }

  moreOptions = () => {

    const editMenu = () => {
      return (
        <Menu>
          <MenuItem
            text={ `Edit` }
            icon={ `annotation` }
            onClick={ () => {
              editWidgetBus.emit('editBiWidget', { card: this.props.data, parentKey: this.props.parentKey })
            } }
          />
        </Menu>
      )
    }

    return (
      <div className={ `moreIcon` }>
        { this.state.status === "ready" && (
          <Popover
            content={ editMenu() }
            interactionKind={ 'click' }
          >
            <div><Icon icon={ `more` }/></div>
          </Popover>
        ) }
      </div>
    )
  }

  render() {
    return (
      <div className={ `biCharts` }>
        { this.showData() }
        { this.moreOptions() }
      </div>
    )
  }
}
