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
var utils = require('../common/utils');
var countingData = require('../data/counting.data');
var pollingStationService = require('../services/pollingstation.service');
var Queue = require('better-queue');

var counter = new Queue(function (task, cb) {

    var option = task.option;
    var wallet = task.wallet;
    var response = task.response;

    function trySendResponse(response, status, message) {
        cb();
        try {
            response.status(status).json({ message: message });
        } catch (err) {
            console.log(err);
        }

    }

    pollingStationService.recordVote(option, (new Date()).getTime().toString(), wallet, function (data) {
        if (data.status) {
            pollingStationService.getVoteCounted(function (error, event) {
                if (event && event.returnValues && event.returnValues.message) {
                    trySendResponse(response, 200, `vote ${option} recorded`);
                }
            });
            setTimeout(() => {
                trySendResponse(response, 422, `failed to record vote option ${option} please try again. Error: timeout`);
            }, 30 * 1000);
        }
        else {
            trySendResponse(response, 422, `failed to record vote option ${option} please try again. Error: ${data.message}`);
        }
    });
});

module.exports = function (app) {
    /**
     * Records a vote transaction and keep it waiting for the confirmation
     * from the block.
     * At this moment the transaction is kept waiting, otherwise the
     * webservice will throw a 422 exception.
     */
    app.post('/counting/vote', async function (req, res) {
        counter.push({ wallet: req.user.wallet, option: req.body.option, response: res });
    });

    app.get('/counting/canfinish', function (req, res) {
        var ct = counter;
        if (counter.length == 0) {
            res.json({ message: 'ok' });
        }
        else {
            res.status(422).json({ message: 'please wait the the counting process finish before continuing ' });
        }

    });
}