angular.module('bookSearch', [])
    .directive('addBookSearchForm', function() {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/ng/book_app/add_book_search_form/partials/add_book_search_form.html',
            replace: true,
            controller: 'AddBookSearchFormController',
            controllerAs: 'controller',
        };
    })
    .factory('GetBook', function($resource) {
        var url = 'https://openlibrary.org/api/books';
        return $resource(url, {callback: 'JSON_CALLBACK'}, {
            getBook: {method: 'JSONP'}
        });
    })
    .controller('AddBookSearchFormController', function($http, GetBook) {

        this.search = {};

        this.newSearch = {
            type: 'isbn'
        };

        var preview = document.getElementById("preview");

        function addContainer() {
            var container = document.createElement('div');
            container.className = 'cover-preview';
            preview.appendChild(container);
        }



        this.fetch = function() {
            preview.innerHTML = '';
            var type = this.newSearch.type;
            var params = this.newSearch.params;

            $http.get('https://openlibrary.org/search.json?'+type+'='+params, {headers: {'Content-Type': 'application/json'}})
            .success(function(response) {
                var bookInfo = [];
                for (i in response.docs) {
                    bookInfo[i] = {};
                    bookInfo[i]['title'] = response.docs[i]['title_suggest'];
                    bookInfo[i]['author'] = response.docs[i]['author_name'];
                    bookInfo[i]['year'] = response.docs[i]['first_publish_year'];
                    if (response.docs[i]['lccn'] === undefined) {
                        bookInfo[i]['lccn'] = [];
                    } else {
                        bookInfo[i]['lccn'] = response.docs[i]['lccn'];
                    }

                }
                for (i in bookInfo) {

                    var lccns = bookInfo[i]['lccn'];

                    function addImage(index, arr) {
                        if (index >= arr.length) {
                            var container = document.createElement('div');
                            container.className = 'cover-preview';
                            preview.appendChild(container);
                            var img = new Image(280, 200);
                            img.src = 'assets/blank_cover.jpg';
                            container.appendChild(img);
                        } else {
                            var container = document.createElement('div');
                            container.className = 'cover-preview';
                            preview.appendChild(container);
                            var img = new Image(280, 200);
                            img.onerror = function() {
                                this.parentNode.removeChild(this);
                                addImage(index+1, arr);
                            }
                            img.src = "http://covers.openlibrary.org/b/lccn/"+arr[index]+"-M.jpg?default=false"
                            container.width = img.width;
                            container.appendChild(img);

                        }

                    }

                    addImage(0, lccns);

                }
            });
        };


        this.cancel = function(){
            preview.innerHTML = '';
        }

    });
