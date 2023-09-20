/**
 * Control an ASR Brainybot robot.
 */
//% color=230 weight=50 icon="\uf067" block="bb"
namespace bb {
  const I2CADDR = 0x10;
  const ADC0_REGISTER = 0x1e;
  const ADC1_REGISTER = 0x20;
  const ADC2_REGISTER = 0x22;
  const ADC3_REGISTER = 0x24;
  const ADC4_REGISTER = 0x26;
  const LEFT_LED_REGISTER = 0x0b;
  const RIGHT_LED_REGISTER = 0x0c;
  const LEFT_MOTOR_REGISTER = 0x00;
  const RIGHT_MOTOR_REGISTER = 0x02;
  const LINE_STATE_REGISTER = 0x1d;
  const VERSION_CNT_REGISTER = 0x32;
  const VERSION_DATA_REGISTER = 0x33;

  //Motor direction enumeration selection
  export enum MotorDir {
    //% block="forward"
    Forward,
    //% block="backward"
    Backward,
  }

  //% block="drive forwards|%duration seconds"
  export function showNumber(
    duration: number,
    speed: number = 100
  ): void {
    let allBuffer = pins.createBuffer(5);
    allBuffer[0] = LEFT_MOTOR_REGISTER;
    allBuffer[1] = MotorDir.Forward;
    allBuffer[2] = speed;
    allBuffer[3] = MotorDir.Forward;
    allBuffer[4] = speed;
    pins.i2cWriteBuffer(I2CADDR, allBuffer);
  }
}

// basic.forever(function () {
//
// })
