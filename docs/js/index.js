const CROSSOUT = 'X';
const MAX_INPUT = 12;
const MATCH_TYPE_CONST = {
  MATCH: 'MATCH',
  APPEARS: 'APPEARS',
  CONSECUTIVE: 'CONSECUTIVE',
  STARTS: 'STARTS',
  ENDS: 'ENDS',
};
const MATCH_TYPE_EXAMPLE = {
  MATCH: 'わん ➡ …わ…/…ん…',
  APPEARS: 'わん ➡ …わ…ん…',
  CONSECUTIVE: 'わん ➡ …わん…',
  STARTS: 'わん ➡ わん○○○○○',
  ENDS: 'わん ➡ ○○○○○わん',
}
const AppConfig = {
  el: '#app',
  delimiters: ['!((', '))'],
  data: {
    groups: groups,
    characterGroups: {},
    wordsDB: [],
    showModal: false,
    missingWord: '',
    language: 'jp',

    pickedGroups: [],
    searchMethod: MATCH_TYPE_CONST.MATCH,

    countResultByGroup: {},
    countResultByGroupAndLength: {},
    matchedWords: [],
    totalMatched: 0,
  },
  created: function() {
    var _vm = this;
    // Initialize
    this.wordsDB = this.wordsDB.concat(monji7);
    this.wordsDB = this.wordsDB.concat(monji6);
    this.wordsDB = this.wordsDB.concat(monji5);
    this.wordsDB = this.wordsDB.concat(monji4);
    this.wordsDB = this.wordsDB.concat(monji3);
    this.wordsDB = this.wordsDB.concat(monji2);

    for (var key in this.groups){
      this.groups[key].forEach(function(jpChar, index) {
        _vm.characterGroups[jpChar] = key;
      });
    }

    this.resetCountResult();
    this.showCountByWords();
  },
  methods: {
    __t: function(key) {
      var lang = APP_TEXT[this.language];
      return lang[key] || key;
    },
    setLanguage: function(lang) {
      this.language = APP_TEXT[lang] ? lang : 'jp';

      gtag('event', 'Language', {
        'event_category': 'SetLanguageClicked',
        'event_label': lang,
      });
    },
    resetCountResult: function () {
      for (var key in this.groups){
        this.countResultByGroup[key] = 0;
        this.countResultByGroupAndLength[key] = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      this.countResultByGroupAndLength.all = [0, 0, 0, 0, 0, 0, 0, 0];
    },
    applyFilterClick: function(){
      gtag('event', 'Filter', {
        'event_category': 'ApplyFilterClicked',
      });
      $(this.$refs.wordPanel).accordion('close', 0);
      this.showCountByWords();
    },
    submitMissingWords: function() {
      var word = this.missingWord;
      console.log(this.wordsDB.indexOf(word));
      if (word.length > 1 && word.length < 8) {
        if(this.wordsDB.indexOf(word) === -1){
          this.wordsDB.push(word);
          var url = 'https://hook.io/mk.triniti/add-koto-word?w='+encodeURI(word);
          $.get(url);

          gtag('event', 'AddWord', {
            'event_category': 'AddWordClicked',
            'event_label': word,
          });
        }
      }
      this.missingWord = '';
    },
    isSkipWord: function (word){
      if (this.pickedGroups.length === 0){
        return false;
      }

      var searchPattern = this.getSearchRegexPattern();
      if (this.searchMethod === this.getMatchType('MATCH')) {
        var searchCharacters = $.unique(this.getSearchCharSet());
        for (var index in searchCharacters) {
          if ( !!~word.indexOf(searchCharacters[index]) ){
            return false;
          }
        }
      } else if (this.searchMethod === this.getMatchType('CONSECUTIVE')) {
        return word.match(new RegExp(searchPattern))===null;
      } else if (this.searchMethod === this.getMatchType('STARTS')) {
        return word.match(new RegExp('^' + searchPattern))===null;
      } else if (this.searchMethod === this.getMatchType('ENDS')) {
        return word.match(new RegExp(searchPattern + '$'))===null;
      } else if (this.searchMethod === this.getMatchType('APPEARS')) {
        var groups = [].concat(this.pickedGroups);
        var findAll = true;

        for (var index in groups) {
          if (groups[index] === 'groupx') continue;
          var tmpWord = word.replace(new RegExp('[' + this.groups[groups[index]].join('') + ']'), CROSSOUT);
          findAll = findAll && (tmpWord !== word);
          word = tmpWord;
        }
        return !findAll;
      }
      return true;
    },
    showCountByWords: function () {
      var _vm = this;
      var total = 0;
      this.resetCountResult();

      var result = Object.assign({}, this.countResultByGroup);
      var resultWords = Object.assign({}, this.countResultByGroupAndLength);
      var matched = [];
      var searchCharacters = this.getSearchCharSet();
      this.wordsDB.forEach(function(word, index) {
        if (_vm.isSkipWord(word)) {
          return;
        }

        var groupsAppearedInWord = {};
        matched.push(word);
        var tmpWord = searchCharacters.reduce(function(result, searchCharacter) {
          return result.replace(searchCharacter, CROSSOUT);
        }, word);
        for(var c in tmpWord) {
          var checkChar = tmpWord.charAt(c);
          if (checkChar === CROSSOUT) continue;
          groupsAppearedInWord[_vm.characterGroups[checkChar]] = true;
        }
        for(var groupKey in groupsAppearedInWord) {
          try {
            result[groupKey] ++;
            resultWords[groupKey][tmpWord.length] ++;
            total ++;
          } catch (e) {
            console.log(tmpWord);
          }
        }
        resultWords.all[tmpWord.length] ++;
      });

      this.matchedWords = matched;
      this.totalMatched = matched.length;
      this.countResultByGroup = Object.assign({}, result);
      this.countResultByGroupAndLength = Object.assign({}, resultWords);

      // $(this.$refs.wordPanel).accordion('close', 0);
    },
    changeSearchMethod: function(key) {
      this.searchMethod = key;

      gtag('event', 'Filter', {
        'event_category': 'SearchMethodChanged',
        'key': key,
      });

      // Instant update?
      // this.showCountByWords();
    },
    filterMatchResult: function() {
      var group = this.showGroup;
      var length = this.showLength;
      var matched = 0;

      return this.matchedWords.filter(function(word) {
        var searchCharacters = this.groups[group];
        var isThisLength = (word.length === length);
        if (group === 'all') {
          return isThisLength;
        }
        for (var index in searchCharacters) {
          if ( !!~word.indexOf(searchCharacters[index]) ){
            return isThisLength;
          }
        }
        return false;
      });
    },
    getSearchRegexPattern: function() {
      var _vm = this;
      var groups = [].concat(this.pickedGroups);
      return groups.length==0 ? '' : groups.reduce(function(resultRegex, group){
        return resultRegex = resultRegex + (group === 'groupx' ? '.' : '['+ _vm.groups[group].join('')+ ']');
      }, '');
    },
    getSearchCharSet: function() {
      var _vm = this;
      var groups = [].concat(this.pickedGroups);
      return groups.length==0 ? [] : groups.reduce(function(result, group){
        return result.concat(_vm.groups[group]);
      }, []);
    },
    getGroupDisplayByKey: function (key) {
      return this.groups[key];
    },
    getSortedResult: function() {
      var result = [];
      for (var key in this.countResultByGroup){
        result.push({key: key, count: this.countResultByGroup[key]});
      }
      result.sort(function(a, b){
        return a.count < b.count ? 1 : -1;
      })
      
      return result;
    },
    pickGroup: function(group) {
      if (this.pickedGroups.length < MAX_INPUT) {
        this.pickedGroups.push(group);
        var inputContainer = this.$el.querySelector("#group-input");
        inputContainer.scrollLeft = inputContainer.scrollWidth;

        // Instant update?
        // this.showCountByWords();
      }

      gtag('event', 'Filter', {
        'event_category': 'WordPicked',
        'group': group,
      });
    },
    throwAwayGroupAtIndex: function(index) {
      gtag('event', 'Filter', {
        'event_category': 'WordUnpicked',
        'group': this.pickedGroups[index],
      });
      this.pickedGroups.splice(index, 1);
    },
    resetFilter: function() {
      this.pickedGroups = [];
      // this.showCountByWords();

      gtag('event', 'Filter', {
        'event_category': 'FilterReset',
      });
    },
    getInputWidth: function() {
      return 64 * (this.pickedGroups.length + 1);
    },
    getStock: function(length) {
      switch( length ){
        case 2:
          return monji2.length;
        case 3:
          return monji3.length;
        case 4:
          return monji4.length;
        case 5:
          return monji5.length;
        case 6:
          return monji6.length;
        case 7:
          return monji7.length;
        default:
          return monji2.length + monji3.length + monji4.length + monji5.length + monji6.length + monji7.length;
      }
    },
    openWordsModal: function(group, length){
      this.showModal = true;
      this.showGroup = group;
      this.showLength = length;

      gtag('event', 'Result', {
        'event_category': 'WordsModalOpened',
        'group': group,
        'length': length,
      });
    },

    getMatchType: function(key) {
      return MATCH_TYPE_CONST[key];
    },
    getMatchTypeExample: function(key) {
      return MATCH_TYPE_EXAMPLE[key];
    },

    handleScroll: function (evt, el) {
      if (window.scrollY > 160) {
        el.setAttribute(
          'style',
          'display: block;'
        )
      } else {
        el.setAttribute(
          'style',
          'display: none;'
        )
      }
    },
    scrollToTop: function() {
      var body = $("html, body");
      body.stop().animate({scrollTop:0}, 200, 'swing');

      $(this.$refs.wordPanel).accordion('open', 0);

      gtag('event', 'Page', {
        'event_category': 'ScrollToTopClicked',
      });
    }
  }
};

Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

function twitterShare(text){
  gtag('event', 'Share', {
    'event_category': 'Twitter share clicked',
  });
  window.open("https://twitter.com/intent/tweet?link="+window.location.href+"&original_referer="+window.location.href+"&text="+encodeURIComponent(window.location.href + " " + text), "share", "width=640,height=443");
}

function facebookShare(){
  gtag('event', 'Share', {
    'event_category': 'Facebook share clicked',
  });
  window.open("http://www.facebook.com/sharer/sharer.php?u="+window.location.href, "share", "width=640,height=443");
}

$( document ).ready(function() {
  var app = new Vue(AppConfig);

  $('.ui.dropdown').dropdown();
  $('.ui.sticky').sticky({context: '#app'});
  $('.ui.accordion').accordion();
});