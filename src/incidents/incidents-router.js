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
    .post(jsonParser, (req, res, next) => {
        const { title, comments, users_id, inc_pri, office_location } = req.body;
        
        console.log('title:', title, "comments:", comments, "users_id:", users_id, "priority:", inc_pri, "office_location:", office_location)

        for (const field of ['title', 'comments', 'users_id', 'inc_pri', 'office_location' ])
            if(field === null)
                return res.status(400).json({
                    error: {
                        message: `Missing ${field} in request`
                    }
            })
            const newIncident = {title, comments, users_id, inc_pri, office_location};
            incidentService.insertIncident(
                req.app.get('db'),
                newIncident
            )
            .then(incident => {
                res
                .status(201)
                .location('/incidents/:id')
                .json(serializeIncidents(incident))
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
//update route
    .put(jsonParser, (req, res, next) => {
        const {
            
            title,
            comments,
            users_id,
            inc_pri,
            office_location
        } = req.body
        const incidentToUpdate = {
            
            title,
            comments,
            users_id,
            inc_pri,
            office_location
        }

        const numberOfValues = Object.values(incidentToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        incidentService.updateIncident(
                req.app.get('db'),
                req.params.id,
                incidentToUpdate
            )
            .then(updatedIncident => {
                res.status(200).json(serializeIncidents(updatedIncident[0]))
            })
            .catch(next)
    })
    //delete route
    .delete((req, res, next) => {
        incidentService.deleteIncident(
                req.app.get('db'),
                req.params.id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
module.exports = incidentRouter