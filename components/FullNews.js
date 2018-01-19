import React,{Component} from 'react'
import {View, Text, Image, ActivityIndicator} from 'react-native'
import { SearchBar, Header } from 'react-native-elements'
var translate = require('../actions/translate')

class FullNews extends Component {
    componentWillMount = () => {
        this.setState({news:[],showLoader:true})
    }

    componentDidMount = () => {
        translate.translate(this.props.item.description,this.props.language,(resp) => {
            this.props.item.description = resp;
            this.setState({news:this.props.item,showLoader:false})
        })
    }

    render = () => {
        return (
            <View>
                <Header
                    outerContainerStyles={{height:45,backgroundColor:"#0F084B"}}
                    centerComponent={{ text: 'News', style: { color: '#fff',fontSize:17 }}}
                />
                {
                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff" /> : <View style={{backgroundColor:"white", height:"100%"}}>
                        <Image source={{uri:this.state.news.urlToImage || "http://www.blackbell.com.ng/ui/images/img_not_found.jpg"}} style={{height: "35%"}} resizeMode="contain"/>
                        <View style={{borderBottomColor: '#0F084B',
                            borderBottomWidth: 1,marginTop:5}} />
                        <Text style = {{fontSize:15, height:"50%"}}>{this.state.news.description}</Text>
                    </View>
                }
            </View>
        )
    }
}

export default FullNews;