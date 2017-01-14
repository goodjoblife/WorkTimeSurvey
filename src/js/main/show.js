const timeAndSalary = Vue.extend({
  template: "#app-time-and-salary",
  data: function () {
    return {
      // current page loaded
      current_page: 0,
      data: [],
      total: 0,
      is_loading: false,
      user_enabled: false,
      search_result_sort: "",
    };
  },
  events: {
    load_time_and_salary: function(searchResultSort) {
      this.loadTimeAndSalary(0, searchResultSort);
    },
    scroll_bottom_reach: function() {
      // we don't want the two loading
      if (this.is_loading) {
        return;
      }

      this.loadMorePage();
    },
    change_user_enabled: function(user_enabled){
      this.changeUserEnabled(user_enabled);
    },
  },
  methods: {
    loadMorePage: function() {
      this.current_page += 1;
      const searchResultSort = JSON.parse(this.search_result_sort);
      this.loadTimeAndSalary(this.current_page, searchResultSort);
    },
    loadTimeAndSalary: function(page, searchResultSort = {
      "sort_by": "created_at",
      "order": "descending",
    }) {
      this.is_loading = true;
      this.search_result_sort = JSON.stringify(searchResultSort);

      const sort_by = searchResultSort.sort_by;
      const order = searchResultSort.order;

      this.getData(page, sort_by, order).then(res => {
        this.data = res.data;
        this.total = res.data.total;
        this.is_loading = false;
      }, err => {
        this.is_loading = false;
      });
    },
    getData: function(page, sort_by, order) {
      const opt = {
        params: {
          sort_by,
          order,
          page,
          limit: 25,
        },
      };
      return this.$http.get(`${WTS.constants.backendURL}workings`, opt);
    },
    sortOnChange: function(selected) {
      const sortBy = JSON.parse(selected).sort_by.replace(/_/g, "-") + "-" + JSON.parse(selected).order;
      router.setRoute(`/sort/${sortBy}`);
    },
    changeUserEnabled: function(user_enabled){
      this.user_enabled = user_enabled;
    },
  },
  computed: {
    workingsList: function() {
      const sortBy = JSON.parse(this.search_result_sort).group_sort_by.replace(/_/g, "-") + "-" + JSON.parse(this.search_result_sort).order;
      router.setRoute(`/sort/${sortBy}`);
      return this.user_enabled ? this.workings : this.workings.slice(0, 10);
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
      search_result_sort: "",
    };
  },
  events: {
    load_search_and_group_by_job_title: function(job_title_keyword, searchResultSort) {
      this.loadData(job_title_keyword, searchResultSort);
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
      this.job_title_keyword = job_title_keyword;
      this.data = [];
      this.is_loading = true;
      this.search_result_sort = JSON.stringify(searchResultSort);

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
        },
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search_by/job_title/group_by/company`, opt);
    },
    sortOnChange: function(selected) {
      const sortBy = JSON.parse(selected).group_sort_by.replace(/_/g, "-") + "-" + JSON.parse(selected).order;
      router.setRoute(`/search-by-job-title/${encodeURIComponent(this.job_title_keyword)}/sort/${sortBy}`);
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
      search_result_sort: "",
    };
  },
  events: {
    load_search_and_group_by_company: function(company_keyword, searchResultSort) {
      this.loadData(company_keyword, searchResultSort);
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
      this.company_keyword = company_keyword;
      this.data = [];
      this.is_loading = true;
      this.search_result_sort = JSON.stringify(searchResultSort);

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
        },
      };
      return this.$http.get(`${WTS.constants.backendURL}workings/search_by/company/group_by/company`, opt);
    },
    sortOnChange: function(selected) {
      const sortBy = JSON.parse(selected).group_sort_by.replace(/_/g, "-") + "-" + JSON.parse(selected).order;
      router.setRoute(`/search-by-company/${encodeURIComponent(this.company_keyword)}/sort/${sortBy}`);
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

Vue.filter('formatted_wage_string', value => {
    if(typeof value == 'number') return parseFloat(value).toFixed(2).replace(/\.?0*$/g, '');
    return value;
});

const app = new Vue({
  el: "#app",
  components: {
    'timeAndSalary': timeAndSalary,
    "searchAndGroupByJobTitle": searchAndGroupByJobTitle,
    "searchAndGroupByCompany": searchAndGroupByCompany,
  },
  data: {
    currentView: null,
  },
});

const searchBarApp = new Vue({
  el: "#section-search",
  data: {
    search_type: "by-company",
    keyword: "",
    user_enabled: false,
    search_result_sort: {},
  },
  methods: {
    onSubmit: function() {
      if (this.search_type === "by-company") {
        router.setRoute(`/search-by-company/${encodeURIComponent(this.keyword)}/sort/week-work-time-descending`);

        this.$emit("submit", this.search_type, this.keyword);
      } else if (this.search_type === "by-job-title") {
        router.setRoute(`/search-by-job-title/${encodeURIComponent(this.keyword)}/sort/estimated-hourly-wage-descending`);

        this.$emit("submit", this.search_type, this.keyword);
      } else {
        router.setRoute("/sort/created-at-descending");
      }
    },
    setInputInfo: function(search_type = "by-company", keyword = "", searchResultSort="") {
      this.search_type = search_type;
      this.keyword = keyword;
      this.search_result_sort = searchResultSort;
    },
  },
});

const sortByToSearchResultSort = (sortBy, isLatest) => {
  const sort = sortBy.split("-");
  let group_sort_by = "";
  for (let i = 0; i < sort.length - 1; i++) {
    group_sort_by += sort[i] + "_";
  }
  group_sort_by = group_sort_by.slice(0, -1);

  if (isLatest) {
    return {
      sort_by: group_sort_by,
      order: sort[sort.length - 1],
    };
  }

  return {
    group_sort_by,
    order: sort[sort.length - 1],
  };
};

const router = Router({
  "/sort/:sort": {
    on: sort => {
      app.currentView = "timeAndSalary";
      const searchResultSort = sortByToSearchResultSort(sort, true);
      searchBarApp.setInputInfo("by-company", "", searchResultSort);
      Vue.nextTick(() => {
        app.$broadcast("load_time_and_salary", searchResultSort);
      });
    },
  },
  "/search-by-job-title/:job_title/sort/:sort": {
    on: (job_title, sort) => {
      app.currentView = "searchAndGroupByJobTitle";
      const decodedName = decodeURIComponent(job_title);
      const searchResultSort = sortByToSearchResultSort(sort, false);
      searchBarApp.setInputInfo("by-job-title", decodedName, searchResultSort);
      Vue.nextTick(() => {
        app.$broadcast("load_search_and_group_by_job_title", decodedName, searchResultSort);
      });
    },
  },
  "/search-by-company/:company/sort/:sort": {
    on: (company, sort) => {
      app.currentView = "searchAndGroupByCompany";
      const decodedName = decodeURIComponent(company);
      const searchResultSort = sortByToSearchResultSort(sort, false);
      searchBarApp.setInputInfo("by-company", decodedName, searchResultSort);
      Vue.nextTick(() => {
        app.$broadcast("load_search_and_group_by_company", decodedName, searchResultSort);
      });
    },
  },
}).configure({
  notfound: () => {
    router.setRoute(`/sort/created-at-descending`);
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

// user_enabled
function testSearchPermission(){
  const access_token = FB.getAccessToken();
  $.ajax({
    url: WTS.constants.backendURL + "me/permissions/search",
    data: {access_token},
    dataType: "json",
  }).then(response => {
    const hasSearchPermission = response.hasSearchPermission;
    if(hasSearchPermission) changeUserEnabled(true);
    else{
      return $.ajax({
        url: WTS.constants.backendURL + "me/recommendations",
        method:'POST',
        data: {access_token},
        dataType: "json",
      }).then(response => {
        const recomm_url =
            WTS.constants.siteURL + '?rec_by=' + response.recommendation_string;
        $('#user-link').val(recomm_url);

        $("#share-rec-url").click(function(){
          FB.ui({
            method: 'share',
            display: 'popup',
            href: recomm_url,
            quote: "想邀請身邊的朋友們，一起參與【工時透明化運動】！",
          }, function(response){});
        });
      });
    }
  }).catch((jqXHR, textStatus, errorThrown) => {
    // TODO
  });
}

function changeUserEnabled(user_enabled){
  if (user_enabled) {
    $('#user-enabled').addClass('hide');
  } else {
    $('#user-enabled').removeClass('hide');
  }
  if (user_enabled) {
    $(window).on('scroll', function() {
      if ($(window).scrollTop() + window.innerHeight >= $(document).height() - 100) {
        if (app.currentView === "timeAndSalary") {
          app.$broadcast("scroll_bottom_reach");
        }
      }
    });
  }
  app.$broadcast("change_user_enabled", user_enabled);
  searchBarApp.user_enabled = user_enabled;
}

// wait the event trigger done
router.init(["/"]);
