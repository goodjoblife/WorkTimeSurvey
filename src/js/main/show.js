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
    },
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
    data_loaded: function() {
      if (this.data.length === 1) {
        let button = this.$el.querySelector(".accordion__trigger");
        $(button).trigger("click");
      }
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
        this.$emit('data_loaded');
      });
    },
    getData: function(job_title_keyword) {
      const opt = {
        params: {
          job_title: job_title_keyword,
        }
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search-and-group/by-job-title`, opt);
    },
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
    data_loaded: function() {
      if (this.data.length === 1) {
        let button = this.$el.querySelector(".accordion__trigger");
        $(button).trigger("click");
      }
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
        // the promise let the event occur after the dom update
        this.$emit('data_loaded');
      });
    },
    getData: function(company_keyword) {
      const opt = {
        params: {
          company: company_keyword,
        }
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search-and-group/by-company`, opt);
    },
  },
});

Vue.filter('getDataTime', (working) => {
  const toDate = (t) => {
    let d = new Date(t);
    return {
      year:d.getFullYear(),
      month:d.getMonth()+1,
    };
  };
  const date = working.is_currently_employed? toDate(working.created_at): working.job_ending_time;
  return date.year + "." + date.month;
});

Vue.filter('num', (value) => value ? value : "-");

Vue.filter('overtime_frequency_string', (value) => {
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

Vue.filter('experience_in_year_string', (value) => {
  if (value == 0) {
    return "未滿1年";
  } else if (1<=value) {
    return value + "年";
  }
  throw new Error("invalid value");
});

Vue.filter('employment_type_string', (value) => {
  switch(value){
    case "full-time": return '全職';
    case "part-time": return '兼職';
    case "intern": return '實習';
    case "temporary": return '約聘雇';
    case "contract": return '合約';
    case "dispatched-labor": return '派遣';
    default: throw new Error("invalid value");
  }
});

Vue.filter('salary_string', (salary) => {
  const type_text = (x) => {
    switch(x){
      case 'year': return '年';
      case 'month': return '月';
      case 'day': return '日';
      case 'hour': return '時';
      default: throw new Error("invalid value");
    }
  };
  return amount_in_comma(salary.amount) + " / " + type_text(salary.type)
});

// convert a positive integer to comma-separated number string for every thousand
// e.g. 10000 => 10,000
const amount_in_comma = (amount) => {
  if(typeof amount!="number"){
    throw new Error('invalid amount');
  }
  return amount.toString().replace(/^(\d{0,2})((?:\d{3})*)$/,
    ($0,$1,$2) => $1+$2.replace(/(\d{3})/g,',$1').slice($1==''?1:0)
  );
};

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

        this.$emit("submit", this.search_type, this.keyword);
      } else if (this.search_type === "by-job-title") {
        router.setRoute(`/search-and-group/by-job-title/${encodeURIComponent(this.keyword)}`);

        this.$emit("submit", this.search_type, this.keyword);
      } else {
        router.setRoute("/latest");
      }
    },
    setInputInfo: function(search_type = "by-company", keyword = "") {
      this.search_type = search_type;
      this.keyword = keyword;
    }
  },
});

const router = Router({
  "/latest": function() {
    app.currentView = "latestWorkings";
    searchBarApp.setInputInfo();
  },
  "/search-and-group/by-job-title/(.*)": function(name) {
    app.currentView = "searchAndGroupByJobTitle";
    const decodedName = decodeURIComponent(name);
    searchBarApp.setInputInfo("by-job-title", decodedName);
    Vue.nextTick(function() {
      app.$broadcast("load_search_and_group_by_job_title", decodedName);
    });
  },
  "/search-and-group/by-company/(.*)": function(name) {
    app.currentView = "searchAndGroupByCompany";
    const decodedName = decodeURIComponent(name);
    searchBarApp.setInputInfo("by-company", decodedName);
    Vue.nextTick(function() {
      app.$broadcast("load_search_and_group_by_company", decodedName);
    });
  },
}).configure({
  notfound: function() {
    router.setRoute("/latest");
  }
});

$(window).on('scroll', function() {
  if ($(window).scrollTop() + window.innerHeight >= $(document).height() - 100) {
    if (app.currentView === "latestWorkings") {
      app.$broadcast("scroll_bottom_reach");
    }
  }
});


/*
 * Autocomplete Part
 */
$(function(){
  const $input = $(searchBarApp.$el).find("#search-bar-input");
  const vue = searchBarApp;
  $input.autocomplete({
    source: function (request, response) {
      if(vue.search_type === "by-company") {
        $input.trigger("company-query-autocomplete-search", request.term);
        $.ajax({
          url: WTS.constants.backendURL + "workings/companies/search",
          data: {
            key : request.term,
          },
          dataType: "json",
        }).done(function(res) {
          const nameList = $.map(res, (item, i) => ({
              value: item._id.name,
              id: item._id.name,
            })
          );
          response(nameList);
        }).fail(function( jqXHR, textStatus ) {
          response([]);
        });
      }
      else if(vue.search_type === "by-job-title") {
        $input.trigger("jot-title-query-autocomplete-search", request.term);
        $.ajax({
          url: WTS.constants.backendURL + "workings/jobs/search",
          data: {
            key : request.term,
          },
          dataType: "json",
        }).done(function(res) {
            const nameList = $.map(res, (item, i) => ({
                value: item._id,
                id: item._id,
              })
            );
            response(nameList);
        }).fail(function(jqXHR, textStatus) {
          response([]);
        });
      }
    },
    select: function(event, ui) {
      if (searchBarApp.search_type === "by-company") {
        $input.trigger("company-query-autocomplete-select", ui.item.label);
      } else if (searchBarApp.search_type === "by-job-title") {
        $input.trigger("job-title-query-autocomplete-select", ui.item.label);
      }
    },
  });
});

//*************************************************
//
//  Begin of GA part
//
//*************************************************
(($, searchBarApp) => {
  const category = "QUERY_PAGE";

  const $search_bar = $("#search-bar-input");

  // autocomplete event
  $search_bar.on("company-query-autocomplete-search", (e, q) => {
    ga("send", "event", category, "company-query-autocomplete-search", q);
  });

  $search_bar.on("job-title-query-autocomplete-search", (e, q) => {
    ga("send", "event", category, "job-title-query-autocomplete-search", q);
  });

  $search_bar.on("ompany-query-autocomplete-select", (e, q) => {
    ga("send", "event", category, "ompany-query-autocomplete-select", q);
  });

  $search_bar.on("job-title-query-autocomplete-select", (e, q) => {
    ga("send", "event", category, "job-title-query-autocomplete-select", q);
  });

  // form event
  searchBarApp.$on("submit", (search_type, keyword) => {
    if (search_type === "by-company") {
      ga("send", "event", category, "company-form-submit", keyword);
    } else if (search_type === "by-job-title") {
      ga("send", "event", category, "job-title-form-submit", keyword);
    }
  });

  // router event
  router.on("on", "/latest", () => {
    ga("send", "event", category, "visit-latest");
  });

  router.on("on", "/search-and-group/by-job-title/(.*)", (name) => {
    ga("send", "event", category, "visit-job-title", decodeURIComponent(name));
  });

  router.on("on", "/search-and-group/by-company/(.*)", (name) => {
    ga("send", "event", category, "visit-company", decodeURIComponent(name));
  });
})(window.jQuery, searchBarApp);
//*************************************************
//
//  End of GA part
//
//*************************************************

/*
 * Init Part
 */

// wait the event trigger done
router.init(["/"]);
