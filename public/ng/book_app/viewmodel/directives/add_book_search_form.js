angular.module('books', [])
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
    });


angular.module('addBookSearchForm', [])
    .directive('aAddBookSearchForm', function() {
        return {
            restrict: 'EA',
            scope: {
                books: '='
            },
            templateUrl: '/ng/book_app/views/partials/add_book_search_form.html',
            replace: true,
            controller: 'AddBookSearchFormController',
            controllerAs: 'controller',
            bindToController: true
        };
    })
    .controller('AddBookSearchFormController', function() {

    });
