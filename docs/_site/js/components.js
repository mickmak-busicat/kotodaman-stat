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
      if( this.filteredByLength.length === 0) {
        return this.filterWords();
      }
      return this.searchResult;
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
  props: ['index', 'value'],
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
    updateQuestion: function(index) {
      return this.$root.updateQuestion(this.char, index);
    }
  },
  template: `
    <select class="ui dropdown compact" v-model="char" @change="updateQuestion(index)">
      <option :value="char.key" v-for="(char, index) in getAllWords()">{{ char.text }}</option>
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
Vue.component('battle-input-section', {
  mounted: function() {
    $(this.$refs.stepAccordion).accordion();
  },
  data: function() {
    return {
      currentPickGroup: -1,
      currentPickIndex: -1,
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
      this.currentPickIndex = this.currentPickIndex === -1 ? 0 : (this.currentPickIndex + 1) % (this.$root.battleHand.length - this.$root.battleUsed.length);
    },
    getDeck: function() {
      return this.$root.battleDeck;
    },
    getHand: function() {
      return this.$root.battleHand;
    },
    getHandGroup: function() {
      return this.$root.battleHand.map(idx => this.$root.battleDeck[idx]);
    },
    getUsed: function() {
      return this.$root.battleUsed;
    },
    getDeckMax: function() {
      return DECK_MAX;
    },
    getQuestion: function() {
      return this.$root.question;
    },
    getQuestionCharAt: function(index) {
      const char = this.$root.question[index] === 'x' ? '' : this.$root.question[index];
      return char;
    },
    getCurrentPickGroup: function() {
      return this.$root.getGroupDisplayByKey(this.$root.battleDeck[this.$root.battleHand[this.currentPickGroup]]);
    },
    isSelected: function(index) {
      if (this.$root.question[index] === 'x') {
        if (index === 0 && this.currentPickIndex === index) {
          return true;
        }
        const match = this.$root.question.slice(0, index).match(/x/g);
        return match && match.length === this.currentPickIndex;
      }
      return false;
    },
    isStep1Completed: function() {
      return this.getDeck().length == this.getDeckMax();
    },
    isStep2Completed: function() {
      const match = this.$root.question.match(/x/g);
      return match && match.length <= USE_MAX;
    },
    isStep3Completed: function() {
      return this.$root.battleHand.length === HAND_MAX;
    },
    goStep: function(index) {
      $(this.$refs.stepAccordion).accordion('open', index-1);

      if (index === 2) {
        this.$root.closeWordPanel();
      }
    },
    reset: function() {
      this.$root.battleHand = [];
      this.$root.battleUsed = [];
      this.currentPickGroup = -1;
      this.currentPickIndex = -1;
    },
    pickCharAtIndex: function(char, index) {
      console.log(char, index);
    },
    showComboResult: function() {
      console.log('combo');
    }
  },
  template: `
    <div class="ui grid container" id="battle-section" v-show="getCurrentTab()==1">
      <div class="ui fluid accordion" ref="stepAccordion">
        <div class="active title">
          <i class="dropdown icon"></i>
          Step 1: Pick your deck from below
          <span v-if="!isStep1Completed()">**</span>
        </div>
        <div class="active content">
          <div class="ui grid">
            <div class="column">
              <div class="ui raised segment">
                <div class="ui top left attached label yellow">Deck</div>
                <div class="step1DeckContainer">
                  <words-input v-for="(group, index) in getDeck()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="throwAwayGroupAtIndex(index)"></words-input>
                </div>
                <div class="clearfix"></div>
                <div>
                  <button class="ui right labeled icon button right floated green" :disabled="!isStep1Completed()" @click="goStep(2)">
                    Next
                    <i class="right chevron icon"></i>
                  </button>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="title">
          <i class="dropdown icon"></i>
          Step 2: Setup the question
          <span v-if="!isStep2Completed()">**</span>
        </div>
        <div class="content">
          <table class="ui celled striped table very compact">
            <thead>
              <tr><th colspan="7">
                Setup Question
              </th>
            </tr>
            </thead>
            <tbody align="center">
              <tr>
                <td v-for="index in [0,1,2,3,4,5,6]">{{ index + 1 }}</td>
              </tr>
              <tr>
                <td v-for="index in [0,1,2,3,4,5,6]">
                  <question-word-select :index="index"></question-word-select>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button class="ui right labeled icon button right floated green" :disabled="!isStep2Completed()" @click="goStep(3)">
              Set Question
              <i class="right chevron icon"></i>
            </button>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="title">
          <i class="dropdown icon"></i>
          Step 3: Select your hand card
          <span v-if="!isStep3Completed()">**</span>
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
                    <div v-else>
                      {{ getQuestionCharAt(index) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="allCardContainer">
              <div class="handBigContainer ui raised segment">
                <div class="ui top left attached label green mini">Hand card</div>
                <div class="handContainer">
                  <words-input class="small" v-for="(group, index) in getHandGroup()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="pickHandCard(index)"></words-input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="deckBigContainer ui segment">
                <div class="ui top left attached label yellow mini">Deck</div>
                <div class="deckContainer">
                  <words-input class="small" v-for="(group, index) in getDeck()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="pickToHandAtIndex(index)" :class="{disabled: getHand().indexOf(index) !== -1}"></words-input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="usedBigContainer ui segment">
                <div class="ui top left attached label mini">Used card</div>
                <div class="usedContainer">
                  <words-input class="small" v-for="(group, index) in getUsed()" :key="index" :group-key="group" :group="getGroupDisplayByKey(group)" v-on:click.native="throwAwayGroupAtIndex(index)"></words-input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="clearfix"></div>
              <div>
                <button class="ui left icon button floated" @click="reset">Reset</button>
                <button class="ui right labeled icon button right floated green" :disabled="!isStep1Completed() || !isStep2Completed() || !isStep3Completed()" @click="showComboResult">
                  Show me combo
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