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
            elevator.on("idle", function() {});
            
            elevator.on('floor_button_pressed', function(floorNum) {
                elevator.goToFloor(floorNum);
            });

            elevator.on('passing_floor', function(floorNum, direction) {
                if(elevator.getPressedFloors().indexOf(floorNum) > -1) {
                    elevator.goToFloor(floorNum, true);
                }
            });

            elevator.on('stopped_at_floor', function(floorNum) {
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
