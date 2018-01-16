import React,{Component} from 'react'
import {View, Text, Image} from 'react-native'
import { SearchBar, Header } from 'react-native-elements'
class FullNews extends Component {
    componentWillMount = () => {
        this.setState({news:this.props.item})
    }

    render = () => {
        return (
            <View>
            <Header
                outerContainerStyles={{height:60}}
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'News', style: { color: '#fff',fontSize:30 } }}
                rightComponent={{ icon: 'search', color: '#fff' }}
            />
            <View style={{backgroundColor:"white", height:"100%"}}>
                <Image source={{uri:this.state.news.urlToImage || "http://www.blackbell.com.ng/ui/images/img_not_found.jpg"}} style={{height: "50%"}} resizeMode="contain"/>
                <View style={{borderBottomColor: 'black',
                    borderBottomWidth: 1,marginTop:5}} />
                <Text style = {{fontSize:20, height:"50%"}}>{this.state.news.description}</Text>
            </View>
            </View>
        )
    }
}

export default FullNews;