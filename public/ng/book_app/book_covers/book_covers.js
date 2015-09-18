angular.module('bookCovers', [])
    .factory('OpenLibrary', function($http) {
        var urlBase = 'https://openlibrary.org/search.json?';
        var data = {};

        data.searchBooks = function(key, value) {
            return $http.get(urlBase+key+'='+value, {headers: {'Content-Type': 'application/json'}});
        };

        return data;
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
            return $http.put(urlBase+'/'+book.isbn);
        };

        dataFactory.deleteBook = function(book) {
            return $http.delete(urlBase+'/'+book.isbn);
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
            console.log(book.toSource());
            return $http.post(urlbase, book);
        };

        dataFactory.updateBook = function(book) {
            return $http.put(urlbase+'/'+book.lccn[0], book);
        };

        dataFactory.deleteBook = function(book) {
            return $http.delete(urlbase+'/'+book.lccn[0]);
        };
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
                        if (attributes.srcFallback === '') {
                            attributes.$set('src', 'blank_cover.jpg');
                        }
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
                            } else {
                                attributes.$set('src', 'http://covers.openlibrary.org/b/lccn/'+arr[index+1]+'-M.jpg?default=false');
                                attributes.$set('srcIndex', index+1);
                            }
                        });
                    },
                    post: function(scope, element, attributes) {
                        attributes.$observe('src', function(newValue) {
                            scope.book.img = {}
                            scope.book.img = newValue;
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
    .controller('BookCoversController', function($scope, OpenLibrary, ToReadApi) {

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

    })
    .controller('PopupController', function($scope, ToReadApi) {
        this.addToDb = {
            title: $scope.book.title_suggest,
            author: $scope.book.author_name,
            year_published: $scope.book.first_publish_year,
            isbn: $scope.book.isbn[0],
            img: $scope.book.img,
            notes: 'Add your notes here!',
        };

        this.post = function() {
            this.addToDb.img = $scope.book.img;
            ToReadApi.postBook(this.addToDb)
            .success(function(data){

                alert('Posted to DB!');
                $scope.bookData = {};
                $scope.isVisible = false;
            })
            .error(function(err){
                alert('Did not post');
            });

            $scope.bookData = {};
        }

    })
    .controller('ToReadListController', function($scope, ToReadApi) {
        $scope.toReadList = null;
        $scope.$watch('bookData', function(newValue, oldValue) {
            ToReadApi.getList().success(function(data){
                $scope.toReadList = data;
            }).error(function(err) {
                console.log('Error: '+err);
            });
        })
    });
