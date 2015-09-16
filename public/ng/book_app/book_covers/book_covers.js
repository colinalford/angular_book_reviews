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
                        if (attributes.srcFallback === '') {
                            attributes.$set('src', 'blank_cover.jpg');
                        }
                    },
                    post: function(scope, element, attributes) {
                        if (attributes.src === 'blank_cover.jpg') {
                            var prev = element.parent().parent();
                            var container = element.parent();
                            prev.append(container);
                        }
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
    .controller('AddPopupController', function($scope) {
        
    })
    .controller('BookCoversController', function($scope, OpenLibrary) {

        this.bookData;
        this.status;

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

    });
