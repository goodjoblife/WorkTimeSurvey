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

const searchAndGroupByJobTitle = Vue.extend({
  template: "#app-search-and-group-by-job-title",
  data: function() {
    return {
      job_title_keyword: null,
      data: [],
    };
  },
  events: {
    load_job_title: function(job_title_keyword) {
      this.loadData(job_title_keyword);
    },
  },
  methods: {
    loadData: function(job_title_keyword) {
      this.getData(job_title_keyword).then((res) => {
        this.job_title_keyword = job_title_keyword;
        this.data = res.data;
      }, (err) => {
        // TODO
      });
    },
    getData: function(job_title_keyword) {
      const opt = {
        params: {
          job_title: job_title_keyword,
        }
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search-and-group/by-job-title`, opt);
    }
  },
});

const app = new Vue({
  el: "#app",
  components: {
    'latestWorkings': latestWorkings,
    "searchAndGroupByJobTitle": searchAndGroupByJobTitle,
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
    });
  },
  "/search-and-group/by-job-title/(.*)": function(name) {
    app.currentView = "searchAndGroupByJobTitle";
    Vue.nextTick(function() {
      app.$broadcast("load_job_title", decodeURIComponent(name));
    });
  },
}).configure({
  notfound: function() {
    router.setRoute("/latest");
  }
});

router.init(["/"]);
