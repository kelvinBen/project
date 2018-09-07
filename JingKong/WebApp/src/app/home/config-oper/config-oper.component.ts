import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ConfigSetComponent } from '../../dialog/config-set/config-set.component';
@Component({
  selector: 'app-config-oper',
  templateUrl: './config-oper.component.html',
  styleUrls: ['./config-oper.component.css']
})
export class ConfigOperComponent implements OnInit {
  selType: Number = 1;
  displayedColumns = ['phone', 'name', 'id'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog) {
    // Create 100 users
    const users: UserData[] = [];
    for (let i = 1; i <= 1; i++) { users.push(createNewUser(i)); }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ConfigSetComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}


function createNewUser(id: number): UserData {
  return {
    id: id.toString(),
    name: '******',
    position: '******',
    email: '******',
    phone: '***********'
  };
}

export interface UserData {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
}
