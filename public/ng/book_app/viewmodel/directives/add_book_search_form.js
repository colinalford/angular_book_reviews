angular.module('bookSearch', [])
    .directive('addBookSearchForm', function() {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/ng/book_app/views/partials/add_book_search_form.html',
            replace: true,
            controller: 'AddBookSearchFormController',
            controllerAs: 'controller',
        };
    })
    /*.directive('addBookSelector', function() {
            return {
                restrict: 'E',
                scope: {
                    search: '='
                },
                replace: true,
                templateUrl: '/ng/book_app/views/partials/add_book_selector.html',
                controller: 'AddBookSelectorController',
                controllerAs: 'controller',
                bindToController: true
            };
    })*/

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

        this.fetch = function() {
            preview.innerHTML = '';
            var type = this.newSearch.type;
            var params = this.newSearch.params;

            if (type === 'isbn') {
                var data = GetBook.getBook({bibkeys:'ISBN:'+params});
                data.$promise.then(function(res) {
                    var info = JSON.stringify(res);
                    if(info === '{}') {
                        alert('No book found');
                    } else {
                        this.book = res['ISBN:'+params];
                        console.log(info);
                    }
                });
            } else {
                $http.get('https://openlibrary.org/search.json?'+type+'='+params, {headers: {'Content-Type': 'application/json'}})
                .success(function(response) {
                    //console.log(JSON.stringify(response));
                    var keys = [];
                    for (i in response.docs) {
                        keys[i] = [];
                        keys[i].push(response.docs[i]["title_suggest"]);
                        keys[i].push(response.docs[i]["lccn"]);
                    }
                    for (i in keys) {
                        if(keys[i][1] === undefined) {
                            var title = document.createElement('span');
                            title.innerHTML = keys[i][0].slice(0, 120)+'. . .';
                            preview.appendChild(title);
                        } else if (keys[i][1].length > 1) {
                            for (j in keys[i][1]) {
                                var imgHeight;
                                var imgWidth;

                                var img = new Image();
                                img.src = "http://covers.openlibrary.org/b/lccn/"+keys[i][1][j]+"-M.jpg";
                                preview.appendChild(img);
                                if (img.width <= 1) {
                                    preview.removeChild(img);
                                    var span = document.createElement('span');
                                    title.innerHTML = keys[i][0];
                                    title.style.width = '280px';
                                    title.style.height = '280px';
                                    preview.appendChild(span);
                                }
                            }

                        } else {
                            var img = document.createElement('img');
                            img.src = "http://covers.openlibrary.org/b/lccn/"+keys[i][1]+"-M.jpg";
                            preview.appendChild(img);
                        }

                    }
                });
            }
        };

        this.cancel = function(){
            preview.innerHTML = '';
        }

    });

/*angular.module('books', [])
    .directive('booksList', function() {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/ng/book_app/views/partials/book_list.html',
            replace: true,
            controller: 'BookController',
            controllerAs: 'controller'
        };
    })
    .controller('BookController', function() {
        this.books = [
            {title: 'The Jungle Book', author: 'Rudyard Kipling', isbn: '123456'},
            {title: 'The Desert Book', author: 'Kudyard Ripling', isbn: '666666'},
            {title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', isbn: '993821'},
            {title: 'Rin Tin Tin', author: 'Lizzie Alford', isbn: '18948750'},
        ];
    });*/
