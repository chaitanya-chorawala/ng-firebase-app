import { Component } from '@angular/core';
import { Task } from './task/Task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskDialogResult } from './task-dialog/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ng-firebase-app';
  todo: Task[] = [
    {
      title: 'Task1',
      description: 'Task1 description',
    },
    {
      title: 'Task2',
      description: 'Task2 description',
    },
  ];
  inProgress: Task[] = [];
  done: Task[] = [];

  constructor(private dialog: MatDialog){}

  newTask(){
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    });

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if(!result){
          return;
        }

        this.todo.push(result.task);
      })
  }

  editTask(list: 'todo' | 'inProgress' | 'done', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true
      }
    });

    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      if(!result) {
        return;
      }

      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if(result.delete)
      {
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
      }
    })
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
