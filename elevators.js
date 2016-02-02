{
    init: function(elevators, floors) {
        // var elevator = elevators[0]; // Let's use the first elevator

        function leastBusyElevator() {
            return elevators.reduce(function(leastBusyElevator, elevator) {
                return leastBusyElevator.destinationQueue.length < elevator.destinationQueue.length ?
                    leastBusyElevator :
                    elevator;
            }, elevators[0]);
        }

        floors.forEach(function(floor) {
            floor.on('up_button_pressed', function() {
                leastBusyElevator().goToFloor(floor.floorNum());
            });

            floor.on('down_button_pressed', function() {
                leastBusyElevator().goToFloor(floor.floorNum());
            });
        });

        // // Whenever the elevator is idle (has no more queued destinations) ...
        _.each(elevators, function(elevator) {

            elevator.goingUpIndicator(false);
            elevator.goingDownIndicator(false);

            elevator.on("idle", function() {});
            
            elevator.on('floor_button_pressed', function(floorNum) {
                elevator.goToFloor(floorNum);
            });

            elevator.on('passing_floor', function(floorNum, direction) {
                if(elevator.getPressedFloors().indexOf(floorNum) > -1) {
                    elevator.goToFloor(floorNum, true);
                }

                var pickUpWaitingPassenger = 
                    elevator.destinationDirection() === direction &&
                    floors[floorNum].buttonStates[direction] === "activated";

                if(pickUpWaitingPassenger) {
                    elevator.goToFloor(floorNum, true);
                }
            });

            elevator.on('stopped_at_floor', function(floorNum) {
                var direction;

                if (_.last(elevator.destinationQueue) > floorNum) {
                    direction = 'up';
                } else if (_.last(elevator.destinationQueue) < floorNum) {
                    direction = 'down';
                } else {
                    if(floors[floorNum].buttonStates.down === 'activated') {
                        direction = 'down';
                    } else {
                        direction = 'up';
                    }
                }

                switch (direction) {
                    case 'up':
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                        break;
                    case 'down':
                        elevator.goingUpIndicator(false);
                        elevator.goingDownIndicator(true);
                        break;
                }

                _.remove(elevator.destinationQueue, function(n) {
                    return floorNum === n;
                });
                elevator.checkDestinationQueue();
            });
        });

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
