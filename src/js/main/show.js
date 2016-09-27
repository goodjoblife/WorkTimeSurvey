const latestWorkings = Vue.extend({
  template: "#app-latest-workings",
  data: function () {
    return {
      // current page loaded
      current_page: 0,
      workings: [],
      is_loading: false,
    };
  },
  created: function() {
    this.loadLatestWorkings(0);
  },
  events: {
    scroll_bottom_reach: function() {
      // we don't want the two loading
      if (this.is_loading) {
        return;
      }

      this.loadMorePage();
    }
  },
  methods: {
    loadMorePage: function() {
      this.current_page += 1;
      this.loadLatestWorkings(this.current_page);
    },
    loadLatestWorkings: function(page) {
      this.is_loading = true;
      this.getLatestWorkings(page).then((res) => {
        this.workings = this.workings.concat(res.data.workings);
        this.is_loading = false;
      }, (err) => {
        this.is_loading = false;
      });
    },
    getLatestWorkings: function(page) {
      const opt = {
        params: {
          page: page,
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
      is_loading: false,
    };
  },
  events: {
    load_search_and_group_by_job_title: function(job_title_keyword) {
      this.loadData(job_title_keyword);
    },
  },
  methods: {
    loadData: function(job_title_keyword) {
      this.job_title_keyword = job_title_keyword;
      this.data = [];
      this.is_loading = true;
      this.getData(job_title_keyword).then((res) => {
        this.data = res.data;
      }, (err) => {
        this.data = [];
      }).then(() => {
        this.is_loading = false;
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
      is_loading: false,
    };
  },
  events: {
    load_search_and_group_by_company: function(company_keyword) {
      this.loadData(company_keyword);
    },
  },
  methods: {
    loadData: function(company_keyword) {
      this.company_keyword = company_keyword;
      this.data = [];
      this.is_loading = true;
      this.getData(company_keyword).then((res) => {
        this.data = res.data;
      }, (err) => {
        this.data = [];
      }).then(() => {
        this.is_loading = false;
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

Vue.filter('overtime_frequency_string', function (value) {
  if (value == "0") {
    return "幾乎不";
  } else if (value == "1") {
    return "偶而";
  } else if (value == "2") {
    return "經常";
  } else if (value == "3") {
    return "幾乎每天";
  }

  throw new Error("invalid value");
});

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
  },
  "/search-and-group/by-job-title/(.*)": function(name) {
    app.currentView = "searchAndGroupByJobTitle";
    Vue.nextTick(function() {
      app.$broadcast("load_search_and_group_by_job_title", decodeURIComponent(name));
    });
  },
  "/search-and-group/by-company/(.*)": function(name) {
    app.currentView = "searchAndGroupByCompany";
    Vue.nextTick(function() {
      app.$broadcast("load_search_and_group_by_company", decodeURIComponent(name));
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

$(window).on('scroll', function() {
  if ($(window).scrollTop() + window.innerHeight >= $(document).height() - 100) {
    if (app.currentView === "latestWorkings") {
      app.$broadcast("scroll_bottom_reach");
    }
  }
});
