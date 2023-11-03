/**
 * Control an ASR Brainybot robot.
 */
//% color=230 weight=50 icon="\uf1b9" block="Brainybot"
//% groups=['Head', 'Ground Sensors', 'Simple Movement', 'Advanced Movement', 'Forever Movement', 'others']
namespace bb {
  const I2CADDR = 0x10;
  const MOTOR_SPEEDS_REGISTER = 0x00;
  const LINE_STATE_REGISTER = 0x1d;

  const ULTRASONIC_TRIGGER_PIN = DigitalPin.P13;
  const ULTRASONIC_ECHO_PIN = DigitalPin.P14;
  const ULTRASONIC_PULSE_LENGTH = 27000;

  const FULL_SPEED_IPS = 8.5;
  const FULL_SPEED_DPS = 240;

  const SPEED_TO_IPS = FULL_SPEED_IPS / 100;
  const SPEED_TO_DPS = FULL_SPEED_DPS / 100;

  const SPEED_TO_IPMS = SPEED_TO_IPS / 1000;
  const SPEED_TO_DPMS = SPEED_TO_DPS / 1000;

  // Motor direction options
  export enum MotorDir {
    //% block="forward"
    Forward,
    //% block="backward"
    Backward,
  }

  // Ground sensor IDs
  export enum GroundSensor {
    //% block="L1"
    L1,
    //% block="M"
    M,
    //% block="R1"
    R1,
    //% block="L2"
    L2,
    //% block="R2"
    R2,
  }

  //% block="go forward|%dist inches|at %speed speed"
  //% dist.min=0 dist.defl=12
  //% speed.min=0 speed.max=100 speed.defl=100
  //% group="Simple Movement"
  //% weight=1
  export function goForward(dist: number, speed: number = 100): void {
    let duration = internal.inchesToMsAtSpeed(dist, speed);
    let dir = MotorDir.Forward;
    internal.setMotors(dir, speed, dir, speed);
    basic.pause(duration);
    internal.setMotors(dir, 0, dir, 0);
  }

  //% block="go backward|%dist inches|at %speed speed"
  //% dist.min=0 dist.defl=12
  //% speed.min=0 speed.max=100 speed.defl=100
  //% group="Simple Movement"
  //% weight=2
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
  //% speed.min=0 speed.max=100 speed.defl=100
  //% group="Simple Movement"
  //% weight=3
  export function turnLeft(deg: number, speed: number = 100): void {
    let duration = internal.degreesToMsAtSpeed(deg, speed);
    let leftDir = MotorDir.Backward;
    let rightDir = MotorDir.Forward;
    internal.setMotors(leftDir, speed, rightDir, speed);
    basic.pause(duration);
    internal.setMotors(leftDir, 0, rightDir, 0);
  }

  //% block="turn right|%deg degrees|at %speed speed"
  //% deg.min=0 deg.defl=90
  //% speed.min=0 speed.max=100 speed.defl=100
  //% group="Simple Movement"
  //% weight=4
  export function turnRight(deg: number, speed: number = 100): void {
    let duration = internal.degreesToMsAtSpeed(deg, speed);
    let leftDir = MotorDir.Forward;
    let rightDir = MotorDir.Backward;
    internal.setMotors(leftDir, speed, rightDir, speed);
    basic.pause(duration);
    internal.setMotors(leftDir, 0, rightDir, 0);
  }

  //% block="set motor|left %leftSpeed|and right %rightSpeed|for %duration ms"
  //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.defl=100
  //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.defl=100
  //% duration.min=0 duration.defl=1000
  //% group="Advanced Movement"
  //% weight=1
  export function setMotorLeftAndRight(
    leftSpeed: number,
    rightSpeed: number,
    duration: number
  ): void {
    internal.setMotors(
      leftSpeed >= 0 ? MotorDir.Forward : MotorDir.Backward,
      Math.abs(leftSpeed),
      rightSpeed >= 0 ? MotorDir.Forward : MotorDir.Backward,
      Math.abs(rightSpeed)
    );
    basic.pause(duration);
    internal.setMotors(MotorDir.Forward, 0, MotorDir.Forward, 0);
  }

  //% block="set motor|left %leftSpeed|and right %rightSpeed|forever"
  //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.defl=100
  //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.defl=100
  //% group="Forever Movement"
  //% weight=1
  export function setMotorLeftAndRightForever(
    leftSpeed: number,
    rightSpeed: number
  ): void {
    internal.setMotors(
      leftSpeed >= 0 ? MotorDir.Forward : MotorDir.Backward,
      Math.abs(leftSpeed),
      rightSpeed >= 0 ? MotorDir.Forward : MotorDir.Backward,
      Math.abs(rightSpeed)
    );
  }

  //% block="set head to %pos degrees"
  //% pos.min=0 pos.max=180 pos.defl=90
  //% group="Head"
  //% weight=1
  export function setHead(pos: number): void {
    pins.servoWritePin(AnalogPin.P1, pos);
  }

  //% block="sense distance"
  //% group="Head"
  //% weight=2
  export function senseDistance(): number {
    let data;
    pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 1);
    basic.pause(1);
    pins.digitalWritePin(ULTRASONIC_TRIGGER_PIN, 0);

    data = pins.pulseIn(
      ULTRASONIC_ECHO_PIN,
      PulseValue.High,
      ULTRASONIC_PULSE_LENGTH
    );
    basic.pause(60);

    if (data <= 0) {
      return 999999;
    }
    return data / 148;
  }

  //% block="ground sensor %eline is black"
  //% group="Ground Sensors"
  //% weight=1
  export function groundSensorIsBlack(sensor: GroundSensor): boolean {
    pins.i2cWriteNumber(
      I2CADDR,
      LINE_STATE_REGISTER,
      NumberFormat.Int8LE
    );
    let data = pins.i2cReadNumber(I2CADDR, NumberFormat.Int8LE);
    let state;
    switch (sensor) {
      case GroundSensor.L1:
        state = (data & 0x08) == 0x08;
        break;
      case GroundSensor.M:
        state = (data & 0x04) == 0x04;
        break;
      case GroundSensor.R1:
        state = (data & 0x02) == 0x02;
        break;
      case GroundSensor.L2:
        state = (data & 0x10) == 0x10;
        break;
      default:
        state = (data & 0x01) == 0x01;
        break;
    }
    return state;
  }

  //% block="ground sensor %eline is white"
  //% group="Ground Sensors"
  //% weight=1
  export function groundSensorIsWhite(eline: GroundSensor): boolean {
    return !groundSensorIsBlack(eline);
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
