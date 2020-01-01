/**
 * Autobind decorator
 * @param _target: any
 * @param _methodName: string
 * @param descriptor: PropertyDescriptor
 * @return bound descriptor
 */
export function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod: Function = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get(): Function {
      return originalMethod.bind(this);
    }
  };
  return adjustedDescriptor;
}
