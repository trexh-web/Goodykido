const translationRows = [
  [
    "Goodykido - عالم الكرتون الآمن",
    "Goodykido — Safe cartoons",
    "Goodykido — Güvenli çizgi filmler",
    "Goodykido — Dessins animés sûrs",
    "Goodykido — Dibujos seguros"
  ],
  [
    "أهلاً سمسم",
    "Ahlan Simsim",
    "Ahlan Simsim",
    "Ahlan Simsim",
    "Ahlan Simsim"
  ],
  [
    "جوديكيدو 🎈",
    "Goodykido 🎈",
    "Goodykido 🎈",
    "Goodykido 🎈",
    "Goodykido 🎈"
  ],
  [
    "أولاد",
    "Boys",
    "Erkek",
    "Garçons",
    "Niños"
  ],
  [
    "بنات",
    "Girls",
    "Kız",
    "Filles",
    "Niñas"
  ],
  [
    "تسجيل الدخول",
    "Log in",
    "Giriş yap",
    "Se connecter",
    "Iniciar sesión"
  ],
  [
    "تغيير اللغة",
    "Change language",
    "Dili değiştir",
    "Changer de langue",
    "Cambiar idioma"
  ],
  [
    "كل اللغات معاً",
    "Videos in all languages",
    "Tüm dillerde videolar",
    "Vidéos dans toutes les langues",
    "Vídeos en todos los idiomas"
  ],
  [
    "إضافة روابط وإدارة الأهل",
    "Parent settings",
    "Ebeveyn ayarları",
    "Paramètres des parents",
    "Ajustes de padres"
  ],
  [
    "كل البرامج",
    "All Shows",
    "Tümü",
    "Tout",
    "Todo"
  ],
  [
    "أناشيد وأغاني",
    "Songs",
    "Şarkılar",
    "Chansons",
    "Canciones"
  ],
  [
    "كرتون ومغامرات",
    "Cartoons",
    "Çizgi Film",
    "Dessins",
    "Dibujos"
  ],
  [
    "تعليم وعلوم",
    "Learning",
    "Eğitim",
    "Éducation",
    "Educación"
  ],
  [
    "قصص وحكايات",
    "Stories",
    "Masallar",
    "Histoires",
    "Cuentos"
  ],
  [
    "مقترح لك بناءً على مشاهداتك",
    "Recommended for you",
    "Sizin için önerilenler",
    "Recommandé pour vous",
    "Recomendado para ti"
  ],
  [
    "محرك الاقتراح الذكي",
    "Smart recommendations",
    "Akıllı öneriler",
    "Suggestions intelligentes",
    "Recomendaciones inteligentes"
  ],
  [
    "قائمة الفيديوهات المضافة",
    "Your video library",
    "Video kitaplığınız",
    "Votre vidéothèque",
    "Tu biblioteca de vídeos"
  ],
  [
    "مكتبتك فارغة حالياً! 🎬",
    "Your library is empty! 🎬",
    "Kitaplığınız boş! 🎬",
    "Votre bibliothèque est vide ! 🎬",
    "¡Tu biblioteca está vacía! 🎬"
  ],
  [
    "أنت من يختار المحتوى! اضغط على أيقونة القفل الجانبية لإضافة روابط اليوتيوب الخاصة بك وبناء مكتبة طفلك الآمنة.",
    "Choose what your child watches. Open parent settings to add YouTube links to their safe library.",
    "Çocuğunuzun izleyeceklerini siz seçin. Güvenli kitaplığına YouTube bağlantıları eklemek için ebeveyn ayarlarını açın.",
    "Choisissez les vidéos de votre enfant. Ouvrez les paramètres des parents pour ajouter des liens YouTube.",
    "Elige lo que ve tu hijo. Abre los ajustes de padres para añadir enlaces de YouTube a su biblioteca segura."
  ],
  [
    "إضافة أول رابط فيديو الآن",
    "Add your first video",
    "İlk videonuzu ekleyin",
    "Ajouter votre première vidéo",
    "Añadir el primer vídeo"
  ],
  [
    "عالمك الكارتوني الآمن",
    "Your safe cartoon world",
    "Güvenli çizgi film dünyanız",
    "Votre monde de dessins animés sûr",
    "Tu mundo de dibujos seguro"
  ],
  [
    "رجوع",
    "Back",
    "Geri",
    "Retour",
    "Volver"
  ],
  [
    "عنوان الفيديو",
    "Video title",
    "Video başlığı",
    "Titre de la vidéo",
    "Título del vídeo"
  ],
  [
    "التالي",
    "Next",
    "Sonraki",
    "Suivant",
    "Siguiente"
  ],
  [
    "أحسنت يا بطل!",
    "Well done!",
    "Aferin!",
    "Bravo !",
    "¡Muy bien!"
  ],
  [
    "الفيديو التالي",
    "Next video",
    "Sonraki video",
    "Vidéo suivante",
    "Siguiente vídeo"
  ],
  [
    "العودة للقائمة",
    "Back to library",
    "Kitaplığa dön",
    "Retour à la bibliothèque",
    "Volver a la biblioteca"
  ],
  [
    "وضع المشاهدة الآمنة نشط (ممنوع الخروج ليوتيوب)",
    "Safe viewing is active",
    "Güvenli izleme etkin",
    "Visionnage sécurisé actif",
    "Visualización segura activa"
  ],
  [
    "انتهيت من المشاهدة ✨",
    "Finished watching ✨",
    "İzlemeyi bitirdim ✨",
    "Visionnage terminé ✨",
    "Terminé de ver ✨"
  ],
  [
    "بوابة الأهل الذكية",
    "Parent gate",
    "Ebeveyn kapısı",
    "Accès des parents",
    "Acceso de padres"
  ],
  [
    "حل مسألة الضرب أو القسمة التالية للمتابعة:",
    "Solve this multiplication or division to continue:",
    "Devam etmek için bu çarpma veya bölme işlemini çözün:",
    "Résolvez cette multiplication ou division pour continuer :",
    "Resuelve esta multiplicación o división para continuar:"
  ],
  [
    "؟",
    "?",
    "?",
    "?",
    "?"
  ],
  [
    "إجابة خاطئة، حاول مرة أخرى!",
    "Incorrect answer. Try again!",
    "Yanlış cevap. Tekrar deneyin!",
    "Réponse incorrecte. Réessayez !",
    "Respuesta incorrecta. ¡Inténtalo de nuevo!"
  ],
  [
    "فتح القفل 🔓",
    "Unlock 🔓",
    "Kilidi aç 🔓",
    "Déverrouiller 🔓",
    "Desbloquear 🔓"
  ],
  [
    "إدارة الروابط والمحتوى",
    "Parent settings and library",
    "Ebeveyn ayarları ve kitaplık",
    "Paramètres des parents et bibliothèque",
    "Ajustes de padres y biblioteca"
  ],
  [
    "أضف روابط فيديوهات اليوتيوب التي تختارها بنفسك لطفلك",
    "Add YouTube videos you choose for your child",
    "Çocuğunuz için seçtiğiniz YouTube videolarını ekleyin",
    "Ajoutez les vidéos YouTube choisies pour votre enfant",
    "Añade los vídeos de YouTube que elijas para tu hijo"
  ],
  [
    "إضافة رابط فيديو يوتيوب جديد",
    "Add a YouTube video",
    "YouTube videosu ekle",
    "Ajouter une vidéo YouTube",
    "Añadir un vídeo de YouTube"
  ],
  [
    "رابط الفيديو من YouTube *",
    "YouTube video link *",
    "YouTube video bağlantısı *",
    "Lien YouTube *",
    "Enlace de YouTube *"
  ],
  [
    "عنوان الفيديو *",
    "Video title *",
    "Video başlığı *",
    "Titre de la vidéo *",
    "Título del vídeo *"
  ],
  [
    "مثال: نشيد الحروف العربية",
    "Example: Alphabet song",
    "Örnek: Alfabe şarkısı",
    "Exemple : chanson de l’alphabet",
    "Ejemplo: canción del abecedario"
  ],
  [
    "اسم القناة أو البرنامج",
    "Channel or show name",
    "Kanal veya program adı",
    "Nom de la chaîne ou de l’émission",
    "Nombre del canal o programa"
  ],
  [
    "مثال: عمر وهنا",
    "Example: Omar and Hana",
    "Örnek: Ömer ve Hana",
    "Exemple : Omar et Hana",
    "Ejemplo: Omar y Hana"
  ],
  [
    "القسم",
    "Category",
    "Kategori",
    "Catégorie",
    "Categoría"
  ],
  [
    "اللغة",
    "Language",
    "Dil",
    "Langue",
    "Idioma"
  ],
  [
    "إضافة الفيديو إلى المكتبة",
    "Add video to library",
    "Videoyu kitaplığa ekle",
    "Ajouter à la bibliothèque",
    "Añadir vídeo a la biblioteca"
  ],
  [
    "الفيديوهات المضافة في مكتبتك (",
    "Videos in your library (",
    "Kitaplığınızdaki videolar (",
    "Vidéos dans votre bibliothèque (",
    "Vídeos en tu biblioteca ("
  ],
  [
    "حساب العائلة",
    "Family account",
    "Aile hesabı",
    "Compte familial",
    "Cuenta familiar"
  ],
  [
    "حساب العائلة في Goodykido",
    "Goodykido family account",
    "Goodykido aile hesabı",
    "Compte familial Goodykido",
    "Cuenta familiar de Goodykido"
  ],
  [
    "سجّل الدخول لإنشاء ملف مخصص لطفلك وحفظ تفضيلاته وسجل مشاهداته",
    "Log in to create your child’s profile and manage their preferences.",
    "Çocuğunuzun profilini oluşturmak ve tercihlerini yönetmek için giriş yapın.",
    "Connectez-vous pour créer le profil de votre enfant et gérer ses préférences.",
    "Inicia sesión para crear el perfil de tu hijo y gestionar sus preferencias."
  ],
  [
    "المتابعة باستخدام Google",
    "Continue with Google",
    "Google ile devam et",
    "Continuer avec Google",
    "Continuar con Google"
  ],
  [
    "أو بالبريد الإلكتروني",
    "Or with email",
    "Veya e-posta ile",
    "Ou par e-mail",
    "O con correo electrónico"
  ],
  [
    "طريقة الدخول",
    "Login method",
    "Giriş yöntemi",
    "Méthode de connexion",
    "Método de acceso"
  ],
  [
    "إنشاء حساب",
    "Sign up",
    "Hesap oluştur",
    "Créer un compte",
    "Crear cuenta"
  ],
  [
    "تسجيل الدخول بالبريد الإلكتروني",
    "Log in with email",
    "E-posta ile giriş yap",
    "Connexion par e-mail",
    "Acceder con correo"
  ],
  [
    "بريد ولي الأمر",
    "Parent’s email",
    "Ebeveyn e-postası",
    "E-mail du parent",
    "Correo del padre o madre"
  ],
  [
    "كلمة المرور",
    "Password",
    "Şifre",
    "Mot de passe",
    "Contraseña"
  ],
  [
    "استخدم 10 أحرف على الأقل. نرسل رابط تأكيد إلى بريدك قبل تسجيل الدخول.",
    "Use at least 10 characters. We email a confirmation link before login.",
    "En az 10 karakter kullanın. Girişten önce e-postanıza onay bağlantısı gönderilir.",
    "Utilisez au moins 10 caractères. Un lien de confirmation sera envoyé par e-mail.",
    "Usa al menos 10 caracteres. Enviamos un enlace de confirmación por correo."
  ],
  [
    "نسيت كلمة المرور؟",
    "Forgot password?",
    "Şifrenizi mi unuttunuz?",
    "Mot de passe oublié ?",
    "¿Olvidaste tu contraseña?"
  ],
  [
    "لأولياء الأمور فقط. لا تشارك بيانات الدخول مع طفلك.",
    "Parents only. Keep login details private.",
    "Yalnızca ebeveynler içindir. Giriş bilgilerinizi çocuğunuzla paylaşmayın.",
    "Réservé aux parents. Ne partagez pas vos identifiants avec votre enfant.",
    "Solo para padres. No compartas tus datos de acceso con tu hijo."
  ],
  [
    "تم الربط مع Google",
    "Connected with Google",
    "Google ile bağlandı",
    "Connecté avec Google",
    "Conectado con Google"
  ],
  [
    "إعداد ملف الطفل (بواسطة ولي الأمر)",
    "Child profile (parent setup)",
    "Çocuk profili (ebeveyn ayarları)",
    "Profil enfant (configuration parentale)",
    "Perfil infantil (configuración parental)"
  ],
  [
    "يرجى إكمال هذه البيانات لتخصيص تجربة المشاهدة ومحرك الاقتراحات:",
    "Complete these details to personalize viewing and recommendations:",
    "İzleme deneyimini ve önerileri kişiselleştirmek için bu bilgileri doldurun:",
    "Complétez ces informations pour personnaliser les vidéos et suggestions :",
    "Completa estos datos para personalizar los vídeos y recomendaciones:"
  ],
  [
    "1. اسم الحساب (اسم الطفل) *",
    "1. Child’s name *",
    "1. Çocuğun adı *",
    "1. Prénom de l’enfant *",
    "1. Nombre del niño *"
  ],
  [
    "مثال: سارة أو أحمد",
    "Example: Sara or Ahmed",
    "Örnek: Sara veya Ahmet",
    "Exemple : Sara ou Ahmed",
    "Ejemplo: Sara o Ahmed"
  ],
  [
    "2. مواليد الطفل (سنة الميلاد) *",
    "2. Birth year *",
    "2. Doğum yılı *",
    "2. Année de naissance *",
    "2. Año de nacimiento *"
  ],
  [
    "اختر سنة الميلاد...",
    "Choose birth year…",
    "Doğum yılını seçin…",
    "Choisissez l’année…",
    "Elige el año…"
  ],
  [
    "3. نظام عرض المحتوى *",
    "3. Viewing mode *",
    "3. İzleme modu *",
    "3. Mode de visionnage *",
    "3. Modo de visualización *"
  ],
  [
    "وضع الاقتراح الذكي",
    "Smart recommendations",
    "Akıllı öneriler",
    "Suggestions intelligentes",
    "Recomendaciones inteligentes"
  ],
  [
    "المحتوى المخصص فقط",
    "Selected content only",
    "Yalnızca seçilen içerik",
    "Contenu sélectionné uniquement",
    "Solo contenido seleccionado"
  ],
  [
    "يقترح فيديوهات بناءً على مشاهدات الطفل واهتماماته",
    "Suggest videos based on your child’s viewing and interests",
    "Çocuğunuzun izlediklerine ve ilgi alanlarına göre video önerir",
    "Suggère des vidéos selon les intérêts de votre enfant",
    "Sugiere vídeos según los intereses de tu hijo"
  ],
  [
    "يعرض فقط الأقسام التي يحددها ولي الأمر أدناه",
    "Show only categories selected below",
    "Yalnızca aşağıda seçilen kategorileri gösterir",
    "Affiche uniquement les catégories choisies ci-dessous",
    "Muestra solo las categorías seleccionadas abajo"
  ],
  [
    "الأقسام المسموحة لطفلك:",
    "Allowed categories:",
    "İzin verilen kategoriler:",
    "Catégories autorisées :",
    "Categorías permitidas:"
  ],
  [
    "حفظ الحساب وبدء المشاهدة 🚀",
    "Save and start watching 🚀",
    "Kaydet ve izlemeye başla 🚀",
    "Enregistrer et regarder 🚀",
    "Guardar y empezar a ver 🚀"
  ],
  [
    "تسجيل الخروج",
    "Log out",
    "Çıkış yap",
    "Se déconnecter",
    "Cerrar sesión"
  ],
  [
    "اسم الطفل",
    "Child’s name",
    "Çocuğun adı",
    "Prénom de l’enfant",
    "Nombre del niño"
  ],
  [
    "📊 إحصائيات محرك الاقتراحات لهذا الحساب:",
    "📊 Viewing statistics",
    "📊 İzleme istatistikleri",
    "📊 Statistiques de visionnage",
    "📊 Estadísticas de visualización"
  ],
  [
    "تعديل الإعدادات",
    "Edit settings",
    "Ayarları düzenle",
    "Modifier les paramètres",
    "Editar ajustes"
  ],
  [
    "لم يُحدد بعد",
    "Not yet available",
    "Henüz belirlenmedi",
    "Pas encore disponible",
    "Aún no disponible"
  ],
  [
    "لا توجد روابط مضافة بعد. أضف رابطك الأول في الأعلى!",
    "No videos yet. Add your first link above!",
    "Henüz video yok. İlk bağlantınızı yukarıdan ekleyin!",
    "Aucune vidéo. Ajoutez votre premier lien ci-dessus !",
    "No hay vídeos. ¡Añade el primer enlace arriba!"
  ],
  [
    "لا توجد فيديوهات تطابق هذا القسم أو اللغة حالياً.",
    "No videos match this category or language.",
    "Bu kategori veya dilde video bulunamadı.",
    "Aucune vidéo dans cette catégorie ou langue.",
    "No hay vídeos en esta categoría o idioma."
  ],
  [
    "حذف",
    "Delete",
    "Sil",
    "Supprimer",
    "Eliminar"
  ],
  [
    "مقترح",
    "Recommended",
    "Önerilen",
    "Recommandé",
    "Recomendado"
  ],
  [
    "مختاراتي",
    "My picks",
    "Seçtiklerim",
    "Ma sélection",
    "Mis selecciones"
  ],
  [
    "فيديو",
    "videos",
    "video",
    "vidéos",
    "vídeos"
  ],
  [
    "مواليد",
    "Born",
    "Doğum yılı",
    "Né en",
    "Nacimiento"
  ],
  [
    "إجمالي المشاهدات:",
    "Total views:",
    "Toplam izlenme:",
    "Vues totales :",
    "Visualizaciones totales:"
  ],
  [
    "القسم الأكثر مشاهدة:",
    "Most watched category:",
    "En çok izlenen kategori:",
    "Catégorie favorite :",
    "Categoría más vista:"
  ],
  [
    "عدد الفيديوهات المشاهدة:",
    "Videos watched:",
    "İzlenen videolar:",
    "Vidéos regardées :",
    "Vídeos vistos:"
  ],
  [
    "القسم المفضل:",
    "Favorite category:",
    "Favori kategori:",
    "Catégorie favorite :",
    "Categoría favorita:"
  ],
  [
    "تم تفعيل ثيم البنات السحري! 👑❄️",
    "Girls theme enabled!",
    "Kız teması etkin!",
    "Thème filles activé !",
    "¡Tema de niñas activado!"
  ],
  [
    "تم تفعيل ثيم الأولاد والمغامرات! ⚡🔍",
    "Boys theme enabled!",
    "Erkek teması etkin!",
    "Thème garçons activé !",
    "¡Tema de niños activado!"
  ],
  [
    "مرحباً بك في Goodykido!",
    "Welcome to Goodykido!",
    "Goodykido’ya hoş geldiniz!",
    "Bienvenue sur Goodykido !",
    "¡Bienvenido a Goodykido!"
  ],
  [
    "⚠️ يرجى إدخال رابط يوتيوب صحيح!",
    "Please enter a valid YouTube link.",
    "Geçerli bir YouTube bağlantısı girin.",
    "Saisissez un lien YouTube valide.",
    "Introduce un enlace de YouTube válido."
  ],
  [
    "⚠️ يرجى كتابة عنوان للفيديو!",
    "Please enter a video title.",
    "Video başlığı girin.",
    "Saisissez un titre.",
    "Introduce un título."
  ],
  [
    "تمت إضافة الفيديو إلى مكتبتك بنجاح! 🎉",
    "Video added! 🎉",
    "Video eklendi! 🎉",
    "Vidéo ajoutée ! 🎉",
    "¡Vídeo añadido! 🎉"
  ],
  [
    "تم حذف الفيديو من القائمة",
    "Video deleted",
    "Video silindi",
    "Vidéo supprimée",
    "Vídeo eliminado"
  ],
  [
    "⚠️ يرجى إدخال اسم الحساب (اسم الطفل)",
    "Please enter your child’s name.",
    "Çocuğunuzun adını girin.",
    "Saisissez le prénom de votre enfant.",
    "Introduce el nombre de tu hijo."
  ],
  [
    "⚠️ يرجى تحديد مواليد الطفل",
    "Please select a birth year.",
    "Doğum yılını seçin.",
    "Choisissez une année de naissance.",
    "Selecciona un año de nacimiento."
  ],
  [
    "تعذر حفظ الملف. يرجى المحاولة مرة أخرى.",
    "Could not save the profile. Try again.",
    "Profil kaydedilemedi. Tekrar deneyin.",
    "Enregistrement impossible. Réessayez.",
    "No se pudo guardar. Inténtalo de nuevo."
  ],
  [
    "أهلاً بك يا",
    "Welcome,",
    "Hoş geldin,",
    "Bienvenue,",
    "Bienvenido,"
  ],
  [
    "! تم حفظ إعدادات الحساب 🌟",
    "! Account settings saved 🌟",
    "! Hesap ayarları kaydedildi 🌟",
    " ! Paramètres enregistrés 🌟",
    "! Ajustes guardados 🌟"
  ],
  [
    "تم تسجيل الخروج من الحساب",
    "Logged out",
    "Çıkış yapıldı",
    "Déconnexion effectuée",
    "Sesión cerrada"
  ],
  [
    "تعذر تسجيل الخروج. يرجى المحاولة مرة أخرى.",
    "Could not log out. Try again.",
    "Çıkış yapılamadı. Tekrar deneyin.",
    "Déconnexion impossible. Réessayez.",
    "No se pudo cerrar sesión. Inténtalo de nuevo."
  ],
  [
    "جارٍ المتابعة…",
    "Please wait…",
    "Lütfen bekleyin…",
    "Veuillez patienter…",
    "Espera…"
  ],
  [
    "إنشاء حساب وإرسال رابط التأكيد",
    "Create account and send confirmation",
    "Hesap oluştur ve onay gönder",
    "Créer un compte et envoyer la confirmation",
    "Crear cuenta y enviar confirmación"
  ],
  [
    "إرسال رابط استعادة كلمة المرور",
    "Send password recovery link",
    "Şifre sıfırlama bağlantısı gönder",
    "Envoyer le lien de récupération",
    "Enviar enlace de recuperación"
  ],
  [
    "حفظ كلمة المرور الجديدة",
    "Save new password",
    "Yeni şifreyi kaydet",
    "Enregistrer le nouveau mot de passe",
    "Guardar nueva contraseña"
  ],
  [
    "إنشاء حساب جديد",
    "Create an account",
    "Yeni hesap oluştur",
    "Créer un compte",
    "Crear una cuenta"
  ],
  [
    "استعادة كلمة المرور",
    "Password recovery",
    "Şifre kurtarma",
    "Récupération du mot de passe",
    "Recuperar contraseña"
  ],
  [
    "اختر كلمة مرور جديدة",
    "Choose a new password",
    "Yeni şifre seçin",
    "Choisissez un nouveau mot de passe",
    "Elige una nueva contraseña"
  ],
  [
    "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.",
    "Too many attempts. Wait and try again.",
    "Çok fazla deneme. Biraz bekleyip tekrar deneyin.",
    "Trop de tentatives. Patientez puis réessayez.",
    "Demasiados intentos. Espera y vuelve a intentarlo."
  ],
  [
    "تحقق من البريد وكلمة المرور، ومن تأكيد بريدك الإلكتروني.",
    "Check your email, password, and email confirmation.",
    "E-posta, şifre ve e-posta onayınızı kontrol edin.",
    "Vérifiez votre e-mail, mot de passe et confirmation.",
    "Comprueba tu correo, contraseña y confirmación."
  ],
  [
    "تعذر إكمال الطلب. تحقق من تأكيد البريد أو تواصل مع إدارة الموقع.",
    "Could not complete the request. Check email confirmation or contact support.",
    "İstek tamamlanamadı. E-posta onayını kontrol edin veya destekle iletişime geçin.",
    "Demande impossible. Vérifiez la confirmation ou contactez l’assistance.",
    "No se pudo completar. Confirma tu correo o contacta con soporte."
  ],
  [
    "تعذر إكمال الطلب. تحقق من الاتصال والبيانات ثم حاول مرة أخرى.",
    "Could not complete the request. Check your connection and details, then try again.",
    "İstek tamamlanamadı. Bağlantınızı ve bilgilerinizi kontrol edip tekrar deneyin.",
    "Vérifiez votre connexion et vos informations, puis réessayez.",
    "Comprueba tu conexión y tus datos e inténtalo de nuevo."
  ],
  [
    "الدخول عبر Google غير متاح حالياً. يمكنك استخدام البريد الإلكتروني.",
    "Google login is unavailable. Use email instead.",
    "Google ile giriş kullanılamıyor. E-posta kullanabilirsiniz.",
    "Connexion Google indisponible. Utilisez votre e-mail.",
    "Google no está disponible. Puedes usar tu correo."
  ],
  [
    "تحقق من بريدك الإلكتروني واضغط رابط التأكيد لإكمال إنشاء الحساب. تحقق أيضاً من البريد غير المرغوب فيه.",
    "Check your inbox and spam folder. Follow the confirmation link to finish signup.",
    "Gelen kutunuzu ve spam klasörünü kontrol edin. Kaydı tamamlamak için onay bağlantısını açın.",
    "Vérifiez votre boîte de réception et les indésirables. Suivez le lien de confirmation.",
    "Revisa tu bandeja y el correo no deseado. Abre el enlace de confirmación."
  ],
  [
    "إذا كان البريد مسجلاً، تصلك رسالة تحتوي على رابط استعادة كلمة المرور. تحقق أيضاً من البريد غير المرغوب فيه.",
    "If the email is registered, a recovery link is on its way. Check your spam folder too.",
    "E-posta kayıtlıysa şifre kurtarma bağlantısı gönderilir. Spam klasörünü de kontrol edin.",
    "Si l’e-mail est enregistré, un lien de récupération sera envoyé. Vérifiez les indésirables.",
    "Si el correo está registrado, recibirás un enlace de recuperación. Revisa el correo no deseado."
  ],
  [
    "تم تحديث كلمة المرور بنجاح.",
    "Password updated.",
    "Şifre güncellendi.",
    "Mot de passe mis à jour.",
    "Contraseña actualizada."
  ],
  [
    "تم تسجيل الدخول بنجاح.",
    "Logged in successfully.",
    "Giriş başarılı.",
    "Connexion réussie.",
    "Sesión iniciada."
  ],
  [
    "جارٍ تجهيز تسجيل الدخول…",
    "Preparing login…",
    "Giriş hazırlanıyor…",
    "Préparation de la connexion…",
    "Preparando el acceso…"
  ],
  [
    "تم تأكيد البريد الإلكتروني وتسجيل الدخول.",
    "Email confirmed. You are logged in.",
    "E-posta onaylandı. Giriş yapıldı.",
    "E-mail confirmé. Vous êtes connecté.",
    "Correo confirmado. Has iniciado sesión."
  ],
  [
    "تسجيل الدخول غير متاح مؤقتاً. أعد تحميل الصفحة للمحاولة مجدداً.",
    "Login is temporarily unavailable. Reload to try again.",
    "Giriş geçici olarak kullanılamıyor. Tekrar denemek için sayfayı yenileyin.",
    "Connexion temporairement indisponible. Rechargez la page.",
    "Acceso temporalmente no disponible. Recarga la página."
  ]
];
translationRows.push(...[["قنواتنا للجميع", "Channels for everyone", "Herkes için kanallar", "Chaînes pour tous", "Canales para todos"], ["جميع القنوات", "All channels", "Tüm kanallar", "Toutes les chaînes", "Todos los canales"], ["مكتبة عامة • قنوات المجتمع", "Public library • Community channels", "Herkese açık kitaplık • Yönetici seçimi", "Bibliothèque publique • Sélection de l’administrateur", "Biblioteca pública • Selección del administrador"], ["جارٍ تحميل المكتبة العامة…", "Loading the public library…", "Herkese açık kitaplık yükleniyor…", "Chargement de la bibliothèque publique…", "Cargando la biblioteca pública…"], ["إعادة المحاولة", "Try again", "Tekrar dene", "Réessayer", "Reintentar"], ["تحميل المزيد من الفيديوهات", "Load more videos", "Daha fazla video yükle", "Charger plus de vidéos", "Cargar más vídeos"], ["مشاركة الرابط", "Share link", "Bağlantıyı paylaş", "Partager le lien", "Compartir enlace"], ["المكتبة العامة فارغة حالياً", "The public library is empty", "Herkese açık kitaplık şu anda boş", "La bibliothèque publique est vide", "La biblioteca pública está vacía"], ["أضف قناة بحسابك لتصبح فيديوهاتها متاحة لجميع الزوار.", "Sign in and add a channel for everyone to watch.", "Yönetici, herkesin izleyebilmesi için kanalları ve videoları burada yayınlar.", "L’administrateur publie ici les chaînes et vidéos pour tous les visiteurs.", "El administrador publica aquí canales y vídeos para todos los visitantes."], ["إضافة قناة", "Add a channel", "Yönetici yayın panelini aç", "Ouvrir la publication administrateur", "Abrir publicación del administrador"], ["ناشر القنوات العامة", "Public channel publisher", "Herkese açık kanal yayıncısı", "Publication de chaînes publiques", "Publicación de canales públicos"], ["رابط قناة YouTube كاملة", "YouTube channel URL", "YouTube kanal bağlantısı", "URL de la chaîne YouTube", "URL del canal de YouTube"], ["إضافة القناة واستيراد فيديوهاتها", "Add channel and import videos", "Kanalı ekle ve videoları içe aktar", "Ajouter la chaîne et importer ses vidéos", "Añadir canal e importar sus vídeos"], ["نشر فيديو للجميع", "Publish a video for everyone", "Herkes için video yayınla", "Publier une vidéo pour tous", "Publicar un vídeo para todos"], ["رابط الفيديو (YouTube أو HTTPS) *", "Video URL (YouTube or HTTPS) *", "Video bağlantısı (YouTube veya HTTPS) *", "URL de la vidéo (YouTube ou HTTPS) *", "URL del vídeo (YouTube o HTTPS) *"], ["إزالة للجميع", "Remove for everyone", "Herkes için kaldır", "Supprimer pour tous", "Eliminar para todos"], ["تحديث واستيراد الدفعة التالية", "Sync and import next batch", "Eşitle ve sonraki grubu içe aktar", "Synchroniser et importer le lot suivant", "Sincronizar e importar el siguiente lote"], ["حذف القناة وفيديوهاتها", "Delete channel and its videos", "Kanalı ve videolarını sil", "Supprimer la chaîne et ses vidéos", "Eliminar el canal y sus vídeos"], ["القنوات والفيديوهات المنشورة متاحة لكل زائر. اختر قناة أو تصفح جميع الفيديوهات.", "Published channels and videos are visible to everyone. Choose a channel or browse all videos.", "Yayınlanan kanallar ve videolar herkese açıktır. Bir kanal seçin veya tüm videolara göz atın.", "Les chaînes et vidéos publiées sont visibles par tous. Choisissez une chaîne ou parcourez toutes les vidéos.", "Los canales y vídeos publicados son visibles para todos. Elige un canal o explora todos los vídeos."]]);
translationRows.push(
 ['استيراد القنوات بانتظار الإعداد — عرض توضيحي فقط','Channel importing awaits setup — placeholder only','Kanal içe aktarma kurulum bekliyor — yalnızca örnek','Importation des chaînes en attente de configuration — aperçu uniquement','La importación de canales espera configuración — solo vista previa'],
 ['لم تُنشر أي قنوات أو فيديوهات تجريبية. يتفعّل الاستيراد عند إعداد اتصال YouTube. يمكنك الآن نشر روابط فيديوهات YouTube أو HTTPS منفردة للجميع.','No sample channels or videos are published. Importing activates when YouTube is connected. You can publish individual YouTube or HTTPS video links now.','Örnek kanal veya video yayınlanmadı. YouTube bağlandığında içe aktarma etkinleşir. Şimdi tekil YouTube veya HTTPS video bağlantıları yayınlayabilirsiniz.','Aucune chaîne ou vidéo de démonstration n’est publiée. L’importation s’active après connexion à YouTube. Vous pouvez déjà publier des liens vidéo individuels YouTube ou HTTPS.','No se publican canales ni vídeos de muestra. La importación se activa al conectar YouTube. Ya puedes publicar enlaces individuales de YouTube o HTTPS.']
);
const translationColumns = {en:1,tr:2,fr:3,es:4};
const orderedTranslations = [...translationRows].sort((a,b) => b[0].length-a[0].length);
const translationPattern = new RegExp(orderedTranslations.map(row => row[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
window.translateText = function(text) {
    const column = translationColumns[uiLang];
    if (!column) return text;
    return text.replace(translationPattern, phrase => translationRows.find(row => row[0] === phrase)[column]);
};
const textSources = new WeakMap();
const attributeSources = new WeakMap();
window.translatePage = function() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest('script, style, [data-user-content], .lang-option, #new-video-lang, #header-account-name, #provider-badge')) continue;
        let state = textSources.get(node);
        if (!state || state.last !== node.nodeValue) state = {source:node.nodeValue};
        state.last = window.translateText(state.source);
        if (node.nodeValue !== state.last) node.nodeValue = state.last;
        textSources.set(node,state);
    }
    document.querySelectorAll('[placeholder], [title], [aria-label]').forEach(element => {
        const states = attributeSources.get(element) || {};
        ['placeholder','title','aria-label'].forEach(attribute => {
            if (!element.hasAttribute(attribute)) return;
            const value = element.getAttribute(attribute);
            let state = states[attribute];
            if (!state || state.last !== value) state = {source:value};
            state.last = window.translateText(state.source);
            if (value !== state.last) element.setAttribute(attribute,state.last);
            states[attribute] = state;
        });
        attributeSources.set(element,states);
    });
    document.querySelectorAll('#profile-birth-year option[value]:not([value=""])').forEach(option => { if(option.textContent !== option.value) option.textContent = option.value; });
    document.getElementById('player-back-icon').className = 'ph-bold text-2xl ' + (uiLang === 'ar' ? 'ph-arrow-right' : 'ph-arrow-left');
    if (!userProfile) {
        const name = document.getElementById('header-account-name');
        const label = window.translateText('تسجيل الدخول');
        if (name.textContent !== label) name.textContent = label;
    }
    observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
};
const observer = new MutationObserver(() => window.translatePage());
window.translatePage();
