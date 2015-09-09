# Book Review App
This app is built with Angular and pulls data from the openlibrary API. It allows users to add books to their To Read list, then remove them and add reviews and a rating. The app is still heavily under construction.

The app is also an experiment in building with Angular and not using controllers. Using directives instead of controllers means each component on the web page has isolate scope, so it is easier to control what information is passed to which scope. By banning controls, you reduce prototypical inheritance and scope chaining and the corresponding confusion.

Angular code can be found at public/ng/book_app.
