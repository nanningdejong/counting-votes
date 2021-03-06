/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
var config = require('../../config.json');
var utils = require('../common/utils.js');
var routerContract = require('../contracts/router.contract');

module.exports.initializeConfig = function (host, owner, pollingStationAddress, municipalityAddress, userActivationAddress, routerAddress) {
    var promise = new Promise(function (resolve, reject) {

        var isResolved = true;
        var isPollingStationResolved = true;
        var isMunicipalityResolved = true;
        var isUserActivationResolved = true;

        let computerName = utils.getComputerName().replace("PS", "");

        if (host) {
            config.blockchain.provider = `ws://${host}`;
            config.blockchain.httpProvider = `http://${host}`;
        }

        if (owner) {
            config.blockchain.owner = owner;
        }

        config.blockchain.pollingStationId = computerName;

        if (routerAddress) {
            config.blockchain.routerAddress = routerAddress;
        }

        if (pollingStationAddress) {
            config.blockchain.pollingStationAddress = pollingStationAddress;
        } else {
            isResolved = false;
            isPollingStationResolved = false;
            routerContract.getPollingStationAddress(computerName, function (_err, _data) {
                config.blockchain.pollingStationAddress = _data;
                isPollingStationResolved = true;
                if (isPollingStationResolved && isMunicipalityResolved && isUserActivationResolved) resolve();
            });
        }

        if (municipalityAddress) {
            config.blockchain.municipalityAddress = municipalityAddress;
        } else {
            isResolved = false;
            isMunicipalityResolved = false;
            routerContract.getMunicipalityAddress(computerName, function (_err, _data) {
                config.blockchain.municipalityAddress = _data;
                isMunicipalityResolved = true;
                if (isPollingStationResolved && isMunicipalityResolved && isUserActivationResolved) resolve();
            });
        }

        if (userActivationAddress) {
            config.blockchain.userActivationAddress = userActivationAddress;
        } else {
            isResolved = false;
            isUserActivationResolved = false;
            routerContract.getUacAddress(computerName, function (_err, _data) {
                config.blockchain.userActivationAddress = _data;
                isUserActivationResolved = true;
                if (isPollingStationResolved && isMunicipalityResolved && isUserActivationResolved) resolve();
            });
        }

        if (isResolved) {
            resolve();
        }
    });

    return promise;
}