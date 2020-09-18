const userService = {
    //relevant
    getUsers(db) {
        return db
            .from('users')
            .select(
                'users.userid',
                'users.username',
                'users.pwd',
            )
    }, 
    getUsersById(db, userid) {
        return db
            .from('users')
            .select(
                'users.id',
                'users.username',
                'users.pwd',
            )
            .where('users.id', userid)
            .first()
    },
    //relevant
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateUser(db, usersid, newUser) {
        return db('users')
            .where({
                id: usersid
            })
            .update(newUser, returning = true)
            .returning('*')
    },
    //relevant
    deleteUser(db, usersid) {
        return db('users')
            .where({
                'id': usersid
            })
            .delete()
    }
}

module.exports = userService