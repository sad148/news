import React,{Component} from 'react'
import {View, Text, FlatList, Image, TouchableHighlight} from 'react-native'
import { Header, Icon } from 'react-native-elements'
import {Actions} from 'react-native-router-flux'
const headers = { method: 'GET',
    headers: {
        "X-Api-Key":"b7c0872a3fb042d9baa45eb7b6385faa"
    }};

const publicationMap = {
    'abc-news':"https://i.vimeocdn.com/portrait/5584804_300x300",
'bbc-news':"https://www.thewrap.com/wp-content/uploads/2014/07/bbc-news-logo.jpg",    
'bbc-sport':"https://m.files.bbci.co.uk/modules/bbc-morph-sport-opengraph/1.1.1/images/bbc-sport-logo.png",
    'hacker-news':"https://prod-marketing-greenhouse.global.ssl.fastly.net/blog-assets/hackernews.png?mtime=20160407112052",
    'mtv-news':"https://pmcvariety.files.wordpress.com/2017/06/mtv-news.jpg?w=1000&h=563&crop=1",
    'cnbc':"https://lh3.googleusercontent.com/z1UDoxRq7-yLISA0gYHYjbxygwTFGQrEe84Tvu9sRi8fA8nmb6MGRu0hU-BJx1i2rdI=w300",
    'nfl-news':"https://i.axs.com/2015/11/promoted-media-optimized_565a48f275df8.jpg",
    'nhl-news':"https://i.ytimg.com/vi/BCjLYVuLE88/maxresdefault.jpg",
    'independent':"https://static.independent.co.uk/s3fs-public/styles/article_small/public/thumbnails/image/2017/06/02/11/independent-logo-eagle.png",
}


class Publications extends Component {
    state = {
        publicationsData:[],
        count:0,
        showLoader:true,
        showSearch:false
    }
    
    componentDidMount = () => {
        this.formData(this.props.type)
    }

    formData = (type) => {
        const request = new Request("https://newsapi.org/v2/sources",headers)
        fetch(request)
            .then((response) => response.json())
            .then((responseJson)=>{
                if(responseJson.status == 'ok') {
                    let data = []
                    responseJson.sources.map((item) => {
                        if(type == "countries") {
                            if (publicationMap[item.country]) {
                                item.image = publicationMap[item.country]
                                data.push(item)
                            }
                        } else if(type == "publications") {
                            if(publicationMap[item.id]) {
                                item.image = publicationMap[item.id]
                                data.push(item)
                            }
                        }
                    })
                    this.setState({publicationsData:data, showLoader:false})
                } else {
                    console.log("no data");
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
    }

    logoPressed = (pubId) => {
        Actions.push("publishernews",{publisher:pubId})
    }

    goBack = () => {
        Actions.pop();
    }

    render = () => {

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
            <View>
                <Header
                    outerContainerStyles={{height:60,backgroundColor:"#0F084B"}}
                    leftComponent={backButton}
                    centerComponent={{ text: 'Publications', style: { color: '#fff',fontSize:17 } }}
                />

                <View>
                    <FlatList
                        data = {this.state.publicationsData}
                        numColumns = {3}
                        columnWrapperStyle={{alignItems:'center',marginLeft:25}}
                        renderItem = {({item}) => (
                            <TouchableHighlight
                                onPress = {() => this.logoPressed(item.id)}
                                style={{flex:1}}
                                underlayColor="transparent"
                            >
                            <View>
                                    <Image style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius:50
                                    }} source={{uri: item.image}} />
                                <Text style={{alignSelf:"center", marginTop:5, marginBottom:5, fontSize:15, color:"maroon", marginRight:30}}>{item.name}</Text>
                            </View>
                            </TouchableHighlight>
                        )}
                    />
                </View>
            </View>
        )
    }
}

export default Publications;
