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
module.exports = function () {
    let contract = require('../contracts/polling.station.contract');
    contract.setTrigger('allEvents', function (err, result) {
        console.log('pollingstation.sol trigger raised');
        if (err) {
            console.log(err.reason);
            return;
        }
        if (result)
            console.log(result);
    });
}