import React,{Component} from 'react';
import {StyleSheet,View,Text,ScrollView,TouchableOpacity,TextInput} from 'react-native';

class Search extends Component{

  state={
    details:[
      {number:0,time:"Date",receiver:"Owned",purpose:'Purpose',location:'Location'},
    ],
    tag_key:'',
    owner:'',
    status:'',
  }

  tag=(text)=>{
    this.setState({tag_key:text})
  }

  search=()=>{
    const tag=this.state.tag_key
    const url='http://www.mershcap.co.zw/hist.php?asset_tag='+tag
    fetch(url)
    .then((response)=>response.json())
    .then((resp)=>{
      resp=JSON.stringify(resp)
      resp=JSON.parse(resp)
      this.setState({details:resp})
      this.setState({owner:resp[1].receiver})
    })
    .catch((error)=>{
      this.setState({status:'error'})
    })
  }

  render(){
    return(
      <View style={styles.main}>
        <View style={styles.search_box}>
          <TextInput style={styles.search} onChangeText={this.tag}
            placeholder='   Asset tag' />
            <TouchableOpacity style={styles.button} onPress={this.search}>
          <Text style={styles.button_text}>Search</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.owner}>
          <Text numberOfLines={1} style={styles.owner_text}>current owner:{this.state.owner}</Text>
        </View>

        <ScrollView style={styles.conatiner}>
          {this.state.details.map((item,number)=>(
            <View style={styles.items}>
              <Text numberOfLines={1} style={styles.text}>
              {item.time}</Text>
              <Text numberOfLines={1} style={styles.text}>              {item.receiver}</Text>
              <Text numberOfLines={1} style={styles.text}>          {item.purpose}</Text>
              <Text numberOfLines={1} style={styles.text}>          {item.location}</Text>
            </View>
          ))
          }
        </ScrollView>
        <Text>{this.state.status}</Text>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  main:{
    flex:1,
  },
  search_box:{
    justifyContent:'center',
    alignItems:'center',
  },
  search:{
    borderBottomColor:'black',
    borderWidth:2,
    borderRadius:5,
    height:40,
    width:270,
    marginTop:15,
  },
  owner:{
    marginLeft:40,
    marginTop:12,
  },
  owner_text:{
    fontSize:18,
  },
  conatiner:{
    flex:1,
  },
  items:{
    flexDirection:'row',
    justifyContent:'space-around',
    margin:10,
  },
  
  text:{
    fontSize:13,
  },
  button:{
    backgroundColor:'#60b80f',
    borderRadius:3,
    height:40,
    width:200,
    justifyContent:'center',
    alignItems:'center',
    marginTop:15,
  },
  button_text:{
    fontSize:16,
  },
})

export default Search