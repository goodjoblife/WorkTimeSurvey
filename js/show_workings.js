var vue = new Vue({
    el: '#workings-latest-section',
    data: {
        page: 0,
        total: 0,
        limit: 10,
        workings: [],
        isAlertShown: false,
        message: '',
        isLoading: false,
    },
    methods: {
        loadPage: function(page) {
            this.isLoading = true;

            if (page < 0) {
                this.showAlert('第一頁');
                this.isLoading = false;

                return;
            }

            this.getWorkings(page).then(function(res) {
                this.isLoading = false;
                if (res.data.workings.length === 0) {
                    this.showAlert('最後一頁');
                } else {
                    this.workings = res.data.workings;
                    this.total = res.data.total;
                    this.page = page;
                }
            }, function(res) {
                this.isLoading = false;
                this.showAlert('存取錯誤');
            });
        },
        getWorkings: function(page) {
            var opt = {
                params: {
                    page: page,
                    limit: this.limit
                }
            };
            return this.$http.get('https://tranquil-fortress-92731.herokuapp.com/workings/latest', opt);
        },
        previousPage: function() {
            this.loadPage(this.page - 1);
        },
        nextPage: function() {
            this.loadPage(this.page + 1);
        },
        switchPage: function(index) {
            this.loadPage(this.pager_offset + index);
        },
        showAlert: function(message) {
            this.isAlertShown = true;
            this.message = message;

            var me = this;
            setTimeout(function() {
                me.isAlertShown = false;
            }, 2000);
        }
    },
    computed: {
        total_page: function() {
            return Math.ceil(this.total / this.limit);
        },
        pager_offset: function() {
            if (this.total_page <= 5) {
                return 0;
            }

            if (this.page - 2 < 0) {
                return 0;
            }

            if (this.page + 2 >= this.total_page) {
                return this.total_page - 5;
            }

            return this.page - 2;
        }
    }
});

vue.$on('hey', function() {
    console.log(hey);
});
