// services/ChatService.js
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import moment from 'moment';
import {fireStoreDB} from '../Config/firebaseConfig';
import {config} from '../Provider/configProvider';
import {apifuntion} from '../Provider/Apicallingprovider/apiProvider';
import {consolepro} from '../Provider/Messageconsolevalidationprovider/Consoleprovider';
import {localStorage} from '../Provider/localStorageProvider';

const getChatDocumentId = (user1, user2) => {
  const sortedIds = [user1, user2].sort();
  const chatId = sortedIds.join('_');
  return chatId;
};

const getLatestMessageForChat = async (currentUserId, otherUserId) => {
  try {
    const chatDocId = getChatDocumentId(currentUserId, otherUserId);
    const messagesRef = collection(fireStoreDB, 'chats', chatDocId, 'messages');

    // 1️⃣ Fetch the latest message
    const latestQuery = query(
      messagesRef,
      orderBy('timeStamp', 'desc'),
      limit(1),
    );
    const latestSnapshot = await getDocs(latestQuery);

    // 2️⃣ Fetch unread messages (only where isRead = false)
    const unreadSnapshot = await getDocs(
      query(messagesRef, where('isRead', '==', false)),
    );

    // 3️⃣ Filter only messages sent by the OTHER user
    const unreadCount = unreadSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.senderId !== currentUserId;
    }).length;

    // Prepare response
    let lastMessage = '';
    let lastMessageTime = null;
    let lastMessageType = '';

    if (!latestSnapshot.empty) {
      const docData = latestSnapshot.docs[0].data();
      lastMessage = docData?.isStory
        ? docData.story_reply
        : docData?.isMatch
        ? docData?.match_message
        : docData.body;
      lastMessageTime = docData.timeStamp?.toDate() || null;
      lastMessageType = docData.type || '';
    }

    return {
      last_message: lastMessage,
      last_message_time: lastMessageTime,
      last_message_type: lastMessageType,
      unread_count: unreadCount,
    };
  } catch (error) {
    console.error('Firestore fetch error:', error);
    return {
      last_message: '',
      last_message_time: null,
      last_message_type: '',
      unread_count: 0,
    };
  }
};

export const getAllChatUsersByProvider = async () => {
  try {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;

    const API_URL = config.baseURL + 'get_all_chat_users?user_id=' + userId;

    // ✅ Wait for API response
    const res = await apifuntion.getApi(API_URL, 1);

    if (res?.success === true) {
      let details_arr = res?.user_details;

      const enrichedArr = await Promise.all(
        details_arr.map(async user => {
          const latest = await getLatestMessageForChat(userId, user.user_id);
          return {
            ...user,
            last_message: latest.last_message,
            last_message_time: latest.last_message_time
              ? moment(latest.last_message_time).fromNow()
              : '',
            last_message_type: latest.last_message_type,
            last_message_time_raw: latest.last_message_time,
            unread_count: latest.unread_count,
          };
        }),
      );

      // ✅ Calculate overall unread count
      const overallUnreadCount = enrichedArr.reduce(
        (sum, user) => sum + (user?.unread_count || 0),
        0,
      );

      config.show_overall_chat_count = overallUnreadCount;
      console.log('Overall Unread Count:', overallUnreadCount);

      return overallUnreadCount; // ✅ Now this works
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error fetching chat users:', error);
    return 0;
  }
};
