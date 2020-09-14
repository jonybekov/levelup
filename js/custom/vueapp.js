var TabComponent = Vue.component("tabs", {
  template: `<ul>
                 <li v-for="(tab, i) in tabsList" :key="i" @click="getData(tab.type)">{{tab.name}}</li>
               </ul>`,
  data() {
    return {
      tabsList: [
        {
          type: "apps",
          name: "Мобильное приложения"
        },
        {
          type: "website",
          name: "Веб-сайты"
        },
        {
          type: "telegram_bot",
          name: "Телеграм боты"
        },
        {
          type: "newsletter",
          name: "Рассылки"
        }
      ]
    };
  },
  methods: {
    getData(type) {
      this.$store.dispatch("setCurrentTab", type);
    }
  },
  created() {
    if (!this.$store.state.projectList) {
      this.getData("apps");
    }
  }
});

let PartnersComponent = Vue.component("partners-component", {
  template: `
  <div class="partners">
    <div class="row" v-if='loading == false'>
        <div class="col-xs-6 col-sm-4 col-md-3" v-for='(partner, i) in partnersList' :key='i'>
        <a :href='partner.data.link_to_website.url'>
          <div  class="partner-item" >
          <img :src="partner.data.image.url" :alt="partner.data.title[0].text" :title="partner.data.title[0].text" />
          </div>
          </a>
        </div>
      </div>
  
      <template v-else>
        Loading...
      </template>
  </div>  
  `,

  computed: {
    partnersList() {
      return this.$store.state.partners;
    },
    isLoading() {
      return this.loading;
    }
  },
  data() {
    return {
      loading: false,
      partners: null
    };
  },
  methods: {
    getPartners() {
      this.$store.dispatch("setPartners");
    }
  },
  created() {
    if (!this.$store.getters.partnersList) {
      this.getPartners();
    }
  }
});

let TabContentComponent = Vue.component("tab-content", {
  template: `
          <div class="col-md-12 col-lg-9">
            
            <div class="tab-content">
              <div v-if="isLoading == true">
                <div class="showbox">
                  <div class="loader">
                    <svg class="circular" viewBox="25 25 50 50">
                      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                    </svg>
                  </div>
                </div>  
              </div>
              <div class="row" v-if="isLoading == false">
                <div class="col-sm-4" v-for="(project, i) in projects" :key="i">
                  <div class="tab-item">
                    <div class="tab-item-pretitle">Мобильное приложение</div>
                    <div class="tab-item-title">{{project.data.title[0].text}}</div>
                    <div class="tab-item-img">
                      <img :src="project.data.image.url" alt="" />
                    </div>
                    <div class="tab-item-desc">
                      {{project.data.description[0].text ? project.data.description[0].text : "sorry"}}
                    </div>
                  </div>
                </div>
                </div>
                <div v-if="projects == false" class="empty">
                  <img width="300px" src="assets/images/pale-list-is-empty.png"/>
                  <p>Здесь пока пусто!</p>
                </div>
            </div>
          </div>
    
    `,
  computed: {
    projects() {
      return this.$store.getters.projectList;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  data() {
    return {
      pretitle: null,
      title: null,
      image: null,
      desc: null,
      loading: false
    };
  },

  methods: {
    mounted() {
      // if(this.$store.getters.projectList) {}
    }
  }
});

const App = new Vue({
  el: "#app",
  store: new Vuex.Store({
    state: {
      isLoading: false,
      projects: null,
      partners: null,
      isPartnersLoading: false
    },
    mutations: {
      setCurrentTab(state, payload) {
        state.projects = payload;
      },
      setPartners(state, payload) {
        state.partners = payload;
      },
      changeLoading(state, payload) {
        state.isLoading = payload;
      },
      changePartnersLoading(state, payload) {
        state.isPartnersLoading = payload;
      }
    },
    actions: {
      setCurrentTab({ commit, state }, tabId) {
        commit("changeLoading", true);
        console.log("Loading...", state.isLoading);
        prismic.then((api) => {
          return api
            .query(PrismicJS.Predicates.at("document.type", tabId))
            .then((response) => {
              commit("setCurrentTab", response.results);
              commit("changeLoading", false);
              console.log("Loaded", state.isLoading);
            })
            .catch((err) => console.log(err));
        });
      },
      setPartners({ commit, state }) {
        commit("changePartnersLoading", true);
        prismic
          .then(function(api) {
            return api.query(
              PrismicJS.Predicates.at("document.type", "partners")
            ); // An empty query will return all the documents
          })
          .then(
            function(response) {
              commit("setPartners", response.results);
              commit("changePartnersLoading", true);
              console.log("Documents: ", response.results);
            },
            function(err) {
              console.log("Something went wrong: ", err);
            }
          );
      }
    },
    getters: {
      projectList(state) {
        return state.projects;
      },
      partnersList(state) {
        return state.partners;
      },

      loadingState(state) {
        return new Promise((res, rej) => {
          res(state.isLoading);
        }).catch(() => rej());
      }
    }
  }),
  data: {
    content: "hey"
  },
  components: {
    "tab-component": TabComponent,
    "partners-component": PartnersComponent,
    "tab-content": TabContentComponent
  }
});
