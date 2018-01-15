import React, { Component } from 'react';
import { Text, Image, View, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native';
import {Actions} from 'react-native-router-flux'
import FullNews from "./FullNews";
const headers = { method: 'GET',
    headers: {
        "X-Api-Key":"b7c0872a3fb042d9baa45eb7b6385faa"
    }};
//const

class HomePage extends Component {
    componentWillMount = () => {
        const request = new Request('https://newsapi.org/v2/everything?q=news&language=en',headers)
        fetch(request)
            .then((response) => response.json())
            .then((responseJson)=>{
                if(responseJson.status == 'ok') {
                    console.log(responseJson.articles);
                    this.setState({newsData:responseJson.articles, totalResults:responseJson.totalResults,showLoader:false})
                } else {
                    console.log("no data");
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
    }

    endReached = () => {
        const request = new Request('https://newsapi.org/v2/everything?q=news&language=en&page=' + this.state.page + 1,headers)
        fetch(request)
            .then((response) => response.json())
            .then((responseJson)=>{
                if(responseJson.status == 'ok') {
                    responseJson.articles.map((item) => {
                        this.state.newsData.push(item)
                    })
                    this.setState({newsData:this.state.newsData, showLoader:false})
                } else {
                    console.log("no data");
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
    }

    onPress = (item) => {
        Actions.push("description",{item:item});
    }

    state = {
        newsData:[],
        totalResults:0,
        page:1,
        count:0,
        showLoader:true,
        loader : "https://loading.io/spinners/coolors/lg.palette-rotating-ring-loader.gif"
    }

    render() {
        console.log(this.state.showLoader);
        return (
            <View>
                {
                    (this.state.showLoader == true) ? <View><ActivityIndicator size="large" color="#0000ff"/></View> :
                        <FlatList
                            data={this.state.newsData}
                            renderItem={({item}) => (
                                <TouchableHighlight
                                    onPress={() => this.onPress(item)}
                                    style={{underlayColor: "white"}}
                                >
                                    <View key={this.state.count++} style={{
                                        "backgroundColor": "white",
                                        "height": 100,
                                        "borderColor": "black",
                                        "borderWidth": 1,
                                        flex: 1,
                                        flexDirection: 'row',
                                        'marginBottom': 10
                                    }}>
                                        <Text key={this.state.count++} style={{width: "70%"}}>{item.title}</Text>
                                        <Image key={this.state.count++}
                                               source={{uri: item.urlToImage || "http://www.blackbell.com.ng/ui/images/img_not_found.jpg"}}
                                               style={{flex: 1}}
                                               resizeMode="contain"/>
                                    </View>
                                </TouchableHighlight>
                            )}
                            onEndReachedThreshold={1}
                            onEndReached={this.endReached}
                        />
                }
            </View>
        )
    }
}
export default HomePage;