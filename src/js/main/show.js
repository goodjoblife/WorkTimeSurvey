/* global WTS, FB, ga, $, Vue, Router */
const TIME_AND_SALARY_VIEW = 'TIME_AND_SALARY_VIEW';
const SEARCH_JOB_TITLE_VIEW = 'SEARCH_JOB_TITLE_VIEW';
const SEARCH_COMPANY_VIEW = 'SEARCH_COMPANY_VIEW';

/*
 * A store to save the state.
 *
 * store 提供 methods 來改動狀態(state)，並觸發相關的下游來接收狀態，
 * 任何的狀態改變都需要透過這裡的 methods 來進行（除了 Routing 除外）
 *
 */
const showjs_store = {
  state: {
    is_logged_in: null,
    is_authed: null,
    current_view: null,
    view_params: {},
  },
  changeLoggedInState: function(is_logged_in) {
    showjs_store.state.is_logged_in = is_logged_in;

    if (showjs_store.state.is_logged_in === true) {
      testSearchPermission();
    } else if (showjs_store.state.is_logged_in === false) {
      showjs_store.state.is_authed = false;
    }

    app.$emit("state-change");
    searchBarApp.$emit("state-change");
  },
  changeAuthState: function(is_authed) {
    showjs_store.state.is_authed = is_authed;
    app.$emit("state-change");
    searchBarApp.$emit("state-change");
  },
  changeViewState: function(new_view, new_params) {
    showjs_store.state.current_view = new_view;
    showjs_store.state.view_params = new_params;
    app.$emit("state-change");
    searchBarApp.$emit("state-change");
  },
};

const timeAndSalary = Vue.extend({
  template: "#app-time-and-salary",
  data: function () {
    return {
      // current page loaded
      current_page: 0,
      // 薪時資訊
      time_and_salary: [],
      total: 0,
      is_loading: false,
      // 選單的內部狀態
      search_result_sort: {},
      share: showjs_store.state,
    };
  },
  events: {
    load_time_and_salary: function() {
      this.search_result_sort = {
        sort_by: this.share.view_params.sort_by,
        order: this.share.view_params.order,
      };
      this.current_page = 0;

      // 權限未確認狀態，保持原樣
      if (this.share.is_authed === null) {
        return;
      }

      // 有查詢權限
      if (this.share.is_authed === true) {
        this.loadTimeAndSalary(0);
        return;
      }

      // 無查詢權限，僅允許 最新薪時，其餘轉址
      if (this.share.is_authed === false) {
        if (this.share.view_params.sort_by === "created_at" && this.share.view_params.order === "descending") {
          this.loadTimeAndSalary(0);
          return;
        }
        router.setRoute("/latest");
        return;
      }
    },
    scroll_bottom_reach: function() {
      if (! this.share.is_authed) {
        return;
      }
      // we don't want the two loading
      if (this.is_loading) {
        return;
      }

      this.loadMorePage();
    },
  },
  methods: {
    loadMorePage: function() {
      this.loadTimeAndSalary(this.current_page + 1);
    },
    loadTimeAndSalary: function(page) {
      this.is_loading = true;

      const limit = 25;
      const opt = {
        params: {
          sort_by: this.share.view_params.sort_by,
          order: this.share.view_params.order,
          page,
          limit,
          access_token: (this.share.is_authed === true && typeof FB !== 'undefined') ? FB.getAuthResponse().accessToken : undefined,
        },
      };

      this.$http.get(`${WTS.constants.backendURL}workings`, opt).then(res => res.json()).then(data => {
        // 將Array公司名稱轉換成String
        const time_and_salary = data.time_and_salary.map(row => {
          const name = row.company.name;
          row.company.name = Array.isArray(name)? name[0]: name;
          return row;
        });
        // 當讀取的是第 0 頁，代表資料要被取代
        if (page === 0) {
          this.time_and_salary = time_and_salary;
        } else {
          this.time_and_salary = this.time_and_salary.concat(time_and_salary);
        }
        // 這個只是讓 current_page 不要一直加上去（但不影響功能）
        if (time_and_salary.length === 0) {
          this.current_page;
        } else {
          this.current_page = page;
        }
        this.total = data.total;
        this.is_loading = false;
      }, err => {
        this.is_loading = false;
        this.current_page;
      });
    },
    sortOnChange: function() {
      const routes = {
        "created_at_descending": "/latest",
        "created_at_ascending": "/sort/time-asc",
        "week_work_time_descending": "/work-time-dashboard",
        "week_work_time_ascending": "/sort/work-time-asc",
        "estimated_hourly_wage_descending": "/salary-dashboard",
        "estimated_hourly_wage_ascending": "/sort/salary-asc",
      };

      const key = `${this.search_result_sort.sort_by}_${this.search_result_sort.order}`;
      router.setRoute(routes[key]);
    },
  },
  computed: {
    section_title: function() {
      const names = {
        "created_at_descending": "最新薪時資訊",
        "created_at_ascending": "最舊薪時資訊",
        "week_work_time_descending": "工時排行榜",
        "week_work_time_ascending": "工時排行榜（由低到高）",
        "estimated_hourly_wage_descending": "估算時薪排行榜",
        "estimated_hourly_wage_ascending": "估算時薪排行榜（由低到高）",
      };
      const key = `${this.search_result_sort.sort_by}_${this.search_result_sort.order}`;
      return names[key];
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
      search_result_sort: {},
      share: showjs_store.state,
    };
  },
  events: {
    load_search_and_group_by_job_title: function() {
      // 權限未確認狀態，保持原樣
      if (this.share.is_authed === null) {
        // passed
      }

      // 有查詢權限
      if (this.share.is_authed === true) {
        // passed
      }

      // 無查詢權限，僅允許 最新薪時，其餘轉址
      if (this.share.is_authed === false) {
        router.setRoute("/latest");
        return;
      }

      this.search_result_sort = {
        group_sort_by: this.share.view_params.group_sort_by,
        order: this.share.view_params.order,
      };
      this.job_title_keyword = this.share.view_params.job_title;

      this.loadData(this.job_title_keyword, this.search_result_sort);
    },
    data_loaded: function() {
      if (this.data.length === 1) {
        let button = this.$el.querySelector(".accordion__trigger");
        $(button).trigger("click");
      }
    },
  },
  methods: {
    loadData: function(job_title_keyword, searchResultSort) {
      this.data = [];
      this.is_loading = true;

      const group_sort_by = searchResultSort.group_sort_by;
      const order = searchResultSort.order;

      this.getData(job_title_keyword, group_sort_by, order).then(res => {
        this.data = res.data;
      }, err => {
        this.data = [];
      }).then(() => {
        this.is_loading = false;
        this.$emit('data_loaded');
      });
    },
    getData: function(job_title, group_sort_by, order) {
      const opt = {
        params: {
          job_title,
          group_sort_by,
          order,
          access_token: typeof FB !== 'undefined' ? FB.getAuthResponse().accessToken : undefined,
        },
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search_by/job_title/group_by/company`, opt);
    },
    sortOnChange: function() {
      const routes = {
        "week_work_time_descending": "/work-time-dashboard",
        "week_work_time_ascending": "/sort/work-time-asc",
        "estimated_hourly_wage_descending": "/salary-dashboard",
        "estimated_hourly_wage_ascending": "/sort/salary-asc",
      };

      const key = `${this.search_result_sort.group_sort_by}_${this.search_result_sort.order}`;
      router.setRoute(`/job-title/${encodeURIComponent(this.job_title_keyword)}` + routes[key]);
    },
  },
  computed: {
    section_title: function() {
      const names = {
        "week_work_time_descending": "工時排行榜",
        "week_work_time_ascending": "工時排行榜（由低到高）",
        "estimated_hourly_wage_descending": "估算時薪排行榜",
        "estimated_hourly_wage_ascending": "估算時薪排行榜（由低到高）",
      };
      const key = `${this.search_result_sort.group_sort_by}_${this.search_result_sort.order}`;
      return names[key];
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
      search_result_sort: {},
      share: showjs_store.state,
    };
  },
  events: {
    load_search_and_group_by_company: function() {
      // 權限未確認狀態，保持原樣
      if (this.share.is_authed === null) {
        // passed
      }

      // 有查詢權限
      if (this.share.is_authed === true) {
        // passed
      }

      // 無查詢權限，僅允許 最新薪時，其餘轉址
      if (this.share.is_authed === false) {
        router.setRoute("/latest");
        return;
      }

      this.search_result_sort = {
        group_sort_by: this.share.view_params.group_sort_by,
        order: this.share.view_params.order,
      };
      this.company_keyword = this.share.view_params.company;

      this.loadData(this.company_keyword, this.search_result_sort);
    },
    data_loaded: function() {
      if (this.data.length === 1) {
        let button = this.$el.querySelector(".accordion__trigger");
        $(button).trigger("click");
      }
    },
  },
  methods: {
    loadData: function(company_keyword, searchResultSort) {
      this.data = [];
      this.is_loading = true;

      const group_sort_by = searchResultSort.group_sort_by;
      const order = searchResultSort.order;

      this.getData(company_keyword, group_sort_by, order).then(res => {
        this.data = res.data;
      }, err => {
        this.data = [];
      }).then(() => {
        this.is_loading = false;
        // the promise let the event occur after the dom update
        this.$emit('data_loaded');
      });
    },
    getData: function(company, group_sort_by, order) {
      const opt = {
        params: {
          company,
          group_sort_by,
          order,
          access_token: typeof FB !== 'undefined' ? FB.getAuthResponse().accessToken : undefined,
        },
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search_by/company/group_by/company`, opt);
    },
    sortOnChange: function() {
      const routes = {
        "week_work_time_descending": "/work-time-dashboard",
        "week_work_time_ascending": "/sort/work-time-asc",
        "estimated_hourly_wage_descending": "/salary-dashboard",
        "estimated_hourly_wage_ascending": "/sort/salary-asc",
      };

      const key = `${this.search_result_sort.group_sort_by}_${this.search_result_sort.order}`;
      router.setRoute(`/company/${encodeURIComponent(this.company_keyword)}` + routes[key]);
    },
  },
});

Vue.filter('num', value => {
  return value ? value : "-";
});

Vue.filter('overtime_frequency_string', value => {
  if (value === 0) {
    return "幾乎不";
  } else if (value === 1) {
    return "偶爾";
  } else if (value === 2) {
    return "經常";
  } else if (value === 3) {
    return "幾乎每天";
  }

  return "";
});

Vue.filter('employment_type_string', value => {
  if (value === "full-time") {
    return "全職";
  } else if (value === "part-time") {
    return "兼職(含打工)";
  } else if (value === "intern") {
    return "實習";
  } else if (value === "temporary") {
    return "臨時工";
  } else if (value === "contract") {
    return "約聘雇";
  } else if (value === "dispatched-labor") {
    return "派遣";
  }

  return "";
});

Vue.filter('salary_type_string', value => {
  if (value === "year") {
    return "年";
  } else if (value === "month") {
    return "月";
  } else if (value === "day") {
    return "日";
  } else if (value === "hour") {
    return "小時";
  }

  return "";
});

//Attribution: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
Vue.filter('formatted_wage_string', value => {
  if (typeof value == 'number') {
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return value;
});

Vue.filter('two_digit_month', value => {
  if (typeof value === 'number') {
    return value > 9 ? value.toString() : "0" + value;
  }
  return "";
});

const app = new Vue({
  el: "#app",
  components: {
    TIME_AND_SALARY_VIEW: timeAndSalary,
    SEARCH_JOB_TITLE_VIEW: searchAndGroupByJobTitle,
    SEARCH_COMPANY_VIEW: searchAndGroupByCompany,
  },
  data: {
    currentView: null,
    share: showjs_store.state,
  },
  events: {
    "state-change": function() {
      this.currentView = this.share.current_view;
      if (this.currentView === TIME_AND_SALARY_VIEW) {
        Vue.nextTick(() => {
          app.$broadcast("load_time_and_salary");
        });
      } else if (this.currentView === SEARCH_JOB_TITLE_VIEW) {
        Vue.nextTick(() => {
          app.$broadcast("load_search_and_group_by_job_title");
        });
      } else if (this.currentView === SEARCH_COMPANY_VIEW) {
        Vue.nextTick(() => {
          app.$broadcast("load_search_and_group_by_company");
        });
      }
    },
  },
});

const searchBarApp = new Vue({
  el: "#section-search",
  data: {
    share: showjs_store.state,
    search_type: "by-company",
    keyword: "",
    search_result_sort: {},
  },
  methods: {
    onSubmit: function() {
      if (this.search_type === "by-company") {
        router.setRoute(`/company/${encodeURIComponent(this.keyword)}/work-time-dashboard`);

        this.$emit("submit", this.search_type, this.keyword);
      } else if (this.search_type === "by-job-title") {
        router.setRoute(`/job-title/${encodeURIComponent(this.keyword)}/work-time-dashboard`);

        this.$emit("submit", this.search_type, this.keyword);
      } else {
        router.setRoute("/latest");
      }
    },
  },
  events: {
    'state-change': function() {
      if (this.share.current_view === SEARCH_COMPANY_VIEW) {
        this.search_type = "by-company";
        this.keyword = this.share.view_params.company;
      } else if (this.share.current_view === SEARCH_JOB_TITLE_VIEW) {
        this.search_type = "by-job-title";
        this.keyword = this.share.view_params.job_title;
      }
    },
  },
});

const router = Router({
  "/latest": {
    on: () => {
      showjs_store.changeViewState(TIME_AND_SALARY_VIEW, {
        sort_by: "created_at",
        order: "descending",
      });
    },
  },
  "/sort/time-asc": {
    on: () => {
      showjs_store.changeViewState(TIME_AND_SALARY_VIEW, {
        sort_by: "created_at",
        order: "ascending",
      });
    },
  },
  "/work-time-dashboard": {
    on: () => {
      showjs_store.changeViewState(TIME_AND_SALARY_VIEW, {
        sort_by: "week_work_time",
        order: "descending",
      });
    },
  },
  "/sort/work-time-asc": {
    on: () => {
      showjs_store.changeViewState(TIME_AND_SALARY_VIEW, {
        sort_by: "week_work_time",
        order: "ascending",
      });
    },
  },
  "/salary-dashboard": {
    on: () => {
      showjs_store.changeViewState(TIME_AND_SALARY_VIEW, {
        sort_by: "estimated_hourly_wage",
        order: "descending",
      });
    },
  },
  "/sort/salary-asc": {
    on: () => {
      showjs_store.changeViewState(TIME_AND_SALARY_VIEW, {
        sort_by: "estimated_hourly_wage",
        order: "ascending",
      });
    },
  },
  "/job-title/:job_title/work-time-dashboard": {
    on: (job_title) => {
      showjs_store.changeViewState(SEARCH_JOB_TITLE_VIEW, {
        job_title: decodeURIComponent(job_title),
        group_sort_by: "week_work_time",
        order: "descending",
      });
    },
  },
  "/job-title/:job_title/sort/work-time-asc": {
    on: (job_title) => {
      showjs_store.changeViewState(SEARCH_JOB_TITLE_VIEW, {
        job_title: decodeURIComponent(job_title),
        group_sort_by: "week_work_time",
        order: "ascending",
      });
    },
  },
  "/job-title/:job_title/salary-dashboard": {
    on: (job_title) => {
      showjs_store.changeViewState(SEARCH_JOB_TITLE_VIEW, {
        job_title: decodeURIComponent(job_title),
        group_sort_by: "estimated_hourly_wage",
        order: "descending",
      });
    },
  },
  "/job-title/:job_title/sort/salary-asc": {
    on: (job_title) => {
      showjs_store.changeViewState(SEARCH_JOB_TITLE_VIEW, {
        job_title: decodeURIComponent(job_title),
        group_sort_by: "estimated_hourly_wage",
        order: "ascending",
      });
    },
  },
  "/company/:company/work-time-dashboard": {
    on: (company) => {
      showjs_store.changeViewState(SEARCH_COMPANY_VIEW, {
        company: decodeURIComponent(company),
        group_sort_by: "week_work_time",
        order: "descending",
      });
    },
  },
  "/company/:company/sort/work-time-asc": {
    on: (company) => {
      showjs_store.changeViewState(SEARCH_COMPANY_VIEW, {
        company: decodeURIComponent(company),
        group_sort_by: "week_work_time",
        order: "ascending",
      });
    },
  },
  "/company/:company/salary-dashboard": {
    on: (company) => {
      showjs_store.changeViewState(SEARCH_COMPANY_VIEW, {
        company: decodeURIComponent(company),
        group_sort_by: "estimated_hourly_wage",
        order: "descending",
      });
    },
  },
  "/company/:company/sort/salary-asc": {
    on: (company) => {
      showjs_store.changeViewState(SEARCH_COMPANY_VIEW, {
        company: decodeURIComponent(company),
        group_sort_by: "estimated_hourly_wage",
        order: "ascending",
      });
    },
  },
  // This url is outdated
  "/search-and-group/by-job-title/(.*)": {
    on: (job_title) => {
      job_title = decodeURIComponent(job_title);
      router.setRoute(`/job-title/${encodeURIComponent(job_title)}/work-time-dashboard`);
    },
  },
  // This url is outdated
  "/search-and-group/by-company/(.*)": {
    on: (company) => {
      company = decodeURIComponent(company);
      router.setRoute(`/company/${encodeURIComponent(company)}/work-time-dashboard`);
    },
  },
}).configure({
  notfound: () => {
    router.setRoute(`/latest`);
  },
});

/*
 * Autocomplete Part
 */
$(function() {
  const $input = $(searchBarApp.$el).find("#search-bar-input");
  const vue = searchBarApp;
  $input.autocomplete({
    source: function (request, response) {
      if (vue.search_type === "by-company") {
        $input.trigger("company-query-autocomplete-search", request.term);
        const url = `${WTS.constants.backendURL}workings/companies/search`;
        const opt = {
          params: {
            key: request.term,
          },
        };
        Vue.http.get(url, opt).then(res => res.json()).then(res => {
          const nameList = $.map(res, (item, i) => {
            let name = item._id.name;
            if(Array.isArray(name)) {
              name = name.filter(x => x.toLowerCase().indexOf(request.term.toLowerCase()) >= 0)[0];
            }
            return {
              value: name,
              id: name,
            }
          });
          response(nameList);
        }).catch(err => {
          response([]);
        });
      } else if (vue.search_type === "by-job-title") {
        $input.trigger("jot-title-query-autocomplete-search", request.term);
        const url = `${WTS.constants.backendURL}workings/jobs/search`;
        const opt = {
          params: {
            key: request.term,
          },
        };
        Vue.http.get(url, opt).then(res => res.json()).then(res => {
          const nameList = $.map(res, (item, i) => ({
            value: item._id,
            id: item._id,
          }));
          response(nameList);
        }).catch(err => {
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

const callToShareDataApp = new Vue({
  el: "#call-to-share-data",
  data: {
    share: showjs_store.state,
    user_link: null,
  },
  watch: {
    'share.is_logged_in': function(new_value) {
      if (new_value === true) {
        this.queryRecommendationString();
      } else {
        this.user_link = null;
      }
    },
  },
  methods: {
    shareLink: function() {
      FB.ui({
        method: 'share',
        display: 'popup',
        href: this.user_link,
        quote: "想邀請身邊的朋友們，一起參與【工時透明化運動】！",
      });
    },
    queryRecommendationString: function() {
      const access_token = FB.getAccessToken();
      const body = {
        access_token,
      };
      return this.$http.post(`${WTS.constants.backendURL}me/recommendations`, body)
        .then(response => response.json())
        .then(response => {
          this.user_link = `${WTS.constants.siteURL}?rec_by=${response.recommendation_string}`;
        })
        .catch(err => {
          this.user_link = null;
        });
    },
  },
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

$(window).on('scroll', function() {
  if ($(window).scrollTop() + window.innerHeight >= $(document).height() - 100) {
    if (app.currentView === TIME_AND_SALARY_VIEW) {
      app.$broadcast("scroll_bottom_reach");
    }
  }
});

// wait the event trigger done
router.init(["/"]);

function testSearchPermission() {
  const access_token = FB.getAccessToken();
  const opt = {
    params: {
      access_token,
    },
  };
  return Vue.http.get(`${WTS.constants.backendURL}me/permissions/search`, opt)
    .then(response => response.json())
    .then(response => {
      const hasSearchPermission = response.hasSearchPermission;
      if (hasSearchPermission) {
        showjs_store.changeAuthState(true);
      } else {
        showjs_store.changeAuthState(false);
      }
    })
    .catch(err => {
      showjs_store.changeAuthState(false);
    });
}
