import React from 'react';
import {
    Alert,
    AsyncStorage,
    Image,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraKitGalleryView, CameraKitCameraScreen } from 'react-native-camera-kit';
import NetworkFailed from '../../component/NetworkFailed';
import NotFound from '../../component/NotFound';
import Loading from '../../component/Loading';
import GOBALS from '../../GOBALS';
import UserModel from '../../models/UserModel'
import UploadModel from '../../models/UploadModel'
var user_model = new UserModel
var upload_model = new UploadModel
export default class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isImageVisible: false,
            shouldRenderCameraScreen: false,
            images: {},
            alert: '',
            user_data: [],
            url_img: ''
        }
    }
    componentDidMount() {
        this.setState({
            loading: true,
            alert: '',
        }, () => {
            AsyncStorage.getItem('user_data').then((user) => { return JSON.parse(user) }).then((user_data) => {
                user_model.getUserByUserCode(user_data.user_code).then((response) => {
                    if (response == false) {
                        this.setState({
                            loading: false,
                            alert: 'network-failed',
                        });
                    } else if (response.data.length == 0) {
                        this.setState({
                            loading: false,
                            alert: 'not-found',
                        });
                    } else {
                        this.setState({
                            loading: false,
                            user_data: response.data[0],
                        });
                    }
                })
            })
        })
    }
    _confirmLogout() {
        Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่ ?', [{ text: 'OK', onPress: () => this._logOut() }, { text: 'cancel', }]);
    }
    _logOut() {
        AsyncStorage.removeItem('user_data').then(() => {
            this.props.navigation.navigate('Login')
        });
    }
    _handleImageChang(url_img) {
        const formdata = new FormData();
        var res = url_img.split(".");
        this.setState({
            loading: true,
            alert: '',
            isImageVisible: false,
            shouldRenderCameraScreen: false
        }, () => {
            formdata.append('delete_path', this.state.user_data.user_image);
            formdata.append('user_code', this.state.user_data.user_code);
            formdata.append('file_type', '.' + res[res.length - 1]);
            formdata.append('upload_url', 'user');
            formdata.append('files', {
                name: 'user1.jpg',
                type: 'image/jpeg',
                uri: Platform.OS === "android" ? `file://${url_img}` : url_img
            });
            upload_model.uploadFile(formdata).then((res) => {
                this.setState({
                    loading: false,
                }, () => {
                    this.componentDidMount()
                })
            })
        })
    }
    render() {
        var display_data = [];
        if (this.state.loading) {
            display_data.push(<Loading />);
        } else {
            if (this.state.alert == 'network-failed') {
                display_data.push(<NetworkFailed />);
            } else if (this.state.alert == 'not-found') {
                display_data.push(<NotFound />);
            } else {
                display_data.push(
                    <View style={{ padding: 20, }}>
                        <View style={styles.profile_frame}>
                            {this.state.user_data.user_image != '' ?
                                <TouchableOpacity onPress={() => { this.setState({ isImageVisible: true }) }} >
                                    <Image source={{ uri: GOBALS.URL + this.state.user_data.user_image }} style={styles.profile_image} ></Image>
                                </TouchableOpacity>
                                :
                                null
                            }
                        </View>
                        <Text style={[styles.text_font, { alignSelf: "center", fontSize: 22, marginBottom: 16, }]}>
                            {this.state.user_data.user_name + ' ' + this.state.user_data.user_lastname}
                        </Text>
                        {this.state.user_data.user_address != '' ?
                            <View style={{ flexDirection: 'row', marginBottom: 8, }}>
                                <View style={{ flexDirection: 'column', }}>
                                    <Icon name="map-marker-outline" style={{ fontSize: 16, color: "#ff9900", marginTop: 3, }}></Icon>
                                </View>
                                <View style={{ flexDirection: 'column', }}>
                                    <Text style={[styles.text_font, { marginLeft: 8, }]}>{this.state.user_data.user_address}</Text>
                                </View>
                            </View>
                            : null
                        }
                        {this.state.user_data.user_tel != '' ?
                            <View style={{ flexDirection: 'row', marginBottom: 8, }}>
                                <View style={{ flexDirection: 'column', }}>
                                    <Icon name="phone" style={{ fontSize: 16, color: "#ff9900", marginTop: 3, }}></Icon>
                                </View>
                                <View style={{ flexDirection: 'column', }}>
                                    <Text style={[styles.text_font, { marginLeft: 8, }]}>{this.state.user_data.user_tel}</Text>
                                </View>
                            </View>
                            : null
                        }
                        {this.state.user_data.user_email != '' ?
                            <View style={{ flexDirection: 'row', marginBottom: 8, }}>
                                <View style={{ flexDirection: 'column', }}>
                                    <Icon name="at" style={{ fontSize: 16, color: "#ff9900", marginTop: 3, }}></Icon>
                                </View>
                                <View style={{ flexDirection: 'column', }}>
                                    <Text style={[styles.text_font, { marginLeft: 8, }]}>{this.state.user_data.user_email}</Text>
                                </View>
                            </View>
                            : null
                        }
                        <TouchableOpacity
                            style={{
                                alignSelf: 'center',
                                backgroundColor: '#fff',
                                width: 140,
                                padding: 8,
                                marginTop: 16,
                                borderRadius: 30,
                            }}
                            onPress={() => this._confirmLogout()}>
                            <Text style={[styles.text_font, { alignSelf: 'center', color: '#000', }]}>
                                ลงชื่อออก
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
        return (
            <>
                {this.state.isImageVisible ?
                    this.state.shouldRenderCameraScreen ?
                        <CameraKitCameraScreen
                            actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
                            onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
                            flashImages={{
                                on: require('../../component/CamaraScreen/images/flashOff.png'),
                                auto: require('../../component/CamaraScreen/images/flashAuto.png')
                            }}
                            cameraFlipImage={require('../../component/CamaraScreen/images/cameraFlipIcon.png')}
                            captureButtonImage={require('../../component/CamaraScreen/images/cameraButton.png')}
                        />
                        :
                        <CameraKitGalleryView
                            ref={(gallery) => {
                                this.gallery = gallery;
                            }}
                            style={{ flex: 1, margin: 0, backgroundColor: '#ffffff', marginTop: 50 }}
                            albumName={this.state.album}
                            minimumInteritemSpacing={10}
                            minimumLineSpacing={10}
                            columnCount={3}
                            selectedImages={Object.keys(this.state.images)}

                            onTapImage={(event) => this.onTapImage(event)}
                            selection={{
                                selectedImage: require('../../component/CamaraScreen/images/selected.png'),
                                imagePosition: 'bottom-right',
                                imageSizeAndroid: 'large',
                                enable: (Object.keys(this.state.images).length < 1)
                            }}
                            fileTypeSupport={{
                                supportedFileTypes: ['image/jpeg'],
                                unsupportedOverlayColor: "#00000055",
                                unsupportedImage: require('../../component/CamaraScreen/images/unsupportedImage.png'),
                                unsupportedTextColor: '#ff0000'
                            }}
                            customButtonStyle={{
                                image: require('../../component/CamaraScreen/images/openCamera.png'),
                                backgroundColor: '#d7e8ef'
                            }}
                            onCustomButtonPress={() => this.setState({ shouldRenderCameraScreen: true })}
                        />
                    :
                    <ScrollView style={{ backgroundColor: '#010001', }}>
                        {display_data}
                    </ScrollView>
                }
            </>
        );
    }

    onTapImage(event) {
        const selecImages = event.nativeEvent.selected;
        this._handleImageChang(selecImages)
    }
    onBottomButtonPressed(event) {
        const captureImages = event.captureImages;
        const selecImages = captureImages[0].uri;
        this._handleImageChang(selecImages)
    }
}

const styles = StyleSheet.create({
    text_font: {
        fontSize: 16,
        color: '#fff',
    },
    profile_frame: {
        width: 120,
        height: 120,
        padding: 10,
        marginTop: 28,
        marginBottom: 28,
        alignSelf: 'center',
        backgroundColor: '#91d0ea',
        borderRadius: 60
    },
    profile_image: {
        width: 100,
        height: 100,
        borderRadius: 60,
    },
});