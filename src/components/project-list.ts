import { DragTarget } from '../models/drag-n-drop';
import { Component } from './base-component';
import { Project, ProjectStatus } from '../models/project';
import { ProjectItem } from './project-item';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  private assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${ type }-projects`);

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  // Declared as public because abstract methods are not supported as private.
  public configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(project =>
        this.type === 'active' ? project.status === ProjectStatus.Active : project.status === ProjectStatus.Finished);
      this.renderProjects();
    });
  }

  // Declared as public because abstract methods are not supported as private.
  public renderContent(): void {
    this.element.querySelector('ul')!.id = `${ this.type }-projects-list`;
    this.element.querySelector('h2')!.textContent = `${ this.type.toUpperCase() } PROJECTS`;
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listElement = this.element.querySelector('ul')!;
      listElement.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState
      .moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autobind
  dragLeaveHandler(_event: DragEvent): void {
    const listElement = this.element.querySelector('ul')!;
    listElement.classList.remove('droppable');
  }

  private renderProjects(): void {
    const listElement = document.getElementById(`${ this.type }-projects-list`) as HTMLUListElement;
    listElement.innerHTML = '';
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }
}
