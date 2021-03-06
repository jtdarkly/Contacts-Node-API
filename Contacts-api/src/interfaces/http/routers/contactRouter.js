'use strict';

const router = require('express').Router({ mergeParams: true });


// errors
const onlyTheseMethods = require('../errors/onlyTheseMethods');
// sanitizers and validaters
const {
  bodySanitizerDeep,
} = require('../middleware/soapFactory');

/**
 * Use by validators
 * @type {Array}
 * */
const publicParams = [
  'names',
  'addresses',
];

/**
 * Use by validators
 * @type {Array}
 * */
const publicParamsNames = [
  'honorific',
  'firstName',
  'middleName',
  'lastName',
  'primary',
];

/**
 * Use by validators
 * @type {Array}
 * */
const publicParamsAddresses = [
  'primary',
  'addressL1',
  'addressL2',
  'city',
  'state',
  'zipcode',
  'country',
];


/**
 * Subrouter for Entries
 */

function createRouter(controller, nameRouter, addressRouter) {
  // controllers
  const {
    validateContactId,
    createContact,
    retrieveAll,
    retrieveContact,
    retrieveContactPrimary,
    deleteContact,
  } = controller;

  router.param('contactId', validateContactId);

  router.use(bodySanitizerDeep(publicParams[0], publicParamsNames));
  router.use(bodySanitizerDeep(publicParams[1], publicParamsAddresses));

  router.route('/')
    .get(retrieveAll)
    .post(createContact)
    .all(onlyTheseMethods('GET, POST'));

  router.route('/:contactId')
    .get(retrieveContact)
    .delete(deleteContact)
    .all(onlyTheseMethods('GET, DELETE'));

  router.route('/:contactId/primary')
    .get(retrieveContactPrimary)
    .all(onlyTheseMethods('GET'));

  router.use('/:contactId/names', nameRouter);
  router.use('/:contactId/addresses', addressRouter);

  return router;
}
module.exports = createRouter;
