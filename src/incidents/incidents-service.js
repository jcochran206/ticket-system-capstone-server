const incidentService = {
    //relevant
    getIncidents(db) {
        return db
            .from('incidents')
            .select(
                'incidents.id',
                'incidents.title',
                'incidents.comments',
                'incidents.users_id',
                'incidents.inc_pri',
                'incidents.office_location'
            )
    },
    getIncidentById(db, incident_id) {
        return db
            .from('incidents')
            .select(
                'incidents.id',
                'incidents.title',
                'incidents.comments',
                'incidents.users_id',
                'incidents.inc_pri',
                'incidents.office_location',
            )
            .where('incidents.id', incident_id)
            .first()
    },
    //relevant
    insertIncident(db, newIncident) {
        return db
            .insert(newIncident)
            .into('incidents')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateIncident(db, id, newIncident) {
        return db('incidents')
            .where({
                id: id
            })
            .update(newIncident, returning = true)
            .returning('*')
    },
    //relevant
    deleteIncident(db, id) {
        return db('incidents')
            .where({
                'id': id
            })
            .delete()
    }
}

module.exports = incidentService
