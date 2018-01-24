import React, { Component } from 'react';
import { Text, View, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native';
import {Actions} from 'react-native-router-flux'
import { Header, Card, Icon } from 'react-native-elements'

const headers = { method: 'GET',
    headers: {
        "X-Api-Key":"b7c0872a3fb042d9baa45eb7b6385faa"
    }};

class PublicationNews extends Component {
    state = {
        newsData:[],
        showLoader:true
    }

    componentDidMount = () => {
        let publisher = this.props.publisher
        const request = new Request('https://newsapi.org/v2/everything?pageSize=50&sources=' + publisher,headers)
        this.formData(request)
    }

    formData = (request)  => {
        fetch(request)
            .then((response) => response.json())
            .then((responseJson)=>{
                if(responseJson.status == 'ok') {
                    this.state.newsData = responseJson.articles
                    this.setState({newsData:this.state.newsData, showLoader:false})
                } else {
                    console.log("no data");
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
    }

    goBack = () => {
        Actions.pop();
    }

    onPress = (item) => {
        Actions.push("description",{item:item,language:'en'});
    }

    render() {

        let backButton = (
            <Icon
                name='ios-arrow-back'
                type='ionicon'
                color={"white"}
                onPress = {this.goBack}
                underlayColor={"transparent"}
            />
        )

        return (
                <View style={{flex:1}}>
                    <Header
                        outerContainerStyles={{height:60,backgroundColor:"#0F084B"}}
                        leftComponent={backButton}
                        centerComponent={{ text: 'Publication News', style: { color: '#fff',fontSize:17 } }}
                    />
                    <View style={{flex:2}}>
                        {(this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> :
                            <FlatList
                                data={this.state.newsData}
                                renderItem={({item}) => (
                                    <TouchableHighlight
                                        onPress = {() => this.onPress(item)}
                                        underLayColor="transparent"
                                    >
                                        <View>
                                            <Card
                                                title = {item.title}
                                                image={{uri:item.urlToImage || 'http://www.blackbell.com.ng/ui/images/img_not_found.jpg'}}
                                                imageProps={{resizeMode:"contain"}}
                                                titleNumberOfLines = {2}
                                            >
                                                <Text style={{color:"maroon",fontSize:15,marginBottom:5}}>{item.author}</Text>
                                            </Card>
                                        </View>
                                    </TouchableHighlight>
                                )}
                            />
                        }
                    </View>
                </View>
        )
    }
}
export default PublicationNews;