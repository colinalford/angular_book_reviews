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
});
