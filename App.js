// StAuth10244: I Robert Kumar, 000883986, certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. I have not made
//  my work available to anyone else."
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, ScrollView } from 'react-native';
import Home from './components/Home';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Home/>
        <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#909090',
    alignItems: 'center'
  }
});
