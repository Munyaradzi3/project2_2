import React,{Component} from 'react';
import {StyleSheet,View,Text,TextInput,TouchableOpacity,Picker,Alert} from 'react-native';

class Transact extends Component{

  state={
    asset_tag:'',
    rec_key:'',
    purp_key:'',
    loca_key:'',
    status:'Select asset',
  }

  rec=(text)=>{
    this.setState({rec_key:text})
  }

  purp=(text)=>{
    this.setState({purp_key:text})
  }

  loca=(text)=>{
    this.setState({loca_key:text})
  }

  updateasset=(text)=>{
    this.setState({asset_tag:text})
  }

  transact=()=>{
    const tag=this.state.asset_tag
    const rec=this.state.rec_key
    const purp=this.state.purp_key
    const loca=this.state.loca_key
    const key=this.props.public_key
    const url='https://blockbase-app.herokuapp.com/transact?asset_tag='+tag+'&sender='+key+'&receiver='+rec+'&purpose='+purp+'&location='+loca

    fetch(url)
    .then((response)=>response.json())
    .then((resp)=>{
        resp=JSON.stringify(resp)
        this.setState({status:'Done'})
    })
    .catch((error)=>{
      this.setState({status:'error,retry'})
    })
  }
  

  render(){
    return(
      <View style={styles.main}>
        <View style={styles.box}>
        <View style={styles.inputs}>
          <View>
            <Picker selectedValue = {this.state.asset_tag} onValueChange = {this.updateasset} style={styles.pick}>
               { this.props.assets.map((item,number)=>(
                 <Picker.Item label = {item.asset_tag} value = {item.asset_tag} />
               ))
               
               }
            </Picker>
          </View>
          <View style={styles.spacer}>
          <TextInput placeholder="Receiver" onChangeText={this.rec}
          style={styles.input}/>
          </View>
          <View style={styles.spacer}>
          <TextInput placeholder="Purpose" onChangeText={this.purp}
          style={styles.input}/>
          </View>
          <View style={styles.spacer}>
          <TextInput placeholder="Location" onChangeText={this.loca}
          style={styles.input}/>
          </View>
          <View style={styles.spacer}></View>
          <TouchableOpacity style={styles.button} onPress={this.transact}>
            <Text style={styles.button_text}>Transfer</Text>
          </TouchableOpacity>
          <View style={styles.spacer}></View>
          <TouchableOpacity style={styles.complete}>
            <Text style={styles.button_text}>{this.state.status}</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  main:{
    flex:1,
  },
  box:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  inputs:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#f5f5f5',
    borderWidth:1,
    borderColor:'#b6b7b8',
    borderRadius:5,
    width:300,
    height:370,
  },
  spacer:{
    marginTop:20
  },
  pick:{
    borderColor:'black',
    borderWidth:2,
    borderRadius:5,
    height:40,
    width:270,
  },
  input:{
    borderBottomColor:'black',
    borderWidth:2,
    borderRadius:5,
    paddingLeft:10,
    height:40,
    width:270,
  },
  button:{
    backgroundColor:'#60b80f',
    borderRadius:3,
    height:40,
    width:200,
    justifyContent:'center',
    alignItems:'center',
  },
  complete:{
    borderColor:'red',
    borderWidth:1,
    borderRadius:3,
    height:40,
    width:200,
    justifyContent:'center',
    alignItems:'center',
  },

  button_text:{
    fontSize:16
  },
})

export default Transact