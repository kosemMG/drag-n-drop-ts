export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  public templateElement: HTMLTemplateElement;
  public hostElement: T;
  public element: U;

  protected constructor(templateId: string, hostId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId) as T;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  abstract configure(): void;

  abstract renderContent(): void;

  private attach(insertAtStart: boolean): void {
    this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
  }
}
