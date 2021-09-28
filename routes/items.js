// リストと新しいアイテムの作成のためのルーティングロジック
// アイテムを管理するためのホームページとサーバーの呼び出しは、
// アイテムのルートによって制御されます。以下に、必要な通話用に設定されたルートを示します
// これにより、提供される2つのページに2つのルートが登録される
// createとhomeを作成し、2つのpostメソッドを設定します。1つは
// ユーザーが入力した新しいアイテムを作成し、もう1つはユーザーがアイテムを
// 完了としてマークできるようにします
// Sequelizeはpromiseベースです。を呼び出すとgetAllIncompleteItems、
// promiseが返されます。thenpromiseを呼び出すことによりitems、
// コールバック関数で結果（のリスト）を解決してフックすることができます。
// この場合、home.pugコンテンツのレンダリングに使用するモデルの一部がアイテムを提供
'use strict'

const status = require('http-status')

module.exports = function (app, options) {

    const { repo } = options;
    const basepath = '';

    app.get(basepath, ensureAuthenticated, function (request, response) {

        repo.getAllIncompleteToDoItems().then(items => {
            response.render("home", {
                user: request.userContext.userinfo,
                items: items
            });
        })
            .catch(err => {
                response.render("error");
            })
    })

    app.get(basepath + '/create', ensureAuthenticated, function (request, response) {
        response.render("create");
    })

    app.post(basepath + '/items/create', ensureAuthenticated, function (request, response) {

        repo.createToDoItem(request.body.title, request.body.description)
            .then(data => {
                response.redirect('/');
            })
            .catch(err => {
                response.render("error");
            })
    });

    app.post(basepath + '/items/complete', ensureAuthenticated, function (request, response) {

        repo.markAsComplete(request.body.id)
            .then(data => {
                response.redirect('/');
            })
            .catch(err => {
                response.render("error");
            })
    });

    function ensureAuthenticated(request, response, next) {
        if (!request.userContext) {
            return response.status(401).redirect('../users/index');
        }

        next();
    }
}