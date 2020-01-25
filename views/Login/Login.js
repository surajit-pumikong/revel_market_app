import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Image, 
    StatusBar, 
    StyleSheet, 
    ScrollView,
    Text, 
    TextInput, 
    TouchableOpacity,
    View, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import NetworkFailed from '../../component/NetworkFailed';
import NotFound from '../../component/NotFound';

import UserModel from '../../models/UserModel';

var user_model = new UserModel

export class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            alert: '',
            username: '',
            password: '',
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('user_data').then((user) => { return JSON.parse(user) }).then((user_data) => {
            if (user_data != null) {
                this.setState({ 
                    username: user_data.user_username, 
                    password: user_data.user_password 
                });
            }
        });
    }

    _getLogin(){
        if (this.state.username.length == 0) {
            Alert.alert("แจ้งเตือน","กรุณาระบุบัญชีผู้ใช้");
        }else if(this.state.password.length == 0){
            Alert.alert("แจ้งเตือน","กรุณากรอกรหัสผ่าน");
        }else{
            this.setState({
                loading: true,
                alert: '',
            }, () => {
                user_model.getLogin(this.state.username,this.state.password).then((response) => {
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
                        AsyncStorage.setItem('user_data',JSON.stringify(response.data[0])).then(() => {
                            this.props.navigation.navigate('Home')
                        });
                    }
                });
            });
        }
    }
        
    render() {
        var display = [];
        if (this.state.loading) {
            display.push(
                <View style={{ flexDirection: "row", justifyContent: "center", flex: 1, backgroundColor: '#25aae1', borderRadius: 2, padding: 10, }}>
                    <ActivityIndicator size="small" color="#fff"/>
                </View>
            )
        }else{
            display.push(
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#25aae1', borderRadius: 2, padding: 10, }} onPress={() => this._getLogin()}>
                    <Text style={[ styles.text_font, { alignSelf: "center", }]}>LOGIN</Text>
                </TouchableOpacity>
            )
        }

        if (this.state.alert == 'network-failed') {
            display.push(<NetworkFailed/>);
        }else if (this.state.alert == 'not-found') {
            display.push(<NotFound/>);
        }

        return (
            <ScrollView style={{ backgroundColor: "#010001", }}>
                <StatusBar hidden={true} />
                <View style={{ padding: 36, }}>
                    <Image 
                        resizeMode="contain"
                        source={require('../../images/logo.png')} 
                        style={{ width: 200, height: 200, marginTop: 54, marginBottom: 24, alignSelf: 'center', }}
                    >
                    </Image>
                    <View style={[ styles.row_underline, { marginBottom: 16, }]}>
                        <Icon name="email-outline" style={styles.login_icon} />
                        <TextInput placeholder="Email address"
                            placeholderTextColor="#ADADAD"
                            editable={!this.state.loading}
                            underlineColorAndroid='transparent' 
                            style={[ styles.text_font, { flex: 1, paddingLeft: 12, } ]}
                            value={this.state.username}
                            onChangeText={(username) => { this.setState({ username }) }}
                        />
                    </View>
                    <View style={[ styles.row_underline, { marginBottom: 24, }]}>
                        <Icon name="lock-outline" style={styles.login_icon} />
                        <TextInput placeholder="Password"
                            placeholderTextColor="#ADADAD"
                            editable={!this.state.loading}
                            underlineColorAndroid='transparent'
                            style={[ styles.text_font, { flex: 1, paddingLeft: 12, } ]}
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={(password) => { this.setState({ password }) }}
                        />
                    </View>
                    {display}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    text_font:{
        fontSize: 16,
        color: '#fff',
    },
    row_underline:{
        flexDirection: "row", 
        borderBottomWidth: 1, 
        borderBottomColor: '#b6b6b6',
    },
    login_icon:{
        alignSelf: 'center',
        fontSize: 20, 
        color: '#ADADAD', 
    },
});