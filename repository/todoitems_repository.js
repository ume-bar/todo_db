// Postgresデータベースへのアクセスレイヤーとして機能 Sequelize
var sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.server,
    dialect: 'postgres',
    define: {
        freezeTableName: true,
        timestamps: true
    }
});

// Sequelizeがコード内のモデルに名前を付ける方法をより細かく制御 freezeTabName
// Postgresのを使用していることSequelizeを伝える dialect
