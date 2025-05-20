import { NonIdealState } from '@blueprintjs/core';
import { NotFound }      from '@intellicon/ui-core/src/scenes';
import React             from "react";
import { Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";
import Dash        from "./Home"
import Section     from "./Sections/DashboardSection"


class BiTools extends React.PureComponent {
  render() {
    const { display, isAgent } = this.props
    console.log(this.props, "99999999")
    // const renderScreens = () => {
    //   if (display === "home") {
    //     // return <DashboardHomePage/>
    //     return <Dash/>
    //     // return <BiHome/>
    //   }
    //   else {
    //     return <DynamicLayout/>
    //   }
    // }

    return (
      <Switch>
        <Route exact path={ this.props.match.path } component={ Dash }/>
        <Route exact path={ `${ this.props.match.path }/:dashboardId` } component={ Section }/>
        <Route exact path={ `*` } component={ NotFound }/>
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  display: state?.BiTools?.display,
  isAgent: state?.auth?.me?.isAgent
})

export default connect(mapStateToProps)(BiTools)