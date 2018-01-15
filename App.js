import {Scene, Router} from 'react-native-router-flux';
import HomePage from './components/HomePage'
import FullNews from './components/FullNews'
import React, {Component} from 'react'
class App extends Component {
    render() {
        return <Router>
            <Scene key="root">
                <Scene key="homepage" component={HomePage} title="Headlines" initial/>
                <Scene key = "description" component = {FullNews} title = "News" />
            </Scene>
        </Router>
    }
}

export default App;