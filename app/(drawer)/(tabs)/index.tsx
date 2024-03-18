import { Dimensions, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Lottie from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const {width , height } = Dimensions.get('window');

export default function Page() {
  return (
   <SafeAreaView style={styles.container}>
    <Lottie  resizeMode="cover"  style={styles.lottie} source={require('../../../assets/animations/confetti.json')} autoPlay loop />
      <Text style={styles.title}>Welcome to My App</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fef3c7',

  },
  lottie:{
    width: width*0.9,
    height: width,
  },
  text: {
    fontSize: width * 0.09,
    marginBottom: 20
  },
  resetButton: {
    backgroundColor: '#34d399',
    padding: 10,
    borderRadius: 10
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: "900",
    textAlign: 'center',
    color: '#2c3e50', 
    fontFamily: 'Arial', 
    textTransform: 'uppercase', 
    margin: width * 0.01
    
  },
  
})
