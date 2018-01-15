import React,{Component} from 'react'
import {View, Text, Image} from 'react-native'
var img = require('../imagenotfound.jpg');
class FullNews extends Component {
    componentWillMount = () => {
        this.setState({news:this.props.item})
    }

    render = () => {
        return (
            <View style={{backgroundColor:"white", height:"100%"}}>
                <Image source={{uri:this.state.news.urlToImage || "http://www.blackbell.com.ng/ui/images/img_not_found.jpg"}} style={{height: "50%"}} resizeMode="contain"/>
                <View style={{borderBottomColor: 'black',
                    borderBottomWidth: 1,marginTop:5}} />
                <Text style = {{fontSize:20, height:"50%"}}>{this.state.news.description}</Text>
            </View>
        )
    }
}

export default FullNews;