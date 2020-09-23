const path = require('path')
const express = require('express')
const xss = require('xss')
const incidentService = require('./incidents-service')
const { insertIncident } = require('./incidents-service');

const incidentRouter = express.Router();
const jsonParser = express.json();

const serializeIncidents = incident => ({
    id: incident.id,
    title: incident.title,
    comments: incident.comments,
    users_id: incident.users_id,
    priority: incident.inc_pri,
    office_location: incident.office_location,
})

incidentRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        incidentService.getIncidents(knexInstance)
            .then(incidents => {
                res.json(incidents.map(serializeIncidents))
            })
            .catch(next)
    })


//get incidents by id route
incidentRouter
    .route('/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        incidentService.getIncidentById(req.app.get('db'), id)
            .then(id => {
                if (!id) {
                    return res
                        .status(404)
                        .send({ error: { message: `User doesn't exist.` } })
                }
                res.id = id
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeIncidents(res.id))
    })
module.exports = incidentRouter