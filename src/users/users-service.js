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
    insertPancake(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updatePancake(db, users_id, newUser) {
        return db('users')
            .where({
                id: users_id
            })
            .update(newUser, returning = true)
            .returning('*')
    },
    //relevant
    deletePancake(db, users_id) {
        return db('users')
            .where({
                'id': users_id
            })
            .delete()
    }
}

module.exports = userService