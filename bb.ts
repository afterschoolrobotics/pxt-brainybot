/**
 * Control an ASR Brainybot robot.
 */
//% color=230 weight=50 icon="\uf067" block="Brainybot"
namespace bb {
  const I2CADDR = 0x10;
  const MOTOR_SPEEDS_REGISTER = 0x00;
  /*
  const LINE_STATE_REGISTER = 0x1d;

  const ULTRASONIC_TRIGGER_PIN = DigitalPin.P13;
  const ULTRASONIC_ECHO_PIN = DigitalPin.P14;
  const ULTRASONIC_PULSE_LENGTH = 29000;
  */

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
  /*
  //Line sensor selection
  export enum MyEnumLineSensor {
    //% block="L1"
    SensorL1,
    //% block="M"
    SensorM,
    //% block="R1"
    SensorR1,
    //% block="L2"
    SensorL2,
    //% block="R2"
    SensorR2,
  }
  */

  //% block="go forward|%dist inches|at %speed speed"
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

  //% block="turn left|%deg degrees|at %speed speed"
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
  /*
  //% block="sense distance"
  export function senseDistance(): number {
    let data;
    pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 1);
    basic.pause(1);
    pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 0);
    if (pins.digitalReadPin(ULTRASONIC_ECHO_PIN) == 0) {
      pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 0);
      pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 1);
      basic.pause(20);
      pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 0);
      data = pins.pulseIn(
        ULTRASONIC_ECHO_PIN,
        PulseValue.High,
        ULTRASONIC_PULSE_LENGTH
      );
    } else {
      pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 1);
      pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 0);
      basic.pause(20);
      pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 0);
      data = pins.pulseIn(
        ULTRASONIC_ECHO_PIN,
        PulseValue.High,
        ULTRASONIC_PULSE_LENGTH
      );
    }
    data = data / 59;
    if (data <= 0) return 0;
    if (data > 500) return 500;
    return Math.round(data);
  }

  //% block="ground sensor %eline"
  export function groundSensor(eline: MyEnumLineSensor): number {
    pins.i2cWriteNumber(
      I2CADDR,
      LINE_STATE_REGISTER,
      NumberFormat.Int8LE
    );
    let data = pins.i2cReadNumber(I2CADDR, NumberFormat.Int8LE);
    let state;
    switch (eline) {
      case MyEnumLineSensor.SensorL1:
        state = (data & 0x08) == 0x08 ? 1 : 0;
        break;
      case MyEnumLineSensor.SensorM:
        state = (data & 0x04) == 0x04 ? 1 : 0;
        break;
      case MyEnumLineSensor.SensorR1:
        state = (data & 0x02) == 0x02 ? 1 : 0;
        break;
      case MyEnumLineSensor.SensorL2:
        state = (data & 0x10) == 0x10 ? 1 : 0;
        break;
      default:
        state = (data & 0x01) == 0x01 ? 1 : 0;
        break;
    }
    return state;
  }
  */

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
