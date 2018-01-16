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

class Search extends Component {
    state = {
        newsData:[],
        totalResults:0,
        page:1,
        count:0,
        headlines:(<ActivityIndicator size="large" color="#0000ff" />),
        showLoader:true,
        searchText:""
    }

    componentWillMount = () => {
        let category = this.props.text
        const request = new Request('https://newsapi.org/v2/everything?sortBy=relevancy&language=en&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request)
    }

    endReached = () => {
        ToastAndroid.show('Loading more news...',3000,"BOTTOM")
        let category = this.state.text
        const request = new Request('https://newsapi.org/v2/everything?sortBy=relevancy&language=en&page=' + this.state.page++ + '&q=' + category,headers)
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

    submitEditing = () => {
        let category = this.state.searchText
        this.setState({newsData:[]})
        const request = new Request('https://newsapi.org/v2/everything?sortBy=relevancy&language=en&page=' + this.state.page + '&q=' + category,headers)
        this.formData(request)
    }

    searchTextChanged = (text) => {
        this.setState({searchText:text})
    }

    render() {
        let search = (
            <TouchableHighlight

            >
                <View>
                    <Icon
                        name='search'
                    />
                    <TextInput></TextInput>
                </View>
            </TouchableHighlight>
        )
        return (
            <View style={{flex:1,flexDirection: 'column'}}>
                <SearchBar
                    lightTheme
                    round
                    onChangeText = {this.searchTextChanged}
                    onSubmitEditing = {this.submitEditing}
                    placeholder='Type Here...' />
                <View>
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
export default Search;