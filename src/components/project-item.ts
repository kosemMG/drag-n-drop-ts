import { Component } from './base-component';
import { Draggable } from '../models/drag-n-drop';
import { Project } from '../models/project';
import { autobind } from '../decorators/autobind';

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  constructor(hostId: string, private project: Project) {
    super('single-project', hostId, false, project.id);

    this.configure();
    this.renderContent();
  }

  get personLiteral() {
    return `${ this.project.people } person${ this.project.people > 1 ? 's' : '' } assigned`;
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  dragEndHandler(_event: DragEvent): void {
  }

  public configure(): void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  public renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.personLiteral;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
