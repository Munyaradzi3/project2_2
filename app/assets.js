import React,{Component} from 'react';
import {StyleSheet,View, Text,TouchableOpacity,TextInput} from 'react-native';

class Assets extends Component{

  state={
    tag_key:'',
    descr_txt:'',
    purp_txt:'',
    loca_txt:'',
    status:'Input details',
  }

  tag=(text)=>{
    this.setState({tag_key:text})
  }
  descr=(text)=>{
    this.setState({descr_txt:text})
  }

  purp=(text)=>{
    this.setState({purp_txt:text})
  }
  loca=(text)=>{
    this.setState({loca_txt:text})
  }

  add=()=>{
    const tag=this.state.tag_key
    const des=this.state.descr_txt
    const purp=this.state.purp_txt
    const loca=this.state.loca_txt
    const key=this.props.public_key
    const url='https://blockbase-app.herokuapp.com/newasset?asset_tag='+tag+'&descr='+des+'&receiver='+key+'&purpose='+purp+'&location='+loca

    fetch(url)
    .then((response)=>response.json())
    .then((resp)=>{
        resp=JSON.stringify(resp)
        this.setState({status:'Done'})
    })
    .catch((error)=>{
      this.setState({status:'error, retry'})
    })
  }

  render(){
    return(
      <View style={styles.main}>
        <View style={styles.box}>
        <View style={styles.inputs}>
          <View>
          <TextInput placeholder="New asset tag" onChangeText={this.tag}
          style={styles.input}/>
          </View>
          <View style={styles.spacer}>
          <TextInput placeholder="Short description" onChangeText={this.descr}
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
          <TouchableOpacity style={styles.button} onPress={this.add}>
            <Text style={styles.button_text}>Finish</Text>
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

export default Assets