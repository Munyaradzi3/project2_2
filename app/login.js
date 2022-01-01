import React,{Component} from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';

class Login extends Component{
  state={
    private_key:'',
    public_key:'',
    status:'Next'
  }
  public=(text)=>{
    this.setState({public_key:text})
  }
  private=(text)=>{
    this.setState({private_key:text})
  }
  screen=()=>{
    //get information for hashing and return keys
    this.setState({status:'Loading, wait...'})
     const pri=this.state.private_key
     const pub=this.state.public_key
     const url='https://blockbase-app.herokuapp.com/userkeys?private_key='+pri+'&public_key='+pub
     fetch(url)
     .then((response)=>response.json())
     .then((resp)=>{
        resp=JSON.stringify(resp)
        resp=JSON.parse(resp)
        this.props.public(this.state.public_key)
        this.props.private(resp[1])
        this.props.screen()
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
          <TextInput placeholder="username" onChangeText={this.public}
          style={styles.input}/>
          </View>
          <View style={styles.spacer}>
          <TextInput placeholder="password / private key" onChangeText={this.private}
          style={styles.input}/>
          </View>
          <View style={styles.space}>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={this.screen}>
              <Text style={styles.button_text}>{this.state.status}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
        <Text>
          {this.state.err}
        </Text>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  main:{
    flex:1,
  },
  box:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  inputs:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#f5f5f5',
    borderWidth:1,
    borderColor:'#b6b7b8',
    borderRadius:5,
    width:300,
    height:270,
  },
  spacer:{
    marginTop:20
  },
  input:{
    borderBottomColor:'black',
    borderWidth:2,
    borderRadius:5,
    height:40,
    width:270,
    paddingLeft:10,
  },
  buttons:{
    height:70,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
  },
  button:{
    backgroundColor:'#60b80f',
    height:40,
    width:200,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:3,
  },
  button_text:{
    fontSize:16
  },
})

export default Login