'use strict'
// Postgresデータベースへのアクセスレイヤーとして機能 Sequelize
const Sequelize = require('sequelize');

class ToDoItem extends Sequelize.Model { }

const initSequelize = function (config) {

    var sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.server,
        dialect: 'postgres',
        define: {
            freezeTableName: true,
            timestamps: false
        }
    });
    // Sequelizeがコード内のモデルに名前を付ける方法をより細かく制御 freezeTabName
    // Postgresのを使用していることSequelizeを伝える dialect

    // Itemノードアプリケーションのデータベースからモデルを定義
    ToDoItem.init({
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        iscomplete: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        created_at: {
            type: TIMESTAMP
        },
        updated_at: {
            tape: TIMESTAMP
        }
    },
        {
            sequelize,
            tableName: 'item'
        });
}

// Sequelizeを設定したら、リポジトリ機能を実装してSequelizeを
// 利用してデータベース操作を実行できます。javascriptObject.createメソッドは
// 公開された関数を宣言します
// var sequelize = initSequelize(config);
// Object.create({
//   disconnect,
//   createToDoItem,
//   getAllIncompleteToDoItems,
//   markAsComplete
// });
// };
// もちろん、これらの関数は定義されていないと使用できないので、
// リポジトリ関数を変更して、Sequelizeを使用してこれらのメソッドを実装
const repository = function (config) {

    var sequelize = initSequelize(config);

    const disconnect = function () {
        sequelize.close();
    }

    const createToDoItem = function (title, description) {

        return ToDoItem.create(
            {
                title: title,
                description: description,
                iscomplete: false
            });
    }

    const markAsComplete = function (id) {
        return ToDoItem.update(
            {
                iscomplete: true
            },
            {
                where: {
                    id: id
                }
            });
    }

    const getAllIncompleteToDoItems = function () {
        return ToDoItem.findAll({
            where: {
                iscomplete: false
            }
        });
    }

    return Object.create({
        disconnect,
        createToDoItem,
        getAllIncompleteToDoItems,
        markAsComplete
    });

}
// 上記の関数は、次のToDoItemsを変更する一般的な方法、
// を提供 update、create、delete、とfindAll。Sequelize関数は、
// where選択したオプション、updateオプション、およびwhere句の情報を
// 伝達できるオブジェクトを受け取ります
// ToDoItem
// Sequelizeはpromiseベースであるため、この関数はpromiseを返します。
// の真のリストを取得するには、サービスレイヤーでPromiseを解決できるようにする必要があります
const connect = function (connection) {
    return new Promise(function (resolve, reject) {
        if (!connection) {
            reject(new Error("Error connecting to Db"));
        }

        resolve(repository(connection));
    });
}

module.exports = Object.assign({}, { connect });
