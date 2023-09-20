/**
 * Control an ASR Brainybot robot.
 */
//% color=230 weight=50 icon="\uf067" block="Brainybot"
namespace bb {
  const I2CADDR = 0x10;
  const MOTOR_SPEEDS_REGISTER = 0x00;

  const FULL_SPEED_IPS = 8.5;
  const FULL_SPEED_DPS = 240;

  const SPEED_TO_IPS = FULL_SPEED_IPS / 100;
  const SPEED_TO_DPS = FULL_SPEED_DPS / 100;

  const SPEED_TO_IPMS = SPEED_TO_IPS / 1000;
  const SPEED_TO_DPMS = SPEED_TO_DPS / 1000;

  //Motor direction enumeration selection
  export enum MotorDir {
    //% block="forward"
    Forward,
    //% block="backward"
    Backward,
  }

  //% block="go forward|%dist inches"
  //% dist.min=0 dist.defl=12
  export function goForward(dist: number, speed: number = 100): void {
    let duration = internal.inchesToMsAtSpeed(dist, speed);
    let dir = MotorDir.Forward;
    internal.setMotors(dir, speed, dir, speed);
    basic.pause(duration);
    internal.setMotors(dir, 0, dir, 0);
  }

  //% block="go backward|%dist inches"
  //% dist.min=0 dist.defl=12
  export function goBackward(
    dist: number,
    speed: number = 100
  ): void {
    let duration = internal.inchesToMsAtSpeed(dist, speed);
    let dir = MotorDir.Backward;
    internal.setMotors(dir, speed, dir, speed);
    basic.pause(duration);
    internal.setMotors(dir, 0, dir, 0);
  }

  //% block="turn left|%deg degrees"
  //% deg.min=0 deg.defl=90
  export function turnLeft(deg: number, speed: number = 100): void {
    let duration = internal.degreesToMsAtSpeed(deg, speed);
    let leftDir = MotorDir.Backward;
    let rightDir = MotorDir.Forward;
    internal.setMotors(leftDir, speed, rightDir, speed);
    basic.pause(duration);
    internal.setMotors(leftDir, 0, rightDir, 0);
  }

  //% block="turn right|%deg degrees"
  //% deg.min=0 deg.defl=90
  export function turnRight(deg: number, speed: number = 100): void {
    let duration = internal.degreesToMsAtSpeed(deg, speed);
    let leftDir = MotorDir.Forward;
    let rightDir = MotorDir.Backward;
    internal.setMotors(leftDir, speed, rightDir, speed);
    basic.pause(duration);
    internal.setMotors(leftDir, 0, rightDir, 0);
  }

  namespace internal {
    export function setMotors(
      leftDir: MotorDir,
      leftSpeed: number,
      rightDir: MotorDir,
      rightSpeed: number
    ): void {
      let allBuffer = pins.createBuffer(5);
      allBuffer[0] = MOTOR_SPEEDS_REGISTER;
      allBuffer[1] = leftDir;
      allBuffer[2] = leftSpeed;
      allBuffer[3] = rightDir;
      allBuffer[4] = rightSpeed;
      pins.i2cWriteBuffer(I2CADDR, allBuffer);
    }

    export function inchesToMsAtSpeed(
      inches: number,
      speed: number
    ): number {
      let inches_per_ms = speed * SPEED_TO_IPMS;
      return inches / inches_per_ms;
    }

    export function degreesToMsAtSpeed(
      degrees: number,
      speed: number
    ): number {
      let degrees_per_ms = speed * SPEED_TO_DPMS;
      return degrees / degrees_per_ms;
    }
  }
}

// basic.forever(function () {
//
// })
