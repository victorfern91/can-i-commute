import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WeatherSDK from '@victorfern91/can-i-sdk/weather';

import style from './styles/constants';
import withLoader from './hoc/withLoader';
import { addCommuteInformation, getInsights } from './logic/commute';

const COMMUTE_HOURS = [7, 8, 9, 18, 19, 20];

const weatherAPI = new WeatherSDK({ location: 'porto', provider: 'ipma' });

class App extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
              <Text style={{ color:  style.colors.white, fontSize: 32 }}>It's time to commute!</Text>
              <Text style={{ fontSize: 64 }}>🚴</Text>
              <Text>
              Can I commute today ? {getInsights(this.props.today).overall ? '👍' : '👎'}
              </Text>
              <Text>
              Can I commute tommorow ? {getInsights(this.props.tomorrow).overall ? '👍' : '👎'}
              </Text>


            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flex: 1,
    backgroundColor: style.colors.black,
    alignItems: 'center',
    //justifyContent: 'left'
  }
});

export default withLoader(App, {
    asyncRequests: {
        today: async () => {
            const forecast = await weatherAPI.getWeatherForToday();

            return addCommuteInformation(forecast, COMMUTE_HOURS);
        },
        tomorrow: async () => {
            const forecast = await weatherAPI.getWeatherForTomorrow();

            return addCommuteInformation(forecast, COMMUTE_HOURS);
        }
    }
});
