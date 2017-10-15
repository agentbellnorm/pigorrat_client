import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as modelFunctions from '../lib/modelFunctions';
import getVoteSubjects from '../services/getVoteSubjects';
import castVote from '../services/castVote';
import SwipeCards from '../components/SwipeCards';
import texts from '../config/texts.json';
import * as events from '../config/events';

export default class App extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../resources/images/judge.png')}
        style={{
          width: 30,
          height: 24,
          tintColor: tintColor
        }}
      />
    ),
  }

  constructor(props) {
    super(props);
    this.state = {
      fetchingFinished: false,
      voteSubjects: []
    }
  }

  handleEvent(event) {
    switch (event.type) {
      case events.vote:
        // act on event, remove subject with ID from list of loaded subjects
        castVote({
          userId: 'FABIAN',
          voteSubjectId: event.value.subjectId ,
          vote: event.value.vote
        }).then((response) => console.log('voted!'))
    }
  }

  componentWillMount() {
    if (modelFunctions.shouldCallGetvoteSubjects(this.state)) {
      this.setState({ isFetching: true, hasFetched: false })
      getVoteSubjects().then(data => {
        this.setState({
          isFetching: false,
          hasFetched: true,
          voteSubjects: data
        })
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          modelFunctions.isLoading(this.state)
          ? <Text> {texts.loading} </Text>
          : <SwipeCards
              voteSubjects={this.state.voteSubjects}
              handleEvent={this.handleEvent}
              events={events}
            />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
