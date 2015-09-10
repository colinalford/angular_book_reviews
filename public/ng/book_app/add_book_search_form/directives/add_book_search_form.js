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
                    bookInfo[i]['lccn'] = response.docs[i]['lccn'];
                }
                for (i in bookInfo) {
                    var container = document.createElement('div');
                    container.className = 'cover-preview';
                    preview.appendChild(container);

                    var len = bookInfo[i]['lccn'].length;
                    var j = 0;

                    // Add image. If image 404s, use next lccn. If all 404, use replacement image
                    for (j in bookInfo[i]['lccn']) {
                        var img = new Image(280, 200);
                        img.src = "http://covers.openlibrary.org/b/lccn/"+bookInfo[i]['lccn'][j]+"-M.jpg?default=false";
                        img.onerror = function() {
                            this.parentNode.removeChild(this);
                        };

                        container.appendChild(img);

                    }

                }
            });
        };

            /*if (type === 'isbn') {
                var data = GetBook.getBook({bibkeys:'ISBN:'+params});
                data.$promise.then(function(res) {
                    var info = JSON.stringify(res);
                    if(info === '{}') {
                        alert('No book found');
                    } else {
                        this.book = res['ISBN:'+params];
                        console.log(this.book);


                    }
                });
            }
                $http.get('https://openlibrary.org/search.json?'+type+'='+params, {headers: {'Content-Type': 'application/json'}})
                .success(function(response) {
                    var bookInfo = {};
                    bookInfo['lccn'] = [];
                    for (i in response.docs) {
                        bookInfo['title'] = response.docs[i]['title_suggest'];
                        bookInfo['author'] = response.docs[i]['author_name'];
                        bookInfo['year'] = response.docs[i]['first_published_year'];
                        bookInfo['lccn'].push(response.docs[i]['lccn']);
                    }
                    console.log(bookInfo.toSource());
                });

                    function(response) {
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
                                    span.innerHTML = keys[i][0];
                                    span.style.width = '280px';
                                    span.style.height = '280px';
                                    preview.appendChild(span);
                                }
                            }

                        } else {
                            var img = document.createElement('img');
                            img.src = "http://covers.openlibrary.org/b/lccn/"+keys[i][1]+"-M.jpg";
                            preview.appendChild(img);
                        }

                    }
                } );
            }
        };*/

        this.cancel = function(){
            preview.innerHTML = '';
        }

    });
