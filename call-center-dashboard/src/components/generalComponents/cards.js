import { Spinner, Icon, Menu, MenuItem } from '@blueprintjs/core';
import { Popover }                       from 'antd';
import React, { useState, useEffect }    from "react";
import axios                             from 'axios';
import { editWidgetBus }                 from '../../systemBus';

class Cards extends React.PureComponent {

  state = {
    cardData: {},
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

      let url = this.props.shouldRenderGlobal ? `${ window.env.FILE_UPLOAD }${ file[1]?.url }` : `${ window.env.FILE_UPLOAD }${ file[0]?.url }`

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      let cardData = Array.isArray(response?.data) && !!response?.data[0] ? response.data[0] : { "Info": "No Data Found" }

      delete cardData._id

      this.setState({
        cardData,
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
    const { status, cardData, error } = this.state

    console.log(status, cardData, error)

    return (
      <React.Fragment>
        {
          status === 'ready' ? (
            <div className={ 'biReadyCards' }>
              <div className={ 'biCardNumbers' }>
                { cardData[Object.keys(cardData)[0]] || 0 }
              </div>
              <div className={ 'biCardHeading' }>{
                Object.keys(cardData)[0]
              }</div>
            </div>
          ) : status === 'processing' ? (
            <div>
              <div className={ 'biReadyCards' }>
                <div className={ 'biCardHeading' }>Processing</div>
                <div className={ 'biCardNumbers' }>
                  <Spinner/>
                </div>
              </div>
            </div>
          ) : status === 'waiting' ? (
            <div>
              <div className={ 'biCardHeading' }>Waiting</div>
              <div className={ 'biCardNumbers' }>
                <Spinner/>
              </div>
            </div>
          ) : status === "error" ? (
            <React.Fragment>
              <div className={ 'biCardHeading' }>Error!</div>
              <div className={ 'biCardSpinner' }>
                <Popover
                  position={ `bottom` }
                  content={ (
                    <p style={ { padding: "1rem" } }>{ error?.error?.message }</p>
                  ) }
                >
                  <Icon
                    icon={ 'issue' }
                    intent={ 'danger' }
                    size={ 30 }
                    style={ {
                      cursor: "pointer"
                    } }
                  /></Popover>
              </div>
            </React.Fragment>
          ) : (<></>)
        }
      </React.Fragment>
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
      <div>
        { this.state.status === "ready" && (
          <Popover
            content={ editMenu() }
            interactionKind={ 'click' }
          >
            <div className={ `moreIcon` }><Icon icon={ `more` }/></div>
          </Popover>
        ) }
      </div>
    )
  }

  render() {
    return (
      <div className={ `biCards` }>
        { this.showData() }
        { this.moreOptions() }
      </div>
    )
  }

}

export default Cards