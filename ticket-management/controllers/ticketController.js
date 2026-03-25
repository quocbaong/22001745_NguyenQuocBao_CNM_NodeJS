const ticketModel = require('../models/ticketModel');
const { s3 } = require('../config/aws');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const calculateAmounts = (ticket) => {
    const quantity = parseInt(ticket.quantity);
    const pricePerTicket = parseFloat(ticket.pricePerTicket);
    const totalAmount = quantity * pricePerTicket;
    let finalAmount = totalAmount;
    let isDiscounted = false;

    if (ticket.category === 'VIP' && quantity >= 4) {
        finalAmount = totalAmount * 0.9;
        isDiscounted = true;
    } else if (ticket.category === 'VVIP' && quantity >= 2) {
        finalAmount = totalAmount * 0.85;
        isDiscounted = true;
    }

    return { totalAmount, finalAmount, isDiscounted };
};

const validateTicket = (ticket) => {
    const errors = [];
    if (parseInt(ticket.quantity) <= 0) errors.push('Quantity must be greater than 0');
    if (parseFloat(ticket.pricePerTicket) <= 0) errors.push('Price must be greater than 0');
    if (new Date(ticket.eventDate) < new Date().setHours(0,0,0,0)) errors.push('Event date cannot be in the past');
    if (!['Standard', 'VIP', 'VVIP'].includes(ticket.category)) errors.push('Invalid category');
    return errors;
};

module.exports = {
    listTickets: async (req, res) => {
        try {
            const { search, status } = req.query;
            const tickets = await ticketModel.getAll({ search, status });
            res.render('index', { tickets, search, status });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching tickets');
        }
    },

    showAddForm: (req, res) => {
        res.render('add', { errors: [] });
    },

    addTicket: async (req, res) => {
        try {
            const errors = validateTicket(req.body);
            if (errors.length > 0) {
                return res.render('add', { errors, data: req.body });
            }

            const { totalAmount, finalAmount, isDiscounted } = calculateAmounts(req.body);
            const ticketId = uuidv4();
            let imageUrl = '';

            if (req.file) {
                const fileExtension = path.extname(req.file.originalname);
                const fileName = `${ticketId}${fileExtension}`;
                const uploadParams = {
                    Bucket: S3_BUCKET_NAME,
                    Key: fileName,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };
                await s3.send(new PutObjectCommand(uploadParams));
                imageUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            }

            const newTicket = {
                ticketId,
                ...req.body,
                totalAmount,
                finalAmount,
                isDiscounted,
                imageUrl,
                createdAt: new Date().toISOString()
            };

            await ticketModel.create(newTicket);
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error adding ticket');
        }
    },

    showEditForm: async (req, res) => {
        try {
            const ticket = await ticketModel.getById(req.params.id);
            if (!ticket) return res.status(404).send('Ticket not found');
            res.render('edit', { ticket, errors: [] });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching ticket');
        }
    },

    updateTicket: async (req, res) => {
        try {
            const errors = validateTicket(req.body);
            if (errors.length > 0) {
                return res.render('edit', { ticket: { ...req.body, ticketId: req.params.id }, errors });
            }

            const { totalAmount, finalAmount, isDiscounted } = calculateAmounts(req.body);
            let imageUrl = req.body.currentImageUrl;

            if (req.file) {
                const fileName = `${req.params.id}${path.extname(req.file.originalname)}`;
                const uploadParams = {
                    Bucket: S3_BUCKET_NAME,
                    Key: fileName,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };
                await s3.send(new PutObjectCommand(uploadParams));
                imageUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            }

            const updatedTicket = {
                ...req.body,
                totalAmount,
                finalAmount,
                isDiscounted,
                imageUrl
            };
            delete updatedTicket.currentImageUrl;

            await ticketModel.update(req.params.id, updatedTicket);
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating ticket');
        }
    },

    deleteTicket: async (req, res) => {
        try {
            const ticket = await ticketModel.getById(req.params.id);
            if (ticket && ticket.imageUrl) {
                const urlParts = ticket.imageUrl.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const deleteParams = {
                    Bucket: S3_BUCKET_NAME,
                    Key: fileName
                };
                await s3.send(new DeleteObjectCommand(deleteParams));
            }
            await ticketModel.delete(req.params.id);
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting ticket');
        }
    },

    showDetail: async (req, res) => {
        try {
            const ticket = await ticketModel.getById(req.params.id);
            if (!ticket) return res.status(404).send('Ticket not found');
            res.render('detail', { ticket });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching ticket details');
        }
    }
};
