import {
  View,
  Image,
  I18nManager,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  FlatList,
  BackHandler,
  Modal,
  TouchableOpacity,
  keyboard,
  StatusBar,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import {
  localStorage,
  Colors,
  Font,
  msgTitle,
  mobileH,
  notification,
  pushnotification,
  mobileW,
  apifuntion,
  config,
  Lang_chg,
  msgText,
  msgProvider,
  consolepro,
  localimag,
} from '../Provider/utilslib/Utils';
import {types} from '@babel/core';
import {interpolate} from 'react-native-reanimated';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import {useRoute} from '@react-navigation/native';
// import MediaControls, { PLAYER_STATES } from "react-native-media-controls";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class VideoViewPlayer extends Component {
  constructor(props) {
    super(props);
    this.videoPlayerRef = React.createRef();
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      // playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
      video: this.props.route.params.uri,
      type: this.props.route.params.type,
      isPlaying: false,
      showPlayButton: false,
    };
  }

  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };

  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };

  onReplay = () => {
    //Handler for Replay
    // this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };

  onProgress = data => {
    consolepro.consolelog('HELLOSHUBHAM');
    consolepro.consolelog(this.route.params, '>>PARAMS');
    const {isLoading, playerState} = this.state;
    // Video Player will continue progress even if the video already ended
    // if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
    //   this.setState({ currentTime: data.currentTime });
    // }
  };

  onLoad = data => this.setState({duration: data.duration, isLoading: false});

  onLoadStart = data => this.setState({isLoading: true});

  // onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });

  onError = () => alert('Oh! ', error);

  exitFullScreen = () => {
    alert('Exit full screen');
  };

  enterFullScreen = () => {};

  onFullScreen = () => {
    if (this.state.screenType == 'content')
      this.setState({screenType: 'cover'});
    else this.setState({screenType: 'content'});
  };

  onSeeking = currentTime => this.setState({currentTime});

  componentDidMount = () => {
    consolepro.consolelog('iaminViewimagepage', this.state.video);
    const {uri, type, index} = this.props.route.params || {};
    consolepro.consolelog(uri, type, index);
  };

  handleEnd = () => {
    this.setState({showPlayButton: true, isPlaying: true});
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.whiteColor}} />
        <StatusBar
          hidden={false}
          StatusBarStyle=""
          backgroundColor={Colors.whiteColor}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        {/* // --------- Header ----------- */}
        <View
          style={{
            width: mobileW,
            backgroundColor: Colors.themeColor2,
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.themeColor2,
              height: (mobileH * 8) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              width: (mobileW * 92) / 100,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                width: (mobileW * 9) / 100,
                height: (mobileW * 9) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: (mobileW * 4.5) / 100,
              }}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                resizeMode="contain"
                style={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,

                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
                source={localimag.icon_back_arrow}
                tintColor={Colors.whiteColor}></Image>
            </TouchableOpacity>
            <View style={{alignItems: 'center', alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.FontSemibold,
                  color: Colors.blackColor,
                }}>
                {''}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{flex: 1, backgroundColor: Colors.blackColor}}
          style={{flex: 1}}
          onPress={() => {}}>
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            {this.state.type == 1 ? (
              <View
                style={{
                  backgroundColor: Colors.blackColor,
                  width: mobileW,
                  height:
                    this.state.screenType == 'content'
                      ? (mobileH * 90) / 100
                      : (mobileH * 90) / 100,
                }}>
                {/* Video Player */}
                <VideoPlayer
                  ref={this.videoPlayerRef}
                  source={
                    this.props.route.params?.banner_type == 'banner'
                      ? {uri: config.img_url + this.state.video}
                      : {uri: this.state.video}
                  }
                  ignoreSilentSwitch={'ignore'}
                  disableVolume={true}
                  disableBack={true}
                  disableFullscreen={true}
                  disableSeekbar={true}
                  disableTimer={true}
                  disablePlayPause={true}
                  onLoad={() => this.setState({isVideoLoaded: true})} // Detect when video is ready
                  onEnd={this.handleEnd}
                  paused={this.state.isPlaying}
                  style={{
                    width: '100%',
                    height: (mobileH * 90) / 100,
                    borderRadius: (mobileW * 1) / 100,
                  }}
                />

                {/* Loading Indicator (while video loads) */}
                {!this.state.isVideoLoaded && (
                  <View
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: [{translateX: -25}, {translateY: -25}],
                    }}>
                    {/* <ActivityIndicator size="large" color="#ffffff" /> */}
                  </View>
                )}

                {/* Play/Pause Button (Only show when video is loaded) */}
                {this.state.isVideoLoaded && (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({isPlaying: !this.state.isPlaying})
                    }
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                    }}>
                    <Image
                      style={{
                        width: (mobileW * 12) / 100,
                        height: (mobileW * 12) / 100,
                      }}
                      source={
                        this.state.isPlaying
                          ? localimag.icon_play_icon // Pause icon
                          : localimag.icon_pause // Play icon
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Image
                style={{
                  height: (mobileH * 70) / 100,
                  width: mobileW,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={
                  this.props.route.params?.banner_type == 'banner'
                    ? {uri: config.img_url + this.state.video}
                    : {uri: this.state.video}
                }></Image>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // backgroundColor: 'red',
  },
});
