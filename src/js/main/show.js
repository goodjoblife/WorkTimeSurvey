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
        this.job_title_keyword = null;
        this.data = [];
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

const searchAndGroupByCompany = Vue.extend({
  template: "#app-search-and-group-by-company",
  data: function() {
    return {
      company_keyword: null,
      data: [],
    };
  },
  events: {
    load_company: function(company_keyword) {
      this.loadData(company_keyword);
    },
  },
  methods: {
    loadData: function(company_keyword) {
      this.getData(company_keyword).then((res) => {
        console.log(res.data);
        this.company_keyword = company_keyword;
        this.data = res.data;
      }, (err) => {
        this.company_keyword = null;
        this.data = [];
      });
    },
    getData: function(company_keyword) {
      const opt = {
        params: {
          company: company_keyword,
        }
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search-and-group/by-company`, opt);
    }
  },
});

Vue.filter('num', function (value) {
  return value ? value : "-";
})

const app = new Vue({
  el: "#app",
  components: {
    'latestWorkings': latestWorkings,
    "searchAndGroupByJobTitle": searchAndGroupByJobTitle,
    "searchAndGroupByCompany": searchAndGroupByCompany,
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
  "/search-and-group/by-company/(.*)": function(name) {
    app.currentView = "searchAndGroupByCompany";
    Vue.nextTick(function() {
      app.$broadcast("load_company", decodeURIComponent(name));
    });
  },
}).configure({
  notfound: function() {
    router.setRoute("/latest");
  }
});

router.init(["/"]);

const searchBarApp = new Vue({
  el: "#section-search",
  data: {
    search_type: "by-company",
    keyword: "",
  },
  methods: {
    onSubmit: function() {
      if (this.search_type === "by-company") {
        router.setRoute(`/search-and-group/by-company/${encodeURIComponent(this.keyword)}`);
      } else if (this.search_type === "by-job-title") {
        router.setRoute(`/search-and-group/by-job-title/${encodeURIComponent(this.keyword)}`);
      } else {
        router.setRoute("/latest");
      }
    }
  },
});
