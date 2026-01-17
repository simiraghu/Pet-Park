import {Alert, ToastAndroid, Platform} from 'react-native';
import {config} from '../configProvider';
import Toast from 'react-native-simple-toast';

//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
  toast(message, position) {
    if (position == 'center') {
      Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
    } else if (position == 'top') {
      Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
    } else if (position == 'bottom') {
      Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
    } else if (position == 'long') {
      Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
    }
  }

  alert(title, message, callback) {
    if (callback === false) {
      Alert.alert(
        title,
        message,
        [
          {
            text: msgTitle.ok[config.language],
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: msgTitle.ok[config.language],
            onPress: () => callback,
          },
        ],
        {cancelable: false},
      );
    }
  }

  confirm(title, message, callbackOk, callbackCancel) {
    if (callbackCancel === false) {
      Alert.alert(
        title,
        message,
        [
          {
            text: msgTitle.cancel[config.language],
          },
          {
            text: msgTitle.ok[config.language],
            onPress: () => this.btnPageLoginCall(),
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: msgTitle.cancel[config.language],
            onPress: () => callbackCancel,
          },
          {
            text: msgTitle.ok[config.language],
            onPress: () => callbackOk,
          },
        ],
        {cancelable: false},
      );
    }
  }

  later(title, message, callbackOk, callbackCancel, callbackLater) {
    Alert.alert(
      title,
      message,
      [
        {
          text: msgTitle.later[config.language],
          onPress: () => callbackLater,
        },
        {
          text: msgTitle.cancel[config.language],
          onPress: () => callbackCancel,
        },
        {
          text: msgTitle.ok[config.language],
          onPress: () => callbackOk,
        },
      ],
      {cancelable: false},
    );
  }
}

//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
  //----------------- message buttons
  ok = ['Ok', 'موافق', "好的", 'ОК', 'Está bien'];
  cancel = ['Cancel', 'إلغاء', '取消', 'Отмена', 'Cancelar'];
  later = ['Later', 'لاحقًا', 'Plus tard', 'Позже', 'Más tarde'];

  //--------------- message title
  information = [
    'Information Message',
    'رسالة معلومات',
    "Message d'information",
    'Информационное сообщение',
    'Mensaje informativo',
  ];
  alert = ['Alert', 'تنبيه', 'Alerte', 'Предупреждение', 'Alerta'];
  confirm = ['Confirm', 'تأكيد', 'Confirmer', 'Подтвердить', 'Confirmar'];
  validation = ['Validation', 'تحقق', 'Validation', 'Проверка', 'Validación'];
  success = ['Success', 'نجاح', 'Succès', 'Успех', 'Éxito'];
  error = ['Error', 'خطأ', 'Erreur', 'Ошибка', 'Error'];
  response = ['Response', 'رد', 'Réponse', 'Ответ', 'Respuesta'];
  server = [
    'Connection Error',
    'خطأ في الاتصال',
    'Erreur de connexion',
    'Ошибка соединения',
    'Error de conexión',
  ];
  internet = [
    'Connection Error',
    'خطأ في الاتصال',
    'Erreur de connexion',
    'Ошибка соединения',
    'Error de conexión',
  ];
  deactivate_msg = [
    'Account deactivated',
    'تم تعطيل الحساب',
    'Compte désactivé',
    'Аккаунт деактивирован',
    'Cuenta desactivada',
  ];
  deactivate = [0];
  usernotexit = [
    'User id does not exist',
    'معرف المستخدم غير موجود',
    "L'identifiant utilisateur n'existe pas",
    'Идентификатор пользователя не существует',
    'El ID de usuario no existe',
  ];
  account_deactivate_title = [
    'Your account is deactivated. Please try again.',
    'تم تعطيل حسابك. حاول مرة أخرى.',
    'Votre compte est désactivé. Veuillez réessayer.',
    'Ваш аккаунт деактивирован. Пожалуйста, попробуйте снова.',
    'Tu cuenta ha sido desactivada. Por favor, inténtalo de nuevo.',
  ];
}

//--------------------------- Message Provider Start -----------------------

class messageTextProvider {
  // --------don't not change ---------------//
  loginFirst = [
    'Please login first',
    'يرجى تسجيل الدخول أولاً',
    "Veuillez vous connecter d'abord",
    'Пожалуйста, войдите сначала',
    'Por favor inicie sesión primero',
  ];
  networkconnection = [
    'Unable to connect. Please check that you are connected to the Internet and try again.',
    'غير قادر على الاتصال. يرجى التحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
    'Impossible de se connecter. Veuillez vérifier que vous êtes connecté à Internet et réessayer.',
    'Не удается подключиться. Пожалуйста, проверьте, что вы подключены к Интернету, и попробуйте снова.',
    'No se puede conectar. Por favor, verifique que está conectado a Internet y vuelva a intentarlo.',
  ];
  servermessage = [
    'An unexpected error occurred. Please try again. If the problem continues, please contact us.',
    'حدث خطأ غير متوقع. حاول مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بنا.',
    "Une erreur inattendue s'est produite. Veuillez réessayer. Si le problème persiste, veuillez nous contacter.",
    'Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова. Если проблема сохраняется, пожалуйста, свяжитесь с нами.',
    'Ocurrió un error inesperado. Por favor, inténtelo de nuevo. Si el problema persiste, por favor contáctenos.',
  ];

  //----config------
  accountDeactivated = [
    'Your account is deactivated',
    'تم تعطيل حسابك',
    'Votre compte est désactivé',
    'Ваш аккаунт деактивирован',
    'Tu cuenta ha sido desactivada',
  ];
  //login
  emptyphone = [
    'Please enter a phone number',
    'يرجى إدخال رقم هاتف',
    'Veuillez entrer un numéro de téléphone',
    'Пожалуйста, введите номер телефона',
    'Por favor, introduzca un número de teléfono',
  ];

  validPhone = [
    'Enter a valid phone number',
    'أدخل رقم هاتف صالحًا',
    'Entrez un numéro de téléphone valide',
    'Введите действительный номер телефона',
    'Introduce un número de teléfono válido',
  ];

  emptyPassword = [
    'Please enter your password',
    'من فضلك أدخل رقمك السري',
    'Veuillez entrer votre mot de passe',
    'Пожалуйста, введите ваш пароль',
    'Por favor, introduzca su contraseña',
  ];

  passwordMinLength = [
    'Password cannot be less than 6 characters',
    'لا يمكن أن تكون كلمة المرور أقل من 6 أحرف',
    'Le mot de passe ne peut pas contenir moins de 6 caractères',
    'Пароль не может быть менее 6 символов',
    'La contraseña no puede tener menos de 6 caracteres',
  ];

  selectUser = [
    'Please select user',
    'يرجى اختيار المستخدم',
    "Veuillez sélectionner l'utilisateur",
    'Пожалуйста, выберите пользователя',
    'Por favor, seleccione usuario',
  ];

  passwordlowercase = [
    'Password must contain uppercase, lowercase & number',
    'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة ورقم',
    'Le mot de passe doit contenir des majuscules, des minuscules et un chiffre',
    'Пароль должен содержать заглавные и строчные буквы и цифры',
    'La contraseña debe contener mayúsculas, minúsculas y números',
  ];
  Newpasswordlowercase = [
    'New password must contain uppercase, lowercase & number',
    'يجب أن تحتوي كلمة المرور الجديدة على أحرف كبيرة وصغيرة ورقم',
    'Le nouveau mot de passe doit contenir des majuscules, des minuscules et un chiffre',
    'Новый пароль должен содержать заглавные и строчные буквы и цифры',
    'La nueva contraseña debe contener mayúsculas, minúsculas y números',
  ];
  Currentpasswordlowercase = [
    'Current password must contain uppercase, lowercase & number',
    'يجب أن تحتوي كلمة المرور الحالية على أحرف كبيرة وصغيرة ورقم',
    'Le mot de passe actuel doit contenir des majuscules, des minuscules et un chiffre',
    'Текущий пароль должен содержать заглавные и строчные буквы и цифры',
    'La contraseña actual debe contener mayúsculas, minúsculas y números',
  ];
  confirmpasswordlowercase = [
    'Confirm password must contain uppercase, lowercase & number',
    'يجب أن تحتوي كلمة مرور التأكيد على أحرف كبيرة وصغيرة ورقم',
    'Le mot de passe de confirmation doit contenir des majuscules, des minuscules et un chiffre',
    'Подтверждение пароля должно содержать заглавные и строчные буквы и цифры',
    'La confirmación de la contraseña debe contener mayúsculas, minúsculas y números',
  ];
  emptyName = [
    'Please enter your name',
    'من فضلك أدخل إسمك',
    "S'il vous plaît entrez votre nom",
    'Пожалуйста, введите ваше имя',
    'Por favor, introduzca su nombre',
  ];

  emptyConPassword = [
    'Please enter confirm password',
    'الرجاء إدخال تأكيد كلمة المرور',
    'Veuillez saisir le mot de passe de confirmation',
    'Пожалуйста, введите подтверждение пароля',
    'Por favor ingrese la confirmación de la contraseña',
  ];

  conPassMinLength = [
    'Confirm password cannot be less than 6 characters',
    'لا يمكن أن يكون تأكيد كلمة المرور أقل من 6 أحرف',
    'Le mot de passe de confirmation ne peut pas contenir moins de 6 caractères',
    'Подтверждение пароля не может быть менее 6 символов',
    'La confirmación de la contraseña no puede tener menos de 6 caracteres',
  ];

  passNotMatch = [
    'Password and confirm password must be the same',
    'يجب أن تتطابق كلمة المرور وتأكيد كلمة المرور',
    'Le mot de passe et la confirmation du mot de passe doivent être identiques',
    'Пароль и подтверждение пароля должны совпадать',
    'La contraseña y la confirmación de la contraseña deben ser iguales',
  ];

  acceptTerms = [
    'Please accept Terms & Conditions and Privacy Policy to continue',
    'يرجى قبول الشروط والأحكام وسياسة الخصوصية للمتابعة',
    'Veuillez accepter les conditions générales et la politique de confidentialité pour continuer',
    'Пожалуйста, примите условия и политику конфиденциальности, чтобы продолжить',
    'Por favor, acepte los Términos y Condiciones y la Política de Privacidad para continuar',
  ];

  emptyOtp = [
    'Please enter OTP',
    'الرجاء إدخال رمز OTP',
    'Veuillez saisir OTP',
    'Пожалуйста, введите OTP',
    'Por favor, ingrese OTP',
  ];

  otpMinLength = [
    'OTP cannot be less than 4 digits',
    'لا يمكن أن يكون رمز OTP أقل من 4 أرقام',
    'OTP ne peut pas être inférieur à 4 chiffres',
    'OTP не может быть менее 4 цифр',
    'OTP no puede ser inferior a 4 dígitos',
  ];
  emptyprofileImg = [
    'Please upload profile image',
    'يرجى تحميل صورة الملف الشخصي',
    'Veuillez télécharger une image de profil',
    'Пожалуйста, загрузите изображение профиля',
    'Por favor, sube una imagen de perfil',
  ];
  selectDob = [
    'Please select date of birth',
    'يرجى تحديد تاريخ الميلاد',
    'Veuillez sélectionner la date de naissance',
    'Пожалуйста, выберите дату рождения',
    'Por favor, seleccione la fecha de nacimiento',
  ];

  emptyEmail = [
    'Please enter email address',
    'يرجى إدخال عنوان البريد الإلكتروني',
    'Veuillez saisir une adresse e-mail',
    'Пожалуйста, введите адрес электронной почты',
    'Por favor, introduzca una dirección de correo electrónico',
  ];

  validEmail = [
    'Email address is not correct, please enter a valid email address',
    'عنوان البريد الإلكتروني غير صحيح، يرجى إدخال عنوان بريد إلكتروني صالح',
    "L'adresse e-mail n'est pas correcte, veuillez saisir une adresse e-mail valide",
    'Адрес электронной почты неверен, пожалуйста, введите корректный адрес электронной почты',
    'La dirección de correo electrónico no es correcta, por favor ingrese una dirección de correo electrónico válida',
  ];

  selectgender = [
    'Please select gender',
    'يرجى تحديد الجنس',
    'Veuillez sélectionner le genre',
    'Пожалуйста, выберите пол',
    'Por favor, seleccione el género',
  ];

  addatLeastImage = [
    'Please add at least 2 photos',
    'يرجى إضافة ما لا يقل عن 2 صور',
    'Veuillez ajouter au moins 2 photos',
    'Пожалуйста, добавьте как минимум 2 фотографии',
    'Por favor, agregue al menos 2 fotos',
  ];

  emptyedu = [
    'Please select education level',
    'يرجى تحديد مستوى التعليم',
    "Veuillez sélectionner le niveau d'éducation",
    'Пожалуйста, выберите уровень образования',
    'Por favor, seleccione el nivel de educación',
  ];

  emptyCity = [
    'Please select city',
    'يرجى تحديد المدينة',
    'Veuillez sélectionner la ville',
    'Пожалуйста, выберите город',
    'Por favor, seleccione la ciudad',
  ];
  emptybio = [
    'Please enter bio',
    'الرجاء إدخال السيرة الذاتية',
    'Veuillez entrer votre bio',
    'Пожалуйста, введите биографию',
    'Por favor ingresa a la biografía',
  ];
  emptyCountry = [
    'Please select country',
    'اختر البلد',
    'Sélectionnez le pays',
    'Выберите страну',
    'Seleccione el país',
  ];

  emptyState = [
    'Please select state',
    'يرجى اختيار الولاية',
    "Veuillez sélectionner l'état",
    'Пожалуйста, выберите область',
    'Por favor, seleccione el estado',
  ];

  emptyreligion = [
    'Please select religion',
    'يرجى تحديد الديانة',
    'Veuillez sélectionner la religion',
    'Пожалуйста, выберите религию',
    'Por favor, seleccione la religión',
  ];

  emptyEthnicity = [
    'Please select ethnicity',
    'يرجى تحديد العرق',
    "Veuillez sélectionner l'ethnicité",
    'Пожалуйста, выберите этническую принадлежность',
    'Por favor, seleccione la etnia',
  ];

  emptyyourInterest = [
    "Please select what I'm interested in",
    'يرجى تحديد الاهتمامات',
    "Veuillez sélectionner ce qui m'intéresse",
    'Пожалуйста, выберите интересы',
    'Por favor, seleccione sus intereses',
  ];

  emptyrelationtype = [
    'Please select relationship type',
    'يرجى تحديد نوع العلاقة',
    'Veuillez sélectionner le type de relation',
    'Пожалуйста, выберите тип отношений',
    'Por favor, seleccione el tipo de relación',
  ];
  emptyCurrentPassword = [
    'Please enter current password',
    'الرجاء إدخال كلمة المرور الحالية',
    'Veuillez entrer le mot de passe actuel',
    'Пожалуйста, введите текущий пароль',
    'Por favor, introduzca la contraseña actual',
  ];

  currentPassMinLength = [
    'Current password cannot be less than 6 characters',
    'لا يمكن أن تكون كلمة المرور الحالية أقل من 6 أحرف',
    'Le mot de passe actuel ne peut pas contenir moins de 6 caractères',
    'Текущий пароль не может быть менее 6 символов',
    'La contraseña actual no puede tener menos de 6 caracteres',
  ];

  emptyNewPassword = [
    'Please enter new password',
    'الرجاء إدخال كلمة المرور الجديدة',
    'Veuillez entrer le nouveau mot de passe',
    'Пожалуйста, введите новый пароль',
    'Por favor, introduzca la nueva contraseña',
  ];

  newPasswordMinLength = [
    'New password cannot be less than 6 characters',
    'لا يمكن أن تكون كلمة المرور الجديدة أقل من 6 أحرف',
    'Le nouveau mot de passe ne peut pas contenir moins de 6 caractères',
    'Новый пароль не может быть менее 6 символов',
    'La nueva contraseña no puede tener menos de 6 caracteres',
  ];

  emptyConfirmPassword = [
    'Please enter confirm new password',
    'يرجى إدخال تأكيد كلمة المرور الجديدة',
    'Veuillez entrer la confirmation du nouveau mot de passe',
    'Пожалуйста, введите подтверждение нового пароля',
    'Por favor, introduzca la confirmación de la nueva contraseña',
  ];

  confirmPasswordMinLength = [
    'Confirm new password cannot be less than 6 characters',
    'لا يمكن أن يكون تأكيد كلمة المرور الجديدة أقل من 6 أحرف',
    'La confirmation du nouveau mot de passe ne peut pas être inférieure à 6 caractères',
    'Подтверждение нового пароля не может быть менее 6 символов',
    'La confirmación de la nueva contraseña no puede tener menos de 6 caracteres',
  ];

  passwordNotMatch = [
    'New password and confirm password must be the same',
    'يجب أن تكون كلمة المرور الجديدة وتأكيد كلمة المرور متطابقتين',
    'Le nouveau mot de passe et la confirmation du mot de passe doivent être identiques',
    'Новый пароль и подтверждение пароля должны совпадать',
    'La nueva contraseña y la confirmación de la contraseña deben ser iguales',
  ];
  emptyPNR = [
    'Please enter PNR',
    'يرجى إدخال رقم حجز السفر (PNR)',
    'Veuillez entrer le PNR',
    'Пожалуйста, введите PNR',
    'Por favor, introduzca el PNR',
  ];
  scan_or_enter = [
    'Please scan ticket or enter details manually',
    'يرجى مسح التذكرة أو إدخال التفاصيل يدويًا',
    'Veuillez scanner le billet ou entrer les détails manuellement',
    'Пожалуйста, отсканируйте билет или введите данные вручную',
    'Por favor, escanee el boleto o ingrese los detalles manualmente',
  ];
  emptyticketImg = [
    'Please scan ticket',
    'يرجى مسح التذكرة ضوئياً',
    'Veuillez scanner le billet',
    'Пожалуйста, отсканируйте билет',
    'Por favor, escanee el boleto',
  ];
  emptyairline = [
    'Please enter airline',
    'يرجى إدخال اسم شركة الطيران',
    'Veuillez entrer la compagnie aérienne',
    'Пожалуйста, введите авиакомпанию',
    'Por favor, introduzca la aerolínea',
  ];
  emptyTicketNo = [
    'Please enter ticket number',
    'يرجى إدخال رقم التذكرة',
    'Veuillez entrer le numéro de billet',
    'Пожалуйста, введите номер билета',
    'Por favor, introduzca el número de boleto',
  ];
  emptyFlightNo = [
    'Please enter flight number',
    'يرجى إدخال رقم الرحلة',
    'Veuillez entrer le numéro de vol',
    'Пожалуйста, введите номер рейса',
    'Por favor, introduzca el número de vuelo',
  ];
  emptyMessage = [
    'Please enter message',
    'يرجى إدخال رسالة',
    'Veuillez entrer un message',
    'Пожалуйста, введите сообщение',
    'Por favor, introduzca un mensaje',
  ];
  emptyReason = [
    'Please enter reason',
    'يرجى إدخال السبب',
    'Veuillez entrer la raison',
    'Пожалуйста, укажите причину',
    'Por favor, ingrese la razón',
  ];
  emptyEventImg = [
    'Please upload event image',
    'يرجى تحميل صورة الحدث',
    "Veuillez télécharger l'image de l'événement",
    'Пожалуйста, загрузите изображение мероприятия',
    'Por favor, suba la imagen del evento',
  ];
  emptydes = [
    'Please enter description',
    'يرجى إدخال الوصف',
    'Veuillez saisir la description',
    'Пожалуйста, введите описание',
    'Por favor, ingrese la descripción',
  ];
  emptyVenue = [
    'Please enter venue',
    'يرجى إدخال المكان',
    'Veuillez entrer le lieu',
    'Пожалуйста, введите место проведения',
    'Por favor, ingrese el lugar',
  ];
  emptyEventType = [
    'Please select event type',
    'يرجى تحديد نوع الحدث',
    "Veuillez sélectionner le type d'événement",
    'Пожалуйста, выберите тип мероприятия',
    'Por favor, seleccione el tipo de evento',
  ];
  selectDate = [
    'Please select date',
    'يرجى تحديد التاريخ',
    'Veuillez sélectionner la date',
    'Пожалуйста, выберите дату',
    'Por favor, seleccione la fecha',
  ];
  emptylocation = [
    'Please enter location',
    'يرجى إدخال الموقع',
    "Veuillez entrer l'emplacement",
    'Пожалуйста, введите местоположение',
    'Por favor, ingrese la ubicación',
  ];
  emptyFirstname = [
    'Please enter first name',
    'يرجى إدخال الاسم الأول',
    'Veuillez entrer le prénom',
    'Пожалуйста, введите имя',
    'Por favor, ingrese el nombre',
  ];
  emptyLastname = [
    'Please enter last name',
    'يرجى إدخال الاسم الأخير',
    'Veuillez entrer le nom de famille',
    'Пожалуйста, введите фамилию',
    'Por favor, ingrese el apellido',
  ];
  emptyEventfee = [
    'Please enter event fee',
    'يرجى إدخال رسوم الحدث',
    "Veuillez entrer les frais de l'événement",
    'Пожалуйста, введите плату за мероприятие',
    'Por favor, ingrese la tarifa del evento',
  ];
  enterValidnumber = [
    'Please enter a valid number',
    'يرجى إدخال رقم صحيح',
    'Veuillez entrer un numéro valide',
    'Пожалуйста, введите правильный номер',
    'Por favor, ingrese un número válido',
  ];

  validReportMessage = [
    'Please enter a valid report reason',
    'يرجى إدخال سبب صالح للتقرير',
    'Veuillez entrer une raison de rapport valide',
    'Пожалуйста, укажите действительную причину отчета',
    'Por favor, ingrese una razón válida para el informe',
  ];
  minimumReportMessage = [
    'Please enter a minimum of 3 characters',
    'يرجى إدخال ما لا يقل عن 3 أحرف',
    'Veuillez entrer un minimum de 3 caractères',
    'Пожалуйста, введите минимум 3 символа',
    'Por favor, ingrese un mínimo de 3 caracteres',
  ];
  //-------------------------new  ------------------
  validPnone = [
    'Enter a valid phone number',
    'يرجى إدخال رقم هاتف صالح',
    'Veuillez entrer un numéro de téléphone valide',
    'Введите действующий номер телефона',
    'Ingrese un número de teléfono válido',
  ];
  emptyuserName = [
    'Please enter user name',
    'يرجى إدخال اسم المستخدم',
    "Veuillez entrer le nom d'utilisateur",
    'Пожалуйста, введите имя пользователя',
    'Por favor, ingrese el nombre de usuario',
  ];
  emptyOccupation = [
    'Please enter occupation',
    'يرجى إدخال المهنة',
    'Veuillez entrer la profession',
    'Пожалуйста, введите профессию',
    'Por favor, ingrese la ocupación',
  ];
  emptynetworth = [
    'Please enter net worth',
    'يرجى إدخال صافي الثروة',
    'Veuillez entrer la valeur nette',
    'Пожалуйста, введите состояние',
    'Por favor, ingrese el patrimonio neto',
  ];

  please_select_airline = [
    'Please select airline',
    'يرجى اختيار شركة الطيران',
    'Veuillez sélectionner la compagnie aérienne',
    'Пожалуйста, выберите авиакомпанию',
    'Por favor, seleccione la aerolínea',
  ];

  please_select_departure_date = [
    'Please select departure date',
    'يرجى اختيار تاريخ المغادرة',
    'Veuillez sélectionner la date de départ',
    'Пожалуйста, выберите дату отправления',
    'Por favor, seleccione la fecha de salida',
  ];
  // ---------------------
  emptyheight = [
    'Height must be less than 9ft',
    'يجب أن يكون الارتفاع أقل من 9 أقدام',
    'La hauteur doit être inférieure à 9 pieds',
    'Высота должна быть меньше 9 футов',
    'La altura debe ser menor de 9 pies',
  ];
  emptyeventname = [
    'Please enter event name',
    'يرجى إدخال الوصف',
    'Veuillez saisir la description',
    'Пожалуйста, введите описание',
    'Por favor, ingrese la descripción',
  ];
  validdate = [
    'Please enter valid date',
    'يرجى إدخال الوصف',
    'Veuillez saisir la description',
    'Пожалуйста, введите описание',
    'Por favor, ingrese la descripción',
  ];
}

export const msgText = new messageTextProvider();
export const msgTitle = new messageTitleProvider();
export const msgProvider = new messageFunctionsProviders();
//--------------------------- Message Provider End -----------------------
