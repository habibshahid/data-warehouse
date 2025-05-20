import React, { useState, useEffect }    from "react";
import { Spinner }                       from "@blueprintjs/core"
import HighchartsReact                   from 'highcharts-react-official';
import * as Highcharts                   from 'highcharts/highcharts';
import * as HighchartsMore               from 'highcharts/highcharts-more';
import * as HighchartsSolidGauge         from 'highcharts/modules/solid-gauge';
import axios                             from 'axios';
import { editWidgetBus }                 from '../../systemBus';
import { Menu, MenuItem, Icon, Popover } from "@blueprintjs/core"

require('highcharts/modules/funnel')(Highcharts);
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

const BarChart = (props) => {

  console.log(props.data, '999999999999999999999999')
  const names = Object.keys(props.data)
  let values = Object.values(props.data)

  values = values.filter(item => !isNaN(item) && item !== undefined && item !== null);
  values = values.map(Number);

  let chartObject = {
    chart: {
      type: 'column',
      scrollablePlotArea: {
        minWidth: 700, // Minimum width of the plot area
        scrollPositionX: 0 // Initial scroll position
      }
    },
    title: {
      text: props.cardData.customName
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: names,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count of results'
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        borderRadius: 4,
        colorByPoint: true
      }
    },
    series: [{
      name: 'Query data',
      data: values
    }]
  }

  return (
    <HighchartsReact
      highcharts={ Highcharts }
      options={ chartObject }
    />
  )
}

const PieChart = (props) => {
  console.log(props, 'asd')

  const names = Object.keys(props.data)
  let values = Object.values(props.data)
  values = values.filter(item => !isNaN(item) && item !== undefined && item !== null);
  values = values.map(Number);

  let count = -1

  const channelsCount = names.map((item, index) => {
    count = count + 1
    return {
      name: item,
      y: values[count],
      sliced: index === 0 ? true : false,
      selected: index === 0 ? true : false
    }
  })

  const chartObject = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: props.cardData.customName
    },
    tooltip: {
      pointFormat: ''
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Counts',
      colorByPoint: true,
      data: channelsCount
    }]
  }

  return (
    <HighchartsReact
      highcharts={ Highcharts }
      options={ chartObject }
    />
  )
}

const LineChart = (props) => {

  console.log(props, 'asdff')

  const names = Object.keys(props.data)
  let values = Object.values(props.data)
  values = values.filter(item => !isNaN(item) && item !== undefined && item !== null);
  values = values.map(Number);

  const chartObject = {
    title: {
      text: props.cardData.customName
    },
    subtitle: {
      text: ''
    },
    yAxis: {
      title: {
        text: 'Count of results'
      }
    },
    xAxis: {
      categories: names
    },
    series: [
      {
        name: 'Data by query',
        data: values
      }
    ],
    plotOptions: {
      series: [1, 2, 3, 4, 5, 6]
    },
  }

  return (
    <HighchartsReact
      highcharts={ Highcharts }
      options={ chartObject }
    />
  )
}

class Charts extends React.PureComponent {

  state = {
    chartData: null,
    status: '',
    error: {}
  }

  componentDidMount() {
    this.setData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.setData()
    }
  }

  setData = async () => {

    const { file, status, error } = this.props.data

    if (status === 'ready') {
      const response = await axios.get(`${ window.env.FILE_UPLOAD }${ file[0].url }`, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const dataMaker = () => {
        if (response.data.length > 1) {
          let result = {}

          response.data.forEach(item => {
            let someString = ``

            if (!!item._id.agent) {
              someString = someString + ` Agent: ${ item._id.agent }`
            }

            if (!!item._id.channel) {
              someString = someString + ` Channel: ${ item._id.channel }`
            }

            if (!!item._id.queue || !!item._id.pageQueue) {
              someString = someString + ` Queue: ${ !!item._id.queue ? item._id.queue : item._id.pageQueue }`
            }

            if (!!item._id.year) {
              someString = someString + ` Year: ${ item._id.year }`
            }

            if (!!item._id.month) {
              someString = someString + ` Month: ${ item._id.month }`
            }

            if (!!item._id.dayOfMonth) {
              someString = someString + ` Day: ${ item._id.dayOfMonth }`
            }

            if (!!item._id.hour) {
              someString = someString + ` Hour: ${ item._id.hour }`
            }

            result[someString] = Object.values(item)[1]
          })

          return result
        }
        else {
          let chartData = !!response.data[0] ? response.data[0] : {}

          delete chartData._id

          return chartData
        }
      }

      this.setState({
        chartData: dataMaker(),
        status,
        error
      })

    }
    else {
      this.setState({
        status,
        error
      })
    }

  }


  showData = () => {
    const { status, error } = this.state

    const { chartType, name } = this.props.data

    return (
      <>
        {
          status === 'ready' ? (
            <div className={ !!this.state.chartData ? 'biReadyCards' : '' }>
              <React.Fragment>
                {
                  chartType.value === 'bar' ? (
                    <BarChart
                      data={ this.state.chartData }
                      cardData={ { customName: name } }
                    />
                  ) : chartType.value === 'line' ? (
                    <LineChart
                      data={ this.state.chartData }
                      cardData={ { customName: name } }
                    />
                  ) : (
                    <PieChart
                      data={ this.state.chartData }
                      cardData={ { customName: name } }
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
    console.log(this.props, '*****************')
    return (
      <div className={ `biCharts` }>
        { this.showData() }
        { this.moreOptions() }
      </div>
    )
  }
}

export default Charts