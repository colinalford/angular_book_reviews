// User can enter book information and search for book to add to read
// list. Info is pulled from OpenLibrary API. When book is selected, user will
// verify information, then the data will be posted to the database via API
// POST route. This information will be displayed by the to_read_list directive.

angular.module('bookSearch', [])

    .directive('addSelectedBook', function() {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/ng/book_app/add_book_search_form/partials/add_selected_book.html',
            replace: true,
            controller: 'AddSelectedBookController',
            controllerAs: 'controller'
        }
    })
    .controller('AddSelectedBookController', function(){
        this.bookParams = {
            author: '',
            title: '',
            year: ''
        };
    })
    .directive('addBookSearchForm', function() {
        return {
            restrict: 'EA',
            scope: {
                bookParams: '='
            },
            templateUrl: '/ng/book_app/add_book_search_form/partials/add_book_search_form.html',
            replace: true,
            controller: 'AddBookSearchFormController',
            controllerAs: 'controller',
            bindToController: true
        };
    })
    .factory('GetBook', function($resource) {
        var url = 'https://openlibrary.org/api/books';
        return $resource(url, {callback: 'JSON_CALLBACK'}, {
            getBook: {method: 'JSONP'}
        });
    })
    .controller('AddBookSearchFormController', function($http, GetBook) {

        this.newSearch = {
            type: 'author',
            params: 'stephen king'
        };

        var preview = document.getElementById("preview");

        this.fetch = function() {

            preview.innerHTML = '';
            var gif = new Image();
            gif.src = 'assets/ajax-loader.gif';
            preview.appendChild(gif);
            var type = this.newSearch.type;
            var params = this.newSearch.params;

            $http.get('https://openlibrary.org/search.json?'+type+'='+params, {headers: {'Content-Type': 'application/json'}})
            .success(function(response) {
                var span = document.createElement('span');
                preview.innerHTML = '';
                preview.appendChild(span);
                if (response.num_found === 0) {
                    var err = document.createElement('p');
                    err.innerHTML = 'No results found';
                    preview.appendChild(err);
                }
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

                    var obj = bookInfo[i];

                    function addImage(index, obj) {

                        var container = document.createElement('div');
                        container.className = 'cover-preview';
                        container.setAttribute('ng-click', 'controller.addBookInfo()');
                        if (index >= obj['lccn'].length) {
                            preview.appendChild(container);
                        } else {
                            preview.insertBefore(container, span);
                        }

                        var img = new Image(190, 280);

                        img.onload = function() {
                            var title = document.createElement('p');
                            title.className = 'title';
                            if (obj['title'].length > 20) {
                                title.innerHTML = obj['title'].slice(0, 19)+'. . .';
                            } else {
                                title.innerHTML = obj['title'];
                            }

                            var author = document.createElement('p');
                            author.className = 'author';
                            if (obj['title'].length > 20) {
                                author.innerHTML = obj['author'].slice(0, 19)+'. . .';
                            } else {
                                author.innerHTML = obj['author'];
                            }
                            author.innerHTML = obj['author'];

                            this.parentNode.appendChild(title);
                            this.parentNode.appendChild(author);
                        }

                        img.onerror = function() {
                            this.parentNode.parentNode.removeChild(this.parentNode);
                            addImage(index+1, obj);
                        }

                        if (index >= obj['lccn'].length) {
                            img.src = 'assets/blank_cover.jpg';
                        } else {
                            img.src = "http://covers.openlibrary.org/b/lccn/"+obj['lccn'][index]+"-M.jpg?default=false";
                        }

                        container.appendChild(img);
                    }
                    addImage(0, obj);
                }
            });
        };


        this.cancel = function() {
            this.newSearch.params = '';
            preview.innerHTML = '';
        };

        this.addBookInfo = function() {
            console.log('clikkkkkked');
            this.bookParams.author = 'ballzzzzz';
        };

    });
