import { Dimensions, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Lottie from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width , height } = Dimensions.get('window');

export default function Page() {
  return (
   <SafeAreaView style={styles.container}>
        <Lottie style={styles.lottie} source={require('../../../assets/animations/shoots.json')}
 autoPlay loop speed= {2} resizeMode="cover"   />
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#a7f3d0',
  },
  lottie:{
    width: width * 0.9,
    height: width * 1.4,
    // borderWidth: 3
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
    fontWeight: 'bold',
    marginBottom: width * 0.02, 
    textAlign: 'center',
    color: '#2c3e50', 
    fontFamily: 'Arial', 
    textTransform: 'uppercase', // T
    
  },
});
