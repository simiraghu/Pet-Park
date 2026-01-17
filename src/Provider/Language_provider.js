import {I18nManager} from 'react-native';
import {consolepro} from './Messageconsolevalidationprovider/Consoleprovider';
import {config} from './configProvider';
import {localStorage} from './localStorageProvider';
import RNRestart from 'react-native-restart';

global.language_key = 1;

export const language_get = async () => {
  var item = await localStorage.getItemObject('language');
  consolepro.consolelog('check launguage option', item);

  consolepro.consolelog('is rtl', I18nManager.isRTL);
  consolepro.consolelog('is rtl config', config.textalign);

  if (item != null) {
    consolepro.consolelog('language__1', config.language);
    config.language = item;
  }
  consolepro.consolelog('language_key123', config.language);
  if (item != null) {
    if (item == 0) {
      config.textalign = 'left';
      config.inverted = false;
    } else {
      config.textalign = 'right';
      config.inverted = true;
    }
  } else {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    config.textalign = 'left';
    config.inverted = false;
    localStorage.setItemObject('language', 0);
  }

  setTimeout(() => {
    RNRestart.Restart();
  }, 500);
};

export const language_set = async languagem => {
  consolepro.consolelog('I18nManager.isRTL Develaoper', I18nManager.isRTL);
  if (languagem == 1) {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    config.textalign = 'right';
    config.inverted = true;
    //localStorage.setItemObject('language', 1);
    //localStorage.setItemObject('languagecathc', 0);
    //config.language = 1;
  } else {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    config.textalign = 'left';
    config.inverted = false;
    //localStorage.setItemObject('language', 0);
    //localStorage.removeItem('languagecathc');
    //localStorage.removeItem('languagesetenglish');
    //config.language = 0;
  }

  setTimeout(() => {
    RNRestart.Restart();
  }, 500);
};

export const language_set_new = async languagem => {
  console.log('I18nManager.isRTL Developer', I18nManager.isRTL);
  if (languagem == 1) {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    config.textalign = 'right';
    config.inverted = true;
  } else {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    config.textalign = 'left';
    config.inverted = false;
  }
};

export const Lang_chg = {
  yourLocation_txt: ['Your Location'],
  premium_txt: ['PREMIUM'],
  account_txt: ['Account'],
  yourprofile_txt: ['Your Profile'],
  Manageyourconnectexperiencesandaccountsettings_txt: [
    'Manage your connect experiences and account settings.',
  ],
  logout_txt: ['Log Out'],
  changeLanguage_txt: ['Change Language'],
  chat_txt: ['Chats'],
  settings_txt: ['Settings'],
  favourite_txt: ['Favourite'],
  contactUs_txt: ['Contact Us'],
  privacyPolicy_txt: ['Privacy Policy'],
  termsAndConditions_txt: ['Terms and Conditions'],
  yourFan_txt: ['Your Fan'],
  hereYouCanSeePeoeple_txt: ['Here you can see people who like you'],
  search_txt: ['Search'],
  conversations_txt: ['Conversations'],
  treasureEveryPawSome_txt: [
    'Treasure every paw-some moment,\none memory at a time',
  ],
  createStory_txt: ['Create Story'],
  petParkCommunity_txt: ['Pet Park Community'],
  viewAll_txt: ['View All'],
  allCommunity_txt: ['All Community'],
  myFeed_txt: ['My Feed'],
  myCommunities_txt: ['My Communities'],
  viewCommunity_txt: ['View Community'],
  postedIn_txt: ['Posted In'],
  publishPost_txt: ['Publish Post'],
  addYourPostIn_txt: ['Add your post in'],
  joinCommunity_txt: ['Join Community'],
  aboutCommunities_txt: ['About Community'],
  post_txt: ['Post'],
  unfollow_txt: ['Unfollow'],
  interested_txt: ['Interested'],
  moreSuggestedPosts_txt: [
    'More suggested posts in your feed will be like this.',
  ],
  notInterested_txt: ['Not Interested'],
  lessSuggestedPost_txt: [
    'Less suggested posts in your feed will be like this.',
  ],
  hidePost_txt: ['Hide Post'],
  seeFewerPostLikeThis_txt: ['See fewer posts like this.'],
  reportPost_txt: ['Report Post'],
  weWontletDiscover_txt: [
    "We won't let Discover #paw_lover know who reposted this.",
  ],
  hideAllfrom_txt: ['Hide all from #Pawlover'],
  stopSeeingPost_txt: ['Stop seeing posts from this page.'],
  keepSwipe_txt: ['KEEP SWIPE'],
  likeEx_txt: ['LIKE!'],
  filters_txt: ['Filters'],
  yourCurrentLocation_txt: ['Your Current Location'],
  interests_txt: ['Interests'],
  all_txt: ['All'],
  distance_txt: ['Distance'],
  ageRange_txt: ['Age Range'],
  apply_txt: ['Apply'],
  notifications_txt: ['Notifications'],
  edit_txt: ['Edit'],
  areyousure_txt: ['Are You Sure?'],
  youwanttologout_txt: ['You Want To Logout'],
  cancelmedia: ['Cancel', ''],

  // Simi ------------

  find_pet_perfect_txt: ['Find pet Perfect'],
  continue_with_apple_txt: ['Continue with Apple'],
  continue_with_google_txt: ['Continue with Google'],
  companion_txt: ['COMPANION'],
  mobile_txt: ['Mobile'],
  email_txt: ['Email'],
  bysigning_up_agree_to_our: ['By Signing up you agree to our '],
  term_and_service_txt: ['Terms Of Service'],
  and_txt: ['and'],
  privacy_policy: ['Privacy Policy.'],
  login_with_email: ['Login with Email'],
  welcome_pet_park_txt: ['Welcome to the Pet Park'],
  email_address_txt: ['Email address'],
  password_txt: ['Password'],
  enter_your_email_address_txt: ['Enter your email'],
  enter_your_password: ['Enter your password'],
  forgot_password_txt: ['Forgot password?'],
  keep_me_signed_in_txt: ['Keep me signed in'],
  login_txt: ['Login'],
  orSigned_in_using: ['or signed in using'],
  apple_txt: ['Apple'],
  google_txt: ['Google'],
  new_user_txt: ['New User?'],
  register_here_txt: ['Register here'],
  login_with_mobile_txt: ['Login with Mobile'],
  enter_your_mobile_num_txt: ['Enter Your Mobile Number'],
  we_will_send_verifi_code_txt: ['We will send you 6 digit verification code'],
  generate_otp_txt: ['Generate OTP'],
  otp_verification_Headding_txt: ['OTP Verification'],
  enter_the_otp_sent_to: ['Enter the Otp sent to'],
  mobile_number_value: ['+91 9488943200'],
  didnt_receive_otp: ["Didn't Receive OTP?"],
  resend_txt: ['RESEND'],
  verify_and_continue: ['Verify & Continue'],
  what_brings_you_to_pet_park_txt: ['What brings you to Pet Park?'],
  discover_connections_playtime_pawsitive_vibes_txt: [
    'Discover connections, playtime and paw- sitive vibes ',
  ],
  friendship_txt: ['Friendship'],
  where_paws_meets_for_lifelong_friendships_txt: [
    'Where paws meet for lifelong friendships',
  ],
  plan_a_new_pet_txt: ['Plan A New Pet'],
  your_journey_perfect_pet_companion_start_here: [
    'Your journey to a perfect pet companion starts here',
  ],
  continue_txt: ['Continue'],
  tell_us_about_your_pet_txt: ['Tell us about your pet'],
  you_add_pet_image_txt: [
    "You must add at least one photo to create your profile. Please make sure your pet's face is well lit and visible.",
  ],
  pet_name_txt: ['Pet Name'],
  pet_category_txt: ['Pet Category'],
  pet_breed_txt: ['Pet Breed'],
  Date_of_birth_txt: ['Date Of Birth'],
  gender_txt: ['Gender'],
  size_txt: ['Size'],
  next_txt: ['Next'],
  enter_pet_name_txt: ['Enter pet name'],
  select_pet_category_txt: ['Select pet category'],
  select_breed_txt: ['Select breed'],
  select_date_of_birth_txt: ['Select date of birth'],
  select_gender_txt: ['Select gender'],
  select_size: ['Select size'],
  add_litle_about_you_txt: ['Add a little about you'],
  you_add_your_details_txt: [
    'You can add at least one photo to create your profile. make sure your face is well lit and visible.',
  ],
  your_name_txt: ['Your Name'],
  DOB_txt: ['DOB'],
  location_txt: ['Location'],
  what_do_you_do_txt: ['What do you do?'],
  relationship_status_txt: ['Relationship status'],
  enter_your_name_txt: ['Enter your name'],
  enter_your_location_txt: ['Enter your location'],
  select_relationship_status_txt: ['Select relationship status'],
  enter_what_do_you_do_txt: ['Enter what do you do?'],
  where_in_the_world_are_you_txt: ['Where are you in the world?'],
  you_need_enable_location_txt: [
    'Your need to enable your location to enjoy the complete experience at pet park, including matching. Your location will be used to show pet owners near you.',
  ],
  allow_location_access_txt: ['Allow Location Access'],
  you_need_enable_notification_txt: [
    "You'll need to enable notifications to know when you have a new match or have received new messages. You can always turn off notifications by going to your settings.",
  ],
  want_to_stay_informed: ['Want to stay informed?'],
  lets_go_to_know_your_pet_txt: ["Let's go to know your pet!"],
  you_can_answer_any_3_txt: ['You can answer any 3 out of 5 questions'],
  question_1_txt: ['Question 1'],
  best_memory_with_your_pet_txt: ['Best memory with your pet ?'],
  questions_one_value: [
    'What is you favorite memory with your pet that always brings a smile to your face?',
  ],
  write_your_answer_here_txt: ['Write your answer here'],
  skip_txt: ['Skip'],
  next_txt: ['Next'],
  question_2_txt: ['Question 2'],
  question_3_txt: ['Question 3'],
  question_4_txt: ['Question 4'],
  question_5_txt: ['Question 5'],
  questions_heading_value2: ['What activities does your pet enjoy the most?'],
  questions_heading_value3: ['Favorite Toy or Treat?'],
  question_two_value: ['Activities does your pet enjoy?'],
  question_three_value: ['Does your pet have a favorite toy or treat?'],
  questions_heading_value4: ["What's one quirky habit your pet has?"],
  question_four_value: ['Quirky habit your pet has?'],
  questions_heading_value5: ['Trained in Commands or Tricks?'],
  question_five_value: [
    'Is your pet trained in any specific command or tricks?',
  ],
  back_txt: ['Back'],
  tell_us_about_your_pet_health_txt: ['Tell us about your pet health'],
  vaccination_status: ['Vaccination Status'],
  is_your_pet_vaccinated_txt: ['Is your pet vaccinated?'],
  yes_txt: ['Yes'],
  no_txt: ['No'],
  government_registration_txt: ['Government Registration'],
  is_your_pet_registered_with_the_government_portal: [
    'Is your pet registered with the government portal?',
  ],
  would_you_like_to_register_your_pet_txt: [
    'Would you like to get your pet registered?',
  ],
  important_disclaimer_txt: ['Important Disclaimer'],
  if_you_cant_register_txt: [
    "If you cannot register your pet on the government-verified portal, the government has the right to take custody of your pet. Ensuring vaccination and registeration is essential or your pet's safety and compliance with regulations.",
  ],
  search_txt: ['Search'],
  use_my_current_location_txt: ['Use my current location'],
  search_result_txt: ['S E A R C H   R E S U L T'],
  gold_avenue_txt: ['Gold Avenue'],
  location_value_txt: ['8503 Preston rd, ingl..'],
  create_account_txt: ['Create Account'],
  name_txt: ['Name'],
  create_password_txt: ['Create Password'],
  confirm_password_txt: ['Confirm Password'],
  enter_confirm_password_txt: ['Enter confirm password'],
  create_txt: ['Create'],
  date_value: ['04/09/1983'],
  forgotPassword_txt: ['Forgot Password'],
  ifYouHaveForgotten_txt: [
    'if you’ve forgotten your password, simply follow the reset instructions',
  ],
  otp_verification_txt: ['Enter verification code'],
  submit_txt: ['Submit'],
  resetPassword_txt: ['Reset Password'],
  toResetYourPassword_txt: [
    'to reset your password, enter a new password and confirm it',
  ],
  enterANewPassword_txt: ['Enter a new password'],
  done_txt: ['Done'],
  pleaseEneterVerificationCode_txt: [
    'please enter the verification code sent to your email',
  ],
  otp_txt: ['OTP'],
  password_saved_successfully: ['Password Saved Successfully!'],
  plan_a_pet_txt: ['Plan a pet'],
  what_type_of_pet_are_you_planning: ['What type of pet are you planning?'],
  what_is_the_preferred_breed_txt: [
    'What is the preferred breed or type of the pet?',
  ],
  what_gender_are_you_preferred_txt: ['What gender do you prefer?'],
  what_age_range_are_you_looking_txt: ['What age range are you looking for?'],
  Note_txt: ['Note'],
  select_pet_type_txt: ['Select pet type'],
  select_breed_type: ['Select breed type'],
  select_age_range_txt: ['Select age range'],
  write_your_note_txt: ['Write your note'],
  thanks_for_sharing_txt: ['Thanks For Sharing!'],
  your_pet_profile_ready_to_explore_txt: [
    'Your pet profile is ready to explore and connect with others!',
  ],
  ok_txt: ['Ok'],
  keep_swipe_txt: ['KEEP SWIPE'],
  like_txt: ['LIKE!'],
  what_do_you_want_to_report_txt: ['What do you want to report?'],
  if_someone_immidate_danger_txt: [
    "If someone is in immediate danger, get help before reporting to pet park. don't wait.",
  ],
  why_are_you_reporting_this_profile_txt: [
    'Why are you reporting this profle?',
  ],
  thanks_for_letting_use_know: ['Thanks For Letting Us Know'],
  we_use_your_feedback_txt: [
    "We use your feedback to helf our systems learn when something isn't right.",
  ],
  other_steps_you_can_take: ['Other steps you can take'],
  cancel_txt: ['Cancel'],
  block_txt: ['Block'],
  congratulations_txt: ['C O N G R A T U L A T I O N S'],
  do_not_waste_time_start_converstation_txt: [
    'Do not waste time and start conversation with each other, Hurry Up!',
  ],
  start_chatting_now_txt: ['START CHATTING NOW'],
  not_now_chat_later_txt: ["Not now, i'll chat later"],
  unlock_exclusive_feature_txt: [
    'Unlock exclusive features and make the most of your pet experience.',
  ],
  unlimited_pet_match_txt: ['Unlimited pet matches'],
  early_access_to_new_feature_txt: ['Early access to new features'],
  access_to_full_community_feature_txt: ['Access to full community features'],
  chat_and_connect_pet_owner_txt: ['Chat and connect with pet owners'],
  get_premium_now: ['Get Premium Now'],
  most_popular_txt: ['Most Popular'],
  converstation_txt: ['Converstations'],
  treasure_every_paw_some_txt: ['Treasure every paw-some moment,'],
  one_time_memory_txt: ['one memory at a time'],
  create_story: ['Create story'],
  choose_language_txt: ['Choose Language'],
  setting_txt: ['Settings'],
  account_txt: ['Account'],
  notifications_txt: ['Notifications'],
  blocked_account_txt: ['Blocked Accounts'],
  personal_information_txt: ['Personal Information'],
  delete_account_txt: ['Delete Account'],
  unblocked_txt: ['Unblocked'],
  unblock_txt: ['Unblock'],
  are_you_sure_txt: ['Are You Sure?'],
  personal_information_subheading: [
    'Pet Park uses this information to verify identity and keep our community safe. You control which personal details are visible to others.',
  ],
  please_enter_email: ['Please enter email'],
  save_txt: ['Save'],
  personal_information_saved_successfully_txt: [
    'Personal Information Saved Successfully!',
  ],
  home_txt: ['Home'],
  deactivate_account_txt: ['Deactivated your account rather deleting?'],
  deactivate_account_temprary_txt: ['Deactivate your account is temporary'],
  your_profile_photo_comment_hidden_txt: [
    'Your profile, photos, comments & adores will be hidden until you enable it by logging back in.',
  ],
  deleting_your_account_txt: ['Deleting Your Account is Permanent'],
  it_may_take_days_txt: [
    'It may take 60 days to complete the deletion process after it has begun, your profile, photos, vidoes, comments and adores and followers will be permanently deleted after deletion process is completed. If you will  login in between the deletion process we will stop the process.',
  ],
  deactivate_account_btn_txt: ['Deactivate Account'],
  you_want_to_delete_your_acccout: ['You Want To Delete Your Account'],
  delete_btn_txt: ['Delete'],
  you_want_to_deactivate_your_acccout: ['You Want To Deactivate Account'],
  deactivate_btn_txt: ['Deactivate'],
  favourite_txt: ['Favourites'],
  Contactus: ['Contact Us'],
  enteradescriptionhere_txt: ['Enter a description here'],
  thankyou_txt: ['Thank You'],
  thankyouforsubmittingyourdetails_txt: [
    'Thankyou for submitting your details',
  ],
  optional_txt: ['(optional)'],
  thank_you_for_submitting_contact_us_txt: [
    'Thankyou for submitting your details. we will connect you soon.',
  ],
  update_profile_txt: ['Update Profile'],
  your_detail_txt: ['Your Details'],
  your_pet_detail_txt: ['Your Pet Details'],
  update_btn_txt: ['Update'],
  profile_update_successfully_txt: ['Profile Update Successfully!'],
  profile_txt: ['Profile'],
  select_location_txt: ['Select location'],
  rate_app_txt: ['Rate App'],
  share_app_txt: ['Share App'],
  about_us_txt: ['About Us'],
  change_password_txt: ['Change Password'],
  toChange_password_txt: [
    'to Change your password, enter a current password, new password and confirm it',
  ],
  enter_current_password_txt: ['Enter you current password'],
  current_password_txt: ['Current Password'],
  enterNewPassword_txt: ['Enter new password'],
  enterANewPassword_txt: ['Enter a new password'],
  enterConfirmNewPassword_txt: ['Enter a confirm password'],
  confirmPassword_txt: ['Confirm Password'],
  password_changed_successfully: ['Password Changed Successfully'],
  fandq_txt: ["FAQ'S"],
  enteryourReason_txt: ['Enter your reason'],
  tell_use_about_your_pet_nature_txt: ['Tell us about your pet Nature'],
  you_can_choose_any_three_txt: ['You can choose any three'],
  adore_you_txt: ['Adore You'],
  saved_successfully_txt: ['Saved Successfully!'],
  confirm_account_deactivation_txt: ['Confirm Account Deactivation'],
  confrim_delete_account_txt: ['Confirm Account Delete'],
  you_want_to_unfollow_txt: ['You Want To Unfollow'],
  add_pet_details_txt: ['Add Pet Details'],
  enter_aboutHere_txt: ['Enter about here'],
  followed_communities_txt: ['Followed Communities'],
  create_own_community_txt: ['Create Own Community'],
  create_community_txt: ['Create Community'],
  your_community_cover_txt: ['Your Community Cover'],
  enter_your_community_name_txt: ['Enter Your Community Name'],
  about_your_community_txt: ['About Your Community'],
  community_create_successfully_txt: ['Community Create Successfully!'],
  okay_txt: ['Okay'],
  enter_title_txt: ['Enter Your Community Title'],
  change_country_txt: ['Change Country'],
  choose_country_txt: ['Choose Country'],
  woof_yes_txt: ['WOOF YES!'],
  bark_off_txt: ['BARK OFF!'],
  all_communities_txt: ['All Communities'],
  userAgeRange_txt: ['User Age Range'],
  petAgeRange_txt: ['Pet Age Range'],
  register_with_email_txt: ['Register With Email'],

  byContinuingYouAgree_txt: ['By continuing, you agree to our '],
  termsOfService: ['terms of service'],
  getstarted_text: ['Get Started'],
  otphasbeensenttoyouonmobilenumberemailid_txt: [
    'OTP has been sent to you on mobile number\n and email id',
  ],
  enterotp_txt: ['ENTER OTP'],
  resendotp_txt: ['resend OTP'],
  verify_txt: ['Verify'],
  pet_parent_age_range_txt: ['Pet Parent Age Range'],
  mobile_number_txt: ['Mobile Number'],
  signUp_txt: ['Sign Up'],
  register_txt: ['Register'],
  view_all_plans_txt: ['view all plans'],
  payment_method_txt: ['Payment Method'],
  credit_card_txt: ['Credit Card'],
  paypal_txt: ['Paypal'],
  google_pay_txt: ['Google Pay'],
  payable_amount_txt: ['Payable Amount'],
  pay_now_txt: ['PAY NOW'],
  payment_successfully_txt: ['Payment Successfully!'],
  select_option_txt: ['Select Option'],
  MediaCamera: ['Media From Camera'],
  Mediagallery: ['Media From Gallery'],
};
