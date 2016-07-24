var vue = new Vue({
    el: '#workings-latest-section',
    data: {
        //current page number (目前頁碼)
        page: 0,
        //number of total data
        total: 0,
        // << 5 6 7 8 9 10 11 >> if like this, then pager_count is 7
        pager_count: 7,
        limit: 10,
        workings: [],
        isAlertShown: false,
        message: '',
        isLoading: false,
    },
    methods: {
        loadPage: function(page) {
            // prevent another loading
            if (this.isLoading) {
                return;
            }

            this.$emit('page-loading', page);

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
            return this.$http.get(WTS.constants.backendURL + 'workings/latest', opt);
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
        },
        searchTitle: function(keyword) {
            var q = $('#query'),
                form = $('#search-form');
            if (q.length !== 0) {
                q.val(keyword);
                form.submit();
            }
        }
    },
    computed: {
        total_page: function() {
            return Math.ceil(this.total / this.limit);
        },
        /*
         * pager_offset: the page of 0th pager (第0個頁簽的頁碼)
         *   << 5 6 7 8 9 10 11 >> 像這樣的話，pager_offset = 5(使用者看到的) - 1 = 4
         *
         * 0  1  2  3  4  5  ...  ...  t-1  t
         * <----------->
         *         <----------->
         *                   <----------->
         * 由於頁數太多，不可能把頁碼都印出來，勢必有個 window 要取，顯示出起始～結束的頁碼
         *
         * 另一方面，又希望目前的頁碼在正中間。
         *
         */
        pager_offset: function() {
            // The size remaining to left or right
            // middleOffset . 1 . middleOffset
            var middleOffset = Math.floor(this.pager_count / 2);

            if (this.total_page <= this.pager_count) {
                return 0;
            }

            // 左寬度不夠
            if (this.page - middleOffset < 0) {
                return 0;
            }

            // 右寬度不夠
            if (this.page + middleOffset > this.total_page - 1) {
                return this.total_page - this.pager_count;
            }

            // 左右寬度足夠
            return this.page - middleOffset;
        }
    }
});

