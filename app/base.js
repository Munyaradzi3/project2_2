import React,{Component} from 'react';
import {SafeAreaView,View,StyleSheet,Text, TouchableOpacity} from 'react-native';

//this is base file

//secondary views
import Main from './main'
import Search from './search'
import Transact from './transact'
import Assets from './assets'

class Base extends Component{

  state={
    screen:Main,
    asset_tag:'',
    assets:[
      {number:0,hash:'Asset tag',desc:'description'},
    ]
  }

  items=(list)=>{
    this.setState({assets:list})
  }

  main=()=>{
    this.setState({screen:Main})
  }
  search=()=>{
    this.setState({screen:Search})
  }
  transact=(text)=>{
    this.setState({screen:Transact})
  }
  assets=()=>{
    this.setState({screen:Assets})
  }


  render(){
    return(
      <SafeAreaView style={styles.main}>
        <View style={styles.box}>
          <this.state.screen public_key={this.props.public_key} private_key={this.props.private_key} assets={this.state.assets} items={this.items}/>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={this.main}>
          <Text style={styles.button} >
            Main
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.search}>
          <Text style={styles.button} >
            Search
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.transact}>
          <Text style={styles.button} >
            Transact
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.assets}>
          <Text style={styles.button} >
            Add new
          </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles=StyleSheet.create({
  main:{
    flex:1
  },
  box:{
    flex:1
  },
  bottom:{
    width:'100%',
    height:'7%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:1,
    borderTopColor:'grey',
  },
  button:{
    margin:14,
    fontSize:16,
  }
})

export default Base;