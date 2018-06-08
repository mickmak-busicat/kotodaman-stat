Vue.component('example-text', {
  props: ['example'],
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
  },
  template: `
    <div v-cloak>{{ __t('example-text') }}: {{ example }}</div>`,
});

Vue.component('words-input', {
  props: ['group', 'groupKey', 'isClearfix'],
  methods: {
    getGroupClassName: function(key) {
      var className = 'group' + key[key.length-1];
      if (this.isClearfix !== undefined) {
        return 'monji ' + className + (className === key && className !== 'groupn' && className !== 'groupx' ? ' clearfix' : '');
      }
      return 'monji ' + className;
    },
    getGroupDisplayName: function() {
      return this.groupKey === 'groupx' ? 'Any' : this.group.join(",");
    }
  },
  template: `
    <div :class="getGroupClassName(groupKey)"> 
      <div class="forms">{{ getGroupDisplayName() }}</div> 
      <div class="big-text"><div>{{ group[0] }}</div></div> 
    </div>`,
});

Vue.component('words-result-display', {
  props: ['result'],
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
    getGroupDisplayByKey: function(group) {
      return this.$root.getGroupDisplayByKey(group);
    },
    getGroupCount: function(group) {
      return this.$root.$data.countResultByGroup[group];
    },
    getGroupCountByLength: function(group, length) {
      return this.$root.$data.countResultByGroupAndLength[group][length];
    },
    getRankColor: function(index) {
      return ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink'][index] || 'grey';
    },
    rankLabelClass: function (index) {
      var classObject = {
        ui: true,
        circular: true,
        label: true,
        huge: true,
      };
      classObject[this.getRankColor(index)] = true;
      return classObject;
    },
    getTotalMatched: function() {
      return this.$root.$data.totalMatched;
    },
    openWordsModal: function(group, length) {
      this.$root.openWordsModal(group, length);
    },
    getStock: function(length) {
      return this.$root.getStock(length);
    }
  },
  template: `
    <table class="ui compact striped definition table">
      <thead class="full-width">
        <tr>
          <th><center>{{ __t('result-text') }}</center></th>
          <th colspan="4">
            <span class="ui brown tag label">{{ __t('total-match-text') }}: {{ getTotalMatched() }} / {{ getStock(-1) }}</span>
            <a class="ui red label" @click="openWordsModal('all', 7)">{{ __t('monji.7-text') }} <div class="detail">{{ getGroupCountByLength("all", 7) }}  / {{ getStock(7) }}</div></a>
            <a class="ui orange label" @click="openWordsModal('all', 6)">{{ __t('monji.6-text') }} <div class="detail">{{ getGroupCountByLength("all", 6) }} / {{ getStock(6) }}</div></a>
            <a class="ui yellow label" @click="openWordsModal('all', 5)">{{ __t('monji.5-text') }} <div class="detail">{{ getGroupCountByLength("all", 5) }} / {{ getStock(5) }}</div></a>
            <a class="ui olive label" @click="openWordsModal('all', 4)">{{ __t('monji.4-text') }} <div class="detail">{{ getGroupCountByLength("all", 4) }} / {{ getStock(4) }}</div></a>
            <a class="ui green label" @click="openWordsModal('all', 3)">{{ __t('monji.3-text') }} <div class="detail">{{ getGroupCountByLength("all", 3) }} / {{ getStock(3) }}</div></a>
            <a class="ui teal label" @click="openWordsModal('all', 2)">{{ __t('monji.2-text') }} <div class="detail">{{ getGroupCountByLength("all", 2) }} / {{ getStock(2) }}</div></a>
          </th>
        </tr>
      </thead>
      <thead class="full-width">
        <tr>
          <th></th>
          <th><center>{{ __t('rank-text') }}</center></th>
          <th>{{ __t('occurrences-text') }}</th>
          <th>{{ __t('words-distribution-text') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rs, index) in result" v-if="getGroupCount(rs.key) > 0" :key="rs.key">
          <td class="collapsing">
            <words-input :group-key="rs.key" :group="getGroupDisplayByKey(rs.key)"></words-input>
          </td>
          <td><center><span :class="rankLabelClass(index)">{{ index+1 }}</span></center></td>
          <td>{{ getGroupCount(rs.key) }} {{ __t('times-text') }}</td>
          <td>
            <a class="ui red label" @click="openWordsModal(rs.key, 7)">
              {{ __t('monji.7-text') }} 
              <div class="detail">{{ getGroupCountByLength(rs.key, 7) }}</div>
            </a> 
            <a class="ui orange label" @click="openWordsModal(rs.key, 6)">
              {{ __t('monji.6-text') }} 
              <div class="detail">{{ getGroupCountByLength(rs.key, 6) }}</div>
            </a> 
            <a class="ui yellow label" @click="openWordsModal(rs.key, 5)">
              {{ __t('monji.5-text') }} 
              <div class="detail">{{ getGroupCountByLength(rs.key, 5) }}</div>
            </a> 
            <a class="ui olive label" @click="openWordsModal(rs.key, 4)">
              {{ __t('monji.4-text') }} 
              <div class="detail">{{ getGroupCountByLength(rs.key, 4) }}</div>
            </a> 
            <a class="ui green label" @click="openWordsModal(rs.key, 3)">
              {{ __t('monji.3-text') }} 
              <div class="detail">{{ getGroupCountByLength(rs.key, 3) }}</div>
            </a>
            <a class="ui teal label" @click="openWordsModal(rs.key, 2)">
              {{ __t('monji.2-text') }} 
              <div class="detail">{{ getGroupCountByLength(rs.key, 2) }}</div>
            </a>
          </td>
        </tr>
      </tbody>
      <tfoot class="full-width">
        <tr>
          <th></th>
          <th><center>0 {{ __t('match-text') }}</center></th>
          <th colspan="3">
            <words-input v-for="(rs, index) in result" v-if="getGroupCount(rs.key) === 0" :key="rs.key" :group-key="rs.key" :group="getGroupDisplayByKey(rs.key)"></words-input>
          </th>
        </tr>
      </tfoot>
    </table>`,
});

Vue.component('modal', {
  methods: {
    filterWords: function() {
      this.filteredByLength = this.$root.filterMatchResult();
      this.searchResult = this.filteredByLength;
      return this.filteredByLength;
    },
    __t: function(key) {
      return this.$root.__t(key);
    },
    addfilter: function(e) {
      var searchText = e.target.value;
      this.searchResult = this.filteredByLength.filter(function(word) {
        if (searchText.length > 0) {
          return !!~word.indexOf(searchText);
        }
        return true;
      });
    },
    getResult: function() {
      if (this.$root.currentTab === 0) {
        if( this.filteredByLength.length === 0) {
          return this.filterWords();
        }
        return this.searchResult;
      } else if (this.$root.currentTab === 1) {
        return this.$root.battleComboList;
      }
    }
  },
  data: function () {
    return {
      maxResult: 200,
      searchResult: [],
      filteredByLength: [],
    };
  },
  template: `
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
              <div class="ui icon input fluid">
                <input type="text" v-bind:placeholder="__t('modal.search-text')" @keyup.enter="addfilter">
                <i class="search icon"></i>
              </div>
            </div>
            <div class="modal-body">
              <div class="ui list">
                <div class="item word-item" v-for="(rs, index) in getResult().slice(0, maxResult)">
                  <span><i class="book icon"></i>{{ index+1 }}. </span><span class="text-display">{{ rs }}</span>
                </div>
                <div class="item word-item" v-if="filteredByLength.length > maxResult">
                  <span><i class="ellipsis horizontal icon"></i> {{ __t('modal.more-text-1') }} {{ maxResult }} {{ __t('modal.more-text-2') }} </span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <center>
                <slot name="footer">
                  <button class="button ui massive" @click="$emit('close')">
                    {{ __t('close-text') }}
                  </button>
                </slot>
              </center>
            </div>
          </div>
        </div>
      </div>
    </transition>`,
});
Vue.component('method-dropdown', {
  mounted: function() {
    $(this.$el).dropdown();
  },
  methods: {
    changeSearchMethod: function(method) {
      return this.$root.changeSearchMethod(method);
    },
    __t: function(key) {
      return this.$root.__t(key);
    },
    getMatchType: function(type) {
      return this.$root.getMatchType(type);
    }
  },
  template: `
    <div class="ui selection compact fluid dropdown">
      <input type="hidden" name="gender">
      <i class="dropdown icon"></i>
      <div class="default text"><span v-cloak>{{ __t('filter.consecutive-words') }}</span></div>
      <div class="menu">
        <div class="item" data-value="CONSECUTIVE" @click="changeSearchMethod(getMatchType('CONSECUTIVE'))">{{ __t('filter.consecutive-words') }}</div>
        <div class="item" data-value="STARTS" @click="changeSearchMethod(getMatchType('STARTS'))">{{ __t('filter.starts-with') }}</div>
        <div class="item" data-value="ENDS" @click="changeSearchMethod(getMatchType('ENDS'))">{{ __t('filter.ends-with') }}</div>
        <div class="item" data-value="MATCH" @click="changeSearchMethod(getMatchType('MATCH'))">{{ __t('filter.any-match') }}</div>
        <div class="item" data-value="APPREARS" @click="changeSearchMethod(getMatchType('APPEARS'))">{{ __t('filter.words-appears') }}</div>
      </div>
    </div>`,
});
Vue.component('word-select-accordion', {
  mounted: function() {
    $(this.$el).accordion();
  },
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
    getGroupDisplayByKey: function(key) {
      return this.$root.getGroupDisplayByKey(key);
    },
    pickGroup: function(group) {
      return this.$root.pickGroup(group);
    },
    getCountResultByGroup: function() {
      return this.$root.countResultByGroup;
    },
    open: function() {
      $(this.$el).accordion('open', 0);
    },
    close: function() {
      $(this.$el).accordion('close', 0);
    },
  },
  template: `
    <div class="ui accordion fluid styled" id="word-panel">
      <div class="title active">
        <i class="icon dropdown"></i>
        <span v-cloak>{{ __t('pick-word-instruction') }}</span>
      </div>
      <div class="content active">
        <div class="input-panel">
          <words-input v-for="(count, group) in getCountResultByGroup()" :key="group" :group-key="group" :group="getGroupDisplayByKey(group)" is-clearfix v-on:click.native="pickGroup(group)"></words-input>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  `,
});
Vue.component('question-word-select', {
  props: ['index', 'value', 'updateQuestion'],
  data: function() {
    return {
      char: ''
    };
  },
  methods: {
    getAllWords: function() {
      return [
        {key: 'x', text: '-'}
      ].concat(Object.keys(this.$root.characterGroups).map(idx => ({
          key: idx,
          text: this.$root.characterGroups[idx][5] + ':' + idx,
        })).sort(function compare(a, b) {
          if (a.text[0] < b.text[0]) {
            return -1;
          }
          return 1;
        }));
    },
  },
  template: `
    <select class="ui dropdown compact question-select" v-model="char" @change="updateQuestion(char, index)">
      <option :value="char.key" v-for="(char, wordIndex) in getAllWords()">{{ char.text }}</option>
    </select>
  `,
});
Vue.component('place-word-dropdown', {
  props: ['groups', 'pickCharAtIndex', 'index'],
  template: `
    <div>
      <div class="ui label mini olive fluid"><i class="pencil alternate icon"></i> {{ groups.join(',') }}</div>
      <div class="ui menu fluid mini compact">
        <div class="ui simple dropdown item fluid">
          <i class="hand paper outline icon"></i>
          <i class="dropdown icon"></i>
          <div class="menu">
            <div class="item" v-for="(char) in groups" @click="pickCharAtIndex(char, index)">{{ char }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
});
Vue.component('load-deck-dropdown', {
  mounted: function() {
    $(this.$el).dropdown();
  },
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
    getCachedDecks: function() {
      return this.$root.cachedDecks;
    },
    changeDeck: function(deck) {
      this.$root.battleDeck = JSON.parse(deck);
    },
    removeDeck: function(index) {
      this.$root.cachedDecks.splice(index, 1);
      localStorage.setItem(LS.BATTLE_DECK, JSON.stringify(this.$root.cachedDecks));
    }
  },
  template: `
    <div class="ui selection dropdown">
      <i class="dropdown icon"></i>
      <div class="default text">{{ __t('battle.load-deck-text') }}</div>
      <div class="menu">
        <div class="item" v-for="(deck, index) in getCachedDecks()" @click="changeDeck(deck)">
          {{ __t('battle.deck-text') }} {{ index+1 }}
          <a class="red right floated" v-on:click.stop="removeDeck(index)">
            DELETE
          </a>
        </div>
      </div>
    </div>
  `,
})
Vue.component('battle-input-section', {
  mounted: function() {
    $(this.$refs.stepAccordion).accordion();
  },
  data: function() {
    return {
      currentPickGroup: -1,
      currentPickIndex: -1,
      minimumCombo: 6,
      isDBRefreshed: false,

      filteredDB: [],
      fullHandCombo: [],
      matches: [],
    }
  },
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
    getCurrentTab: function() {
      return this.$root.currentTab;
    },
    getGroupDisplayByKey: function(key) {
      return this.$root.getGroupDisplayByKey(key);
    },
    throwAwayGroupAtIndex: function(index) {
      return this.$root.throwAwayGroupAtIndex(index);
    },
    pickToHandAtIndex: function(index) {
      return this.$root.pickToHandAtIndex(index);
    },
    pickHandCard: function(index) {
      this.currentPickGroup = index;
      this.currentPickIndex = this.currentPickIndex === -1 ? 0 : (this.currentPickIndex + 1) % (HAND_MAX - this.$root.battleUsed.length);
    },
    getDeck: function() {
      return this.$root.battleDeck;
    },
    getHand: function() {
      return this.$root.battleHand;
    },
    getUsed: function() {
      return this.$root.battleUsed;
    },
    getHandGroup: function() {
      return this.$root.battleHand.map(idx => this.$root.battleDeck[idx]);
    },
    // getUsed: function() {
    //   return this.$root.battleUsed;
    // },
    getUsedGroup: function() {
      return this.$root.battleUsed.map(idx => this.$root.battleDeck[idx]);
    },
    getDeckMax: function() {
      return DECK_MAX;
    },
    getQuestionCharAt: function(index) {
      const char = this.$root.question[index] === 'x' ? '' : this.$root.question[index];
      return char;
    },
    getCurrentPickGroup: function() {
      return this.$root.getGroupDisplayByKey(this.$root.battleDeck[this.$root.battleHand[this.currentPickGroup]]);
    },
    isSelected: function(index) {
      for(var i=0; i<this.$root.questionModifiers.length; i++) {
        if (index == this.$root.questionModifiers[i].index) {
          return false;
        }
      }
      const mQuestion = this.$root.getModifiedQuestion();
      if (mQuestion[index] === 'x') {
        if (index === 0 && this.currentPickIndex === index) {
          return true;
        }
        const match = mQuestion.slice(0, index+1).match(/x/g);
        return match && match.length === this.currentPickIndex + 1;
      }
      return false;
    },
    isPicked: function(index) {
      if (this.$root.questionModifiers.length > 0) {
        for(var i=0; i<this.$root.questionModifiers.length; i++) {
          if (index == this.$root.questionModifiers[i].index) {
            return true;
          }
        }
      }
      return false;
    },
    isStep1Completed: function() {
      const isFullDeck = this.getDeck().length == this.getDeckMax();
      if (!isFullDeck) {
        this.isDBRefreshed = false;
      }
      return isFullDeck;
    },
    isStep2Completed: function() {
      const match = this.$root.question.match(/x/g);
      return match && match.length === USE_MAX;
    },
    isStep3Completed: function() {
      return this.$root.battleHand.length === HAND_MAX;
    },
    completeStep: function(index) {
      $(this.$refs.stepAccordion).accordion('open', index);

      if (index === 1) {
        this.$root.closeWordPanel();
      } else if (index === 2) {
        this.filteredDB = this.filterWords(this.$root.wordsDB, this.$root.question, this.$root.battleDeck);
        console.log(this.$root.wordsDB.length, this.filteredDB.length);
        this.isDBRefreshed = true;
      }
    },
    saveDeck: function() {
      this.$root.cachedDecks.push(JSON.stringify(this.$root.battleDeck));
      localStorage.setItem(LS.BATTLE_DECK, JSON.stringify(this.$root.cachedDecks));
    },
    reset: function() {
      this.$root.battleHand = [];
      this.$root.battleUsed = [];
      this.currentPickGroup = -1;
      this.currentPickIndex = -1;
      this.$root.questionModifiers = [];
    },
    resetQuestion: function() {
      this.$root.question = 'xxxxxxx';
      this.$root.questionModifiers = [];
      this.$root.battleUsed = [];
      this.currentPickGroup = -1;
      this.currentPickIndex = -1;

      $('select.question-select').val('-');
    },
    pickCharAtIndex: function(char, index) {
      this.$root.battleUsed.push(this.$root.battleHand[this.currentPickGroup]);
      this.$root.battleHand.splice(this.currentPickGroup, 1);
      this.$root.questionModifiers.push({
        char: char,
        index: index,
        handIndex: this.currentPickGroup,
        pickedIndex: this.currentPickIndex,
      });

      this.currentPickGroup = -1;
      this.currentPickIndex = -1;
    },
    unpickUsedIndex: function(useIndex) {
      this.$root.questionModifiers.splice(useIndex, 1);
      this.$root.battleUsed.splice(useIndex, 1);
    },
    getUsedChar: function(index) {
      for(var i=0; i<this.$root.questionModifiers.length; i++) {
        if (index == this.$root.questionModifiers[i].index) {
          return this.$root.questionModifiers[i].char;
        }
      }
    },
    updateQuestion: function(char, index) {
      this.isDBRefreshed = false;
      return this.$root.updateQuestion(char, index);
    },
    showComboResult: function() {
      gtag('event', 'Battle', {
        'event_category': 'ShowComboClicked',
      });
      const hand = this.$root.battleHand;
      const deck = this.$root.battleDeck;
      const used = this.$root.battleUsed;
      const groups = this.$root.groups;
      const question = this.$root.getModifiedQuestion();
      const remain = USE_MAX - used.length;

      var fullHandCombo = [];
      var matches = hand.map(h => hand.reduce(function(resultObject, handGroup) {
        resultObject[deck[handGroup]] = [];
        return resultObject;
      }, {}));
      var sortedStats = [];
      var stats = hand.map(h => hand.reduce(function(resultObject, handGroup) {
        resultObject[deck[handGroup]] = {};
        return resultObject;
      }, {}));

      var checkedCount = 0;
      var combo = {};
      for(var i=0; i<hand.length; i++) {
        var positions = [0,1,2,3,4,5,6,7,8,9,10,11];
        for(var j=0; j<=i; j++) {
          var pos = positions.indexOf(hand[j]);
          positions.splice(pos, 1);
        }
        var cb = Utils.getCombinations(positions, remain - 1);
        cb = cb.map(c => {c.push(hand[i]); return c;});
        if (cb.length === 0) {
          // if no more combination, check current hand
          cb.push([hand[i]]);
        }
        for (var cbIdx=0; cbIdx<cb.length; cbIdx++) {
          var choiceArr = cb[cbIdx];
          var pm = Utils.getPermutations(choiceArr);
          var usingGroups = choiceArr.map(c => deck[c]);
          var sentenceDB = this.filterWords(this.filteredDB, question, usingGroups);
          for (var pmIdx=0; pmIdx<pm.length; pmIdx++) {
            var filledSentence = pm[pmIdx].reduce(function(fill, group) {
              return fill.replace('x', '[' + groups[deck[group]].join('') + ']');
            }, question.split('').join(','));
            combo = this.getCombo(sentenceDB, filledSentence.split(','));
            var comboScore = 0;
            for (var k=0; k<hand.length; k++) {
              var appearPos = pm[pmIdx].indexOf(hand[k]);
              if (appearPos !== -1) {
                comboScore ++;
                matches[appearPos][deck[hand[k]]].push(combo);
              }
            }
            combo.score = comboScore;
            if (comboScore == remain) {
              fullHandCombo.push(combo);
            }
            checkedCount ++;
          }
        }
      }
      for (var i=0; i<matches.length; i++) {
        const keys = Object.keys(matches[i]);
        for (var k=0; k<keys.length; k++) {
          stats[i][keys[k]] = matches[i][keys[k]].reduce(function(sc, combo) {
            const isHighCombo = combo.count >= 10;
            const isMediumCombo = combo.count > 5 && combo.count < 10;
            const isLowCombo = combo.count <= 5;
            const comboWeight = Math.pow(1.61, combo.count);
            sc.highCombo = sc.highCombo + (isHighCombo ? 1 : 0);
            sc.mediumCombo = sc.mediumCombo + (isMediumCombo ? 1 : 0);
            sc.lowCombo = sc.lowCombo + (isLowCombo ? 1 : 0);
            sc.sumScore = sc.sumScore + (combo.count * comboWeight * DRAW_WEIGHT[remain - combo.score]);
            return sc;
          }, {
            sumScore: 0,
            highCombo: 0,
            mediumCombo: 0,
            lowCombo: 0,
          });
          stats[i][keys[k]].sumScore = stats[i][keys[k]].sumScore / 100;
        }
        const tmpSort = [];
        for (var k=0; k<keys.length; k++) {
          tmpSort.push({
            key: keys[k],
            object: stats[i][keys[k]],
          });
        }
        tmpSort.sort(function (a, b) {
          return b.object.sumScore - a.object.sumScore;
        });
        sortedStats.push(tmpSort);

        this.$root.closeWordPanel();
      }

      console.log('finished', checkedCount);
      this.$root.displayComboResult(matches, sortedStats, fullHandCombo.sort(function(a, b){
        return b.count - a.count;
      }));
    },
    getCombo: function(filteredDB, filledParts) {
      var result = [];
      var count = 0;
      var usedIndex = this.$root.questionModifiers.map(qm => qm.index);

      for (var matchLength=2; matchLength<=filledParts.length; matchLength++) {
        var index = 0;
        do {
          var isIncludeValid = false;
          for (var vi=0; vi<usedIndex.length; vi++) {
            if (index <= usedIndex[vi] && (index + matchLength) > usedIndex[vi]) {
              isIncludeValid = true;
              break;
            }
          }
          var pattern = '^' + filledParts.slice(index, index + matchLength).join('') + '$';
          if (pattern.indexOf('[') !== -1 || isIncludeValid) {
            var matched = filteredDB.filter(w => w.length === matchLength && w.match(pattern) !== null);
            if (matched.length > 0) {
              result = result.concat(matched);
              count ++;
            }
          }
          index ++;
        } while (index+matchLength <= filledParts.length);
      }
      return {
        placement: filledParts,
        words: result,
        count: count,
      };
    },
    filterWords: function(wordsDB, question, groupsArray) {
      const groups = this.$root.groups;
      const deckPattern = $.unique(groupsArray.slice()).reduce(function(result, group) {
        return result = result + groups[group].join('');
      }, '');
      const antiPattern = '[^' + deckPattern + question + ']+';
      return wordsDB.filter(w => w.match(antiPattern) === null);
    },
  },
  template: `
    <div class="ui grid container" id="battle-section" v-show="getCurrentTab()==1">
      <div class="ui fluid accordion" ref="stepAccordion">
        <div class="active title">
          <i class="dropdown icon"></i>
          {{ __t('battle.step1-text') }}
          <span v-if="!isStep1Completed()">
            <i class="exclamation triangle icon yellow"></i>
          </span>
          <span v-else>
            <i class="check circle icon blue"></i>
          </span>
        </div>
        <div class="active content">
          <div class="ui grid">
            <div class="column">
              <div class="ui raised segment">
                <div class="ui top left attached label yellow">{{ __t('battle.deck-text') }}</div>
                <div class="step1DeckContainer">
                  <words-input v-for="(group, index) in getDeck()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="throwAwayGroupAtIndex(index)"></words-input>
                </div>
                <div class="clearfix"></div>
                <div>
                  <button class="ui right labeled icon button right floated green" :disabled="!isStep1Completed()" @click="completeStep(1)">
                    {{ __t('battle.next-text') }}
                    <i class="right chevron icon"></i>
                  </button>
                  <load-deck-dropdown></load-deck-dropdown>
                  <button class="ui button teal" :disabled="!isStep1Completed()" @click="saveDeck()">
                    {{ __t('battle.save-deck-text') }}
                  </button>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="title">
          <i class="dropdown icon"></i>
          {{ __t('battle.step2-text') }}
          <span v-if="!isStep2Completed() || !isDBRefreshed">
            <i class="exclamation triangle icon yellow"></i>
          </span>
          <span v-else>
            <i class="check circle icon blue"></i>
          </span>
        </div>
        <div class="content">
          <table class="ui celled striped table very compact">
            <thead>
              <tr><th colspan="7">
                {{ __t('battle.setup-question-text') }}
              </th>
            </tr>
            </thead>
            <tbody align="center">
              <tr>
                <td v-for="index in [0,1,2,3,4,5,6]">{{ index + 1 }}</td>
              </tr>
              <tr>
                <td v-for="index in [0,1,2,3,4,5,6]">
                  <question-word-select :index="index" :updateQuestion="updateQuestion"></question-word-select>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button class="ui button" @click="resetQuestion">
              {{ __t('battle.reset-text') }}
            </button>
            <button class="ui right labeled icon button right floated green" :disabled="!isStep2Completed()" @click="completeStep(2)">
              {{ __t('battle.set-question-text') }}
              <i class="right chevron icon"></i>
            </button>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="title">
          <i class="dropdown icon"></i>
          {{ __t('battle.step3-text') }}
          <span v-if="!isStep3Completed()">
            <i class="exclamation triangle icon yellow"></i>
          </span>
          <span v-else>
            <i class="check circle icon blue"></i>
          </span>
        </div>
        <div class="content">
          <div class="ui segment">
            <table class="ui celled fixed striped table very compact">
              <tbody align="center">
                <tr>
                  <td v-for="index in [0,1,2,3,4,5,6]">{{ index + 1 }}</td>
                </tr>
                <tr>
                  <td v-for="index in [0,1,2,3,4,5,6]" class="overflowCell">
                    <div v-if="isSelected(index)">
                      <place-word-dropdown :groups="getCurrentPickGroup()" :pickCharAtIndex="pickCharAtIndex" :index="index"></place-word-dropdown>
                    </div>
                    <div v-else-if="isPicked(index)">
                      {{ getUsedChar(index) }}
                    </div>
                    <div v-else>
                      {{ getQuestionCharAt(index) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="allCardContainer">
              <div class="handBigContainer ui raised segment">
                <div class="ui top left attached label green mini">{{ __t('battle.hand-text') }}</div>
                <div class="handContainer">
                  <words-input class="small" v-for="(group, index) in getHandGroup()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="pickHandCard(index)"></words-input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="deckBigContainer ui segment">
                <div class="ui top left attached label yellow mini">{{ __t('battle.deck-text') }}</div>
                <div class="deckContainer">
                  <words-input class="small" v-for="(group, index) in getDeck()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="pickToHandAtIndex(index)" :class="{disabled: getHand().indexOf(index) !== -1 || getUsed().indexOf(index) !== -1}"></words-input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="usedBigContainer ui segment">
                <div class="ui top left attached label mini">{{ __t('battle.used-text') }}</div>
                <div class="usedContainer">
                  <words-input class="small" v-for="(group, index) in getUsedGroup()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="unpickUsedIndex(index)"></words-input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="clearfix"></div>
              <div>
                <button class="ui left icon button floated" @click="reset">{{ __t('battle.reset-text') }}</button>
                <button class="ui right labeled icon button right floated green" :disabled="!isStep1Completed() || !isStep2Completed() || !isStep3Completed() || !isDBRefreshed" @click="showComboResult">
                  {{ __t('battle.show-combo-text') }}
                  <i class="right chevron icon"></i>
                </button>
              </div>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
});

Vue.component('combo-result-display', {
  props: ['result'],
  data: function() {
    return {
      pickedIndex: -1,
      pickedSubIndex: -1,
      pickedCombo: [],
      comboKey: '',
      comboKeyColor: '',

      byCombo: {},
    };
  },
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
    getBattleStats: function() {
      return this.$root.battleMatchesStats;
    },
    getBattleMatches: function() {
      return this.$root.battleMatches;
    },
    getBattleFullHandCombo: function() {
      return this.$root.battleFullHandCombo;
    },
    getGroupDisplayByKey: function(group) {
      return this.$root.getGroupDisplayByKey(group);
    },
    getStatsBySubIndex: function(index, subIndex) {
      const st = this.$root.battleMatchesStats[subIndex][index] || {key: '', object: {}};
      return st;
    },
    getQuestion: function() {
      var question = this.$root.getModifiedQuestion().split('').join(',');
      var index = 1;
      do {
        question = question.replace('x', "(" + index + ")");
        index++;
      } while(question.indexOf('x') !== -1);
      return question.split(',');
    },
    getColumn: function() {
      const columns = [];
      const remain = USE_MAX - this.$root.battleUsed.length;
      for(var i=0; i<remain; i++) {
        columns.push(i);
      }
      return columns;
    },
    pickResult: function(index, subIndex) {
      const st = this.$root.battleMatches[subIndex][this.getStatsBySubIndex(index, subIndex).key];
      const comboCount = {
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        '10': [],
      };
      const sortedCombo = {
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        '10': [],
      };

      for(var i=0; i<st.length; i++) {
        if (st[i].count <= 5) {
          comboCount['5'].push(st[i]);
        } else if (st[i].count === 6) {
          comboCount['6'].push(st[i]);
        } else if (st[i].count === 7) {
          comboCount['7'].push(st[i]);
        } else if (st[i].count === 8) {
          comboCount['8'].push(st[i]);
        } else if (st[i].count === 9) {
          comboCount['9'].push(st[i]);
        } else if (st[i].count >= 10) {
          comboCount['10'].push(st[i]);
        }
      }
      sortedCombo['5'] = comboCount['5'].sort(function(a, b){
        return ((b.count - a.count)* 10) + (b.score - a.score);
      });
      sortedCombo['6'] = comboCount['6'].sort(function(a, b){
        return ((b.count - a.count)* 10) + (b.score - a.score);
      });
      sortedCombo['7'] = comboCount['7'].sort(function(a, b){
        return ((b.count - a.count)* 10) + (b.score - a.score);
      });
      sortedCombo['8'] = comboCount['8'].sort(function(a, b){
        return ((b.count - a.count)* 10) + (b.score - a.score);
      });
      sortedCombo['9'] = comboCount['9'].sort(function(a, b){
        return ((b.count - a.count)* 10) + (b.score - a.score);
      });
      sortedCombo['10'] = comboCount['10'].sort(function(a, b){
        return ((b.count - a.count)* 10) + (b.score - a.score);
      });

      this.pickedCombo = sortedCombo;
      this.pickedIndex = index;
      this.pickedSubIndex = subIndex;
    },
    showCombo: function(comboKey) {
      switch(comboKey) {
        case '10':
          this.comboKeyColor = 'red';
          break;
        case '9':
          this.comboKeyColor = 'orange';
          break;
        case '8':
          this.comboKeyColor = 'yellow';
          break;
        case '7':
          this.comboKeyColor = 'olive';
          break;
        case '6':
          this.comboKeyColor = 'green';
          break;
        default:
          this.comboKeyColor = 'grey';
          break;
      }
      this.comboKey = comboKey;
    },
    showComboModal: function(combination, list) {
      this.$root.openWordsModalAndFeedEntry([combination.join('')].concat(list));
    },
    isPartOnHand: function(part) {
      if (part.indexOf('[') !== -1) {
        const handChars = this.$root.battleHand.map(h => this.$root.groups[this.$root.battleDeck[h]]).join('');
        return handChars.match(new RegExp(part)) !== null;
      }
      return false;
    }
  },
  template: `
    <table class="ui compact striped fixed table">
      <thead class="full-width">
        <tr>
          <th colspan="4">
            <center>
              {{ __t('battle.result.more-combo-text') }}<br/>
              <div class="ui label small" v-for="(char, index) in getQuestion()" :class="{green: char.indexOf(pickedSubIndex+1)!==-1}">{{ char }}</div>
            </center>
          </th>
        </tr>
      </thead>
      <thead class="full-width">
        <tr align="center">
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(groups, index) in getBattleStats()" :key="index">
          <td v-for="(subIndex) in getColumn()" :class="{pickedCombo: index === pickedIndex && subIndex === pickedSubIndex}">
            <words-input :group-key="getStatsBySubIndex(index, subIndex).key" :group="getGroupDisplayByKey(getStatsBySubIndex(index, subIndex).key)" v-on:click.native="pickResult(index, subIndex)"></words-input>
            <div class="ui label teal">{{ __t('battle.result.score-text') }} <div class="detail">{{ Math.round(getStatsBySubIndex(index, subIndex).object.sumScore) }}</div></div>
            <div class="ui label">{{ __t('battle.result.high-combo-text') }} <div class="detail">{{ getStatsBySubIndex(index, subIndex).object.highCombo }}</div></div>
            <div class="ui label">{{ __t('battle.result.medium-combo-text') }} <div class="detail">{{ getStatsBySubIndex(index, subIndex).object.mediumCombo }}</div></div>
            <div class="ui label">{{ __t('battle.result.low-combo-text') }} <div class="detail">{{ getStatsBySubIndex(index, subIndex).object.lowCombo }}</div></div>
          </td>
        </tr>
      </tbody>
      <tfoot class="full-width" v-if="getColumn().length > 0">
        <tr>
          <th colspan="4">
            <div v-if="pickedIndex === -1 || pickedSubIndex === -1">
              <h2>{{ __t('battle.result.choose-detail-text') }}</h2>
            </div>
            <div v-if="pickedIndex !== -1 && pickedSubIndex !== -1">
              <div>
                <words-input class="small" :group-key="getStatsBySubIndex(pickedIndex, pickedSubIndex).key" :group="getGroupDisplayByKey(getStatsBySubIndex(pickedIndex, pickedSubIndex).key)"></words-input>
                <a class="ui label red" @click="showCombo('10')">10+ {{__t('battle.result.combo-choice-text')}}<div class="detail">{{ pickedCombo['10'].length }}</div></a>
                <a class="ui label orange" @click="showCombo('9')">9 {{__t('battle.result.combo-choice-text')}}<div class="detail">{{ pickedCombo['9'].length }}</div></a>
                <a class="ui label yellow" @click="showCombo('8')">8 {{__t('battle.result.combo-choice-text')}}<div class="detail">{{ pickedCombo['8'].length }}</div></a>
                <a class="ui label olive" @click="showCombo('7')">7 {{__t('battle.result.combo-choice-text')}}<div class="detail">{{ pickedCombo['7'].length }}</div></a>
                <a class="ui label green" @click="showCombo('6')">6 {{__t('battle.result.combo-choice-text')}}<div class="detail">{{ pickedCombo['6'].length }}</div></a>
                <a class="ui label" @click="showCombo('5')">5> {{__t('battle.result.combo-choice-text')}}<div class="detail">{{ pickedCombo['5'].length }}</div></a>
              </div>
              <div class="clearfix"></div>
              <div class="fluid">
                <div v-for="(combo, index) in pickedCombo[comboKey]" class="comboRow fluid">
                  <div class="comboPlacement">
                    <div class="ui label black">{{ index + 1 }}.</div>
                    <div class="ui label" v-for="(part) in combo.placement" :class="{green: isPartOnHand(part)}">{{ part }}</div>
                  </div>
                  <div class="comboInfo">
                    <a class="ui label" :class="comboKeyColor" @click="showComboModal(combo.placement, combo.words)"><i class="eye icon"></i> {{ __t('battle.result.possible-combo') }} <div class="detail">{{ combo.count }}</div></a>
                    <div class="ui label violet">{{ __t('battle.result.already-text') }} <div class="detail">{{ combo.score }}</div></div>
                    <div class="ui label pink">{{ __t('battle.result.combo-long-text') }} <div class="detail">{{ combo.words.reduce(function(len, w) { return len < w.length ? w.length : len }, 0) }}</div></div>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
          </th>
        </tr>
      </tfoot>
    </table>`,
});

Vue.component('full-hand-result-display', {
  methods: {
    __t: function(key) {
      return this.$root.__t(key);
    },
    getFullHandCombo: function() {
      return this.$root.battleFullHandCombo;
    },
    showComboModal: function(combination, list) {
      this.$root.openWordsModalAndFeedEntry([combination.join('')].concat(list));
    },
  },
  template: `
    <table class="ui compact striped fixed table">
      <thead class="full-width">
        <tr>
          <th><center>{{ __t('battle.result.full-hand-text') }}</center></th>
        </tr>
      </thead>
      <tbody class="full-width">
        <tr>
          <td>
            <div class="fluid">
              <div v-for="(combo, index) in getFullHandCombo()" class="comboRow fluid">
                <div class="comboPlacement">
                  <div class="ui label black mini">{{ index + 1 }}.</div>
                  <div class="ui label mini" v-for="(part) in combo.placement">{{ part }}</div>
                </div>
                <div class="comboInfo">
                  <a class="ui label teal mini" @click="showComboModal(combo.placement, combo.words)"><i class="eye icon"></i> {{ __t('battle.result.possible-combo') }} <div class="detail">{{ combo.count }}</div></a>
                  <div class="ui label pink mini">{{ __t('battle.result.combo-long-text') }} <div class="detail">{{ combo.words.reduce(function(len, w) { return len < w.length ? w.length : len }, 0) }}</div></div>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `,
});