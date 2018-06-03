const CROSSOUT = 'X';
const MAX_INPUT = 12;
const DECK_MAX = 12;
const HAND_MAX = 4;
const USE_MAX = 4;
const LS = {
  BATTLE_DECK: 'battleDeck',
};
const DRAW_WEIGHT = [1, 0.375, 0.04, 0.003];
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
const Utils = {
  getPermutations: function(inputArr) {
    var results = [];
    var permute = function(arr, memo) {
      var cur, memo = memo || [];
      for (var i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) {
          results.push(memo.concat(cur));
        }
        permute(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }
      return results;
    }
    return permute(inputArr);
  },
  getCombinations: function(inputArr, exactLen) {
    var fn = function(n, src, got, all) {
      if (n == 0) {
        if (got.length > 0) {
          all[all.length] = got;
        }
        return;
      }
      for (var j = 0; j < src.length; j++) {
        fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
      }
      return;
    }
    var all = [];
    fn(exactLen, inputArr, [], all);
    return all;
  },
};
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
    searchMethod: MATCH_TYPE_CONST.CONSECUTIVE,

    countResultByGroup: {},
    countResultByGroupAndLength: {},
    matchedWords: [],
    totalMatched: 0,

    currentTab: 0,

    // For battle function
    battleDeck: [],
    battleHand: [],
    battleUsed: [],
    battleMatches: [],
    battleMatchesStats: [],
    battleFullHandCombo: [],
    battleComboList: [],
    question: 'xxxxxxx',
    questionModifiers: [],
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

    const cachedDeck = localStorage.getItem(LS.BATTLE_DECK);
    if (cachedDeck !== null) {
      this.battleDeck = cachedDeck.split(',');
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
      this.closeWordPanel();
      this.showCountByWords();
    },
    closeWordPanel: function() {
      this.$refs.wordPanel.close();
      this.$emit('wordSelectClose');
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
    getModifiedQuestion: function() {
      return this.questionModifiers.reduce(function(newQ, modifier) {
        return newQ.slice(0, modifier.index) + modifier.char + newQ.slice(modifier.index + 1, newQ.length);
      }, this.question);
    },
    pickGroup: function(group) {
      if (this.currentTab == 0) {
        // Stats mode
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
      } else if (this.currentTab == 1){
        // Battle mode
        if (this.battleDeck.length < DECK_MAX) {
          this.battleDeck.push(group);
        }

        gtag('event', 'Deck', {
          'event_category': 'DeckWordPicked',
          'group': group,
        });
      }
      
    },
    throwAwayGroupAtIndex: function(index) {
      if (this.currentTab == 0) {
        gtag('event', 'Filter', {
          'event_category': 'WordUnpicked',
          'group': this.pickedGroups[index],
        });
        this.pickedGroups.splice(index, 1);
      } else if (this.currentTab == 1) {
        gtag('event', 'Deck', {
          'event_category': 'DeckWordUnpicked',
          'group': this.battleDeck[index],
        });
        this.battleDeck.splice(index, 1);
      }
    },
    resetFilter: function() {
      this.pickedGroups = [];
      // this.showCountByWords();
      this.$refs.wordPanel.open();

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
    openWordsModalAndFeedEntry: function(list) {
      this.battleComboList = list;
      this.showModal = true;
      gtag('event', 'FeedResult', {
        'event_category': 'WordsModalOpened',
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
    pickToHandAtIndex: function(index) {
      if (this.battleHand.length < HAND_MAX && this.battleHand.indexOf(index) === -1 && this.battleUsed.indexOf(index) === -1) {
        this.battleHand.push(index);
      }
    },
    scrollToTop: function() {
      var body = $("html, body");
      body.stop().animate({scrollTop:0}, 200, 'swing');

      this.$refs.wordPanel.open();

      gtag('event', 'Page', {
        'event_category': 'ScrollToTopClicked',
      });
    },
    switchTab: function(tab) {
      this.currentTab = tab;
    },
    updateQuestion: function(char, index) {
      if (char === 'O') {
        char = 'x';
      }
      this.question = this.question.slice(0, index) + char + this.question.slice(index+1, this.question.length);
    },
    displayComboResult: function(matches, stats, fullHandCombo) {
      this.battleMatches = matches;
      this.battleMatchesStats = stats;
      this.battleFullHandCombo = fullHandCombo;
    }
  },
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

  $('.ui.sticky').sticky({context: '#app'});
});