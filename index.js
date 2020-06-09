/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import AppStackNavigator from './javaScript/navigation/AppStackNavigator';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppStackNavigator);
