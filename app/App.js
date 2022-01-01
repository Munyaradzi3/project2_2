import React from 'react';
import {SafeAreaView,View,StyleSheet,Text, TouchableOpacity} from 'react-native';

//this is base file

//secondary views
import Base from './base'
import Login from './login'

export default class App extends React.Component{

  state={
    screen:Login,
    public_key:'',
    private_key:'',
  }

  base=()=>{
    this.setState({screen:Base})
  }

  public=(text)=>{
    this.setState({public_key:text})
  }

  private=(text)=>{
    this.setState({private_key:text})
  }

  render(){
    return(
      <SafeAreaView style={styles.main}>
        <View style={styles.container}>
        <View style={styles.spacer}>
        </View>
        <View style={styles.head}>
          <Text style={styles.text_head}>Blockbase wallet</Text>
        </View>
        </View>
        <View style={styles.box}>
          <this.state.screen screen={this.base} public={this.public} private={this.private} public_key={this.state.public_key} private_key={this.state.private_key}/>
        </View>
      </SafeAreaView>
    )
  }
}

const styles=StyleSheet.create({
  main:{
    flex:1
  },
  container:{
    width:'100%',
    height:'10%',
    font:'sans-serif',
    fontSize:20,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:'grey',
    borderBottomWidth:1,
    shadowColor:'black',
    shadowOpacity:0.9,
    shadowRadius:4,
  },
  spacer:{
    height:'20%'
  },
  head:{
    width:'100%',
    height:'70%',
    font:'sans-serif',
    fontSize:20,
    alignItems:'center',
    justifyContent:'center',

  },
  text_head:{
    font:'sans-serif',
    fontSize:20,
  },
  box:{
    flex:1
  },
 
})