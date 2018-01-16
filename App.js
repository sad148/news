import {Scene, Router} from 'react-native-router-flux';
import HomePage from './components/HomePage'
import FullNews from './components/FullNews'
import Search from './components/Search'
import React, {Component} from 'react'
class App extends Component {
    render() {
        return <Router>
            <Scene key="root">
                <Scene key="homepage" component={HomePage} hideNavBar={true} initial/>
                <Scene key = "description" component = {FullNews} hideNavBar={true} />
                <Scene key = "search" component = {Search} hideNavBar={true} />
            </Scene>
        </Router>
    }
}

export default App;