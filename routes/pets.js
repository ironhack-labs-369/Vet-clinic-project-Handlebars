const router = require('express').Router();
const { loginCheck } = require('../middlewares/middlewares');
const User = require('../models/User');
const Pet = require('../models/Pet');

// @desc      Get all pets
// @route     GET /pets
// @access    Private
router.get('/pets', (req, res, next) => {
    User.find()
        .populate('owner')
        .then((owners) => {
            Pet.find()
                .then((pets) => {
                    res.render('pets/index', { pets, owners });
                })
                .catch((err) => {
                    console.log(err);
                    next(err);
                });
        });
});

// @desc      Show add pet
// @route     GET /users/add
// @access    Private
router.get('/pets/add', (req, res) => {
    User.find()
        .populate('owner')
        .then((owners) => {
            res.render('pets/add', { owners });
        });
});

// @desc      Get pet details
// @route     GET /pets/:id
// @access    Private
router.get('/pets/:id', (req, res, next) => {
    console.log('req.params', req.params.id);

    Pet.findById(req.params.id).then((pet) => {
        console.log('pet', pet);
        User.find(pet.owner)
            .populate('owner')
            .then((owner) => {
                console.log('owner of the pet', owner[0]);
                res.render('pets/show', { pet, owner: owner[0] });
            })
            .catch((err) => {
                next(err);
            });
    });
});

// @desc      Add pet
// @route     POST /pets/add
// @access    Private
router.post(
    '/pets/add',
    // loginCheck,

    (req, res, next) => {
        const { name, type, age, diagnosis, treatment, owner } = req.body;

        const query = { _id: req.params.id };
        console.log('req.params', req.params);

        if (req.user.role !== 'employee') {
            query.owner = req.user._id;
        } else {
            query.owner = owner._id;
        }
        console.log('query', query);

        Pet.create({
            name,
            type,
            age,
            diagnosis,
            treatment,
            owner: query.owner,
        })
            .then((pet) => {
                console.log('pet added', pet);
                res.redirect('/pets');
            })
            .catch((err) => {
                next(err);
            });
    }
);

module.exports = router;