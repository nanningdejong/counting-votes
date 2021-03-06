/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
window.addEventListener('load', function () {

    if (!this.window.localStorage.token) {
        this.window.location = 'index.html';
        return;
    }

    var vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: [],
            model: {
                email: '',
                password: '',
                passwordConfirmation: '',
                code: '',
                role: '4'
            }
        },
        mounted: function () {
            $('#app').fadeIn();
        },
        methods: {
            requestVerificationCode: function (event) {
                axios.post(apiEndpoint + '/twofactor/verification', vm.model).then(resp => {
                    if (resp.data.isActive) {
                        this.showModalSignIn(event);
                    } else {
                        this.showModalCreatePassword(event);
                    }
                }
                ).catch(error => {
                    this.$toasted.show(error.response.data.message, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );

            },
            showModalCreatePassword: function (event) {
                $('#create-password-modal').modal();
            },
            showModalSignIn: function (event) {
                $('#sign-in-modal').modal();
            },
            requestCreatePassword: function (event) {
                $('#create-password-modal').modal('hide');
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/createpassword', vm.model).then(resp => {
                    this.clearModel();
                    $('#loading-modal').modal('hide');
                    addTeller(resp.data.user);
                    if(this.tellers.indexOf(resp.data.user) == -1)
                        this.tellers.push(resp.data.user);
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                    $('section > .row').removeClass('justify-content-md-center');

                }
                ).catch(error => {
                    this.clearModel();
                    $('#loading-modal').modal('hide');
                    var msg = this.$t('message.unhandledError');
                    if (error && error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    this.$toasted.show(msg, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                });
            },
            requestSignIn: function (event) {
                $('#sign-in-modal').modal('hide');
                $('#loading-modal').modal();
                axios.post(apiEndpoint + '/authentication/signin', vm.model).then(resp => {
                    this.clearModel();
                    $('#loading-modal').modal('hide');
                    addTeller(resp.data.user);
                    if(this.tellers.indexOf(resp.data.user) == -1)
                        this.tellers.push(resp.data.user);
                    $('.sidebar-wrapper, .content-wrapper').addClass('show');
                    $('section > .row').removeClass('justify-content-md-center');
                }).catch(error => {
                    this.clearModel();
                    $('#loading-modal').modal('hide');
                    var msg = this.$t('message.unhandledError');
                    if (error && error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    this.$toasted.show(msg, {
                        theme: "bubble",
                        position: "bottom-center",
                        duration: 3000
                    });
                }
                );
            },
            goToDashboard: function (event) {
                window.location = 'dashboard.html';
            },
            clearModel: function () {
                this.model.email = '';
                this.model.password = '';
                this.model.passwordConfirmation = '';
                this.model.code = ''
            }
        }

    });
    vm.$mount('#app');

    var tellers = getTellers();
    if (tellers) {
        for (var i = 0; i < tellers.length; i++)
            vm.tellers.push(tellers[i]);
    }
});
