angular.module('bookCovers', [])
    .factory('OpenLibrary', function($http) {
        var urlBase = 'https://openlibrary.org/search.json?';
        var data = {};

        data.searchBooks = function(key, value) {
            return $http.get(urlBase+key+'='+value, {headers: {'Content-Type': 'application/json'}});
        };

        return data;
    })
    .directive('bookCoversDirective', function() {
        return {
            scope: {},
            templateUrl: '/ng/book_app/book_covers/book_covers.html',
            replace: true,
            controller: 'BookCoversController',
            controllerAs: 'ctrl'
        }
    })
    .directive('srcFallback', function() {
        return {
            restrict: 'A',
            compile: function(tElem, tAttrs) {
                return {
                    pre: function(scope, element, attributes) {
                        scope.book.img = {};
                        if (attributes.srcFallback === '') {
                            attributes.$set('src', 'blank_cover.jpg');
                        }
                        scope.book.img = attributes.src;
                    },
                    post: function(scope, element, attributes) {
                        if (attributes.src === 'blank_cover.jpg') {
                            var prev = element.parent().parent();
                            var container = element.parent();
                            prev.append(container);
                        }
                        element.bind('load', function() {
                            scope.book.img = attributes.src;
                        });
                        element.bind('error', function() {
                            var arr = JSON.parse(attributes.srcFallback);
                            var index = JSON.parse(attributes.srcIndex);
                            if (index > arr.length) {
                                attributes.$set('src', 'blank_cover.jpg');
                                var prev = element.parent().parent();
                                var container = element.parent();
                                prev.append(container);
                                scope.book.img = attributes.src;
                            } else {
                                attributes.$set('src', 'http://covers.openlibrary.org/b/lccn/'+arr[index+1]+'-M.jpg?default=false');
                                attributes.$set('srcIndex', index+1);
                                scope.book.img = attributes.src;
                            }
                        });
                    }
                }
            }
        }
    })
    .directive('authors', function() {
        return {
            restrict: 'A',
            compile: function(tElem, tAttrs) {
                return {
                    pre: function(scope, elem, attrs) {
                        if (scope.book.author_name.length > 1) {
                            var authors = scope.book.author_name[0];
                            for (i = 1; i < scope.book.author_name.length; i++) {
                                authors = authors + ' and ' + scope.book.author_name[i];
                            }
                            scope.book.author_name = authors;
                        } else {
                            scope.book.author_name = scope.book.author_name[0];
                        }
                    }
                }
            }
        }
    })
    .directive('addPopup', function() {
        return {
            restrict: 'E',
            templateUrl: '/ng/book_app/book_covers/add-popup.html',
            replace: true,
            controller: 'AddPopupController',
            controllerAs: 'ctrl'
        }
    })
    .factory('ToReadApi', function($http) {
        var urlBase = '/api/toread';
        var dataFactory = {};

        dataFactory.getList = function() {
            return $http.get(urlBase);
        };

        dataFactory.postBook = function(book) {
            return $http.post(urlBase, book);
        };

        dataFactory.updateBook = function(book) {
            return $http.put(urlBase+'/'+book.lccn);
        };

        dataFactory.deleteBook = function(book) {
            return $http.delete(urlBase+'/'+book.lccn);
        };

        return dataFactory;
    })
    .factory('ReviewedApi', function($http) {
        var urlBase = '/api/reviewed';
        var dataFactory = {};

        dataFactory.getList = function() {
            return $http.get(urlbase);
        };

        dataFactory.postBook = function(book) {
            book.lccn = book.lccn[0];
            return $http.post(urlbase, book);
        };

        dataFactory.updateBook = function(book) {
            return $http.put(urlbase+'/'+book.lccn[0], book);
        };

        dataFactory.deleteBook = function(book) {
            return $http.delete(urlbase+'/'+book.lccn[0]);
        };
    })
    .controller('AddPopupController', function($scope, ToReadApi) {
        this.addToDb = {
            title: $scope.book.title_suggest,
            author: $scope.book.author_name,
            year: $scope.book.first_publish_year,
            notes: 'Add your notes here!',
        };

        this.post = function() {
            ToReadApi.postBook($scope.book)
            .success(function(data){
                alert('Posted to DB!');
                $scope.$parent.bookData = {};
                $scope.isVisible = false;
            })
            .error(function(err){
                alert('Did not post');
            });
        }
    })
    .controller('BookCoversController', function($scope, OpenLibrary) {

        this.bookData;
        this.status;

        this.isVisible = false;

        this.newSearch = {
            type: 'author',
            params: 'stephen king'
        };

        this.getBooks = function(search) {
            var type = search.type;
            var params = search.params;

            OpenLibrary.searchBooks(type, params)
                .success(function(data) {
                    $scope.bookData = data.docs;
                })
                .error(function(error) {
                    $scope.status = 'Unable to load data: ' + error.message;
                });
        }

        this.clearBooks = function() {
            $scope.bookData = {};
        }

    });
