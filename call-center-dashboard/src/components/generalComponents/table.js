import React, { useEffect, useState } from "react"
import MaterialTable                  from 'material-table';
import axios                          from "axios"
import { Icon, Popover, Spinner }     from "@blueprintjs/core"

const Table = (props) => {
  const [state, setState] = useState({
    status: '',
    tableData: [],
    columns: [],
    tableName: 'Table',
    error: {}
  })

  useEffect(() => {

    const { file, status, name, error } = props.data

    const setData = async () => {

      if (status === 'ready') {

        let url = props.shouldRenderGlobal ? `${ window.env.FILE_UPLOAD }${ file[1]?.url }` : `${ window.env.FILE_UPLOAD }${ file[0]?.url }`

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        let tableData = !!response.data && response.data.length > 0 ? response.data : [{ "Info": "No Data Found" }]

        let flatData = tableData.map(item => {
          item = { ...item._id, ...item }
          delete item._id
          return item
        })


        let columns = Object.keys(flatData[0]).map(item => {
          return { title: item, field: item }
        })

        setState({
          ...state,
          tableData: flatData,
          columns,
          status,
          tableName: name,
          error
        })
      }
      else {
        setState({
          ...state,
          status,
          tableName: name,
          error
        })
      }

    }

    setData()

  }, [props])

  const showData = () => {
    const { status, error } = state

    return (
      <>
        {
          status === 'ready' ? (
            <React.Fragment>
              <MaterialTable
                columns={ state.columns }
                data={ state.tableData }
                title={ state.tableName }
              />
            </React.Fragment>
          ) : status === 'processing' ? (
            <div className={ 'biStackedCharts' }>
              <div className={ 'biChartHeading' }>Processing</div>
              <p className={ `additionalInfo` }>Doing calculations, your table will be available shortly</p>
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

  return (
    <div className={ `biCharts` }>
      { showData() }
    </div>
  )

}

export default Table