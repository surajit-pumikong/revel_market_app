import React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	Image,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import UserModel from '../models/UserModel'

var user_model = new UserModel

export class SplashScreen extends React.Component {
	constructor(props) {
        super(props)
    }

	componentDidMount() {
		setTimeout(() => {
            AsyncStorage.getItem('user_data').then((user) => { return JSON.parse(user) }).then((user_data) => {
				if (user_data == null) {
					this.props.navigation.navigate('Login');
				}else{
					user_model.getLogin(user_data.user_username,user_data.user_password).then((response) => { 
                        if (response == false) {
							this.props.navigation.navigate('Login');
						}else if (response.data.length == 0) {
							this.props.navigation.navigate('Login');
						}else{
							this.props.navigation.navigate('Home')
                        }
                    });
				}
			});
		}, 1000)
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<Image resizeMode="contain" source={require('../images/logo.png')} style={{ width: 180, height: 180, marginBottom: 50 }} />
				<ActivityIndicator style={{ marginBottom: 8, }} size="large" color="#25aae1"/>
                <Text style={{ paddingLeft: 8, color: '#fff' }}>โหลดข้อมูล...</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#010001',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		height: '100%',
	},
});