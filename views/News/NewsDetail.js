import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import NetworkFailed from '../../component/NetworkFailed';
import NotFound from '../../component/NotFound';
import Loading from '../../component/Loading';

import GOBALS from '../../GOBALS';

import NewsModel from '../../models/NewsModel'

var news_model = new NewsModel

export class NewsDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            alert: '',
            news: [],
        }
    }

    componentDidMount() {
        const news_code = this.props.navigation.getParam('news_code',null)

        this.setState({ 
            loading: true,
            alert: '',
        }, () => { 
            news_model.getNewsByNewsCode(news_code).then((response) => {
                if (response == false) {
                    this.setState({
                        loading: false,
                        alert: 'network-failed',
                    });
                }else if (response.data.length == 0) {
                    this.setState({
                        loading: false,
                        alert: 'not-found',
                    });
                }else{
                    this.setState({ 
                        loading: false,
                        news: response.data[0],
                    });
                }
            })
        });
    }

    render() {
        var display_data = []

        if (this.state.loading) {
            display_data.push(<Loading/>);
        }else{
            if (this.state.alert == 'network-failed') {
                display_data.push(<NetworkFailed/>);
            }else if (this.state.alert == 'not-found') {
                display_data.push(<NotFound/>);
            }else{
                display_data.push(
                    <View>
                        <Image resizeMode="cover" 
                            source={{ uri: GOBALS.URL + this.state.news.news_image_name }} 
                            style={{ height: 280, }}
                        >
                        </Image>
                        <View style={{ padding: 15, }}>
                            <Text style={[ styles.text_font, { fontSize: 20, color: '#0099ff',fontWeight: 'bold' }]}>
                                {this.state.news.news_title} <Text style={[ styles.text_font, { fontSize: 14, color: 'white', }]}>{this.state.news.news_date}</Text>
                            </Text>
                        </View>
                        <View style={{ paddingLeft: 15, paddingRight: 15, }}>
                            {this.state.news.news_description != '' ? 
                            <Text style={[ styles.text_font, { marginBottom: 14, }]}>{this.state.news.news_description}</Text>
                            : null 
                            }
                            {this.state.news.news_detail != '' ? 
                            <Text style={[ styles.text_font, { marginBottom: 8, }]}>{this.state.news.news_detail}</Text>
                            : null
                            }
                        </View>
                    </View>
                )
            }
        }

        return (
            <ScrollView style={{ backgroundColor: '#010001', }}>
                <StatusBar hidden={true} />
                {display_data} 
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
	text_font: {
		fontFamily: 'Kanit-Regular',
		fontSize: 16,
        color: '#fff',
    },
});