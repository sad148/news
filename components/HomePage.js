import React, { Component } from 'react';
import { Text, Image, View, FlatList, TouchableHighlight, ActivityIndicator, ToastAndroid, Picker, StatusBar, Platform, Dimensions, Linking, StyleSheet } from 'react-native';
import {Actions} from 'react-native-router-flux'
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { Header, SearchBar } from 'react-native-elements'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Drawer from 'react-native-drawer'
import Tabs from 'react-native-tabs';
var translate = require('../actions/translate')
const headers = { method: 'GET',
    headers: {
        "X-Api-Key":"b7c0872a3fb042d9baa45eb7b6385faa"
    }};

const drawerStyles = {
    drawer: { backgroundColor:"#0F084B"}
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


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
        language:'en',
        totalResults:0,
        render:[],
        page:1,
        categorySelected:0,
        count:0,
        headlines:(<ActivityIndicator size="large" color="#0000ff" />),
        showLoader:true,
        searchText:"",
        showSearch:false,
        q:[],
        height:Dimensions.get('window').height
    }

    componentWillMount = () => {
        let category = categories[this.state.categorySelected];
        const request = new Request('https://newsapi.org/v2/everything?pageSize=5&sortBy=publishedAt&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request)
    }

    endReached = () => {
        if(Platform.OS == "android")
            ToastAndroid.show('Loading more news...',3000,"BOTTOM")
        let category = categories[this.state.categorySelected];
        const request = new Request('https://newsapi.org/v2/everything?pageSize=10&sortBy=publishedAt&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request)
    }

    tabChanged = (tab) => {
        this.state = {
            categorySelected:tab.i,
            page:1
        }
        this.setState({showLoader:true,newsData:[],q:[]})
        let category = categories[tab.i];
        const request = new Request('https://newsapi.org/v2/everything?pageSize=10&sortBy=publishedAt&page=' + this.state.page++ + '&q=' + category,headers)
        this.formData(request);
    }


    changePicker = (language) => {
        let newsData = this.state.newsData
        this.setState({language:language, newsData:[], showLoader:true})
        if(Platform.OS == "android")
            ToastAndroid.show('Translating...',3000,"BOTTOM")
        let category = categories[this.state.categorySelected];
        let data = []
        console.log(this.state.q,language);
        translate.translate(this.state.q,language,(resp) => {
            newsData.map((item, index) => {
                console.log(item.title,resp[index].title);
                return item.title = resp[index]
            })
            console.log(newsData);
            this.setState({newsData:newsData, showLoader:false})
        })

        const request = new Request('https://newsapi.org/v2/everything?pageSize=10&sortBy=publishedAt&page=' + this.state.page + '&q=' + category,headers)
        //this.formData(request)
    }

    formData = (request)  => {
        fetch(request)
            .then((response) => response.json())
            .then((responseJson)=>{
                if(responseJson.status == 'ok') {
                    responseJson.articles.map((item) => {
                        this.state.q.push(item.title);
                        this.state.newsData.push(item);
                    })
                    translate.translate(this.state.q,this.state.language,(resp) => {
                        this.state.newsData.map((item, index) => {
                            return this.state.newsData[index].title = resp[index]
                        })
                        this.setState({newsData:this.state.newsData, showLoader:false})
                        this.tabview(this.state.newsData);
                    })
                } else {
                    console.log("no data");
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
    }

    tabview = (data) => {
           this.setState({
                render:(
                    <View>
                    <FlatList
                        data={data}
                        renderItem={({item}) => (
                            <TouchableHighlight
                                onPress={() => this.onPress(item)}
                                underLayColor="transparent"
                            >
                                <View>
                                    <Card
                                        title={item.title}
                                        image={{uri: item.urlToImage || 'http://www.blackbell.com.ng/ui/images/img_not_found.jpg'}}
                                        imageProps={{resizeMode: "contain"}}
                                        wrapperStyle={{shadowColor: "red"}}
                                        containerStyle={{shadowColor: "red"}}
                                        titleNumberOfLines={2}
                                    >
                                        <Text style={{
                                            color: "maroon",
                                            fontSize: 15,
                                            marginBottom: 5
                                        }}>{item.author}({item.source.name})</Text>
                                    </Card>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                    </View>)
            })

    }

    onPress = (item) => {
        Actions.push("description",{item:item,language:this.state.language});
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

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    showPublications = () => {
        Actions.push("publications",{type:"publications"});
    }

    showCountries = () => {
        Actions.push("publications",{type:"countries"});
    }

    render() {
        let search = (
                <Icon
                    name='search'
                    color="white"
                    onPress = {this.showSearchbar}
                />
        )

        let hamburger = (
            <Icon
                name='menu'
                color="white"
                onPress = {this.openControlPanel}
            />
        )

        let drawerMenu = (
            <View style={{padding:10, marginTop:10}}>
                <TouchableHighlight
                    onPress = {this.showPublications}
                    underlayColor = "transparent"
                >
                <View style={{"marginBottom":20}}>
                    <Text style={{color:"white", fontSize:15, "marginBottom":20}}>Publications</Text>
                    <View style={{borderColor:"lightgray", borderWidth:1}}></View>
                </View>
                </TouchableHighlight>
                {/*<TouchableHighlight*/}
                    {/*onPress = {this.showLanguages}*/}
                {/*>*/}
                {/*<View style={{"marginBottom":20}}>*/}
                    {/*<Text style={{color:"white",fontSize:15,"marginBottom":20}}>Languages</Text>*/}
                    {/*<View style={{borderColor:"lightgray", borderWidth:1}}></View>*/}
                {/*</View>*/}
                {/*</TouchableHighlight>*/}
                {/*<TouchableHighlight*/}
                    {/*onPress = {this.showCountries}*/}
                {/*>*/}
                {/*<View style={{"marginBottom":20}}>*/}
                    {/*<Text style={{color:"white", fontSize:15,"marginBottom":20}}>Countries</Text>*/}
                    {/*<View style={{borderColor:"lightgray", borderWidth:1}}></View>*/}
                {/*</View>*/}
                {/*</TouchableHighlight>*/}
            </View>
        )

        return (
                <Drawer
                    ref={(ref) => this._drawer = ref}
                    content={drawerMenu}
                    type="overlay"
                    tapToClose={true}
                    styles={drawerStyles}
                    openDrawerOffset={0.5}
                >
                    <StatusBar
                        backgroundColor="#0F084B"
                        barStyle="light-content"
                    />
                    <View style={{flex:1}}>
                        <Header
                            outerContainerStyles={{height:45,backgroundColor:"#0F084B"}}
                            leftComponent={hamburger}
                            centerComponent={{ text: 'Headlines', style: { color: '#fff',fontSize:17 }}}
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

                        <View style={{flex:2}}>
                            <ScrollableTabView
                                initialPage={0}
                                renderTabBar={() => <ScrollableTabBar />}
                                tabBarActiveTextColor={"red"}
                                tabBarUnderlineStyle={{height:2}}
                                onChangeTab={this.tabChanged}
                            >
                                <View tabLabel='Business'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                                <View tabLabel='Entertainment'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                                <View tabLabel='General'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                                <View tabLabel='Health'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                                <View tabLabel='Science'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                                <View tabLabel='Sports'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                                <View tabLabel='Technology'>{
                                    (this.state.showLoader == true) ? <ActivityIndicator size="large" color="#0000ff"/> : this.state.render
                                }</View>
                            </ScrollableTabView>
                        </View>
                            {/*<View style={{flex:10}}>*/}

                            {/*</View>*/}
                    </View>
                    {/*<View style={styles.container}>*/}
                        {/*<Tabs selected={this.state.page} style={{backgroundColor:'white'}}*/}
                              {/*selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>*/}
                                {/*<Text style={{fontSize:15, marginLeft:8, color:"white"}}>Translate to:</Text>*/}
                                {/*/!*<Picker*!/*/}
                                    {/*/!*style={{color:"white"}}*!/*/}
                                    {/*/!*selectedValue={this.state.language}*!/*/}
                                    {/*/!*onValueChange={(itemValue) => this.changePicker(itemValue)}>*!/*/}
                                    {/*/!*<Picker.Item label="English" value="en" />*!/*/}
                                    {/*/!*<Picker.Item label="Hindi" value="hi" />*!/*/}
                                    {/*/!*<Picker.Item label="Marathi" value="mr" />*!/*/}
                                    {/*/!*<Picker.Item label="French" value="fr" />*!/*/}
                                    {/*/!*<Picker.Item label="Gujarati" value="gu" />*!/*/}
                                {/*/!*</Picker>*!/*/}
                            {/*<Text>Publication</Text>*/}
                        {/*</Tabs>*/}
                    {/*</View>*/}
                    <View>
                        <Text style={{alignSelf:'center',fontSize:15}}>Powered by NewsAPI.org</Text>
                    </View>
                </Drawer>

        )
    }
}
export default HomePage;