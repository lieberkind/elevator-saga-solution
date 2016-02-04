{
    init: function(elevators, floors) {
        var BOTTOM_FLOOR = 0;
        var TOP_FLOOR = _.last(floors).floorNum();

        _.each(elevators, function(elevator) {
            elevator.on('passing_floor', function(floorNum, direction) {
                var shouldStop = 
                    shouldPickUp(elevator, floorNum, direction) ||
                    shouldDropOff(elevator, floorNum);

                if (shouldStop) {
                    elevator.goToFloor(floorNum, true);
                }
            });

            elevator.on('stopped_at_floor', function(floorNum) {
                if (floorNum === TOP_FLOOR) {
                    goToBottomFloor(elevator);
                }

                if (floorNum === BOTTOM_FLOOR) {
                    goToTopFloor(elevator);
                }
            });
        });

        function shouldPickUp(elevator, floorNum, direction) {
            return elevator.destinationDirection() === direction &&
            floors[floorNum].buttonStates[direction] === "activated" &&
            elevator.loadFactor() < 1;
        }

        function shouldDropOff(elevator, floorNum) {
            return _.indexOf(elevator.getPressedFloors(), floorNum) > -1;
        }

        function continueUp(elevator, floorNum) {
        }

        function continueDown(elevator, floorNum) {
        }

        function goToTopFloor(elevator) {
            elevator.goToFloor(TOP_FLOOR);
            elevator.goingUpIndicator(true)
            elevator.goingDownIndicator(false);
        }

        function goToBottomFloor(elevator) {
            elevator.goToFloor(BOTTOM_FLOOR);
            elevator.goingUpIndicator(false)
            elevator.goingDownIndicator(true);
        }
    },
    update: function(dt, elevators, floors) {}
}
