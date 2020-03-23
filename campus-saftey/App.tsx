import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, StatusBar, AppState, Dimensions, TouchableWithoutFeedback, ScrollView, Platform, Image} from 'react-native';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import MapView from 'react-native-maps';

const firebaseConfig = {
  //put in your own cofig details thanks.
};

const app = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  constructor() {
    super();
    this.rend
    this.state = {
      Email: '',
      Name: '',
      Phone: '',
      buttonColor: this.randomColor(),
    };
  }

  render() {
    return (
      <TextInputExample />
    );
  }



  randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

}


class TextInputExample extends React.Component {

  constructor() {
    super();
    this.state = {
      Email: '',
      Name: '',
      Phone: '',
      buttonColor: this.randomColor(),
      gradient1: this.randomColor(),
      gradient2: this.randomColor(),
      prevData:
        {userKey: '',
        name: '',
        email: '',
        phone: ''},
      loggedIn: false,

    };
  };



  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  };

  hide(){
        StatusBar.setHidden(true, Math.random() > 0.5 ? 'slide' : 'fade');
  };

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      firebase.database().ref().child('users/' + this.state.prevData.userKey).remove();
    } else if (nextAppState === 'active') {
      firebase.database().ref().child('users/' + this.state.prevData.userKey).set(this.state.prevData);
    }
  };

  randomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  _storeUser = () => {
    var rootRef = firebase.database().ref();
    var x = rootRef.child('users/').push();
    var newStoreRef = x;
    if (this.state.Name === "") {
      alert("No name was entered");
    } else if (this.state.Email === "") {
      alert("No email was entered");
    } else if (this.state.Phone === "") {
      alert("No phone number was entered");
    } else if (!this.state.Email.includes("@berkeley.edu")) {
      alert("Please enter a valid Berkeley email adress");
    } else {
      newStoreRef.set({
        userKey: '',
        name: this.state.Name,
        email: this.state.Email,
        phone: this.state.Phone,
      });
      this.state.prevData = {
        userKey: newStoreRef.key,
        name: this.state.Name,
        email: this.state.Email,
        phone: this.state.Phone
      };
      this.setState({loggedIn: true});
    }
  };

  render() {
    const textInputStyle = {
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#eee',
      fontSize: 15,
      padding: 5,
      height: 60,
      color: 'white',
    };

    const updateSingleLineValue = (value: string) => this.setState({ Email: value });
    const updateSecureTextValue = (value: string) => this.setState({ Name: value });
    const updatePhoneNumber = (value: string) => this.setState({ Phone: value });

    if (!this.state.loggedIn) {
      return (
        <LinearGradient onload = {this.hide()}
          colors={[this.state.gradient1, this.state.gradient2]}
          style = {{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
            <View style = {{justifyContent:'flex-end', alignItems:'center', flex: 2}}>
              <Text style={styles.TitleText}>
                Sign Into Walk Along App
              </Text>
            </View>
        <View style = {{flex: 6, flexDirection: 'column'}}>
        <View style={{ padding: 10 }}>
          <TextInput
            placeholder="Name:"
            placeholderTextColor='#fff'
            keyboardAppearance="dark"
            value={this.state.Name}
            onChangeText={updateSecureTextValue}
            style={[{ marginBottom: 10 }, textInputStyle]}
          />
          <TextInput
            placeholder="Email:"
            placeholderTextColor='#fff'
            onChangeText={updateSingleLineValue}
            style={[{ marginBottom: 10 }, textInputStyle]}
            value={this.state.Email}
          />
          <TextInput
            placeholder="Phone Number:"
            placeholderTextColor='#fff'
            onChangeText={updatePhoneNumber}
            style={[{ marginBottom: 10 }, textInputStyle]}
            value={this.state.Phone}
          />
          <Button
          style = {styles.button, styles.TitleText}
          onPress={this._storeUser}
          title="Sign Up"
          color={this.state.buttonColor}
          accessibilityLabel="Sign Up"
          />
        </View>
        </View>
      </LinearGradient>
      );
    } else {
      return (
        <MapPage />
      );
    }
  }
}


class MapPage extends React.Component {

constructor() {
  super();
  this.state = {
    Email: '',
    Name: '',
    Phone: '',
    gradient1: this.randomColor(),
    gradient2: this.randomColor(),
    gradient3: this.randomColor(),
    users: null,
  };
};

  componentDidMount() {
    var leadsRef = firebase.database().ref('users');
    leadsRef.on('value', function(snapshot) {
      const temp = [];
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.key;
        temp.push(childData);
      });
      this.setState({users: temp});
    }.bind(this));
  };

  randomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  texts = () => {
    let dimensions = Dimensions.get("window");
    let b = Math.round((dimensions.width * 5) / 16);
    let a = b;
    if (this.state.users) {
      return this.state.users.map((item) =>
      <LilImage key = {item} plop = {item} imageHeight = {a} imageWidth = {a}>
      </LilImage>
    );
    }
  };

  render() {
    let dimensions = Dimensions.get("window");
    let imageHeight = Math.round((dimensions.width * 5) / 16);
    let imageWidth = imageHeight;
    return (
      <View style={{flexDirection: 'column', flex: 5}}>
      <LinearGradient
        colors={[this.state.gradient1, this.state.gradient2]}
        style = {{flex: 1, justifyContent: 'center', paddingTop: 4}}>
          <ScrollView style = {{flexDirection: 'row'}} horizontal = {true} activeOpacity = {0.5}>
              {this.texts()}
          </ScrollView>
        </LinearGradient>
        <LinearGradient
          colors={[this.state.gradient2, this.state.gradient3]}
          style = {{flex: 4, justifyContent: 'center'}}>
          <View style = {{paddingHorizontal: 5, paddingTop: 3, flex: 4, flexDirection: 'row', justifyContent: 'center'}}>
            <MapView style={{flex: 4}} />
          </View>
          </LinearGradient>
      </View>
    );
  }


  _storeUser = () => {
  var rootRef = firebase.database().ref();
  var storesRef = rootRef.child('users/').push();
  var newStoreRef = storesRef;
    newStoreRef.set({
      name: this.state.Name,
      email: this.state.Email,
      phone: this.state.Phone,
    });
  }

}

class LilImage extends React.Component {
  _flex = () => {
    firebase.database().ref('users/' + this.props.plop).once('value').then(function(snapshot) {
      var x =  snapshot.child("name").val();
      alert('Name: ' + x + '\nEmail: ' + snapshot.child("email").val()+ '\nPhone Number: ' + snapshot.child("phone").val());
    });
  }
  render() {
    return (
    <TouchableOpacity onPress={this._flex} style = {{paddingHorizontal: 10}}>
      <Image
         style={{ height: this.props.imageHeight, width: this.props.imageWidth}}
         source={require("./images/A.png")}
       />
     </TouchableOpacity>
   );
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  sectionHeader: {
    backgroundColor: 'rgba(245,245,245,1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: 'black',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },

  TitleText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
  },

  mapStyle: {
    width: Dimensions.get('window').width * (8/10),
    height: Dimensions.get('window').height,
  },
});
