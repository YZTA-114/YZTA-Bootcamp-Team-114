<template>
  <div class="take-quiz-container">
    <div class="header-section">
      <div class="dark-sidebar">
        <div class="logo-section">
          <div class="logo-icon">
            <img src="@/assets/images/logo.png" alt="Logo" />
          </div>
        </div>
      </div>
      <div class="top-bar">
        <div class="header-left">
          <div class="breadcrumb">
            <span>Take Quiz</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <button class="notification-btn">
              <ri-notification-line />
              <span class="notification-badge">3</span>
            </button>
            <div class="user-menu">
              <button class="user-menu-toggle">
                <img src="/default-avatar.png" alt="User" />
                <ri-arrow-down-s-line />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="question-sidebar">

        <div class="timer-container">
          <div class="timer-circle">
            <div class="timer-label">Remaining Time</div>
            <div class="timer-display">{{ timerDisplay }}</div>
            <div class="timer-units">
              <span>Hours</span>
              <span>Min</span>
              <span>Sec</span>
            </div>
          </div>
        </div>
        <div 
          class="question-grid"
          :class="{
            'cols-5': quizQuestions.length >= 20,
            'cols-4': quizQuestions.length >= 10 && quizQuestions.length < 20,
            'cols-3': quizQuestions.length < 10
          }"
        >
          <button
            v-for="(question, idx) in quizQuestions"
            :key="question.id"
            class="question-btn"
            :class="{ current: idx === currentQuestionIndex }"
            @click="goToQuestion(idx)"
          >
            {{ idx + 1 }}
          </button>
        </div>
        <div class="user-profile">
          <div class="profile-icon">
            <div class="placeholder-icon">?</div>
          </div>
          <div class="profile-info">
            <div class="user-name">John Doe</div>
            <div class="user-role">Student</div>
          </div>
        </div>
      </div>
      <div class="quiz-content">
        <div class="quiz-header">
          <div class="question-header-row">
            <span class="question-label">Soru {{ currentQuestionIndex + 1 }}</span>
          </div>
        </div>
        
        <div class="question-container">
          <div class="question-content">
            <div class="question-actions-top">
              <SecondaryButton>
                <ri-volume-up-line />
                Soruyu Seslendir
              </SecondaryButton>
              <SecondaryButton>
                <ri-mic-line style="margin-right: 6px;" />
                Yanıt Ver
              </SecondaryButton>
            </div>
            <div class="question-text" v-html="currentQuestion.text"></div>
            
            <div class="options-list">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="option-item"
                :class="{ selected: selectedAnswer === index }"
                @click="selectAnswer(index)"
              >
                <div class="option-letter">{{ String.fromCharCode(65 + index) }})</div>
                <div class="option-text">{{ option }}</div>
                <div class="option-check" v-if="selectedAnswer === index">
                  <ri-check-line />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quiz-navigation">
          <div class="nav-inner">
            <button class="nav-btn round-pink" @click="previousQuestion" :disabled="currentQuestionIndex === 0">
              <ri-arrow-left-line />
            </button>
            <span class="question-counter">{{ currentQuestionIndex + 1 }} / {{ quizQuestions.length }}</span>
            <button class="nav-btn round-pink" @click="nextQuestion" :disabled="currentQuestionIndex === quizQuestions.length - 1">
              <ri-arrow-right-line />
            </button>
          </div>
        </div>
        <SecondaryButton
          v-if="currentQuestionIndex === quizQuestions.length - 1"
          class="finish-btn-fixed"
        >
          Sınavı Bitir
        </SecondaryButton>
        
        <!-- quiz-actions buttons removed as requested -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SecondaryButton from '@/components/custom/button/SecondaryButton.vue'

// Timer logic
const totalSeconds = ref(6669) // 1 hour 51 minutes 9 seconds
const timerDisplay = computed(() => {
  const hours = Math.floor(totalSeconds.value / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((totalSeconds.value % 3600) / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds.value % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})

let timerInterval = null
onMounted(() => {
  timerInterval = setInterval(() => {
    if (totalSeconds.value > 0) totalSeconds.value--
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timerInterval)
})

const goToQuestion = (idx) => {
  currentQuestionIndex.value = idx
}

const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)

const quizQuestions = ref([
  {
    id: 1,
    text: `<p>İlerideki uçurumun kıyısına kadar yürüdüler. "Kıyı" sözcüğünün bu cümledeki anlamı, aşağıdaki altı çizili sözcüklerin hangisinde vardır?</p>`,
    options: [
      "Paltosunun yakasını kaldırıp caddeye doğru yürümeye başladı.",
      "Duvarın kenarında tek başına uzun bir süre bekledi.",
      "Genç adam etrafına meraklı gözlerle bakıyordu.",
      "Komşuluk ilişkilerinin çok iyi olduğu bir çevrede yetişti."
    ]
  },
  {
    id: 2,
    text: `<p>Aşağıdakilerin hangisinde "orta" sözcüğü, cümlede kazandığı anlamla eşleştirilmiştir?</p>`,
    options: [
      "Topluluk içinde, arasında.",
      "Orta boy bir ev aldılar.",
      "Orta yaşlı bir adam geldi.",
      "Orta seviyede bir öğrenci."
    ]
  },
  {
    id: 3,
    text: `<p>Aşağıdakilerin hangisinde bir öneri gerekçesiyle birlikte verilmiştir?</p>`,
    options: [
      "Damlayan bir musluk, bir günde yedi kova su harcar.",
      "Kirli ellerde ne kadar çok mikrop yaşıyor, biliyor musunuz?",
      "Suyumuza sahip çıkalım, bir damla suya muhtaç kalabiliriz.",
      "Ne kadar su harcadığına dikkat et, muslukları kontrol et!"
    ]
  },
  {
    id: 4,
    text: `<p>Sayın profesör, yeni kitabının bir bölümünde "Tükenmez Kalem"e cevap vermiş. Daha doğrusu "Tükenmez Kalem köşesinin yazarı Mehmet Efe!" diyerek baltayı taşa vurmuş. Meğer beni Mehmet Efe sanıyormuş. Birincisi ben Mehmet Efe değilim, kendisini tanımam. Sadece yazılarını okurum. İkincisi, sayın profesör bana değil, asıl kendisiyle ilgili iddiaları dile getiren tarihçi Sezai Kerim'e cevap vermeli. Zaten Sezai Kerim de tam bu noktada "Yanlış bilgiyle doğru bilgiyi ayırt edemiyor, hep..." diyordu.</p>
    <p>Bu metinde üç nokta ile belirtilen yere aşağıdaki deyimlerden hangisi getirilirse parçada anlatılanlar özetlenmiş olur?</p>`,
    options: [
      "bir baltaya sap olamıyor.",
      "saman altından su yürütüyor.",
      "saman alevi gibi parlayıp sönüyor.",
      "sapla samanı birbirine karıştırıyor."
    ]
  },
  {
    id: 5,
    text: `<p>Gençliği bir mutluluk dönemi saymak yanılgısına düşenler, ihtiyarlığı da acıklı bir dönem sayıyorlar. "Artık ben ihtiyarladım." dediğimde "Hayır, sadece yaşlandınız." diyorlar. (K) Sanki yaşlanmakla ihtiyarlamak aynı anlama gelmiyormuş gibi. (L) Benden genç olanlar, benimle karşılaşır karşılaşmaz "Sizi çok iyi gördüm." diyorlar selam yerine. (M) Bunu söylerken, sanırım yaşlılığın beni incittiğini düşünüyorlar. (N) Aslında huzurlu ve güzel günlerin bir başlangıcı.</p>
    <p>Yukarıdaki paragrafta düşüncenin akışını kesen bir eksiklik bulunmaktadır. Bu eksikliği gidermek için K, L, M, N harfleriyle belirtilen boşlukların hangisine "Oysa yaşlanmak hiç de üzülecek bir durum değil." cümlesi getirilmelidir?</p>`,
    options: [
      "K",
      "L", 
      "M",
      "N"
    ]
  },
  {
    id: 6,
    text: `<p>"Ala keçiyi gören, içi dolu yağ sanır." atasözündeki "dolu" sözcüğünün sesteşi aşağıdaki cümlelerin hangisinde vardır?</p>`,
    options: [
      "Doludur gönlüm ışıklarla bu bayram sabahı.",
      "Bugün çok doluyum, yarın görüşelim.",
      "Gölün kenarına kurdukları çadır, doludan zarar görmüştü.",
      "Haftaya pazartesiye kadar bütün uçaklar dolu."
    ]
  },
  {
    id: 7,
    text: `<p>Aşağıdakilerden hangisi bir "düşünce yazısı"dır?</p>`,
    options: [
      "Kuzuyu kâtibe verdim, kâtip bana yazı verdi... Yazıyı ozana verdim, ozan bana sazı verdi... Kimseye vermem bu sazı, ben çalarım bazı bazı, dinle benden, ince telden, söyleşelim tatlı dilden...",
      "Tüm vazgeçişlerime rağmen defterden vazgeçebilir miyim? Asla... Öyle bilgisayar delisi değilim ben. El yazısı, karalamalar, satırların üstüne çizmenin zevki... Bilgisayara değişilir mi bunlar?",
      "Sokak lambaları gün boyu yanıyor, yine de insanlar sisten birbirlerine çarpıyordu. Fayton beygirlerinin çıngırakları, insan ve nal sesleri, bu sisli havada boğuk boğuk duyuluyordu. Hafta haftayı izliyor, hava hiç değişmiyordu.",
      "Birkaç ay içinde büyük bir ilerleme göstermişti. Tüm derslerde durumunu epeyce düzeltmişti. 'Bu çocuk bu sınıfı üç sene okusa yine başaramaz!'diyenler şaşıp kalıyorlardı. O sene Osman takdir alarak sınıfı geçti."
    ]
  },
  {
    id: 8,
    text: `<p>"Şiir yazmış bir kimse başkasına zarar vermez." Orhan Veli mi söylemişti bunu? Sanatın işlevini ve yararını çok ince bir biçimde açıklayan bu söz, her kesimden okura da adanmalıdır, diyorum. Çünkü işlev açısından ele alınırsa yukarıdaki cümle yalnız şairi değil, şiir okurunu da kavrayan bir öz taşıyor. Roman okurunu da, öykü okurunu da...</p>
    <p>Bu paragrafın anlatımında aşağıdakilerin hangisi kullanılmıştır?</p>`,
    options: [
      "Tanımlama",
      "Öyküleme",
      "Benzetme",
      "Tanık gösterme"
    ]
  },
  {
    id: 9,
    text: `<div class="question-image-container">
      <div class="speech-bubble">
        <p>Nedense bilimsel bir kesinliğe sahiptir haritalar gözümüzde. Çoğu zaman birer insan ürünü olduklarını bile unuturuz. Haritalar, yeryüzünü olduğu gibi gösteren tartışmasız birer fotoğraftır toplumun gözünde.</p>
      </div>
    </div>
    <p>Deniz'in verdiği cevaba göre, Oya aşağıdakilerden hangisini sormuştur?</p>`,
    options: [
      "Bir haritadan yararlanarak bilmediğimiz bir yere gidebilir miyiz?",
      "Haritalar gerçeğin kendisini mi yansıtır yoksa onun kurgulanmış resmi midir?",
      "Modern dünya haritalarının çiziminde hangi yöntemler kullanılmıştır?",
      "Önüne bir dünya haritası koyup gözlerinle ülkeden ülkeye, kıtadan kıtaya gezdin mi?"
    ]
  },
  {
    id: 10,
    text: `<p>(1) Kavurucu temmuz güneşi, Ömer dayıyı yormuş; terletmişti. (2) Ömer dayı sabahtan beri tarlasında ekin biçiyordu. (3) Arada sırada doğrulup dinleniyordu. (4) Çizgili, yakasız keten gömleğinin önü boydan boya açıktı.</p>
    <p>Bu parçadaki numaralandırılmış cümlelerin hangisinde neden-sonuç ilişkisi vardır?</p>`,
    options: [
      "1",
      "2", 
      "3",
      "4"
    ]
  },
  {
    id: 11,
    text: `<div class="text-excerpt">
      <p>"Mercan Adası", denizci bir ailenin oğlu olan Ralph ve arkadaşlarının Güney Pasifik'te batan bir gemiden kurtularak bir mercan adasına çıkmalarını, bu adada yaşadıkları heyecanlı günleri anlatır. Burası, neredeyse bütün yıl yaz mevsiminin hüküm sürdüğü, ağaçların bol ve lezzetli meyvelerle dolup taştığı bir yerdir.</p>
    </div>
    <div class="text-excerpt">
      <p>Her çocuk, bence zevkle okunmaya değer ilginç bir kitap; karşısında uzun uzun, hayran hayran düşünülecek bir bilinmeyenler âlemidir... Ben bu kitapta sadece gördüklerimi ve duyduklarımı (işittiklerimi değil, hissettiklerimi) sunuyorum. Çok sevdiğim "Benim Küçük Dostlarım"ı, daha doğrusu binlerce küçük dostumdan rastgele birkaçını okurlarıma da tanıtmak istedim.</p>
    </div>
    <p>Bu iki metne göre, her iki kitapla ilgili olarak aşağıdakilerden hangisi söylenebilir?</p>`,
    options: [
      "Çocuklar için yazılmış oldukları",
      "Yazarlarının düşüncelerini yansıttıkları",
      "Yaşanabilecek olayları konu edindikleri",
      "Çocuklara okuma alışkanlığı kazandırmayı amaçladıkları"
    ]
  },
  {
    id: 12,
    text: `<p>Eleştirmenlik zor bir iş. Bazı dergilerde öyle kitap eleştirileri okuyorum ki kitabı okumadığım hâlde yazarına haksızlık edildiğini anlıyorum. Yazar yirmi yıl emek vermiş; bir arkadaş çıkıyor, onu yerin dibine batırıyor, olur mu? Adamın dedikodusunu yapar gibi kitap eleştiriyor. Yazarın kitabı ile kişiliğini hâlâ karıştırıyoruz.</p>
    <p>Bu parçada, sözü edilen eleştirmenlerle ilgili olarak aşağıdakilerden hangisinden yakınılmaktadır?</p>`,
    options: [
      "Kitapları ayrıntılı okumadan eleştirmelerinden",
      "Başarılı yazarları yeterince tanımadıklarından",
      "Sayfa sayısı çok olan kitaplarla ilgilenmediklerinden",
      "Kitabın içeriğinden çok, yazara ilişkin özellikleri söz konusu etmelerinden"
    ]
  },
  {
    id: 13,
    text: `<p>Zaman ileriye doğru akıp gittiğine göre, büyülendiğimiz "gelecek", aslında el değmemiş "geçmiş"ten başka bir şey değildir.</p>
    <p>Aşağıdakilerden hangisi bu cümleyle aynı anlamdadır?</p>`,
    options: [
      "Zaman, geçmişten geleceğe akıp giden bir nehirdir.",
      "Gelecek dediğimiz zaman dilimi, günü gelince geçmiş adını alır.",
      "Geçmiş ve gelecek, zamanın birbirine en uzak duraklarıdır.",
      "Zamanın doğduğu kaynak geçmiş ise, döküldüğü deniz de gelecektir."
    ]
  },
  {
    id: 14,
    text: `<p>Bir çocuk hiçbir zaman karga ya da tilkinin, insan gibi konuşacağına inanmaz. Fakat böyle olağanüstülüklere ihtiyacı vardır. Nitekim kendi oyuncak bebeklerine birer kişilik yakıştıran, onlarla konuşan ve türlü türlü sahneler düzenleyen bir çocuk, yarattığı olaylara inanmış değildir. Yanlış kanılar, boş inançlar çocuklara yetişkinlerden geçer; asıl bundan çekinmek gerekir. Yoksa hayalin gıdası olan masallardan değil.</p>
    <p>Bu metnin ana düşüncesi aşağıdakilerden hangisidir?</p>`,
    options: [
      "Hayal kurmak, çocuğun başarılı olmasında çok etkilidir.",
      "Çocuklardan önce yetişkinler masal okuyarak hayal kurmayı öğrenmelidir.",
      "Çocuğa zarar veren hayal kurması değil, kafasının yanlış fikirlerle doldurulmasıdır.",
      "Ana dilinin kavranmasında, hayal gücünün zenginleşmesinde masalların büyük payı vardır."
    ]
  },
  {
    id: 15,
    text: `<p>Bu parçanın başlığında, okuyucunun dikkatini çekmek için aşağıdakilerden hangisi yapılmıştır?</p>`,
    options: [
      "Cilt, kaleye benzetilmiştir.",
      "Cildin sanat yönü vurgulanmıştır.",
      "Cilt, bir insan gibi konuşturulmuştur.",
      "Cilt yapmanın ustalık gerektirdiği belirtilmiştir."
    ]
  },
  {
    id: 16,
    text: `<p>Çok okuyan bir sanat tarihçisi tanıyorum. Okuduğu kitaplardan "Tuhaf Bir Serüven" adlı kitap için "İşte bu benim klasiğim!" derdi. Bu kitabı kendi klasiği olarak görmesinin nedeni, her fırsatta ondan espriler aktarması, içinde yer aldığı her olayla romanın sahneleri arasında bağlantı kurması ve kendisinin, yaşadıklarının, düşüncelerinin yavaş yavaş "Tuhaf Bir Serüven" romanının çehresine bürünmesiydi.</p>
    <p>Sanat tarihçisinin, parçada sözü edilen kitabı klasik olarak görmesinin nedeni aşağıdakilerden hangisidir?</p>`,
    options: [
      "Üzerinde fazlaca yorum yapılması",
      "Birçok insan tarafından okunması",
      "Edebî değerine önem vermesi",
      "Kendi hayatıyla ilişkilendirmesi"
    ]
  },
  {
    id: 17,
    text: `<p>Aşağıda bir paragrafın cümleleri karışık olarak verilmiştir:</p>
    <p>1. Bu önerimi uygularsan yanlışlarını fark edeceksin.</p>
    <p>2. Bu yolla, hem tüm bilimlerin ve sanatların kaynağı olan deneyim hazinen zenginleşecek hem de resim sanatında yetkinleşerek doruklara ulaşacaksın.</p>
    <p>3. Çalışmalarındaki yanlışlıkları gidermek için resimde ortaya koyduğun nesneleri, gereksiz ayrıntılardan kurtarıp gerçeğine benzeyecek kadar belirginleştirmelisin.</p>
    <p>4. Yani hatalarını eleştirerek yön vereceğin yargılama gücün sayesinde, resimlerindeki orantısız ve ölçüsüz her ayrıntıyı ayırt ederek düzeltebileceksin.</p>
    <p>Kaç numaralı cümle, bu paragraftaki düşünce akışına göre en sonda yer almalıdır?</p>`,
    options: [
      "1",
      "2", 
      "3",
      "4"
    ]
  },
  {
    id: 18,
    text: `<p>Genç bir yazarın, sevdiği yazarları seçmesinin her zaman önemli bir adım olduğuna kuşku yok. Sonunda yazı yolunun üstündeki her dönemeçte bir yazarla karşılaşır genç yazar ve sevdiği yazarların niteliği, gideceği yolun ucunun baştan görülmesini sağlar...</p>
    <p>Paragrafın anlam bütünlüğü dikkate alındığında, üç nokta ile belirtilen yere aşağıdakilerden hangisi getirilmelidir?</p>`,
    options: [
      "Bu seçimi yapabilme yeteneği, onun kendine özgü bir okuma biçimi edindiğini, dolayısıyla kendine özgü bir yazının izini sürmeye başladığını gösterir.",
      "'İyi ki çok okudum.' diyebilmenin yazarlar için ne denli ayırt edici bir özellik olduğunu genç yazarlar daha iyi değerlendirir.",
      "Öykü dünyasının nasıl kurgulanması gerektiğine ilişkin başka derse gereksinimi kalmayacak şekilde onu kendi içlerine çekecektir bu eserler.",
      "Ancak okurlar istediğinde, sevdikleri yazarları dile getirmekten kaçınmak bir yana, sıraya bile koyarak açıklarlar."
    ]
  },
  {
    id: 19,
    text: `<p>Soba gürül gürül yanıyordu. Odam iyice ısınmıştı. Kedi her zamanki gibi köşesinde, mışıl mışıl uyuyordu ama benim gözüme uyku girmiyordu. Çünkü kuş onun kafasından benim kafama, benim kafamdan onun kafasına konup duruyordu. Uzun bir süre kuşun kanat seslerine, kedinin mırıltısına kulak kesildim.</p>
    <p>Yazar, bu metinde anlatımı kuvvetlendirmek için aşağıdaki dil ve anlatım özelliklerinin hangisinden yararlanmıştır?</p>`,
    options: [
      "Deyimlerden",
      "Kişileştirmelerden",
      "Eksiltili cümlelerden",
      "Olağanüstü ögelerden"
    ]
  },
  {
    id: 20,
    text: `<p>Adayı en ıssız köşelerine ( 1 ) kıyılarına kadar dolaştık ( 2 ) yerlere atılmış bir çöp ( 3 ) bir kâğıt parçası ( 4 ) bir meyve kabuğu bile bulamadık.</p>
    <p>Bu cümledeki kaç numaralı boşluğa noktalı virgül konmalıdır?</p>`,
    options: [
      "1",
      "2", 
      "3",
      "4"
    ]
  },
  {
    id: 21,
    text: `<p>Serpilmeye başladı bir rüzgâr ince ince,<br>Son yokuş noktasından düzlüğe çevrilince.</p>
    <p>Faruk Nafiz Çamlıbel</p>
    <p>Bu dizelerdeki altı çizili sözcüklerden hangisi fiilimsidir?</p>`,
    options: [
      "Başladı",
      "Rüzgâr",
      "Yokuş",
      "Çevrilince"
    ]
  },
  {
    id: 22,
    text: `<p>Erciyes Dağı, güneş batarken bütün heybetiyle bulutların arasından bizi selamlıyordu.</p>
    <p>Bu cümlenin dolaylı tümleci aşağıdakilerden hangisidir?</p>`,
    options: [
      "güneş batarken",
      "bütün heybetiyle",
      "bulutların arasından",
      "bizi"
    ]
  },
  {
    id: 23,
    text: `<p>Sayın Veli,</p>
    <p>Bu davetiyedeki anlatım bozukluğu aşağıdakilerin hangisiyle giderilebilir?</p>`,
    options: [
      "'sizi' sözcüğü 'sizleri' yapılarak",
      "'de' bağlacı cümleden çıkarılarak",
      "'yılında' sözcüğünün yerine 'tarihinde' sözcüğü getirilerek",
      "'gösterimizde' sözcüğü 'etkinliğimizde' sözcüğüyle değiştirilerek"
    ]
  }
])

const currentQuestion = computed(() => {
  return quizQuestions.value[currentQuestionIndex.value]
})

const nextQuestion = () => {
  if (currentQuestionIndex.value < quizQuestions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = null
  }
}

const selectAnswer = (optionIndex) => {
  selectedAnswer.value = optionIndex
  // Update question status in sidebar
  // questions.value[currentQuestionIndex.value].status = 'answered' // This line is no longer needed
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.take-quiz-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $black;
}

.header-section {
  display: flex;
  height: 80px;
  flex-shrink: 0;
}

.dark-sidebar {
  width: 280px;
  background: #2c2c2c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 $space-m;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: $white;
  font-size: 20px;
  cursor: pointer;
  padding: $space-xs;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.top-bar {
  flex: 1;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-l;
  border-bottom: 1px solid #e5e5e5;
}

.header-left {
  display: flex;
  align-items: center;
}

.breadcrumb {
  font-size: $font-size-m;
  font-weight: $font-weight-bold;
  color: $black;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $space-m;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 20px;
  color: $black;
  cursor: pointer;
  padding: $space-xs;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  background: $orange;
  color: $white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: $font-weight-bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
}

.user-menu-toggle {
  display: flex;
  align-items: center;
  gap: $space-xs;
  background: none;
  border: none;
  cursor: pointer;
  padding: $space-xs;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.main-content {
  display: flex;
  gap: $space-l;
  padding: $space-l;
  box-sizing: border-box;
  flex: 1;
  overflow: hidden;
}

.question-sidebar {
  width: 350px;
  background: $black;
  border-radius: 12px;
  padding: $space-l;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  height: calc(100vh - 2 * $space-l);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $space-m;
  text-align: center;
  flex-shrink: 0;
  background: $orange;
  padding: $space-m;
  border-radius: 8px;
  font-family: serif;
  text-transform: capitalize;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: $space-s;
  padding: $space-s;
  background: #333;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: auto;
}

.profile-icon {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #e3f2fd;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
}

.placeholder-icon {
  color: #1976d2;
  font-size: 18px;
  font-weight: bold;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: $font-size-s;
  font-weight: $font-weight-semi-bold;
  color: $white;
}

.user-role {
  font-size: 11px;
  color: #ccc;
  font-weight: $font-weight-regular;
}

.timer-container {
  display: flex;
  justify-content: center;
  margin-bottom: $space-l;
  flex-shrink: 0;
}

.timer-circle {
  width: 160px;
  height: 160px;
  border-radius: 60%;
  background: $black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-s;
}

.timer-label {
  font-size: 10px;
  color: $white;
  margin-bottom: 2px;
  font-weight: $font-weight-regular;
}

.timer-display {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $pink;
  margin-bottom: 2px;
  font-family: monospace;
  line-height: 1;
}

.timer-units {
  display: flex;
  gap: 4px;
  font-size: 9px;
  color: $white;
  font-weight: $font-weight-regular;
}

.question-grid {
  display: grid;
  gap: $space-xs;
  margin-bottom: $space-m;
}
.question-grid.cols-5 {
  grid-template-columns: repeat(5, 1fr);
}
.question-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}
.question-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.question-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #f8f9fa;
  color: $black;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &.current {
    background: $pink;
    color: $white;
    font-weight: $font-weight-bold;
    box-shadow: 0 2px 8px rgba($pink, 0.15);
  }
}

.status-answered {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-not-answered {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-marked {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-answered-marked {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-current {
  background: $white;
  color: $black;
  border-color: $pink;
  box-shadow: 0 0 0 2px $pink;
}

.status-not-visited {
  background: #555;
  color: #ccc;
  border-color: #777;
}

.quiz-content {
  flex: 1;
  background: $white;
  border-radius: 12px;
  padding: $space-m;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  height: calc(100vh - 2 * $space-l);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quiz-header {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: $space-xs;
  padding-bottom: $space-s;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.question-header-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.question-label {
  font-size: 1.1rem;
  font-weight: $font-weight-bold;
  color: $pink;
  margin-left: 0;
  margin-bottom: 0;
  letter-spacing: 0.5px;
}

.question-number {
  display: none;
}

.question-text {
  font-size: 1.25rem;
  line-height: 1.5;
  color: $black;
  margin-bottom: $space-s;
  background: #f8f9fa;
  padding: $space-m;
  border-radius: 8px;
  border-left: 4px solid $pink;
  flex-shrink: 0;
  max-height: 220px;
  overflow-y: auto;

  .question-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $space-s;
  }

  .speech-bubble {
    background: $white;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: $space-s;
    margin-bottom: $space-s;
    position: relative;
    width: 100%;
    max-width: 90%;
    
    p {
      margin: 0;
      font-size: $font-size-xs;
      line-height: 1.4;
    }
  }

  .text-excerpt {
    background: $white;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: $space-xs;
    margin-bottom: $space-s;
    
    p {
      margin: 0;
      font-size: $font-size-xs;
      line-height: 1.4;
    }
  }
}

.question-actions-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: $space-m;
  margin-bottom: $space-s;
}
.question-actions-top > :deep(button) {
  min-width: 160px;
  height: 44px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 1rem;
  box-sizing: border-box;
}

.question-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-m;
}
.question-text {
  flex: 1 1 0;
}
.question-actions-inline {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  align-items: flex-end;
  margin-left: $space-m;
}
.audio-btn.small {
  font-size: 0.95rem;
  padding: 4px 10px;
  min-width: 120px;
  height: 32px;
  border-radius: 6px;
  white-space: nowrap;
}

.question-actions {
  display: flex;
  gap: $space-s;
  margin-bottom: $space-s;
  flex-shrink: 0;
}

.audio-btn {
  display: flex;
  align-items: center;
  gap: $space-xs;
  background: $white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: $space-s $space-m;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  color: $black;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    border-color: $pink;
    background: #fef7f7;
  }

  &:active {
    transform: scale(0.98);
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: $space-xs;
  background: $white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: $space-xs;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 35px;

  &:hover {
    border-color: $pink;
    background: #fef7f7;
  }

  &.selected {
    border-color: $pink;
    background: #fef7f7;
    box-shadow: 0 2px 8px rgba($pink, 0.15);
  }
}

.option-letter {
  font-weight: $font-weight-bold;
  color: $pink;
  min-width: 25px;
  flex-shrink: 0;
  font-size: $font-size-s;
  margin-top: 2px;
}

.option-text {
  flex: 1;
  font-size: 1.25rem;
  line-height: 1.5;
  color: $black;
  /* max-height removed for better readability */
  overflow-y: auto;
}

.option-check {
  width: 20px;
  height: 20px;
  background: $pink;
  color: $white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
}

// Quiz navigation bottom bar
.quiz-navigation {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  background: $white;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
  padding-top: $space-m;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
  z-index: 2;
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  width: 100%;
}
.nav-btn.round-pink {
  background: $pink;
  color: $white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba($pink, 0.10);
  outline: none;
  &:hover:not(:disabled) {
    background: darken($pink, 10%);
    transform: scale(1.07);
  }
  &:disabled {
    background: #f3c2d6;
    color: #fff;
    cursor: not-allowed;
    opacity: 0.7;
  }
}
.question-counter {
  font-size: 1.15rem;
  font-weight: $font-weight-semi-bold;
  color: $black;
  min-width: 60px;
  text-align: center;
  letter-spacing: 0.5px;
}

.btn {
  display: flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-xs $space-m;
  border: none;
  border-radius: 8px;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-1px);
  }
}

.btn-primary {
  background: $pink;
  color: $white;
  
  &:hover {
    background: darken($pink, 10%);
    box-shadow: 0 4px 8px rgba($pink, 0.3);
  }
}
.finish-btn-fixed {
  position: fixed;
  right: 48px;
  bottom: 48px;
  min-width: 140px;
  height: 48px;
  font-size: 1rem;
  font-weight: $font-weight-semi-bold;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}
</style>



