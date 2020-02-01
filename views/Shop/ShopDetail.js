import React from 'react';
import  {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, 
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import NetworkFailed from '../../component/NetworkFailed';
import NotFound from '../../component/NotFound';
import Loading from '../../component/Loading';

import GOBALS from '../../GOBALS';

import ShopModel from '../../models/ShopModel';

var shop_model = new ShopModel;

export class ShopDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            alert: '',
            shop: [],
        }
    }

    componentDidMount() {
        const shop_code = this.props.navigation.getParam('shop_code',null)

        this.setState({ 
            loading: true,
            alert: '',
        }, () => { 
            shop_model.getShopByShopCode(shop_code).then((response) => {
                if (response == false) {
                    this.setState({
                        loading: false,
                        alert: 'network-failed',
                    });
                }else if (response.data.length == 0) {
                    /*this.setState({
                        loading: false,
                        alert: 'not-found',
                        
                    });*/

                    this.props.navigation.goBack()
                    
                }else{
                    this.setState({ 
                        loading: false,
                        shop: response.data[0],
                    });
                }
            })
        });
    }

    render() {
        var display_data = [];

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
                        <ImageBackground 
                            resizeMode="cover" 
                            source={{ uri: GOBALS.URL + this.state.shop.shop_image_name }} 
                            style={{ height: 280, justifyContent: "flex-end", }}
                        >
                            <View style={{ height: 64, padding: 18, justifyContent: "center", backgroundColor: 'rgba(255, 255, 255, 0.3)', }}>
                                <Text numberOfLines={1} style={[ styles.text_font, { fontSize: 20, color: '#010001',fontWeight: 'bold' }]}>{this.state.shop.shop_name}</Text>
                            </View>
                        </ImageBackground>
                        {this.state.shop.shop_description != '' ? 
                        <View style={{ padding: 20, paddingBottom: 0, }}>
                            <Text style={[ styles.text_font, ]}>{this.state.shop.shop_description}</Text>
                        </View>
                        : null
                        }
                        {this.state.shop.shop_detail != '' ? 
                        <View style={{ padding: 20, paddingBottom: 0, }}>
                            <Text style={[ styles.text_font, ]}>{this.state.shop.shop_detail}</Text>
                        </View>
                        : null
                        }
                        <View style={{ padding: 16, }}>
                            {this.state.shop.shop_address != '' ? 
                            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                                <Icon name="map-marker" size={15} style={{ color: 'red', marginTop: 2 }} />
                                <Text style={[ styles.text_font, { color: '#e6e6e6', fontSize: 14, marginLeft: 10 }]}>{this.state.shop.shop_address}</Text>
                            </View>
                            : null
                            }
                            {this.state.shop.shop_tel != '' ? 
                            <View style={{ flexDirection: 'row', }}>
                                <Icon name="cellphone-android" size={15} style={{ color: '#2899f2', marginTop: 2 }} />
                                <Text style={[ styles.text_font, { color: '#e6e6e6', fontSize: 14, marginLeft: 10 }]}>{this.state.shop.shop_tel}</Text>
                            </View>
                            : null
                            }
                        </View>
                    </View>
                );
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