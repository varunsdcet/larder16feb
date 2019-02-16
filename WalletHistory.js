import React, {Component} from 'react';
import {ActivityIndicator,Platform, StyleSheet,StatusBar, Text,Alert, View,Image,Dimensions,FlatList,TouchableOpacity,AsyncStorage} from 'react-native';
const window = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
import Button from 'react-native-button';
const GLOBAL = require('./Global');
const { width, height } = Dimensions.get('window');


const equalWidth =  (width -20 )
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
const MyStatusBar = ({backgroundColor, ...props}) => (
<View style={[styles.statusBar, { backgroundColor }]}>
  <StatusBar translucent backgroundColor={backgroundColor} {...props} />
</View>
);

export default class WalletHistory extends Component<Props> {

  static navigationOptions = {
  title: 'BoothList',
  header: null
};
resPress = (resId,index) => {
   GLOBAL.productid =  resId;
  // this.props.navigation.navigate('Detail')
  }
  constructor(props) {
    super(props)
    this.state = {
      moviesList: [],
      eventLists :[],
      brandLists: [],
      moviesLists: [],
      beer: [],
      count : "0",
    }

  }
 _keyExtractor = (item, index) => item.organisationID;

 resPress = (resId,index) => {
  //  GLOBAL.productid =  resId;
  //  this.props.navigation.navigate('BoothDetail')
   }


    showLoading() {
       this.setState({loading: true})
    }

    hideLoading() {
       this.setState({loading: false})
    }

 back = () => {

    this.props.navigation.goBack()
   }






 _renderItem = ({item,index}) => {

var s = item.transaction_type;
var amount = item.amount;
var closing = `Closing Balance : Rs ${item.closing_balance} `;;
var commonHtml = `+ Rs ${amount} `;
var commonHtmls = `- Rs ${amount} `;
   return (
        <TouchableOpacity onPress={() =>  this.resPress(item.boothID,item)}>
     <View style = {{height : 95 ,width : window.width ,flex :1 ,flexDirection :'column'}} >

     <Text style = {{margin :10 ,marginLeft : 15,marginTop :5,  color :'white',fontFamily :'TypoGraphica' ,fontSize :14}}>
    {item.tdate}
      </Text>

   <View style = {{flexDirection :'row'}}>
   <Image style={{marginLeft : 20 ,height : 30 ,marginTop :3 , width : 30,resizeMode :'contain'}}
 source={require('./walle.png')}/>
    {s == "Referral" && (
 <Text style = {{margin :10  ,marginTop : 2,color :'grey',fontFamily :'TypoGraphica' ,fontSize :14}}>
  Got Referral Balance
  </Text>

)}

{s == "scratch_card" && (
<Text style = {{margin :10  ,marginTop : 2,color :'grey',fontFamily :'TypoGraphica' ,fontSize :14}}>
Redeem Scratch Card
</Text>


)}
{s == "Quiz" && (
<Text style = {{margin :10  ,marginTop : 2,color :'grey',fontFamily :'TypoGraphica' ,fontSize :14}}>
Winning in Quiz
</Text>


)}

{s == "wallet" && (
<Text style = {{margin :10  ,marginTop : 2,color :'grey',fontFamily :'TypoGraphica' ,fontSize :14}}>
Added Balance to Wallet
</Text>

)}
{s == "signup" && (
<Text style = {{margin :10  ,marginTop : 2,color :'grey',fontFamily :'TypoGraphica' ,fontSize :14}}>
Got Signup Bonus
</Text>

)}
{s == "Order" && (
<Text style = {{margin :10  ,marginTop : 2,color :'grey',fontFamily :'TypoGraphica' ,fontSize :14}}>
Paid for Order
</Text>

)}

{s == "signup" && (
  <Text style = {{position :'absolute' ,top : 3,right :10,color :'#90BA45' ,fontSize :20 ,fontWeight :'bold'}}>
  {commonHtml}
   </Text>

)}
{s == "Referral" && (
  <Text style = {{position :'absolute' ,top : 3,right :10,color :'#90BA45' ,fontSize :20 ,fontWeight :'bold'}}>
  {commonHtml}
   </Text>

)}
{s == "Quiz" && (
  <Text style = {{position :'absolute' ,top : 3,right :10,color :'#90BA45' ,fontSize :20 ,fontWeight :'bold'}}>
  {commonHtml}
   </Text>

)}

{s == "scratch_card" && (
<Text style = {{position :'absolute' ,top : 3,right :10,color :'#90BA45' ,fontSize :20,fontWeight :'bold'}}>
{commonHtml}
</Text>


)}

{s == "wallet" && (
<Text style = {{position :'absolute' ,top : 3,right :10,color :'#90BA45' ,fontSize :20,fontWeight :'bold'}}>
{commonHtml}
</Text>

)}
{s == "Order" && (
<Text style = {{position :'absolute' ,top : 3,right :10,color :'white' ,fontSize :20}}>
{commonHtmls}
</Text>

)}




   </View>


<View style = {{flexDirection :'row'}}>
<Text style = {{marginLeft :58 ,marginTop : -8,color :'white' ,fontSize :14}}>
{item.ttime}
 </Text>


</View>
<Text style = {{marginLeft :58 ,marginTop : 1,color :'#90BA45' ,fontSize :14,fontWeight :'bold'}}>
{closing}
 </Text>
<View style = {{width:width,height :1 ,backgroundColor :'grey',marginTop :5}}>

</View>

     </View>

 </TouchableOpacity>





   )
 }

 getMoviesFromApiAsync = () => {
 this.showLoading();
       const url = 'http://139.59.76.223/larder/webservice/wallet_history'

      fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userID: GLOBAL.userID


  }),
}).then((response) => response.json())
    .then((responseJson) => {
        this.hideLoading();


       this.setState({ moviesList: responseJson[0].transactions})



    })
    .catch((error) => {
      console.error(error);
       this.hideLoading();
        alert('Unable to process your request Please try again after some time')

    });
 }

   componentWillMount() {
     {this.getMoviesFromApiAsync()}
    }
 renderPage(image, index) {
         return (
             <View key={index}>
                 <Image style={{ width: window.width, height: 150 }} source={{ uri: image }} />
             </View>
         );
     }

  render() {
    if(this.state.loading){
  return(
    <View style={{flex: 1 ,backgroundColor: 'black'}}>
    <ActivityIndicator style = {styles.loading}

   size="large" color="#90ba45" />
    </View>
  )
}
  return (

    <View style = {{flex : 1 , width : width ,height : height ,backgroundColor:'black' }}>

    <Text style = {{marginTop :30 ,color :'white',fontSize : 22, fontFamily:'TypoGraphica' ,alignSelf :'center' }}>
    {GLOBAL.username}
    </Text>

     <View style = {{flexDirection :'row'}}>

      <TouchableOpacity onPress={() =>  this.props.navigation.goBack()}>
    <Image style={{marginLeft : 20 ,height : 30 ,marginTop :15 , width : 30,resizeMode :'contain'}}
source={require('./back.png')}/>
</TouchableOpacity>
<Text style = {{color :'white',fontSize : 16 ,marginLeft : 10, marginTop :19 }}>
Transaction History
</Text>

 </View>
 <FlatList
   data={this.state.moviesList}
   numColumns={1}
   keyExtractor={this._keyExtractor}
  renderItem={this._renderItem}
  extraData={this.state}
 />
    </View>




        //         <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        //  <View style={styles.content}>
        //  <View style = {{width :width , height : 60 ,backgroundColor :'black',flexDirection :'column'}}>
        //  <Text stle = {{fontSize : 20 ,fontFamily :'TypoGraphica',width : width ,height : 30 ,marginTop : 20 ,color :'white' }}>
        // Varun
        //  </Text>
        //
        //  </View>
        //
        //  <FlatList
        //    data={this.state.moviesList}
        //    numColumns={1}
        //    keyExtractor={this._keyExtractor}
        //   renderItem={this._renderItem}
        //   extraData={this.state}
        //  />
        //   </View>
        //    </KeyboardAwareScrollView>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor:'#910818',
    height: APPBAR_HEIGHT,



  },
  loading: {
           position: 'absolute',
           left: window.width/2 - 30,

           top: window.height/2,

           opacity: 0.5,

           justifyContent: 'center',
           alignItems: 'center'
       },

  content: {
    flex: 1,
    backgroundColor:'#000000',
  },
});
