import React, { Component } from 'react';
import { Text, Image, View, FlatList, TouchableHighlight, ActivityIndicator, ToastAndroid, TextInput } from 'react-native';
import {Actions} from 'react-native-router-flux'
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { Header, SearchBar } from 'react-native-elements'
import { Card, ListItem, Button, Icon } from 'react-native-elements'

const headers = { method: 'GET',
    headers: {
        "X-Api-Key":"b7c0872a3fb042d9baa45eb7b6385faa"
    }};


const categories = {
    0:"business",
    1:"entertainment",
    2:"general",
    3:"health",
    4:"science",
    5:"sports",
    6:"technology"
}

class HomePage extends Component {
    state = {
        newsData:[],
        totalResults:0,
        page:1,
        categorySelected:0,
        count:0,
        headlines:(<ActivityIndicator size="large" color="#0000ff" />),
        showLoader:true,
        searchText:"",
        showSearch:false
    }

    componentWillMount = () => {
        let category = categories[this.state.categorySelected];
        const request = new Request('https://newsapi.org/v2/everything?sortBy=publishedAt&language=en&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request)
    }

    endReached = () => {
        ToastAndroid.show('Loading more news...',3000,"BOTTOM")
        let category = categories[this.state.categorySelected];
        const request = new Request('https://newsapi.org/v2/everything?sortBy=publishedAt&language=en&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request)
    }

    formData = (request)  => {
        fetch(request)
            .then((response) => response.json())
            .then((responseJson)=>{
                if(responseJson.status == 'ok') {
                    if(this.state.newsData.length == 0) {
                        this.state.newsData = responseJson.articles
                    } else {
                        responseJson.articles.map((item) => {
                            this.state.newsData.push(item)
                        })
                    }
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

    tabChanged = (tab) => {
        this.state = {
            categorySelected:tab.i,
            page:1
        }
        this.setState({showLoader:true,newsData:[]})
        let category = categories[tab.i];
        const request = new Request('https://newsapi.org/v2/everything?sortBy=publishedAt&language=en&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request);
    }

    submitEditing = () => {
        Actions.push("search",{text:this.state.searchText});
    }

    searchTextChanged = (text) => {
        this.setState({searchText:text})
    }

    showSearchbar = () => {
        if(this.state.showSearch == true)
            this.setState({showSearch:false})
        else
            this.setState({showSearch:true})
    }

    render() {
        let search = (
                <Icon
                    name='search'
                    color="white"
                    onPress = {this.showSearchbar}
                />
        )
        return (
            <View style={{flex:1,flexDirection: 'column'}}>
                <Header
                    outerContainerStyles={{height:60}}
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Headlines', style: { color: '#fff',fontSize:30 } }}
                    rightComponent={search}
                />
                {
                    (this.state.showSearch == true) ? <SearchBar
                        lightTheme
                        round
                        onChangeText = {this.searchTextChanged}
                        onSubmitEditing = {this.submitEditing}
                        placeholder='Type Here...' /> : <View></View>
                }

                <View>
                    <View style={{height:50 }}>
                        <ScrollableTabView
                            initialPage={0}
                            renderTabBar={() => <ScrollableTabBar />}
                            tabBarActiveTextColor={"red"}
                            tabBarUnderlineStyle={{height:0}}
                            onChangeTab={this.tabChanged}
                        >
                            <Text tabLabel='Business'></Text>
                            <Text tabLabel='Entertainment'></Text>
                            <Text tabLabel='General'></Text>
                            <Text tabLabel='Health'></Text>
                            <Text tabLabel='Science'></Text>
                            <Text tabLabel='Sports'></Text>
                            <Text tabLabel='Technology'></Text>
                        </ScrollableTabView>
                    </View>
                    <View>
                        {(this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> :
                            <FlatList
                                data={this.state.newsData}
                                renderItem={({item}) => (
                                    <TouchableHighlight
                                        onPress = {() => this.onPress(item)}
                                        underLayColor="white"
                                    >
                                    <View>
                                       <Card
                                            title = {item.title}
                                            image={{uri:item.urlToImage || 'http://www.blackbell.com.ng/ui/images/img_not_found.jpg'}}
                                            imageProps={{resizeMode:"contain"}}
                                       >
                                           <Text style={{color:"maroon",fontSize:15,marginBottom:5}}>{item.author}({item.source.name})</Text>
                                        </Card>
                                    </View>
                                    </TouchableHighlight>
                                )}
                                onEndReachedThreshold={0.5}
                                onEndReached={this.endReached}
                            />
                        }
                    </View>
                </View>
            </View>
        )
    }
}
export default HomePage;