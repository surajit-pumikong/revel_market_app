import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import { Login } from './views/Login/Login'
import { Home } from './views/Home/Home'
import { NewsDetail } from './views/News/NewsDetail'
import { ShopDetail } from './views/Shop/ShopDetail'

const HomeNavigation = createStackNavigator({
  Home: { 
      screen: Home,
      navigationOptions: {
          header: null
      }
  },
  NewsDetail: { 
      screen: NewsDetail,
      navigationOptions: {
          title: 'รายละเอียด',
          headerTintColor: '#f3f3f3',
          headerTitleStyle: {
              fontSize: 18,
              fontFamily: 'Kanit-Regular',
              color: '#f3f3f3'
          },
          headerStyle: {
              backgroundColor: '#010001',
          },
      }
  },
  ShopDetail: { 
      screen: ShopDetail, 
      navigationOptions: {
          title: 'รายละเอียด',
          headerTintColor: '#f3f3f3',
          headerTitleStyle: {
              fontSize: 18,
              fontWeight: '400',
              fontFamily: 'Kanit-Regular',
              color: '#f3f3f3'
          },
          headerStyle: {
              backgroundColor: '#010001',
          },
      }
  },
}, {
  initialRouteParams: 'Home',
});

const Navigation = createSwitchNavigator({
  Home: HomeNavigation,
})

const App = createAppContainer(Navigation);

export default App;