import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Share,
  Platform,
  TouchableHighlight
} from "react-native";
import Modal from "modal-enhanced-react-native-web";

import styles from "./styles";

const ReactMarkdown = require("react-markdown");

const Link = props => (
  <Text
    {...props}
    accessibilityRole="link"
    style={StyleSheet.compose(
      styles.link,
      props.style
    )}
  />
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beecoObj: null,
      randIndex: 0,
      modalVisible: false
    };

    this.share = this.share.bind(this);
    this.completed = this.completed.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.fetchBeEcoObj = this.fetchBeEcoObj.bind(this);
    this.displayEcoItem = this.displayEcoItem.bind(this);
    this.selectRandomEcoItem = this.selectRandomEcoItem.bind(this);
  }

  componentWillMount() {
    this.fetchBeEcoObj();
  }

  async fetchBeEcoObj() {
    const req = await fetch(
      "https://spreadsheets.google.com/feeds/list/1AtGB7xme7bA3mqeisYxmdZhlle9fYwHE7cBwMYFUY0M/od6/public/values?alt=json"
    );
    const obj = await req.json();

    this.setState({
      beecoObj: obj.feed.entry
    });

    // Select random element when we load the data in
    this.selectRandomEcoItem();
  }

  displayEcoItem() {
    const { randIndex } = this.state;
    return (
      <ReactMarkdown
        source={this.state.beecoObj[randIndex]["gsx$english"]["$t"]}
      />
    );
  }

  selectRandomEcoItem() {
    if (this.state.beecoObj) {
      // We have our object, let's set a random index in our state. This ensures that we rerender the page
      const length = this.state.beecoObj.length;
      const randIndex = Math.floor(Math.random() * Math.floor(length));
      this.setState({
        randIndex
      });
    }
  }

  closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  completed() {
    this.setState({
      modalVisible: true
    });
  }

  async share() {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(`Error sharing, ${error.message}`);
      // alert(error.message);
    }
  }

  render() {
    return (
      <View style={styles.app}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onBackdropPress={this.closeModal}
          backdropColor="black"
          backdropOpacity={0.7}
        >
          <View style={styles.modalContent}>
            <Text>
              Congratulations! You've just taken a measurable step towards
              making the world a little bit better. Pat yourself on the back!{" "}
            </Text>

            {Platform.OS !== "web" && (
              <TouchableHighlight onPress={this.share}>
                <View style={styles.button}>
                  <Text>Tell the World!</Text>
                </View>
              </TouchableHighlight>
            )}

            <TouchableHighlight onPress={this.closeModal}>
              <View style={styles.button}>
                <Text>Close</Text>
              </View>
            </TouchableHighlight>
          </View>
        </Modal>
        <View style={styles.header}>
          <Text style={styles.title}>BeEco Today</Text>
        </View>
        <View style={styles.mainTipView}>
          <Text style={styles.text}>
            {this.state.beecoObj && this.displayEcoItem()}
          </Text>
        </View>
        <Button
          onPress={this.selectRandomEcoItem}
          style={styles.getTipBtn}
          title="Another One"
        />
        <Button onPress={this.completed} title="Completed!" />
      </View>
    );
  }
}

export default App;
