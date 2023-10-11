# Brainybot extension for Microsoft MakeCode

This repository is a MakeCode extension that adds blocks and functions for controlling an [ASR Brainybot](https://afterschoolrobotics.com/store/p/brainybot) robot. It is built on top of the the [BBC micro:bit target for MakeCode](https://github.com/microsoft/pxt-microbit).

The extension provides an extra "Brainybot" menu on the left-hand side of the MakeCode window. All new blocks are contained inside this menu.

## Head movement and sensors

To move the head, use the "set head to X degrees" statement block. Or the corresponding function:

```sig
bb.setHead(pos: number): void
```

Remember that 0 degrees means facing right, 90 degrees means facing forwards, and 180 degrees means facing left.

To use the head's ultrasonic sensor to sense a distance, use the "sense distance" reporter block. The distance is reported in inches.

```sig
bb.senseDistance(): number
```

## Ground sensors

To use the ground sensors to detect black or white markings under the robot, use one of the the "ground sensor X is black/white" boolean reporter blocks. The value of X can be the name of any of the 5 sensors: L2, L1, M, R1, or R2. When using typescript or python, use the namespace `bb.GroundSensor.` as a prefix for the ground sensor names.

```sig
bb.groundSensorIsBlack(sensor: GroundSensor): boolean
```

## Wheel movement

There are 3 ways to control the wheels of the robot.

* Simple movement blocks allow you to choose an exact distance or angle that you want to move or turn the robot.
* Advanced movement blocks let you set the actual speed of the wheels, and tell them how long to run for before stopping.
* The "forever" movement blocks are non-blocking: they allow you to set the wheels to move at the speed you choose, and the block immediately stops executing so that the next block will execute. But the wheels keep moving until you stop them.

### Simple version

There are statement blocks for moving the robot forward and backward, and for turning the robot left and right. When moving forward or backward, you choose a speed from 0 to 100 and a distance in inches. When turning, you choose a speed from 0 to 100 and an angle in degrees, so a 90 degree angle will be a right turn.

```sig
bb.goForward(dist: number, speed: number): void
```

```sig
bb.goBackward(dist: number, speed: number): void
```

```sig
bb.turnLeft(deg: number, speed: number): void
```

```sig
bb.turnRight(deg: number, speed: number): void
```

### Advanced version

Unlike the simple blocks, the advanced block is just a single block that can have positive or negatieve speed values for each wheel. The speed values range from -100 to 100. You also select a duration, which is measured in milliseconds, so a duration of 1000 will make the robot move for 1 second.

```sig
bb.setMotorLeftAndRight(leftSpeed: number, rightSpeed: number, duration: number): void
```

### "Forever" version

The forever version of the advanced movement block simply omits the duration parameter. The block exits immediately, but the robot keeps moving indefinitely until another movement block (of any of the 3 categories) overrides the robot's movement.

```sig
bb.setMotorLeftAndRightForever(leftSpeed: number, rightSpeed: number): void
```

## Examples

Below are three examples of how to use the library to have the robot point its head forwards, move forwards when it sees an obstacle in front of it, and if not, try to follow the right edge of a black line on a white background. The three examples have the same rough functionality, but they do it with the 3 different versions of the motor blocks, and therefore have slightly different results.

### Using simple movement

With simple movement, the robot cannot turn and move at the same time. So instead, the robot is told to turn 5 degrees, then move 3 inches, and then restart the main loop. Additionally, when the robot sees an obstacle, it moves forward in 6-inch increments before restarting the main loop.

```blocks
// Face forward
bb.setHead(90)
basic.forever(function () {
    if (bb.senseDistance() < 6) {
        // When I see something ahead, go forward.
        bb.goForward(6, 100)
    } else if (bb.groundSensorIsWhite(bb.GroundSensor.M)) {
        // Otherwise, if the middle ground sensor sees white, turn left and then go forward.
        bb.turnLeft(5, 100)
        bb.goForward(3, 100)
    } else {
        // Otherwise, turn right and then go forward.
        bb.turnRight(5, 100)
        bb.goForward(3, 100)
    }
})
```

### Using advanced movement

With advanced movement, the robot can make a slight turn by setting one wheel to have a higher speed than the other. The increments are now measured in milliseconds, not inches.

```blocks
// Face forward
bb.setHead(90)
basic.forever(function () {
    if (bb.senseDistance() < 6) {
        // When I see something ahead, go forward.
        bb.setMotorLeftAndRight(100, 100, 800)
    } else if (bb.groundSensorIsWhite(bb.GroundSensor.M)) {
        // Otherwise, if the middle ground sensor sees white, veer left.
        bb.setMotorLeftAndRight(80, 100, 400)
    } else {
        // Otherwise, veer right.
        bb.setMotorLeftAndRight(100, 80, 400)
    }
})
```

### Using "forever" movement

With forever movement, the robot can move without specifying an increment of time, distance, or angle. This allows the loop to run as fast as possible, rechecking the conditions many times per second to recalculate what the robot should be doing.

In practice, reading the ultrasonic sensor on the head takes much longer than any other operation, so that is what determines the frequency at which the inputs are rechecked.

```blocks
bb.setHead(90)
// Face forward
basic.forever(function () {
    if (bb.senseDistance() < 6) {
        // When I see something ahead, go forward.
        bb.setMotorLeftAndRightForever(100, 100)
    } else if (bb.groundSensorIsWhite(bb.GroundSensor.M)) {
        // Otherwise, if the middle ground sensor sees white, veer left.
        bb.setMotorLeftAndRightForever(80, 100)
    } else {
        // Otherwise, veer right.
        bb.setMotorLeftAndRightForever(100, 80)
    }
})
```

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/afterschoolrobotics/pxt-brainybot** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/afterschoolrobotics/pxt-brainybot** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit

```package
bb=github:afterschoolrobotics/pxt-brainybot
```
