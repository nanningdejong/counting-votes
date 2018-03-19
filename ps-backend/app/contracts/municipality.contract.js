var config = require('../../config.json');
var MunicipalityJson = require('./abi/Municipality.json');
var Web3 = require('web3');
var MunicipalityAbi = MunicipalityJson.abi;

var web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
var municipality = new web3.eth.Contract(MunicipalityAbi, config.blockchain.municipalityAddress);

module.exports.reconnect = function () {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.provider));
    municipality = new web3.eth.Contract(MunicipalityAbi, config.blockchain.municipalityAddress);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {uint}
 */
module.exports.getYes = function (callback) {
    municipality.methods.getYes().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getNo = function (callback) {
    municipality.methods.getNo().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getBlank = function (callback) {
    municipality.methods.getBlank().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getInvalid = function (callback) {
    municipality.methods.getInvalid().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {string} qrCodeHash 
 * @param {function(any,any)} callback 
 * @returns {boolean}
 */
module.exports.userVoted = function (qrCodeHash, callback) {
    municipality.methods.userVoted(qrCodeHash).call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int}
 */
module.exports.getRecounts = function (callback) {
    municipality.methods.getRecounts().call({ from: config.blockchain.owner.address }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {boolean}
 */
module.exports.isValid = function (callback) {
    municipality.methods.isValid().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.getPastEvents = function (callback) {
    municipality.getPastEvents('allEvents', { fromBlock: 0 }, callback);
}

/**
 * Queries for the VoterCleared event for a defined polling card.
 * @param {function(error, result)} callback 
 */
module.exports.getVoterClearedEvents = function (callback) {
    municipality.getPastEvents('VoterCleared', { fromBlock: 0 }, callback);
}

/**
 * Set a trigger to fire uppon an event.
 * @param {string} eventName 
 * @param {function(error,result)} callback 
 */
module.exports.setTrigger = function (eventName, callback) {
    var event = municipality.events[eventName](null, { fromBlock: 0, }, callback);
}
/**
 * Gets the mayor Sign In Events in a row
 * @param {function(any,any)} callback 
 */
module.exports.getMayorSignedInEvent = function (callback) {
    municipality.getPastEvents('MayorSignedIn', { fromBlock: 0 }, callback);
}
/**
 * Gets an array of UserAdded events
 * @param {function(any,any)} callback 
 */
module.exports.getUserAddedEvent = function (callback) {
    municipality.getPastEvents('UserAdded', { fromBlock: 0 }, callback);
}

module.exports.getRole = function (callerAddress, callback) {
    municipality.methods.getRole().call({ from: callerAddress }, callback);
}

/**
 * 
 * @param {function(any,any)} callback 
 * @returns {int scannedPollingCards, int registeredVoterPasses, int scannedPowerOfAttorneys, int registeredPowerOfAttorneys, int registeredObjections, int collectedPollingCards, int collectedVoterPasses, int collectedPowerOfAttorneys}
 */
module.exports.getSummary = function (callback) {
    municipality.methods.getSummary().call({ from: config.blockchain.owner.address }, callback);
}

module.exports.getVoteCountedEvents = function (callback) {
    municipality.getPastEvents('VoteCounted', { fromBlock: 0 }, callback);
}

module.exports.getVoterClearedEvent = function (callback) {
    municipality.once('VoterCleared', { fromBlock: 0 }, callback);
}