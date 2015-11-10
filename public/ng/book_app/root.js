angular.module('book_app', ['ngResource','bookCovers']);
angular.module('bookCovers', [])
.run(function($rootScope) {
    $rootScope.bookData = [];
    $rootScope.selectedBook = {};
})
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
        return $http.put(urlBase+'/'+book.isbn, book);
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
        return $http.get(urlBase);
    };

    dataFactory.postBook = function(book) {
        console.log(book.rating, book.review);
        return $http.post(urlBase, book);
    };

    dataFactory.updateBook = function(book) {
        return $http.put(urlBase+'/'+book.isbn, book);
    };

    dataFactory.deleteBook = function(book) {
        return $http.delete(urlBase+'/'+book.isbn);
    };

    return dataFactory;
})
.directive('srcFallback', function() {
    return {
        restrict: 'A',
        compile: function(tElem, tAttrs) {
            return {
                pre: function(scope, element, attributes) {
                    if (attributes.srcFallback === '') {
                        attributes.$set('src', 'assets/book_stack.png');
                    }
                    if (attributes.src === 'assets/book_stack.png') {
                        var prev = element.parent().parent();
                        var container = element.parent();
                        prev.append(container);
                    }
                    element.bind('load', function() {
                        scope.book.img = attributes.src;
                        attributes.$observe('src', function(newValue) {
                            scope.book.img = {}
                            scope.book.img = newValue;
                        });
                    });
                    element.bind('error', function() {
                        var arr = JSON.parse(attributes.srcFallback);
                        var index = JSON.parse(attributes.srcIndex);
                        if (index > arr.length) {
                            attributes.$set('src', 'assets/book_stack.png');
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
                    scope.book.isbn = scope.book.isbn[0];
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
.controller('BookCoversController', function($scope, $rootScope, OpenLibrary) {
    $rootScope.bookSearchDataIsVisible = false;

    this.newSearch = {
        type: 'author',
        params: 'stephen king'
    };

    this.getBooks = function(search) {
        var type = search.type;
        var params = search.params;

        OpenLibrary.searchBooks(type, params)
            .success(function(data) {
                $rootScope.bookData = data.docs;
                $rootScope.bookSearchDataIsVisible = true;

            })
            .error(function(error) {
                console.log(error);
                $scope.status = 'Unable to load data: ' + error.message;
            });
    };

    this.clearBooks = function() {
        $rootScope.bookData = [];
        $rootScope.bookSearchDataIsVisible = false;
        $rootScope.addBookIsVisible = false;
        $rootScope.selectedBook = null;

    };

    this.selected = function(book) {
        $rootScope.selectedBook = book;
        $rootScope.addBookIsVisible = true;
    };
})
.controller('AddBookController', function($scope, $rootScope, ToReadApi) {

    $rootScope.addBookIsVisible = false;

    $rootScope.$watch('selectedBook', function() {
        if ($rootScope.selectedBook === {}) {
            $rootScope.addBookIsVisible = true;
        }
    });

    this.post = function(book) {
        var sendBook = {
            isbn: book.isbn,
            title: book.title_suggest,
            author: book.author_name,
            year_published: book.first_publish_year,
            notes: book.notes,
            img: book.img
        }
        ToReadApi.postBook(sendBook)
        .success(function(data) {
            alert('Posted to db!');
            $rootScope.selectedBook = {};
            $rootScope.bookData = [];
            $rootScope.bookSearchDataIsVisible = false;
            $rootScope.addBookIsVisible = false;
        })
        .error(function(err) {
            console.log(err);
        });
    };

    this.cancel = function() {
        $rootScope.addBookIsVisible = false;
        $rootScope.selectedBook = {};
    };
})
.controller('ToReadListController', function($scope, $rootScope, ToReadApi, ReviewedApi) {

    this.newReview = {};
    this.rating = '';
    this.review = '';
    this.isVisible = false;

    $rootScope.$watch('bookData', function(){
        ToReadApi.getList()
        .success(function(data) {
            $rootScope.toreadlist = data;
            for (book in $rootScope.toreadlist) {
                $rootScope.toreadlist[book].checked = false;
            };
        })
        .error(function(err) {
            console.log(err);
        });
    });

    this.revealAddReview = function(book) {
        $scope.isVisible = true;

        $scope.newReview = {
            isbn: book.isbn,
            author: book.author,
            title: book.title,
            year_published: book.year_published,
            notes: book.notes,
            img_url: book.img_url,
            review: '',
            rating: ''
        };
    };

    this.addReview = function() {
        $scope.newReview.rating = $scope.rating;
        $scope.newReview.review = $scope.review;
        ReviewedApi.postBook($scope.newReview)
        .success(function(data) {
            ToReadApi.deleteBook($scope.newReview)
            .success(function(data) {
                $rootScope.bookData = [];
                $scope.newReview = {}
                $scope.isVisible = false;
            })
            .error(function(data) {
                console.log(data);
            })
        })
        .error(function(){
            console.log(err);
        });
    }

    this.cancelReview = function() {
        $scope.newReview = {};
        $scope.isVisible = false;
        $scope.rating = '';
        $scope.review = '';
    }
})
.controller('AddBookReviewController', function() {

})
.controller('ReviewedListController', function($scope, $rootScope, ToReadApi, ReviewedApi) {
    $rootScope.$watch('toreadlist', function() {
        ReviewedApi.getList()
        .success(function(data) {
            $rootScope.reviewedlist = data;
        })
        .error(function(err) {
            console.log(err);
        });
    });
});
