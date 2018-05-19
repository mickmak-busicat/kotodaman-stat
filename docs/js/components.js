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
        return 'monji ' + className + (className === key && className !== 'groupn' ? ' clearfix' : '');
      }
      return 'monji ' + className;
    },
  },
  template: `
    <div :class="getGroupClassName(groupKey)"> 
      <div class="forms">{{ group.join(",") }}</div> 
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