import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  config,
  consolepro,
  Lang_chg,
  mobileW,
  msgProvider,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import * as Progress from 'react-native-progress';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const KnowYourPet = ({navigation}) => {
  const [answer, setAnswer] = useState(null);
  const [questionNoIndex, setQuestionNoIndex] = useState(0);
  const [progressFilled, setProgressFilled] = useState(0);

  const {t} = useTranslation();
  const {params} = useRoute();

  // const breed = params?.breed;
  // const image = params?.image;
  // const isVaccinated= params?.isVaccinated;
  // const pet_dob = params?.pet_dob;
  // const pet_gender = params?.pet_gender;
  // const pet_name = params?.pet_name;
  // const pet_type = params?.pet_type;
  // const register = params?.register;
  // const size = params?.size;

  const {sliderValuesArray, ...rest} = params;
  const merged = {...rest, ...sliderValuesArray};

  console.log(merged, '<<Merged');

  console.log('Params =======>>', params);

  const [questionData, setQuestionData] = useState([
    {
      id: 1,
      question_no: [1, '١', '一'],
      question: t('questions_one_value'),
      question_heading: t('best_memory_with_your_pet_txt'),
      key: 'answer_1',
    },
    {
      id: 2,
      question_no: [2, '٢', '二'],
      question: t('question_two_value'),
      question_heading: t('questions_heading_value2'),
      key: 'answer_2',
    },
    {
      id: 3,
      question_no: [3, '٣', '三'],
      question: t('question_three_value'),
      question_heading: t('questions_heading_value3'),
      key: 'answer_3',
    },
    {
      id: 4,
      question_no: [4, '٤', '四'],
      question: t('question_four_value'),
      question_heading: t('questions_heading_value4'),
      key: 'answer_4',
    },
    {
      id: 5,
      question_no: [5, '٥', '五'],
      question: t('question_five_value'),
      question_heading: t('questions_heading_value5'),
      key: 'answer_5',
    },
  ]);

  const [answerArray, setAnswerArray] = useState([]);

  // handle next ==============

  const handleOnNext = () => {
    const currentKey = questionData[questionNoIndex].key;
    const currentValue = answer ?? '';

    // Check if key already exists
    const existingIndex = answerArray.findIndex(item =>
      item.hasOwnProperty(currentKey),
    );

    if (existingIndex !== -1) {
      // Update the existing value
      answerArray[existingIndex][currentKey] = currentValue;
    } else {
      // Push new value
      answerArray.push({[currentKey]: currentValue});
    }

    if (questionNoIndex < questionData.length - 1) {
      setQuestionNoIndex(questionNoIndex + 1);
      if (answer) {
        setProgressFilled(progressFilled + 0.33);
      }
      setAnswer(null);
    } else {
      consolepro.consolelog(answerArray, '<<Answer');

      // Count how many answers have non-empty values
      const validAnswersCount = answerArray.filter(
        item => Object.values(item)[0] !== '',
      ).length;

      if (validAnswersCount < 3) {
        msgProvider.toast(t('please_answer_any_three_txt'), 'bottom');
        return false;
      }

      setProgressFilled(1);
      setAnswer(null);

      setTimeout(() => {
        navigation.navigate('AddUserDetails', {
          pagename: 'KnowYourPet',
          merged,
          answerArray,
        });
      }, 500);
    }
  };

  // -------- skip back button--------

  const handleOnSkip = () => {
    if (questionNoIndex < questionData.length - 1) {
      setQuestionNoIndex(questionNoIndex + 1);
    } else {
      // setProgressFilled(progressFilled - 0.2);
      setQuestionNoIndex(questionNoIndex - 1);
      setAnswer(null);
    }
  };

  // -------- back press ----

  const handleBackPress = () => {
    navigation.goBack();
    setProgressFilled(0);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginTop: (mobileW * 3) / 100,
            //   alignSelf: 'center',
            //   backgroundColor: 'blue',
            marginHorizontal: (mobileW * 5) / 100,
            flex: 1,
          }}>
          {/* -----back---- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBackPress}
            style={{
              alignSelf: 'flex-start',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
                {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>

          <KeyboardAwareScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === 'android' ? 100 : 0} // Important for Android
            enableOnAndroid={true}
            contentContainerStyle={{
              paddingBottom: (mobileW * 5) / 100,
              flexGrow: 1, // This allows the scroll view to grow and become scrollable
            }}>
            {/* ------ heading------- */}
            <View style={{marginTop: (mobileW * 5) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 6) / 100,
                }}>
                {t('lets_go_to_know_your_pet_txt')}
              </Text>

              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('you_can_answer_any_3_txt')}
              </Text>
            </View>

            {/* -----progress ------ */}

            <Progress.Bar
              progress={progressFilled}
              width={(mobileW * 90) / 100}
              height={(mobileW * 0.6) / 100}
              style={{marginTop: (mobileW * 4) / 100}}
              color={Colors.ColorProgress}
              borderColor={Colors.placeholderTextColor}
              unfilledColor={Colors.placeholderTextColor}
            />
            {/* ---- questions------ */}

            <View
              style={{
                marginTop: (mobileW * 5) / 100,
                paddingBottom: (mobileW * 10) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: (mobileW * 30) / 100,
                  height: (mobileW * 9) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 6) / 100,
                  backgroundColor: Colors.themeColor,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                  }}>
                  {t('question_txt')}{' '}
                  {questionData[questionNoIndex].question_no[config.language]}
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontBold,
                  fontSize: (mobileW * 5.5) / 100,
                  marginTop: (mobileW * 4) / 100,
                }}>
                {questionData[questionNoIndex].question_heading}
              </Text>

              {/* ----- questions ----- */}
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                }}>
                {questionData[questionNoIndex].question}
              </Text>

              {/* ------input field ------ */}
              <View
                style={{
                  paddingVertical: (mobileW * 2) / 100,
                  position: 'relative',
                }}>
                <TextInput
                  multiline
                  // numberOfLines={7}
                  style={{
                    backgroundColor: Colors.whiteColor,
                    borderColor: Colors.themeColor2,
                    borderWidth: 1,
                    borderRadius: (mobileW * 2) / 100,
                    marginTop: (mobileW * 5) / 100,
                    textAlignVertical: 'top',
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                    padding: (mobileW * 3) / 100,
                    paddingRight: (mobileW * 10) / 100,
                    color: Colors.ColorBlack,
                    height: (mobileW * 40) / 100,
                    textAlign: config.language == 1 ? 'right' : 'left',
                  }}
                  placeholder={t('write_your_answer_here_txt')}
                  value={answer}
                  onChangeText={val => setAnswer(val)}
                  placeholderTextColor={Colors.placeholderTextColor}
                  maxLength={250}
                />
                <Text
                  style={{
                    position: 'absolute',
                    right: (mobileW * 4) / 100,
                    bottom: (mobileW * 4) / 100,
                    color: Colors.themeColor,
                    fontSize: (mobileW * 3) / 100,
                    fontFamily: Font.FontMedium,
                  }}>
                  {answer !== null ? answer.length : 0}/250
                </Text>
              </View>

              {/* ---------buttons------- */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginTop: (mobileW * 5) / 100,
                }}>
                <CommonButton
                  containerStyle={{
                    width: (mobileW * 35) / 100,
                    height: (mobileW * 10) / 100,
                  }}
                  title={
                    questionNoIndex < questionData.length - 1
                      ? t('skip_txt')
                      : t('back_txt')
                  }
                  onPress={handleOnSkip}
                />

                <CommonButton
                  containerStyle={{
                    width: (mobileW * 35) / 100,
                    height: (mobileW * 10) / 100,
                    backgroundColor: Colors.themeColor2,
                  }}
                  title={
                    questionNoIndex === questionData.length - 1
                      ? t('continue_txt')
                      : t('next_txt')
                  }
                  onPress={handleOnNext}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default KnowYourPet;

const styles = StyleSheet.create({});
