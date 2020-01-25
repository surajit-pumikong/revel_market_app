import React from 'react';
import  {
    ScrollView,
    StatusBar,
} from 'react-native';

export class ShopDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#010001', }}>
                <StatusBar hidden={true} />
            </ScrollView>
        );
    }
}