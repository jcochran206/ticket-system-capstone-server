const userService = {
    //relevant
    getUsers(db) {
        return db
            .from('users')
            .select(
                'users.userid',
                'users.username',
                'users.pwd',
                'users.email',
            )
    }, 
    getUsersById(db, userid) {
        return db
            .from('users')
            .select(
                'users.userid',
                'users.username',
                'users.pwd',
            )
            .where('users.userid', userid)
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
    updateUser(db, userid, newUser) {
        return db('users')
            .where({
                id: userid
            })
            .update(newUser, returning = true)
            .returning('*')
    },
    //relevant
    deleteUser(db, userid) {
        return db('users')
            .where({
                'id': userid
            })
            .delete()
    }
}

module.exports = userService