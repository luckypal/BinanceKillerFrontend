import { Pipe, PipeTransform } from '@angular/core';

export function floor(value: any) {
  if (typeof value === 'number') return Math.floor(value * 100) / 100;
  return value;
}

@Pipe({
  name: 'floor'
})
export class FloorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return floor(value);
  }

}
