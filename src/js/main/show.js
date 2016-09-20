const latestWorkings = Vue.extend({
  template: "#app-latest-workings",
  data: function () {
    return {
      workings: [],
    };
  },
  events: {
    load_latest_workings: function() {
      this.loadLatestWorkings();
    },
  },
  methods: {
    loadLatestWorkings: function() {
      this.getLatestWorkings().then((res) => {
        this.workings = res.data.workings;
      }, (err) => {
        // TODO
      });
    },
    getLatestWorkings: function() {
      const opt = {
        params: {
          page: 0,
          limit: 20,
        }
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/latest`, opt);
    }
  },
});

const app = new Vue({
  el: "#app",
  components: {
    'latestWorkings': latestWorkings,
  },
  data: {
    currentView: null,
  }
});

const router = Router({
  "/latest": function() {
    app.currentView = "latestWorkings";
    Vue.nextTick(function() {
      app.$broadcast("load_latest_workings", 0);

      //ga('send', 'event', category, 'visit-latest');
    });
  },
}).configure({
  notfound: function() {
    router.setRoute("/latest");
  }
});

router.init(["/"]);
