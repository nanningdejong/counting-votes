window.addEventListener('load', function () {
    var tellers = getTellers();
    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: tellers || [],
            model: {
                email: '',
                password: ''
            }
        },
        mounted: function () {
            axios.get(apiEndpoint + '/verification/getdeviation', axiosHeaders)
                .then(res => {
                    if (res.data.deviation > 0) {
                        $('#deviationExplanation').show();
                    }
                })
                .catch(err => {

                })
        },
        methods: {
            authenticate() {
                axios.post(apiEndpoint + '/authentication/signoff', vm.model)
                    .then(res => {
                        vm.clearModel();
                        vm.$toasted.show('SignOff Ok', {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    })
                    .catch(err => {
                        var msg = vm.$t('message.unknownError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }
                        vm.clearModel();
                        vm.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            clearModel() {
                vm.model.email = "";
                vm.model.explanation = "";
                vm.model.password = "";
            },
            canSubmit() {
                axios.get(apiEndpoint + '/authentication/submit', axiosHeaders)
                    .then(res => {
                        $('#success').modal();
                        window.localStorage.chairman = null;
                        window.localStorage.tellers = null;
                        window.localStorage.token = null;
                    })
                    .catch(err => {
                        var msg = vm.$t('message.unknownError');
                        if (err && err.response && err.response.data && err.response.data.message) {
                            msg = err.response.data.message;
                        }
                        vm.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            }
        }

    });
    vm.$mount('#app');

    $(function () {
        $('.sidebar-wrapper, .content-wrapper, footer').addClass('show');
        $('section > .row').removeClass('justify-content-md-center');
        $('section').addClass('has-footer');
    });

    $(function () {
        $('.btn-authenticate').click(function () {
            if (!vm.model.email || !vm.model.password) {
                vm.$toasted.show('Invalid Credentials', {
                    theme: "bubble",
                    position: "bottom-center",
                    duration: 3000
                });
                vm.clearModel();
                return;
            }
            vm.authenticate();

        });
    });
});
