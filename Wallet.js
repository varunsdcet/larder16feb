import React, {Component} from 'react';
import {Platform,ActivityIndicator,NativeModules,
  NativeEventEmitter, DeviceEventEmitter,StyleSheet,AsyncStorage, Text, View ,NetInfo ,ScrollView,Image,TouchableOpacity ,Alert,Container ,TextInput , Dimensions} from 'react-native';
import Button from 'react-native-button'
const GLOBAL = require('./Global');
import { DrawerActions } from 'react-navigation';
import { TextField } from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
type Props = {};
const windowW= Dimensions.get('window').width
const windowH = Dimensions.get('window').height
import RazorpayCheckout from 'react-native-razorpay';
var randomString = require('random-string');
import paytm from '@philly25/react-native-paytm';
const paytmConfig = {
    MID: 'sNwQaA02291866118514',
    WEBSITE: 'DEFAULT',
    CHANNEL_ID: 'WAP',
    INDUSTRY_TYPE_ID: 'Retail',
    CALLBACK_URL: 'https://securegw.paytm.in/theia/paytmCallback?ORDER_ID='
};
export default class Wallet extends Component<Props> {
  static navigationOptions = {
  title: 'Login',
  header: null
};
state = {
    phone: '',
    password:'',
    username:'',
    loading:false,
    balance :'',
    value :0,
  };
  showLoading() {
     this.setState({loading: true})
  }

  hideLoading() {
     this.setState({loading: false})
  }
  buttonClickListeners = () =>{
   this.setState({username :'1000'})
  }
  buttonClickListenerss = () =>{
this.setState({username :'500'})
  }
  buttonClickListenersss = () =>{
this.setState({username :'200'})
  }
  getMoviesFromApiAsync = () => {
  this.showLoading();
        const url = 'http://139.59.76.223/larder/webservice/get_profile'

       fetch(url, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     userID: GLOBAL.userID,


   }),
 }).then((response) => response.json())
     .then((responseJson) => {
         this.hideLoading();


         GLOBAL.profile = responseJson[0].image
          GLOBAL.username = responseJson[0].name
           GLOBAL.mobile = responseJson[0].mobile
          GLOBAL.email = responseJson[0].email

this.setState({balance :responseJson[0].wallet})

     })
     .catch((error) => {
       console.error(error);
        this.hideLoading();
         alert('Unable to process your request Please try again after some time')

     });
  }

  runTransaction(amount, customerId, orderId, mobile, email, checkSum) {
      const callbackUrl = `${paytmConfig.CALLBACK_URL}${orderId}`;
      const details = {
          mode: 'Production', // 'Staging' or 'Production'
          MID: paytmConfig.MID,
          INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
          WEBSITE: paytmConfig.WEBSITE,
          CHANNEL_ID: paytmConfig.CHANNEL_ID,
          TXN_AMOUNT: this.state.username, // String
          ORDER_ID: orderId, // String
          CUST_ID: GLOBAL.userID, // String
          CHECKSUMHASH: checkSum, //From your server using PayTM Checksum Utility
          CALLBACK_URL: callbackUrl,
      };

      paytm.startPayment(details);
  }
  componentWillUnmount() {
  if (Platform.OS === 'ios') {
      this.emitter.removeListener('PayTMResponse', this.onPayTmResponse);
  } else {
      DeviceEventEmitter.removeListener('PayTMResponse', this.onPayTmResponse);
  }
  }
  onPayTmResponse = (resp) => {
    const {STATUS, status, response} = resp;
console.log(response)
    if (Platform.OS === 'ios') {
  this.setState({out:response})

  const jsonResponse = JSON.parse(response);
  const {STATUS} = jsonResponse;
  if (jsonResponse.STATUS == 'TXN_SUCCESS') {
this.myPayments(jsonResponse.TXNAMOUNT,'SUCCESS',jsonResponse.TXNID)
  } else if (jsonResponse.STATUS  == 'PENDING'){
this.myPayments(jsonResponse.TXNAMOUNT,'PENDING',jsonResponse.TXNID)
  }
  else if (jsonResponse.STATUS  == 'TXN_FAILURE'){
this.myPayments(jsonResponse.TXNAMOUNT,'FAILURE',jsonResponse.TXNID)
  }



    } else {
      if (STATUS && STATUS === 'TXN_SUCCESS') {
        // Payment succeed!
      }
    }
    };


    myPayments = (s,status,txn) =>{


  this.showLoading();
      const url = 'http://139.59.76.223/larder/webservice/add_wallet'

     fetch(url, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   userID: GLOBAL.userID,
   amount :s.toString(),
   txnID :txn,
   transaction_status :status,



  }),
  }).then((response) => response.json())
   .then((responseJson) => {
       this.hideLoading();

  this.setState({balance :responseJson[0].wallet})




   })
   .catch((error) => {
     console.error(error);
      this.hideLoading();
       alert('Unable to process your request Please try again after some time')

   });
  }
    componentWillMount() {
      if (Platform.OS === 'ios') {
          const { RNPayTm } = NativeModules;

          this.emitter = new NativeEventEmitter(RNPayTm);
          this.emitter.addListener('PayTMResponse', this.onPayTmResponse);
      } else {
          DeviceEventEmitter.addListener('PayTMResponse', this.onPayTmResponse);
      }
      {this.getMoviesFromApiAsync()}
     }

     buttonClickListenerPay=()=>{
       if  (this.state.username == '' || this.state.username == '0'){
         alert('Please add Money to Continue.')
         return
       }
       var dd = parseInt(this.state.username)
       if  (dd == 0){
         alert('Please add Money to Continue.')
         return
       }
       var x = randomString({
       length: 10,
       numeric: true,
       letters: false,
       special: false,

       });
       var commonHtml = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${x}`;


       const url = 'http://139.59.76.223/larder/paytm/generateChecksum.php'

       fetch(url, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
       MID: "sNwQaA02291866118514",
       ORDER_ID: x,
       INDUSTRY_TYPE_ID: "Retail",
       CHANNEL_ID: "WAP",
       TXN_AMOUNT: this.state.username,
       WEBSITE: "DEFAULT",
       CUST_ID: GLOBAL.userID,
       CALLBACK_URL: commonHtml,


       }),
       }).then((response) => response.json())
       .then((responseJson) => {
       const callbackUrl = commonHtml;
       // alert(JSON.stringify(responseJson))
       this.runTransaction('199', '1', x, '9896904632', "varun.singhal78@gmail.com", responseJson.CHECKSUMHASH)


       })
       .catch((error) => {
       alert(error);
       this.hideLoading();
       alert('Unable to process your request Please try again after some time')

       });
     }
  myPayment = (s) =>{


this.showLoading();
      const url = 'http://139.59.76.223/larder/webservice/add_wallet'

     fetch(url, {
 method: 'POST',
 headers: {
   'Content-Type': 'application/json',
 },
 body: JSON.stringify({
   userID: GLOBAL.userID,
   amount :s.toString(),


 }),
}).then((response) => response.json())
   .then((responseJson) => {
       this.hideLoading();

this.setState({balance :responseJson[0].wallet})




   })
   .catch((error) => {
     console.error(error);
      this.hideLoading();
       alert('Unable to process your request Please try again after some time')

   });
  }
  buttonClickListener = () =>{
    if  (this.state.username == '' || this.state.username == '0'){
      alert('Please add Money to Continue.')
      return
    }
    var s = parseInt(this.state.username)

    if  (s == 0){
      alert('Please add Money to Continue.')
      return
    }
    var b = s * 100;

    var options = {
              description: 'Larder',
              image: require('./logo.png'),
              currency: 'INR',
              key: 'rzp_live_j6WtEd1MKTdcih',
              amount: b.toString(),

              name: GLOBAL.username,
              prefill: {
                email: GLOBAL.email,
                contact: GLOBAL.mobile,
                name: GLOBAL.username
              },
              theme: {color: '#F37254'}
            }
            RazorpayCheckout.open(options).then((data) => {

this.myPayments(s,'SUCCESS','Rajor')



            }).catch((error) => {
              // handle failure
              this.myPayments(s,error.description,'')

            });
            RazorpayCheckout.onExternalWalletSelection(data => {



            });

}
  render() {
    var radio_props = [
 {label: 'Pay via Paytm', value: 0 },
 {label: 'Others', value: 1 }
];
    var commonHtml = `Wallet Balance :  ${this.state.balance} Points `;
    if(this.state.loading){
  return(


    <View style={{flex: 1 ,backgroundColor: 'black'}}>
    <ActivityIndicator style = {{ position: 'absolute',
         left: 0,
         right: 0,
         top: 0,
         bottom: 0,
         opacity: 0.5,
         backgroundColor: 'black',
         justifyContent: 'center',
         alignItems: 'center'
       }}

   size="large" color="#90BA45" />
    </View>
  )
  }
    return (
      <KeyboardAwareScrollView style = {{backgroundColor:'black',width : windowW ,height :windowH,flex:1}}>
      <View style = {{flex : 1  }}>

      <Text style = {{marginTop :30 ,color :'white',fontSize : 22, fontFamily:'TypoGraphica' ,alignSelf :'center' }}>
      {GLOBAL.username}
      </Text>

       <View style = {{flexDirection :'row'}}>

        <TouchableOpacity onPress={() =>  this.props.navigation.goBack()}>
      <Image style={{marginLeft : 20 ,height : 30 ,marginTop :15 , width : 30,resizeMode :'contain'}}
  source={require('./back.png')}/>
  </TouchableOpacity>
  <Text style = {{color :'white',fontSize : 16 ,marginLeft : 10, marginTop :19 }}>
  My Money
  </Text>
  <TouchableOpacity onPress={() =>  this.props.navigation.navigate('Dislaimner')}>
  <Image style={{marginLeft : windowW - 200,height : 30 ,marginTop :15 , width : 30,resizeMode :'contain'}}
  source={require('./disclaimer.png')}/>
    </TouchableOpacity>
   </View>

   <Image style={{marginLeft : windowW/2 - 50 ,height : 100 ,marginTop :30 , width : 100,resizeMode :'contain'}}
 source={require('./addmoney.png')}/>


   <Text style = {{alignSelf:'center',marginTop : 50 ,color :'white',fontSize :15}}>
   {commonHtml}
   </Text>
   <Text style = {{alignSelf:'center',marginTop : 10 ,color :'white' ,fontSize :15}}>
    1 Point = 1 INR
   </Text>

   <View style = {{margin :10 ,marginTop : 30,flexDirection :'row',justifyContent :'space-between',alignItems:'space-between'}}>

   <Button
       containerStyle={{padding:10, height:45, overflow:'hidden',borderBottomWidth :2,width :100,borderTopWidth:2,borderLeftWidth:2,borderRightWidth:2,borderRadius:4,borderLeftColor:'white',borderRightColor:'white',  borderTopColor :'white',borderBottomColor :'white',backgroundColor :'transparent'}}
       disabledContainerStyle={{backgroundColor: 'grey'}}
       style={{fontSize: 14, color: 'white',fontFamily:'TypoGraphica'}}
        onPress={this.buttonClickListeners}>
      + 1000
     </Button>

     <Button
         containerStyle={{padding:10, height:45, overflow:'hidden',borderBottomWidth :2,width :100 ,borderTopWidth:2,borderLeftWidth:2,borderRightWidth:2,borderRadius:4,borderLeftColor:'white',borderRightColor:'white',  borderTopColor :'white',borderBottomColor :'white',backgroundColor :'transparent'}}
         disabledContainerStyle={{backgroundColor: 'grey'}}
         style={{fontSize: 14, color: 'white',fontFamily:'TypoGraphica'}}
          onPress={this.buttonClickListenerss}>
        + 500
       </Button>


       <Button
           containerStyle={{padding:10, height:45, overflow:'hidden',borderBottomWidth :2,width :100 ,borderTopWidth:2,borderLeftWidth:2,borderRightWidth:2,borderRadius:4,borderLeftColor:'white',borderRightColor:'white',  borderTopColor :'white',borderBottomColor :'white',backgroundColor :'transparent'}}
           disabledContainerStyle={{backgroundColor: 'grey'}}
           style={{fontSize: 14, color: 'white',fontFamily:'TypoGraphica'}}
            onPress={this.buttonClickListenersss}>
            + 200
         </Button>
    </View>


    <Text style = {{margin : 20 ,color :'#90BA45',fontSize :12,fontFamily :'TypoGraphica'}}>
    Enter Amount
    </Text>

    <TextInput style = {{margin : 30,borderBottomWidth:1,borderBottomColor :'rgba(255,255,255,0.2)',marginLeft : 10,marginTop:2, width : windowW.width - 20 ,height : 40 ,color :'white' ,fontSize : 16 ,fontFamily :'TypoGraphica'}}
      placeholder="Enter Your Amount"
      placeholderTextColor="white"
     keyboardType = 'numeric'
      onChangeText={(username) => this.setState({username})}
     value={this.state.username}
      >


    </TextInput>



   <Button
         containerStyle={{marginLeft :50,marginRight :50,marginTop :10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#90BA45'}}
         disabledContainerStyle={{backgroundColor: 'white'}}
         style={{fontSize: 14, color: 'white',fontFamily:'TypoGraphica'}}
          onPress={this.buttonClickListenerPay}>
         Pay Via Paytm
       </Button>

  <Button
         containerStyle={{marginLeft :50,marginRight :50,marginTop :10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#90BA45'}}
         disabledContainerStyle={{backgroundColor: 'white'}}
         style={{fontSize: 14, color: 'white',fontFamily:'TypoGraphica'}}
          onPress={this.buttonClickListener}>
         Others
       </Button>

    </View>

      </KeyboardAwareScrollView>

    );
  }
}
